import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'

async function loadRows() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'georgia-county-nonvoter-comparison-2024-2026.csv')
  const text = await readFile(filePath, 'utf8')
  const lines = text.trim().split(/\r?\n/)
  const headers = lines.shift()?.split(',')
  if (!headers) throw new Error('Non-voter source is empty')
  return lines.map((line) => Object.fromEntries(
    headers.map((header, index) => [header, line.split(',')[index]]),
  ))
}

export async function GET() {
  const rows = await loadRows()
  const sum = (key: string) => rows.reduce((total, row) => total + Number(row[key]), 0)

  const activeRegistered2024 = sum('active_registered_2024')
  const ballotsCast2024 = sum('ballots_cast_2024')
  const nonvoters2024 = sum('estimated_nonvoters_2024')
  const activeRegistered2026 = sum('active_registered_2026')
  const ballotsCast2026 = sum('ballots_cast_2026')
  const nonvoters2026 = sum('estimated_nonvoters_2026')

  return NextResponse.json({
    county_count: rows.length,
    active_registered_2024: activeRegistered2024,
    ballots_cast_2024: ballotsCast2024,
    estimated_nonvoters_2024: nonvoters2024,
    turnout_2024_pct: (ballotsCast2024 / activeRegistered2024) * 100,
    active_registered_2026: activeRegistered2026,
    ballots_cast_2026: ballotsCast2026,
    estimated_nonvoters_2026: nonvoters2026,
    turnout_2026_pct: (ballotsCast2026 / activeRegistered2026) * 100,
    nonvoter_change_2026_minus_2024: nonvoters2026 - nonvoters2024,
  })
}
