'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getCountyColor } from '@/lib/color-calculator'
import type { County } from '@/lib/types'
import { GEORGIA_COUNTIES } from '@/lib/constants/georgia-counties'
import Link from 'next/link'

export function GeorgiaMapBoundaries() {
  const router = useRouter()
  const [counties, setCounties] = useState<Map<string, County>>(new Map())
  const [loading, setLoading] = useState(true)
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null)
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null)

  const fetchCounties = async () => {
    try {
      const supabase = createClient()
      const { data } = await supabase.from('counties').select('name, activity_score, color_intensity, fips')
      
      const countyMap = new Map<string, County>()
      if (data && data.length > 0) {
        data.forEach((row: any) => {
          countyMap.set(row.name, {
            name: row.name,
            fips: row.fips,
            activity_score: row.activity_score || 0,
            color_intensity: row.color_intensity || 0,
            last_demographics_refresh: row.last_demographics_refresh || new Date().toISOString().split('T')[0],
          })
        })
        setCounties(countyMap)
      } else {
        initializeMockCounties()
      }
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
      countyMap.set(name, {
        name,
        fips: '13001',
        activity_score: Math.random() * 150,
        color_intensity: Math.floor(Math.random() * 255),
        last_demographics_refresh: new Date().toISOString().split('T')[0],
      })
    })
    setCounties(countyMap)
  }

  useEffect(() => {
    fetchCounties()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading Georgia map...</p>
        </div>
      </div>
    )
  }

  const handleCountyClick = (countyName: string) => {
    setSelectedCounty(countyName)
    router.push(`/dashboard/${encodeURIComponent(countyName)}`)
  }

  const countyList = Array.from(counties.keys()).sort()

  return (
    <div className="w-full bg-white border-2 border-red-600 rounded-lg overflow-hidden">
      {/* Map Display - Using SVG with improved styling */}
      <svg
        viewBox="0 0 960 600"
        className="w-full h-auto bg-gradient-to-b from-gray-50 to-white"
        style={{ minHeight: '400px' }}
      >
        <defs>
          <style>{`
            .county-path {
              stroke: #fff;
              stroke-width: 1;
              stroke-linejoin: round;
              cursor: pointer;
              transition: stroke-width 0.2s;
            }
            .county-path:hover {
              stroke-width: 2;
              filter: brightness(1.1);
            }
            .county-label {
              font-size: 10px;
              font-weight: bold;
              text-anchor: middle;
              pointer-events: none;
              fill: #333;
              text-shadow: 0 0 3px white;
            }
          `}</style>
        </defs>

        {/* Background */}
        <rect width="960" height="600" fill="#f9f9f9"/>

        {/* Georgia County Paths (Simplified representation) */}
        {/* Note: For production, use actual county boundary GeoJSON */}
        {/* This shows major Georgia regions with approximate positions */}

        {/* Sample County Regions - Replace with actual GeoJSON boundaries */}
        {/* North Georgia */}
        <g>
          {/* Fulton County (Major - Atlanta) */}
          <rect
            x="320" y="200" width="80" height="70"
            className="county-path"
            fill={getCountyColor(counties.get('Fulton')?.activity_score || 0)}
            onClick={() => handleCountyClick('Fulton')}
            onMouseEnter={() => setHoveredCounty('Fulton')}
            onMouseLeave={() => setHoveredCounty(null)}
          />
          <text x="360" y="240" className="county-label" pointerEvents="none">Fulton</text>

          {/* DeKalb County */}
          <rect
            x="400" y="200" width="70" height="70"
            className="county-path"
            fill={getCountyColor(counties.get('DeKalb')?.activity_score || 0)}
            onClick={() => handleCountyClick('DeKalb')}
            onMouseEnter={() => setHoveredCounty('DeKalb')}
            onMouseLeave={() => setHoveredCounty(null)}
          />
          <text x="435" y="240" className="county-label" pointerEvents="none">DeKalb</text>

          {/* Cobb County */}
          <rect
            x="280" y="160" width="60" height="60"
            className="county-path"
            fill={getCountyColor(counties.get('Cobb')?.activity_score || 0)}
            onClick={() => handleCountyClick('Cobb')}
            onMouseEnter={() => setHoveredCounty('Cobb')}
            onMouseLeave={() => setHoveredCounty(null)}
          />
          <text x="310" y="195" className="county-label" pointerEvents="none">Cobb</text>

          {/* Gwinnett County */}
          <rect
            x="440" y="160" width="80" height="70"
            className="county-path"
            fill={getCountyColor(counties.get('Gwinnett')?.activity_score || 0)}
            onClick={() => handleCountyClick('Gwinnett')}
            onMouseEnter={() => setHoveredCounty('Gwinnett')}
            onMouseLeave={() => setHoveredCounty(null)}
          />
          <text x="480" y="200" className="county-label" pointerEvents="none">Gwinnett</text>

          {/* Clayton County */}
          <rect
            x="330" y="270" width="60" height="60"
            className="county-path"
            fill={getCountyColor(counties.get('Clayton')?.activity_score || 0)}
            onClick={() => handleCountyClick('Clayton')}
            onMouseEnter={() => setHoveredCounty('Clayton')}
            onMouseLeave={() => setHoveredCounty(null)}
          />
          <text x="360" y="305" className="county-label" pointerEvents="none">Clayton</text>

          {/* Henry County */}
          <rect
            x="400" y="280" width="60" height="70"
            className="county-path"
            fill={getCountyColor(counties.get('Henry')?.activity_score || 0)}
            onClick={() => handleCountyClick('Henry')}
            onMouseEnter={() => setHoveredCounty('Henry')}
            onMouseLeave={() => setHoveredCounty(null)}
          />
          <text x="430" y="320" className="county-label" pointerEvents="none">Henry</text>
        </g>

        {/* Other Major Counties */}
        <g>
          {/* Forsyth County (North) */}
          <polygon
            points="480,100 520,100 520,150 480,150"
            className="county-path"
            fill={getCountyColor(counties.get('Forsyth')?.activity_score || 0)}
            onClick={() => handleCountyClick('Forsyth')}
            onMouseEnter={() => setHoveredCounty('Forsyth')}
            onMouseLeave={() => setHoveredCounty(null)}
          />
          <text x="500" y="130" className="county-label" pointerEvents="none">Forsyth</text>

          {/* Chatham County (Savannah) */}
          <polygon
            points="600,430 650,430 650,480 600,480"
            className="county-path"
            fill={getCountyColor(counties.get('Chatham')?.activity_score || 0)}
            onClick={() => handleCountyClick('Chatham')}
            onMouseEnter={() => setHoveredCounty('Chatham')}
            onMouseLeave={() => setHoveredCounty(null)}
          />
          <text x="625" y="460" className="county-label" pointerEvents="none">Chatham</text>

          {/* Muscogee County (Columbus) */}
          <polygon
            points="220,380 270,380 270,430 220,430"
            className="county-path"
            fill={getCountyColor(counties.get('Muscogee')?.activity_score || 0)}
            onClick={() => handleCountyClick('Muscogee')}
            onMouseEnter={() => setHoveredCounty('Muscogee')}
            onMouseLeave={() => setHoveredCounty(null)}
          />
          <text x="245" y="410" className="county-label" pointerEvents="none">Muscogee</text>

          {/* Bibb County (Macon) */}
          <polygon
            points="380,350 430,350 430,400 380,400"
            className="county-path"
            fill={getCountyColor(counties.get('Bibb')?.activity_score || 0)}
            onClick={() => handleCountyClick('Bibb')}
            onMouseEnter={() => setHoveredCounty('Bibb')}
            onMouseLeave={() => setHoveredCounty(null)}
          />
          <text x="405" y="380" className="county-label" pointerEvents="none">Bibb</text>
        </g>

        {/* Click to Select Text - Bottom */}
        <text x="480" y="580" textAnchor="middle" fontSize="12" fill="#666" fontWeight="bold">
          {hoveredCounty ? `Click to view ${hoveredCounty} County` : 'Click any county to view details'}
        </text>
      </svg>

      {/* Legend */}
      <div className="p-6 bg-white border-t-2 border-red-600">
        <h3 className="font-bold text-slate-900 mb-4">County Status Legend</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded border border-gray-300"></div>
            <span className="text-sm font-semibold text-slate-700">Democratic Lean</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-500 rounded border border-gray-300"></div>
            <span className="text-sm font-semibold text-slate-700">Competitive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-600 rounded border border-gray-300"></div>
            <span className="text-sm font-semibold text-slate-700">Republican Lean</span>
          </div>
        </div>
      </div>

      {/* County List - Quick Access */}
      <div className="max-h-64 overflow-y-auto bg-gray-50 border-t border-gray-200">
        <div className="p-4">
          <p className="text-xs font-bold text-slate-600 uppercase mb-3">All 159 Georgia Counties</p>
          <div className="grid grid-cols-4 gap-2">
            {countyList.slice(0, 20).map((county) => (
              <button
                key={county}
                onClick={() => handleCountyClick(county)}
                className="text-xs font-semibold px-2 py-1 rounded bg-white border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition"
              >
                {county}
              </button>
            ))}
          </div>
          {countyList.length > 20 && (
            <p className="text-xs text-slate-600 mt-3 font-semibold">
              + {countyList.length - 20} more counties (scroll in dropdown or use search)
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
