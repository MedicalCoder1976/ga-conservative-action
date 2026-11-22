import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { NextRequest, NextResponse } from 'next/server'

type TurnoutRow = {
  election_year: string
  snapshot_at: string
  status: string
  measurement: string
  county: string
  county_fips: string
  registered_voters: string
  votes_recorded: string
  mail_voted: string
  early_voted: string
  estimated_not_voted: string
  turnout_pct: string
  not_voted_pct: string
  source_name: string
  source_url: string
  imported_at: string
}

let cachedRows: TurnoutRow[] | null = null

async function loadRows() {
  if (cachedRows) return cachedRows
  const filePath = path.join(process.cwd(), 'public', 'data', 'georgia-turnout-snapshots.csv')
  const lines = (await readFile(filePath, 'utf8')).trim().split(/\r?\n/)
  const headers = lines.shift()?.split(',')
  if (!headers) throw new Error('Turnout snapshot is empty')
  cachedRows = lines.map((line) => Object.fromEntries(
    headers.map((header, index) => [header, line.split(',')[index]]),
  ) as TurnoutRow)
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
    return NextResponse.json({ error: 'County turnout not found' }, { status: 404 })
  }

  return NextResponse.json(rows[rows.length - 1])
}
