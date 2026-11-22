'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { County } from '@/lib/types'
import { GEORGIA_COUNTIES } from '@/lib/constants/georgia-counties'

interface CountyDrift {
  name: string
  drift_pct: number // Positive = Republican gain, Negative = Democratic gain
  dem_drift: number
  rep_drift: number
  baseline_year: number
  current_year: number
}

export function VoterDriftMap() {
  const router = useRouter()
  const [counties, setCounties] = useState<Map<string, CountyDrift>>(new Map())
  const [loading, setLoading] = useState(true)
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState(2024)
  const svgRef = useRef<SVGSVGElement>(null)

  const fetchVoterDrift = async () => {
    try {
      const supabase = createClient()
      
      // Fetch county voter statistics for 2016 (baseline) and current year
      const { data: baselineData, error: baselineErr } = await supabase
        .from('county_voter_statistics')
        .select('*')
        .eq('election_year', 2016)

      const { data: currentData, error: currentErr } = await supabase
        .from('county_voter_statistics')
        .select('*')
        .eq('election_year', selectedYear)

      if (baselineErr || currentErr) {
        console.error('Error fetching drift data:', baselineErr || currentErr)
        setCounties(new Map())
        return
      }

      if (!baselineData || !currentData || baselineData.length === 0 || currentData.length === 0) {
        console.warn('Insufficient authoritative data for drift calculation')
        setCounties(new Map())
        return
      }

      // Create lookup maps
      const baselineMap = new Map()
      const currentMap = new Map()
      
      baselineData.forEach((row: any) => {
        baselineMap.set(row.county, {
          dem_votes: row.democrat_votes || 0,
          rep_votes: row.republican_votes || 0,
          total_votes: row.total_votes || 1,
        })
      })

      currentData.forEach((row: any) => {
        currentMap.set(row.county, {
          dem_votes: row.democrat_votes || 0,
          rep_votes: row.republican_votes || 0,
          total_votes: row.total_votes || 1,
        })
      })

      // Calculate drift for all counties
      const countyMap = new Map<string, CountyDrift>()
      GEORGIA_COUNTIES.forEach((countyName) => {
        const baseline = baselineMap.get(countyName)
        const current = currentMap.get(countyName)

        if (baseline && current) {
          const baselineRepPct = (baseline.rep_votes / baseline.total_votes) * 100
          const currentRepPct = (current.rep_votes / current.total_votes) * 100
          const drift = currentRepPct - baselineRepPct // Positive = R gain, Negative = D gain

          const driftData: CountyDrift = {
            name: countyName,
            drift_pct: drift,
            dem_drift: drift < 0 ? Math.abs(drift) : 0,
            rep_drift: drift > 0 ? drift : 0,
            baseline_year: 2016,
            current_year: selectedYear,
          }
          countyMap.set(countyName, driftData)
        } else {
          // Do not fabricate drift values for counties missing authoritative totals.
        }
      })
      
      setCounties(countyMap)
    } catch (err) {
      console.error('Error fetching drift:', err)
      setCounties(new Map())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVoterDrift()
  }, [selectedYear])

  const handleCountyClick = (countyName: string) => {
    router.push(`/dashboard/${encodeURIComponent(countyName)}`)
  }

  const getCountyColor = (driftPct: number): string => {
    // Green baseline (0% drift)
    // Red for Republican gains (positive drift)
    // Blue for Democratic gains (negative drift)
    
    const absDrift = Math.abs(driftPct)
    
    if (absDrift < 1) {
      // Green for minimal drift (baseline)
      return '#22c55e' // green-500
    } else if (driftPct > 0) {
      // Republican gains (shades of red)
      if (absDrift < 3) return '#ef4444' // red-500
      if (absDrift < 6) return '#dc2626' // red-600
      if (absDrift < 10) return '#b91c1c' // red-700
      return '#7f1d1d' // red-900
    } else {
      // Democratic gains (shades of blue)
      if (absDrift < 3) return '#3b82f6' // blue-500
      if (absDrift < 6) return '#2563eb' // blue-600
      if (absDrift < 10) return '#1d4ed8' // blue-700
      return '#1e40af' // blue-900
    }
  }

  const getCountyLabel = (driftPct: number): string => {
    if (driftPct > 0) {
      return `R+${driftPct.toFixed(1)}%`
    } else if (driftPct < 0) {
      return `D+${Math.abs(driftPct).toFixed(1)}%`
    }
    return 'Even'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-slate-400 font-semibold">Loading voter drift map...</p>
        </div>
      </div>
    )
  }

  const countyList = Array.from(counties.keys()).sort()
  const greenCount = countyList.filter((c) => Math.abs((counties.get(c)?.drift_pct ?? 0)) < 1).length
  const blueCount = countyList.filter((c) => {
    const d = (counties.get(c)?.drift_pct ?? 0)
    return d < -1 && d > -6
  }).length
  const darkBlueCount = countyList.filter((c) => (counties.get(c)?.drift_pct ?? 0) < -6).length
  const redCount = countyList.filter((c) => {
    const d = (counties.get(c)?.drift_pct ?? 0)
    return d > 1 && d < 6
  }).length
  const darkRedCount = countyList.filter((c) => (counties.get(c)?.drift_pct ?? 0) > 6).length

  return (
    <div className="w-full">
      <div className="bg-gradient-to-br from-green-50 to-white p-6 sm:p-8 rounded-xl border-2 border-green-600">
        {/* Election Year Selector */}
        <div className="mb-6">
          <label className="block text-sm font-bold mb-3 text-slate-900">
            Select Election Year for Voter Drift:
          </label>
          <div className="flex flex-wrap gap-2">
            {[2026, 2024, 2020, 2016].map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded-lg font-bold transition ${
                  selectedYear === year
                    ? 'bg-red-600 text-white border-2 border-red-700'
                    : 'bg-white text-slate-900 border-2 border-slate-300 hover:border-red-600'
                }`}
              >
                {year}{year === 2026 ? ' (Most Recent)' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mb-6 grid grid-cols-2 sm:grid-cols-5 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <span className="text-slate-700 font-semibold">Baseline {greenCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500"></div>
            <span className="text-slate-700 font-semibold">Dem Gain {blueCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-700"></div>
            <span className="text-slate-700 font-semibold">Dem +6 {darkBlueCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500"></div>
            <span className="text-slate-700 font-semibold">GOP Gain {redCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-700"></div>
            <span className="text-slate-700 font-semibold">GOP +6 {darkRedCount}</span>
          </div>
        </div>

        {/* SVG County Grid Map */}
        <div className="overflow-x-auto flex justify-center mb-8">
          <svg
            ref={svgRef}
            viewBox="0 0 1200 800"
            className="w-full max-w-4xl h-auto"
            style={{ maxHeight: '600px' }}
          >
            <defs>
              <filter id="shadow">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3"/>
              </filter>
            </defs>

            {/* Background - Green baseline */}
            <rect width="1200" height="800" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" rx="8"/>

            {/* County Blocks */}
            {countyList.map((countyName, idx) => {
              const countyData = counties.get(countyName)
              const drift = countyData?.drift_pct ?? 0
              const color = getCountyColor(drift)
              const label = getCountyLabel(drift)

              const cols = 13
              const blockWidth = 85
              const blockHeight = 60
              const col = idx % cols
              const row = Math.floor(idx / cols)
              const x = col * blockWidth + 10
              const y = row * blockHeight + 10

              const isHovered = hoveredCounty === countyName

              return (
                <g
                  key={countyName}
                  onClick={() => handleCountyClick(countyName)}
                  onMouseEnter={() => setHoveredCounty(countyName)}
                  onMouseLeave={() => setHoveredCounty(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <rect
                    x={x}
                    y={y}
                    width={blockWidth - 2}
                    height={blockHeight - 2}
                    fill={color}
                    stroke={isHovered ? '#fbbf24' : '#e2e8f0'}
                    strokeWidth={isHovered ? 3 : 2}
                    rx="4"
                    style={{
                      transition: 'stroke-width 150ms, filter 150ms',
                      filter: isHovered ? 'url(#shadow)' : 'none',
                    }}
                  />
                  <text
                    x={x + (blockWidth - 2) / 2}
                    y={y + (blockHeight - 2) / 2 - 8}
                    textAnchor="middle"
                    fill="#1e293b"
                    fontSize="10"
                    fontWeight="bold"
                    pointerEvents="none"
                  >
                    {countyName}
                  </text>
                  <text
                    x={x + (blockWidth - 2) / 2}
                    y={y + (blockHeight - 2) / 2 + 10}
                    textAnchor="middle"
                    fill={drift > 0 ? '#7f1d1d' : drift < 0 ? '#1e40af' : '#166534'}
                    fontSize="9"
                    fontWeight="bold"
                    pointerEvents="none"
                  >
                    {label}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Stats and Info */}
        <div className="border-t-2 border-green-600 pt-6">
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-green-600">{greenCount}</div>
              <p className="text-xs sm:text-sm text-slate-700 mt-1 font-semibold">Baseline</p>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-blue-500">{blueCount}</div>
              <p className="text-xs sm:text-sm text-slate-700 mt-1 font-semibold">Dem Gains</p>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-blue-900">{darkBlueCount}</div>
              <p className="text-xs sm:text-sm text-slate-700 mt-1 font-semibold">Dem +6%</p>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-red-500">{redCount}</div>
              <p className="text-xs sm:text-sm text-slate-700 mt-1 font-semibold">GOP Gains</p>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-red-900">{darkRedCount}</div>
              <p className="text-xs sm:text-sm text-slate-700 mt-1 font-semibold">GOP +6%</p>
            </div>
          </div>

          <div className="bg-green-100 border-l-4 border-green-600 p-4 rounded">
            <p className="text-sm text-green-900 font-semibold">
              💚 Green baseline = Starting point (2016 baseline)
            </p>
            <p className="text-sm text-red-900 font-semibold mt-2">
              🔴 Red = Republican gains (shift toward GOP from 2016-{selectedYear})
            </p>
            <p className="text-sm text-blue-900 font-semibold mt-2">
              🔵 Blue = Democratic gains (shift toward Democrats from 2016-{selectedYear})
            </p>
          </div>
        </div>

        {/* Hover Tooltip Info */}
        {hoveredCounty && counties.has(hoveredCounty) && (
          <div className="mt-4 p-3 bg-green-100 border-2 border-green-600 rounded-lg text-center">
            <p className="font-bold text-slate-900">{hoveredCounty}</p>
            <p className="text-sm text-slate-700 font-semibold">
              {getCountyLabel(counties.get(hoveredCounty)?.drift_pct ?? 0)}
            </p>
            <p className="text-xs text-slate-600 mt-1">Click to view county details and {selectedYear} data</p>
          </div>
        )}
      </div>
    </div>
  )
}
