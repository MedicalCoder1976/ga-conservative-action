'use client'

import { useEffect, useMemo, useState } from 'react'

type CountyRecord = {
  geoid: string
  name: string
  state: string
  population: number | null
  land_km2: number | null
  density: number | null
  income: number | null
  home_value: number | null
  poverty: number | null
  median_age: number | null
  foreign_born: number | null
  bachelors: number | null
  broadband: number | null
  commute: number | null
  homeownership: number | null
  uninsured: number | null
  forest: number | null
  crop: number | null
  pasture: number | null
  developed: number | null
  cbsa: string | null
  faith: number | null
  faith_tradition: string | null
  amenities: number | null
  mhlth: number | null
  loneliness: number | null
  disasters: number | null
  veterans: number | null
  veterans_pct: number | null
  armed_forces: number | null
  armed_forces_pct: number | null
}

type IntelligenceData = {
  source_vintage: string
  source: string
  references: Record<string, string>
  georgia_medians: Record<string, number | null>
  counties: CountyRecord[]
}

interface CountyIntelligenceCardProps {
  county: string
}

const formatNumber = (value: number | null | undefined) =>
  typeof value === 'number' ? value.toLocaleString() : 'Unavailable'

const formatMoney = (value: number | null | undefined) =>
  typeof value === 'number'
    ? `$${Math.round(value).toLocaleString()}`
    : 'Unavailable'

const formatPercent = (
  value: number | null | undefined,
  fraction = false,
) => {
  if (typeof value !== 'number') return 'Unavailable'
  return `${(fraction ? value * 100 : value).toFixed(1)}%`
}

const formatDecimal = (value: number | null | undefined, digits = 1) =>
  typeof value === 'number' ? value.toFixed(digits) : 'Unavailable'

function comparison(
  value: number | null | undefined,
  median: number | null | undefined,
  higherIsGood = true,
) {
  if (typeof value !== 'number' || typeof median !== 'number') {
    return { label: 'No Georgia comparison', className: 'text-slate-400' }
  }

  const difference = value - median
  if (Math.abs(difference) < median * 0.02) {
    return { label: 'Near Georgia median', className: 'text-slate-300' }
  }

  const favorable = higherIsGood ? difference > 0 : difference < 0
  return favorable
    ? { label: 'Above Georgia median', className: 'text-emerald-300' }
    : { label: 'Below Georgia median', className: 'text-amber-300' }
}

