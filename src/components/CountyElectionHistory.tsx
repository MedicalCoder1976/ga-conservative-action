'use client'

import { useMemo, useState } from 'react'

type ElectionRow = {
  election_year: string
  election_date: string
  stage: string
  office: string
  district: string
  candidate: string
  party: string
  votes: string
  source_name: string
  source_url: string
}

type Props = {
  county: string
  rows: ElectionRow[]
}

const officeOrder = [
  'US President',
  'US Senate',
  'US Senate (Special)',
  'US House',
  'Governor',
  'Georgia State Senate',
  'Georgia State House',
]

function partyColor(party: string) {
  if (party === 'DEMOCRAT') return 'bg-blue-600'
  if (party === 'REPUBLICAN') return 'bg-red-600'
  if (party === 'LIBERTARIAN') return 'bg-yellow-500'
  if (party === 'GREEN') return 'bg-green-600'
  return 'bg-slate-500'
}

export default function CountyElectionHistory({ county, rows }: Props) {
  const years = useMemo(
    () => [...new Set(rows.map((row) => Number(row.election_year)))].sort((a, b) => b - a),
    [rows],
  )
  const [selectedYear, setSelectedYear] = useState(years[0] ?? 2024)

  const contests = useMemo(() => {
    const groups = new Map<string, ElectionRow[]>()
    for (const row of rows) {
      if (Number(row.election_year) !== selectedYear) continue
      const key = `${row.election_date}|${row.stage}|${row.office}|${row.district}`
      groups.set(key, [...(groups.get(key) ?? []), row])
    }

    return [...groups.entries()]
      .map(([key, candidates]) => {
        const [date, stage, office, district] = key.split('|')
        return {
          date,
          stage,
          office,
          district,
          candidates: candidates.sort((a, b) => Number(b.votes) - Number(a.votes)),
          total: candidates.reduce((sum, row) => sum + Number(row.votes), 0),
        }
      })
      .sort((a, b) => (
        officeOrder.indexOf(a.office) - officeOrder.indexOf(b.office)
        || a.date.localeCompare(b.date)
        || a.district.localeCompare(b.district)
      ))
  }, [rows, selectedYear])

  if (!rows.length) return null

  return (
    <section className="bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-slate-600/50 rounded-xl p-8 mb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-100">Verified Election Results</h2>
          <p className="text-sm text-slate-400 mt-1">
            {county} county returns aggregated from official precinct data
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {years.map((year) => (
            <button
              type="button"
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-3 py-2 rounded-lg text-sm font-bold transition ${
                selectedYear === year
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-900/60 text-slate-300 hover:bg-slate-900'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {contests.map((contest) => (
          <article
            key={`${contest.date}-${contest.stage}-${contest.office}-${contest.district}`}
            className="bg-slate-900/45 border border-slate-600 rounded-lg p-5"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h3 className="font-black text-slate-100">{contest.office}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  {contest.date} · {contest.stage === 'runoff' ? 'Runoff' : 'General election'}
                  {contest.district ? ` · District ${contest.district}` : ''}
                </p>
              </div>
              <span className="text-xs text-slate-400 whitespace-nowrap">
                {contest.total.toLocaleString()} votes
              </span>
            </div>

            <div className="space-y-4">
              {contest.candidates.map((candidate) => {
                const percentage = contest.total > 0
                  ? (Number(candidate.votes) / contest.total) * 100
                  : 0
                return (
                  <div key={`${candidate.candidate}-${candidate.party}`}>
                    <div className="flex items-center justify-between gap-3 text-sm mb-1">
                      <span className="font-semibold text-slate-200 truncate">
                        {candidate.candidate}
                      </span>
                      <span className="text-slate-300 whitespace-nowrap">
                        {Number(candidate.votes).toLocaleString()} · {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${partyColor(candidate.party)}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{candidate.party}</p>
                  </div>
                )
              })}
            </div>

            <a
              href={contest.candidates[0].source_url}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-xs text-blue-400 hover:text-blue-300 mt-4"
            >
              Source: {contest.candidates[0].source_name}
            </a>
          </article>
        ))}
      </div>

      <p className="text-xs text-slate-500 mt-6">
        Only official candidate vote rows are included. MEDSL records without a county assignment are excluded rather than estimated or redistributed.
      </p>
    </section>
  )
}
