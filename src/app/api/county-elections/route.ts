import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { NextRequest, NextResponse } from 'next/server'

type ElectionRow = {
  election_year: string
  election_date: string
  stage: string
  office: string
  district: string
  county: string
  county_fips: string
  candidate: string
  party: string
  votes: string
  source_name: string
  source_url: string
  source_file: string
  contest_total_votes?: string
  ballots_cast?: string
  statewide_democrat_votes?: string
  statewide_republican_votes?: string
  statewide_total_votes?: string
}

let cachedRows: ElectionRow[] | null = null
let cached2026RawRows: {
  county: string
  office: string
  candidate: string
  votes: string
}[] | null = null

function parseCsv(text: string) {
  const rows: string[][] = []
  let row: string[] = []
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
      row.push(value)
      value = ''
    } else if (character === '\n') {
      row.push(value.replace(/\r$/, ''))
      rows.push(row)
      row = []
      value = ''
    } else {
      value += character
    }
  }

  if (value || row.length) {
    row.push(value.replace(/\r$/, ''))
    rows.push(row)
  }
  return rows
}

async function loadRows() {
  if (cachedRows) return cachedRows

  const csvPath = path.join(
    process.cwd(),
    'public',
    'data',
    'georgia-county-election-results-2016-2026.csv',
  )
  const records = parseCsv(await readFile(csvPath, 'utf8'))
  const headers = records.shift()
  if (!headers) throw new Error('County election source is empty')

  cachedRows = records
    .filter((values) => values.length === headers.length)
    .map((values) => Object.fromEntries(
      headers.map((header, index) => [header, values[index]]),
    ) as ElectionRow)
  return cachedRows
}

async function load2026RawRows() {
  if (cached2026RawRows) return cached2026RawRows

  const csvPath = path.join(
    process.cwd(),
    'public',
    'data',
    '2026-11-03-general-and-special-election-county-results.csv',
  )
  const records = parseCsv(await readFile(csvPath, 'utf8'))
  const headers = records.shift()
  if (!headers) throw new Error('2026 Georgia SOS source is empty')
  const normalizedHeaders = headers.map((header) => header.replace(/^\uFEFF/, '').trim())

  cached2026RawRows = records
    .filter((values) => values.length === normalizedHeaders.length)
    .map((values) => {
      const raw = Object.fromEntries(
        normalizedHeaders.map((header, index) => [header, values[index]]),
      )
      return {
        county: raw.County ?? '',
        office: raw['Office Name'] ?? '',
        candidate: raw['Ballot Name'] ?? '',
        votes: raw.Total ?? '',
      }
    })
  return cached2026RawRows
}

function rawOfficeMatches(consolidatedOffice: string, rawOffice: string, district: string) {
  if (consolidatedOffice === 'US Senate') return rawOffice === 'US Senate'
  if (consolidatedOffice === 'Governor') return rawOffice === 'Governor'
  if (consolidatedOffice === 'US House of Representatives' || consolidatedOffice === 'US House') {
    return rawOffice.startsWith('US House of Representatives') && (
      !district || rawOffice.endsWith(`District ${district}`)
    )
  }
  return false
}

export async function GET(request: NextRequest) {
  const county = request.nextUrl.searchParams.get('county')
  if (!county) {
    return NextResponse.json({ error: 'County parameter required' }, { status: 400 })
  }

  const decodedCounty = decodeURIComponent(county).trim()
  const rows = (await loadRows()).filter(
    (row) => row.county.toLocaleLowerCase() === decodedCounty.toLocaleLowerCase(),
  )
  if (!rows.length) {
    return NextResponse.json({ error: 'County not found' }, { status: 404 })
  }

  const raw2026Rows = await load2026RawRows()
  const augmentedRows = rows.map((row) => {
    if (row.election_year !== '2026' || row.stage !== 'general') return row

    const countyName = decodedCounty.toLocaleLowerCase()
    const rawCountyRows = raw2026Rows.filter((rawRow) => {
      const rawCounty = String(rawRow.county ?? '').replace(/\s+County$/i, '').trim()
      return rawCounty.toLocaleLowerCase() === countyName
    })
    const matchingRows = rawCountyRows.filter((rawRow) => {
      const rawOffice = String(rawRow.office ?? '')
      return rawOfficeMatches(row.office, rawOffice, row.district)
    })
    const totalRow = matchingRows.find((rawRow) =>
      String(rawRow.candidate ?? '').toLocaleLowerCase() === 'total votes'
    )
    const ballotsRow = matchingRows.find((rawRow) =>
      String(rawRow.candidate ?? '').toLocaleLowerCase() === 'ballots cast'
    )

    return {
      ...row,
      contest_total_votes: totalRow?.votes,
      ballots_cast: ballotsRow?.votes,
    }
  })

  const statewide2026 = (await loadRows()).filter(
    (row) => row.election_year === '2026' && row.stage === 'general',
  )
  const senateStatewide = statewide2026
    .filter((row) => row.office === 'US Senate')
    .reduce((totals, row) => {
      totals.total += Number(row.votes)
      if (row.party === 'DEMOCRAT') totals.democrat += Number(row.votes)
      if (row.party === 'REPUBLICAN') totals.republican += Number(row.votes)
      return totals
    }, { total: 0, democrat: 0, republican: 0 })
  const governorStatewide = statewide2026
    .filter((row) => row.office === 'Governor')
    .reduce((totals, row) => {
      totals.total += Number(row.votes)
      if (row.party === 'DEMOCRAT') totals.democrat += Number(row.votes)
      if (row.party === 'REPUBLICAN') totals.republican += Number(row.votes)
      return totals
    }, { total: 0, democrat: 0, republican: 0 })

  const statewideByOffice = {
    'US Senate': senateStatewide,
    Governor: governorStatewide,
  }
  const rowsWithStatewideContext = augmentedRows.map((row) => {
    if (row.election_year !== '2026' || row.stage !== 'general') return row
    const statewide = statewideByOffice[row.office as keyof typeof statewideByOffice]
    if (!statewide) return row
    return {
      ...row,
      statewide_democrat_votes: String(statewide.democrat),
      statewide_republican_votes: String(statewide.republican),
      statewide_total_votes: String(statewide.total),
    }
  })

  return NextResponse.json({
    county: rowsWithStatewideContext[0].county,
    county_fips: rowsWithStatewideContext[0].county_fips,
    rows: rowsWithStatewideContext,
    statewide2026: {
      senate: senateStatewide,
      governor: governorStatewide,
    },
  })
}