export default function CountyIntelligenceCard({ county }: CountyIntelligenceCardProps) {
  const [data, setData] = useState<IntelligenceData | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true
    fetch('/data/usaciv-georgia-county-intelligence.json')
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json()
      })
      .then((payload: IntelligenceData) => {
        if (active) setData(payload)
      })
      .catch(() => {
        if (active) setError(true)
      })

    return () => {
      active = false
    }
  }, [])

  const record = useMemo(() => {
    if (!data) return null
    const normalized = county.replace(/ county$/i, '').trim().toLowerCase()
    return data.counties.find(
      (item) => item.name.replace(/ county$/i, '').trim().toLowerCase() === normalized,
    ) ?? null
  }, [county, data])

  if (error) {
    return (
      <div className="rounded-lg border border-amber-600/40 bg-amber-900/20 p-5 text-sm text-amber-200">
        County intelligence could not be loaded. No estimated values are being shown.
      </div>
    )
  }

  if (!data) {
    return (
      <div className="rounded-lg border border-slate-600 bg-slate-900/40 p-5 text-sm text-slate-400">
        Loading verified county intelligence…
      </div>
    )
  }

  if (!record) {
    return (
      <div className="rounded-lg border border-slate-600 bg-slate-900/40 p-5 text-sm text-slate-400">
        No source record was found for this county.
      </div>
    )
  }

  const values = [
    {
      label: 'Population',
      value: formatNumber(record.population),
      detail: typeof record.density === 'number'
        ? `${formatDecimal(record.density)} people/km²`
        : 'Density unavailable',
    },
    {
      label: 'Median household income',
      value: formatMoney(record.income),
      detail: comparison(record.income, data.georgia_medians.income).label,
      detailClass: comparison(record.income, data.georgia_medians.income).className,
    },
    {
      label: 'Poverty',
      value: formatPercent(record.poverty, true),
      detail: comparison(record.poverty, data.georgia_medians.poverty, false).label,
      detailClass: comparison(record.poverty, data.georgia_medians.poverty, false).className,
    },
    {
      label: 'Bachelor’s degree or higher',
      value: formatPercent(record.bachelors, true),
      detail: comparison(record.bachelors, data.georgia_medians.bachelors).label,
      detailClass: comparison(record.bachelors, data.georgia_medians.bachelors).className,
    },
    {
      label: 'Broadband access',
      value: formatPercent(record.broadband, true),
      detail: comparison(record.broadband, data.georgia_medians.broadband).label,
      detailClass: comparison(record.broadband, data.georgia_medians.broadband).className,
    },
    {
      label: 'Homeownership',
      value: formatPercent(record.homeownership, true),
      detail: comparison(record.homeownership, data.georgia_medians.homeownership).label,
      detailClass: comparison(record.homeownership, data.georgia_medians.homeownership).className,
    },
    {
      label: 'Median home value',
      value: formatMoney(record.home_value),
      detail: 'ACS 2024 5-year estimate',
    },
    {
      label: 'Uninsured',
      value: formatPercent(record.uninsured, true),
      detail: comparison(record.uninsured, data.georgia_medians.uninsured, false).label,
      detailClass: comparison(record.uninsured, data.georgia_medians.uninsured, false).className,
    },
    {
      label: 'Mental distress',
      value: formatPercent(record.mhlth, true),
      detail: 'CDC PLACES model-based estimate',
    },
    {
      label: 'Community wellbeing',
      value: typeof record.amenities === 'number' ? formatDecimal(record.amenities) : 'Unavailable',
      detail: '100 is the Georgia county comparison average',
    },
    {
      label: 'Veterans',
      value: formatNumber(record.veterans),
      detail: typeof record.veterans_pct === 'number'
        ? `${formatPercent(record.veterans_pct, true)} of civilian adults`
        : 'Veteran share unavailable',
    },
    {
      label: 'FEMA major-disaster declarations',
      value: formatNumber(record.disasters),
      detail: 'Distinct declarations since 2000',
    },
  ]

  const topics: string[] = []
  if (typeof record.poverty === 'number' &&
      typeof data.georgia_medians.poverty === 'number' &&
      record.poverty > data.georgia_medians.poverty) {
    topics.push('Income and workforce development')
  }
  if (typeof record.uninsured === 'number' &&
      typeof data.georgia_medians.uninsured === 'number' &&
      record.uninsured > data.georgia_medians.uninsured) {
    topics.push('Health-access education')
  }
  if (typeof record.broadband === 'number' &&
      typeof data.georgia_medians.broadband === 'number' &&
      record.broadband < data.georgia_medians.broadband) {
    topics.push('Broadband and digital access')
  }
  if (typeof record.bachelors === 'number' &&
      typeof data.georgia_medians.bachelors === 'number' &&
      record.bachelors < data.georgia_medians.bachelors) {
    topics.push('Education and workforce readiness')
  }
  if (typeof record.disasters === 'number' &&
      typeof data.georgia_medians.disasters === 'number' &&
      record.disasters > data.georgia_medians.disasters) {
    topics.push('Disaster preparedness')
  }
  if (topics.length === 0) topics.push('Community baseline review')

  return (
    <div className="rounded-lg border border-cyan-700/50 bg-slate-900/45 p-5">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h4 className="text-lg font-bold text-cyan-300">Verified County Intelligence</h4>
          <p className="mt-1 text-xs text-slate-400">
            {data.source_vintage} · County FIPS {record.geoid}
          </p>
        </div>
        {record.cbsa && (
          <span className="rounded border border-slate-600 px-2 py-1 text-xs text-slate-300">
            CBSA {record.cbsa}
          </span>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {values.map((item) => (
          <div key={item.label} className="rounded border border-slate-700 bg-slate-800/60 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">{item.label}</p>
            <p className="mt-1 text-xl font-black text-white">{item.value}</p>
            <p className={`mt-1 text-xs ${item.detailClass ?? 'text-slate-400'}`}>
              {item.detail}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded border border-slate-700 bg-slate-800/40 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Community education topics</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-200">
            {topics.map((topic) => (
              <li key={topic}>• {topic}</li>
            ))}
          </ul>
        </div>
        <div className="rounded border border-slate-700 bg-slate-800/40 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Land use</p>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <span className="text-slate-400">Forest</span>
            <strong>{formatPercent(record.forest, true)}</strong>
            <span className="text-slate-400">Cropland</span>
            <strong>{formatPercent(record.crop, true)}</strong>
            <span className="text-slate-400">Pasture</span>
            <strong>{formatPercent(record.pasture, true)}</strong>
            <span className="text-slate-400">Built-up</span>
            <strong>{formatPercent(record.developed, true)}</strong>
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-slate-700 pt-4 text-xs text-slate-400">
        <p>
          This panel describes community conditions. It does not estimate voting behavior or a person’s beliefs.
        </p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          <a className="text-cyan-300 hover:underline" href={data.references.census} target="_blank" rel="noreferrer">
            Census ACS
          </a>
          <a className="text-cyan-300 hover:underline" href={data.references.cdc} target="_blank" rel="noreferrer">
            CDC PLACES
          </a>
          <a className="text-cyan-300 hover:underline" href={data.references.fema} target="_blank" rel="noreferrer">
            FEMA
          </a>
          <a className="text-cyan-300 hover:underline" href={data.references.source} target="_blank" rel="noreferrer">
            USA Civ county source
          </a>
        </div>
      </div>
    </div>
  )
}
