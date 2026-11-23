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
  contest_total_votes?: string
  ballots_cast?: string
  statewide_democrat_votes?: string
  statewide_republican_votes?: string
  statewide_total_votes?: string
}

type Props = {
  county: string
  rows: ElectionRow[]
  nonvoterEstimate?: {
    active_registered_2024: number
    ballots_cast_2024: number
    estimated_nonvoters_2024: number
    active_registered_2026: number
    ballots_cast_2026: number
    estimated_nonvoters_2026: number
  } | null
}

function normalizeOffice(office: string) {
  const normalized = office
    .replace(/\s+-\s+(Rep|Dem|Lib|Ind)\s*$/i, '')
    .replace(/\s*\(Rep|Dem\)\s*$/i, '')
    .trim()

  if (/^State Senate\b/i.test(normalized)) {
    return 'Georgia State Senate'
  }
  if (/^State House of Representatives\b/i.test(normalized)) {
    return 'Georgia State House'
  }
  if (/^State House\b/i.test(normalized)) {
    return 'Georgia State House'
  }
  if (/^US House of Representatives\b/i.test(normalized)) {
    return 'US House of Representatives'
  }
  if (/^US House\b/i.test(normalized)) {
    return 'US House'
  }
  return normalized
}

function featuredOfficeRank(office: string) {
  if (office === 'US Senate' || office === 'US Senate (Special)') return 0
  if (office === 'Governor') return 1
  if (office === 'US House of Representatives' || office === 'US House') return 2
  if (office === 'Georgia State Senate') return 3
  if (office === 'Georgia State House') return 4
  if (office === 'US President') return 5
  if (office === 'Lieutenant Governor') return 6
  if (office === 'Secretary of State') return 7
  if (office === 'Attorney General') return 8
  return 100
}

function stageLabel(stage: string) {
  if (stage === 'general') return 'Final General Election'
  if (stage === 'runoff') return 'Runoff'
  if (stage === 'primary') return 'Primary'
  return stage
}

function contestStageRank(stage: string) {
  if (stage === 'general') return 0
  if (stage === 'runoff') return 2
  if (stage === 'primary') return 3
  return 1
}

function partyColor(party: string) {
  if (party === 'DEMOCRAT') return 'bg-blue-600'
  if (party === 'REPUBLICAN') return 'bg-red-600'
  if (party === 'LIBERTARIAN') return 'bg-yellow-500'
  if (party === 'GREEN') return 'bg-green-600'
  return 'bg-slate-500'
}

export default function CountyElectionHistory({ county, rows, nonvoterEstimate }: Props) {
  const years = useMemo(
    () => [...new Set(rows.map((row) => Number(row.election_year)))].sort((a, b) => b - a),
    [rows],
  )
  const [selectedYear, setSelectedYear] = useState(years[0] ?? 2024)

  const contests = useMemo(() => {
    const groups = new Map<string, ElectionRow[]>()
    for (const row of rows) {
      if (Number(row.election_year) !== selectedYear) continue
      const office = normalizeOffice(row.office)
      const key = `${row.election_date}|${row.stage}|${office}|${row.district}`
      groups.set(key, [...(groups.get(key) ?? []), row])
    }

    return [...groups.entries()]
      .map(([key, candidates]) => {
        const [date, stage, office, district] = key.split('|')
        const officialTotal = candidates
          .map((candidate) => Number(candidate.contest_total_votes))
          .find((value) => Number.isFinite(value) && value > 0)
        const candidateTotal = candidates.reduce((sum, row) => sum + Number(row.votes), 0)
        const ballotsCast = candidates
          .map((candidate) => Number(candidate.ballots_cast))
          .find((value) => Number.isFinite(value) && value > 0)
        const statewideDemocrat = candidates
          .map((candidate) => Number(candidate.statewide_democrat_votes))
          .find((value) => Number.isFinite(value) && value > 0)
        const statewideRepublican = candidates
          .map((candidate) => Number(candidate.statewide_republican_votes))
          .find((value) => Number.isFinite(value) && value > 0)
        const statewideTotal = candidates
          .map((candidate) => Number(candidate.statewide_total_votes))
          .find((value) => Number.isFinite(value) && value > 0)
        return {
          date,
          stage,
          office,
          district,
          candidates: candidates.sort((a, b) => Number(b.votes) - Number(a.votes)),
          total: officialTotal ?? candidateTotal,
          candidateTotal,
          ballotsCast,
          statewideDemocrat,
          statewideRepublican,
          statewideTotal,
        }
      })
      .sort((a, b) => (
        contestStageRank(a.stage) - contestStageRank(b.stage)
        || featuredOfficeRank(a.office) - featuredOfficeRank(b.office)
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

      {nonvoterEstimate && (selectedYear === 2024 || selectedYear === 2026) && (
        <div className="mb-6 rounded-lg border border-yellow-600/40 bg-slate-950/35 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black text-yellow-300">
                Estimated registered voters who did not vote
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Active registered voters minus certified ballots cast
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-3xl font-black text-yellow-200">
                {selectedYear === 2024
                  ? nonvoterEstimate.estimated_nonvoters_2024.toLocaleString()
                  : nonvoterEstimate.estimated_nonvoters_2026.toLocaleString()}
              </p>
              <p className="text-xs text-slate-400">
                {selectedYear === 2024
                  ? `${nonvoterEstimate.active_registered_2024.toLocaleString()} active registered`
                  : `${nonvoterEstimate.active_registered_2026.toLocaleString()} active registered`}
                {' - '}
                {selectedYear === 2024
                  ? `${nonvoterEstimate.ballots_cast_2024.toLocaleString()} ballots cast`
                  : `${nonvoterEstimate.ballots_cast_2026.toLocaleString()} ballots cast`}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-5">
        {contests.map((contest) => (
          <article
            key={`${contest.date}-${contest.stage}-${contest.office}-${contest.district}`}
            className="bg-slate-900/45 border border-slate-600 rounded-lg p-5"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-slate-100">{contest.office}</h3>
                  {contest.stage === 'general' && Number(contest.date.slice(0, 4)) === 2026 && (
                    <span className="rounded-full bg-green-700/40 border border-green-500/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green-300">
                      Final
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {contest.date} ·
                  {contest.stage === 'primary' || contest.stage === 'runoff'
                    ? <strong className="ml-1 font-black text-slate-100">{stageLabel(contest.stage).toUpperCase()}</strong>
                    : <span className="ml-1">{stageLabel(contest.stage)}</span>}
                  {contest.district ? ` · District ${contest.district}` : ''}
                </p>
              </div>
              <div className="text-right whitespace-nowrap">
                <span className="block text-xs text-slate-400">
                  {contest.total.toLocaleString()} votes
                </span>
                {contest.ballotsCast && (
                  <span className="block text-[10px] text-slate-500 mt-1">
                    {contest.ballotsCast.toLocaleString()} ballots cast
                  </span>
                )}
              </div>
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
                        {Number(candidate.votes).toLocaleString()} · {percentage.toFixed(1)}% county
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

            {contest.stage === 'general'
              && Number(contest.date.slice(0, 4)) === 2026
              && contest.statewideDemocrat
              && contest.statewideRepublican
              && contest.statewideTotal && (
              <div className="mt-5 pt-4 border-t border-slate-700">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">
                  Georgia statewide
                </p>
                <p className="text-xs text-slate-300">
                  Democrat {((contest.statewideDemocrat / contest.statewideTotal) * 100).toFixed(1)}%
                  {' · '}
                  Republican {((contest.statewideRepublican / contest.statewideTotal) * 100).toFixed(1)}%
                </p>
              </div>
            )}

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
