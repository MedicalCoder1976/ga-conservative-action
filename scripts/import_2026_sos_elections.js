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

function parseCsv(text) {
  const records = []
  let record = []
  let value = ''
  let quoted = false

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        value += '"'
        index += 1
      } else if (character === '"') {
        quoted = false
      } else {
        value += character
      }
    } else if (character === '"') {
      quoted = true
    } else if (character === ',') {
      record.push(value)
      value = ''
    } else if (character === '\n') {
      record.push(value.replace(/\r$/, ''))
      records.push(record)
      record = []
      value = ''
    } else {
      value += character
    }
  }

  if (value || record.length) {
    record.push(value.replace(/\r$/, ''))
    records.push(record)
  }
  return records
}

async function main() {
  const csvPath = path.join(__dirname, '..', 'public', 'data', 'georgia-county-election-results-2016-2026.csv')
  const records = parseCsv(fs.readFileSync(csvPath, 'utf8'))
  const headers = records.shift()
  if (!headers) throw new Error('Election source is empty')

  const totals = new Map()
  for (const values of records) {
    if (values.length !== headers.length) continue
    const row = Object.fromEntries(headers.map((header, index) => [header, values[index]]))
    if (row.election_year !== '2026' || row.stage !== 'general' || row.office !== 'US Senate') continue

    const county = row.county
    if (!totals.has(county)) {
      totals.set(county, {
        county,
        election_year: 2026,
        registered_voters: null,
        democrat_votes: 0,
        republican_votes: 0,
        total_votes: 0,
        voter_turnout_rate: null,
        votes_not_cast: null,
      })
    }

    const entry = totals.get(county)
    const votes = Number(row.votes)
    if (row.party === 'DEMOCRAT') entry.democrat_votes += votes
    if (row.party === 'REPUBLICAN') entry.republican_votes += votes
    entry.total_votes += votes
  }

  const statistics = [...totals.values()]
  for (let index = 0; index < statistics.length; index += 100) {
    const batch = statistics.slice(index, index + 100)
    const { error } = await supabase
      .from('county_voter_statistics')
      .upsert(batch, { onConflict: 'county,election_year' })
    if (error) throw new Error(`Inserting 2026 statistics failed: ${error.message}`)
  }

  console.log(`Imported ${statistics.length} verified 2026 US Senate county totals`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
