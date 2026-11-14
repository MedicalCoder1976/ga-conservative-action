'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getCountyColor } from '@/lib/color-calculator'
import type { County } from '@/lib/types'
import { GEORGIA_COUNTIES } from '@/lib/constants/georgia-counties'

export function GeorgiaSVGMap() {
  const router = useRouter()
  const [counties, setCounties] = useState<Map<string, County>>(new Map())
  const [loading, setLoading] = useState(true)
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const fetchCounties = async () => {
    try {
      const supabase = createClient()
      const { data, error: err } = await supabase
        .from('counties')
        .select('name, activity_score, color_intensity, fips')

      if (err) {
        console.error('Error fetching counties:', err)
        initializeMockCounties()
        return
      }

      const countyMap = new Map<string, County>()
      if (data) {
        data.forEach((row: any) => {
          const county: County = {
            name: row.name,
            fips: row.fips,
            activity_score: row.activity_score || 0,
            color_intensity: row.color_intensity || 0,
            last_demographics_refresh: row.last_demographics_refresh || new Date().toISOString().split('T')[0],
          }
          countyMap.set(county.name, county)
        })
      }
      setCounties(countyMap)
    } catch (err) {
      console.error('Error fetching counties:', err)
      initializeMockCounties()
    } finally {
      setLoading(false)
    }
  }

  const initializeMockCounties = () => {
    const countyMap = new Map<string, County>()
    GEORGIA_COUNTIES.forEach((name) => {
      const countyData: County = {
        name,
        fips: '13001',
        activity_score: Math.random() * 150,
        color_intensity: Math.floor(Math.random() * 255),
        last_demographics_refresh: new Date().toISOString().split('T')[0],
      }
      countyMap.set(name, countyData)
    })
    setCounties(countyMap)
  }

  useEffect(() => {
    fetchCounties()
  }, [])

  const handleCountyClick = (countyName: string) => {
    router.push(`/dashboard/${encodeURIComponent(countyName)}`)
  }

  const handleCountyHover = (countyName: string) => {
    setHoveredCounty(countyName)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-slate-400 font-semibold">Loading Georgia map...</p>
        </div>
      </div>
    )
  }

  const countyList = Array.from(counties.keys()).sort()
  const blueCount = countyList.filter((c) => (counties.get(c)?.activity_score ?? 0) < 50).length
  const purpleCount = countyList.filter((c) => {
    const s = counties.get(c)?.activity_score ?? 0
    return s >= 50 && s < 200
  }).length
  const redCount = countyList.filter((c) => (counties.get(c)?.activity_score ?? 0) >= 200).length

  return (
    <div className="w-full">
      <div className="bg-white p-6 sm:p-8 rounded-xl border-2 border-red-600">
        {/* Legend */}
        <div className="mb-6 flex flex-wrap gap-4 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-600"></div>
            <span className="text-slate-700 font-semibold">No Activity {blueCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-purple-600"></div>
            <span className="text-slate-700 font-semibold">Some Activity {purpleCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-600"></div>
            <span className="text-slate-700 font-semibold">High Activity {redCount}</span>
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

            {/* Background */}
            <rect width="1200" height="800" fill="#ffffff" stroke="#dc2626" strokeWidth="2" rx="8"/>

            {/* County Blocks - Organized in a simplified map-like grid */}
            {countyList.map((countyName, idx) => {
              const countyData = counties.get(countyName)
              const score = countyData?.activity_score ?? 0
              const color = getCountyColor(score)

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
                  onMouseEnter={() => handleCountyHover(countyName)}
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
                  {score > 0 && (
                    <text
                      x={x + (blockWidth - 2) / 2}
                      y={y + (blockHeight - 2) / 2 + 10}
                      textAnchor="middle"
                      fill="#fbbf24"
                      fontSize="9"
                      fontWeight="bold"
                      pointerEvents="none"
                    >
                      +{Math.floor(score)}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t-2 border-red-600">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-black text-blue-600">{blueCount}</div>
            <p className="text-xs sm:text-sm text-slate-700 mt-1 font-semibold">Unclaimed</p>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-black text-purple-600">{purpleCount}</div>
            <p className="text-xs sm:text-sm text-slate-700 mt-1 font-semibold">Contested</p>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-black text-red-600">{redCount}</div>
            <p className="text-xs sm:text-sm text-slate-700 mt-1 font-semibold">Controlled</p>
          </div>
        </div>

        {/* Hover Tooltip Info */}
        {hoveredCounty && (
          <div className="mt-4 p-3 bg-red-50 border-2 border-red-600 rounded-lg text-center">
            <p className="font-bold text-slate-900">{hoveredCounty}</p>
            <p className="text-sm text-red-600 font-semibold">{Math.floor(counties.get(hoveredCounty)?.activity_score ?? 0)} points</p>
            <p className="text-xs text-slate-700 mt-1 font-semibold">Click to view county details</p>
          </div>
        )}
      </div>
    </div>
  )
}
