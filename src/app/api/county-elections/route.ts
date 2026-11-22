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
}

let cachedRows: ElectionRow[] | null = null

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
    'georgia-county-election-results-2016-2024.csv',
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

  return NextResponse.json({
    county: rows[0].county,
    county_fips: rows[0].county_fips,
    rows,
  })
}
