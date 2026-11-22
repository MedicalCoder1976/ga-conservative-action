const fs = require('node:fs')
const path = require('node:path')
const { createClient } = require('@supabase/supabase-js')

function loadEnv(fileName) {
  const filePath = path.join(__dirname, '..', fileName)
  if (!fs.existsSync(filePath)) return
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2]
  }
}

loadEnv('.env.local')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  throw new Error('Missing Supabase URL or service role key')
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const csvPath = path.join(__dirname, '..', 'public', 'data', 'georgia-elections-mit-2016-2024.csv')
const lines = fs.readFileSync(csvPath, 'utf8').trim().split(/\r?\n/)
const headers = lines.shift().split(',')
const rows = lines.map((line) => {
  const values = line.split(',')
  return Object.fromEntries(headers.map((header, index) => [header, values[index]]))
})

function chunk(items, size) {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, index * size + size)
  )
}

async function main() {
  const { error: driftDeleteError } = await supabase
    .from('county_drift')
    .delete()
    .neq('county', '')
  if (driftDeleteError) throw new Error(`Deleting county_drift failed: ${driftDeleteError.message}`)

  const { error: statsDeleteError } = await supabase
    .from('county_voter_statistics')
    .delete()
    .neq('county', '')
  if (statsDeleteError) throw new Error(`Deleting county_voter_statistics failed: ${statsDeleteError.message}`)

  const statistics = rows.map((row) => ({
    county: row.county,
    election_year: Number(row.year),
    registered_voters: null,
    democrat_votes: Number(row.dem_votes),
    republican_votes: Number(row.rep_votes),
    total_votes: Number(row.total_votes),
    voter_turnout_rate: null,
    votes_not_cast: null,
  }))

  for (const batch of chunk(statistics, 100)) {
    const { error } = await supabase
      .from('county_voter_statistics')
      .upsert(batch, { onConflict: 'county,election_year' })
    if (error) throw new Error(`Inserting county statistics failed: ${error.message}`)
  }

  const byKey = new Map(statistics.map((row) => [`${row.county}:${row.election_year}`, row]))
  const driftRows = []
  const counties = [...new Set(statistics.map((row) => row.county))]

  for (const county of counties) {
    const y16 = byKey.get(`${county}:2016`)
    const y20 = byKey.get(`${county}:2020`)
    const y24 = byKey.get(`${county}:2024`)
    if (!y16 || !y20 || !y24) continue

    const demBaseline = (y16.democrat_votes / y16.total_votes) * 100
    const repBaseline = (y16.republican_votes / y16.total_votes) * 100
    const dem2020 = (y20.democrat_votes / y20.total_votes) * 100
    const rep2020 = (y20.republican_votes / y20.total_votes) * 100
    const demCurrent = (y24.democrat_votes / y24.total_votes) * 100
    const repCurrent = (y24.republican_votes / y24.total_votes) * 100
    const demDrift = demCurrent - demBaseline
    const repDrift = repCurrent - repBaseline

    driftRows.push({
      county,
      dem_baseline_percent: demBaseline,
      rep_baseline_percent: repBaseline,
      dem_2020_percent: dem2020,
      rep_2020_percent: rep2020,
      dem_current_percent: demCurrent,
      rep_current_percent: repCurrent,
      dem_drift_pct: demDrift,
      rep_drift_pct: repDrift,
      tilt_score: repDrift / 100,
      direction: Math.abs(repDrift) < 0.5 ? 'neutral' : repDrift > 0 ? 'red' : 'blue',
      momentum_pct: Math.max(Math.abs(demDrift), Math.abs(repDrift)),
      total_votes_2016: y16.total_votes,
      total_votes_2024: y24.total_votes,
      votes_growth_pct: y16.total_votes > 0
        ? ((y24.total_votes - y16.total_votes) / y16.total_votes) * 100
        : null,
      turnout_2016_pct: null,
      turnout_2024_pct: null,
      nonvoters_2016: null,
      nonvoters_2024: null,
      last_updated_year: 2024,
      data_quality: 'MIT verified',
    })
  }

  for (const batch of chunk(driftRows, 100)) {
    const { error } = await supabase
      .from('county_drift')
      .upsert(batch, { onConflict: 'county' })
    if (error) throw new Error(`Inserting county drift failed: ${error.message}`)
  }

  console.log(`Applied MIT data: ${statistics.length} statistics rows and ${driftRows.length} drift rows`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
