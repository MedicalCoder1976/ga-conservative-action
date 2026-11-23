import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { NextRequest, NextResponse } from 'next/server'

type NonvoterRow = {
  county: string
  active_registered_2024: string
  ballots_cast_2024: string
  estimated_nonvoters_2024: string
  active_registered_2026: string
  ballots_cast_2026: string
  estimated_nonvoters_2026: string
  nonvoter_change_2026_minus_2024: string
  source_2024: string
  source_2026: string
}

let cachedRows: NonvoterRow[] | null = null

function parseCsv(text: string) {
  const records: string[][] = []
  let record: string[] = []
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

async function loadRows() {
  if (cachedRows) return cachedRows
  const filePath = path.join(process.cwd(), 'public', 'data', 'georgia-county-nonvoter-comparison-2024-2026.csv')
  const records = parseCsv(await readFile(filePath, 'utf8'))
  const headers = records.shift()
  if (!headers) throw new Error('Non-voter source is empty')

  cachedRows = records
    .filter((values) => values.length === headers.length)
    .map((values) => Object.fromEntries(
      headers.map((header, index) => [header, values[index]]),
    ) as NonvoterRow)
  return cachedRows
}

export async function GET(request: NextRequest) {
  const county = request.nextUrl.searchParams.get('county')
  if (!county) {
    return NextResponse.json({ error: 'County parameter required' }, { status: 400 })
  }

  const decodedCounty = decodeURIComponent(county).trim()
  const row = (await loadRows()).find(
    (item) => item.county.toLocaleLowerCase() === decodedCounty.toLocaleLowerCase(),
  )
  if (!row) {
    return NextResponse.json({ error: 'County not found' }, { status: 404 })
  }

  return NextResponse.json({
    county: row.county,
    active_registered_2024: Number(row.active_registered_2024),
    ballots_cast_2024: Number(row.ballots_cast_2024),
    estimated_nonvoters_2024: Number(row.estimated_nonvoters_2024),
    active_registered_2026: Number(row.active_registered_2026),
    ballots_cast_2026: Number(row.ballots_cast_2026),
    estimated_nonvoters_2026: Number(row.estimated_nonvoters_2026),
    nonvoter_change_2026_minus_2024: Number(row.nonvoter_change_2026_minus_2024),
    source_2024: row.source_2024,
    source_2026: row.source_2026,
  })
}
