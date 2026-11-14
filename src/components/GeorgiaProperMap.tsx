'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { County } from '@/lib/types'
import { getCountyColor } from '@/lib/color-calculator'
import { GEORGIA_COUNTIES } from '@/lib/constants/georgia-counties'

// Approximate center coordinates for each Georgia county (latitude, longitude)
// Used to position counties on a map
const COUNTY_COORDINATES: Record<string, [number, number]> = {
  'Appling': [31.88, -82.35],
  'Atkinson': [31.00, -82.62],
  'Bacon': [31.22, -82.47],
  'Baker': [31.15, -84.30],
  'Baldwin': [33.15, -83.35],
  'Banks': [34.30, -83.40],
  'Barrow': [33.68, -83.70],
  'Bartow': [34.18, -84.70],
  'Ben Hill': [31.58, -83.15],
  'Berrien': [31.02, -83.18],
  'Bibb': [32.82, -83.68],
  'Bleckley': [32.35, -83.68],
  'Brantley': [31.05, -81.55],
  'Brooks': [30.40, -83.25],
  'Bryan': [31.78, -81.45],
  'Bulloch': [32.45, -81.75],
  'Burke': [33.00, -82.20],
  'Butts': [33.30, -84.05],
  'Calhoun': [30.92, -84.60],
  'Camden': [30.90, -81.60],
  'Candler': [32.35, -81.95],
  'Carroll': [33.58, -85.20],
  'Catoosa': [34.88, -85.15],
  'Charlton': [30.48, -82.20],
  'Chatham': [32.05, -81.10],
  'Chattahoochee': [32.30, -85.05],
  'Chattooga': [34.72, -85.35],
  'Cherokee': [34.20, -84.35],
  'Chester': [33.60, -84.90],
  'Chesterfield': [34.42, -84.58],
  'Cobb': [33.95, -84.55],
  'Coffee': [31.40, -82.98],
  'Colquitt': [31.15, -83.75],
  'Columbia': [33.40, -82.10],
  'Cook': [30.80, -83.55],
  'Coweta': [33.60, -84.70],
  'Crawford': [32.85, -84.15],
  'Crisp': [31.90, -83.55],
  'Dade': [34.85, -85.55],
  'Dawson': [34.55, -84.35],
  'Decatur': [30.85, -84.35],
  'DeKalb': [33.75, -84.20],
  'Dodge': [32.40, -83.25],
  'Dooly': [32.25, -83.70],
  'Dougherty': [31.53, -84.15],
  'Douglas': [33.72, -84.80],
  'Early': [31.35, -84.95],
  'Echols': [30.68, -82.90],
  'Effingham': [32.10, -81.40],
  'Elbert': [34.05, -82.85],
  'Emanuel': [32.70, -82.40],
  'Evans': [32.50, -81.80],
  'Fannin': [34.95, -84.50],
  'Fayette': [33.58, -84.35],
  'Floyd': [34.45, -85.20],
  'Forsyth': [34.35, -84.05],
  'Franklin': [34.35, -83.00],
  'Fulton': [33.75, -84.35],
  'Gilmer': [34.60, -84.55],
  'Glascock': [33.40, -82.65],
  'Glynn': [31.15, -81.35],
  'Gordon': [34.40, -85.00],
  'Grady': [31.30, -84.05],
  'Greene': [33.50, -83.15],
  'Gwinnett': [33.95, -84.00],
  'Habersham': [34.55, -83.50],
  'Hall': [34.50, -83.73],
  'Hancock': [33.05, -82.80],
  'Haralson': [33.95, -85.10],
  'Harris': [32.75, -84.95],
  'Hart': [34.32, -82.72],
  'Heard': [33.50, -85.30],
  'Henry': [33.25, -84.27],
  'Houston': [32.30, -83.73],
  'Irwin': [31.72, -83.50],
  'Jackson': [34.15, -83.35],
  'Jasper': [33.65, -84.00],
  'Jeff Davis': [31.92, -82.78],
  'Jefferson': [32.88, -82.50],
  'Jenkins': [32.85, -81.95],
  'Johnson': [32.18, -82.92],
  'Jones': [32.60, -83.98],
  'Lamar': [33.18, -84.30],
  'Lanier': [31.28, -83.15],
  'Laurens': [32.50, -82.70],
  'Lee': [31.95, -84.47],
  'Liberty': [31.85, -81.65],
  'Lincoln': [33.80, -82.45],
  'Long': [31.38, -81.60],
  'Lowndes': [30.78, -83.10],
  'Lumpkin': [34.48, -84.20],
  'Macon': [32.30, -84.15],
  'Madison': [33.58, -83.42],
  'Marion': [32.28, -84.78],
  'McDuffie': [33.48, -82.50],
  'McIntosh': [31.30, -81.25],
  'Meriwether': [33.30, -84.95],
  'Miller': [31.00, -84.60],
  'Milton': [34.25, -84.30],
  'Mitchell': [31.35, -84.20],
  'Monroe': [33.12, -84.00],
  'Montgomery': [32.25, -82.88],
  'Morgan': [33.58, -83.65],
  'Murray': [34.70, -84.85],
  'Muscogee': [32.50, -84.95],
  'Newton': [33.32, -84.00],
  'Oconee': [33.90, -82.70],
  'Oglethorpe': [34.35, -82.65],
  'Paulding': [33.85, -84.70],
  'Peach': [32.60, -84.25],
  'Pickens': [34.55, -84.35],
  'Pierce': [31.22, -82.82],
  'Pike': [33.32, -84.88],
  'Polk': [34.22, -85.30],
  'Pulaski': [32.15, -83.60],
  'Putnam': [33.35, -83.45],
  'Quitman': [31.08, -84.85],
  'Rabun': [34.85, -83.30],
  'Randolph': [31.58, -84.70],
  'Richmond': [33.38, -82.30],
  'Rockdale': [33.68, -84.08],
  'Schley': [32.35, -84.65],
  'Screven': [32.88, -81.88],
  'Seminole': [30.95, -84.75],
  'Spalding': [32.80, -84.25],
  'Stephens': [34.58, -82.85],
  'Stewart': [32.02, -84.75],
  'Sumter': [32.08, -84.55],
  'Talbot': [33.08, -85.15],
  'Taliaferro': [33.65, -82.90],
  'Tattnall': [32.35, -82.08],
  'Taylor': [32.22, -84.45],
  'Telfair': [32.50, -83.10],
  'Terrell': [31.78, -84.75],
  'Thomas': [30.88, -83.72],
  'Tift': [31.42, -83.35],
  'Toombs': [32.35, -82.25],
  'Towns': [34.95, -83.95],
  'Treutlen': [32.28, -82.68],
  'Troup': [33.08, -85.00],
  'Turner': [31.28, -83.60],
  'Twiggs': [32.80, -84.05],
  'Union': [34.78, -84.30],
  'Upson': [32.88, -84.30],
  'Ware': [31.20, -82.60],
  'Warren': [33.58, -82.78],
  'Washington': [33.12, -82.88],
  'Wayne': [31.58, -81.78],
  'Webster': [32.05, -84.85],
  'Wheeler': [32.15, -82.65],
  'White': [34.68, -84.15],
  'Whitfield': [34.88, -85.02],
  'Wilcox': [32.00, -83.88],
  'Wilkes': [33.92, -82.62],
  'Wilkinson': [32.88, -83.05],
  'Worth': [31.00, -83.45],
}

export function GeorgiaProperMap() {
  const router = useRouter()
  const [counties, setCounties] = useState<Map<string, County>>(new Map())
  const [loading, setLoading] = useState(true)
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  // Fetch county data
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
        // Use mock data if empty
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

  const handleCountyClick = (countyName: string) => {
    router.push(`/dashboard/${encodeURIComponent(countyName)}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-slate-700 font-semibold">Loading Georgia map...</p>
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

  // Map bounds: Georgia spans approximately 31° to 35° N, 81° to 85.5° W
  const mapWidth = 1200
  const mapHeight = 800
  const minLat = 30.5
  const maxLat = 35.2
  const minLng = -85.8
  const maxLng = -80.8

  // Convert lat/lng to SVG coordinates
  const latToY = (lat: number) => ((maxLat - lat) / (maxLat - minLat)) * mapHeight
  const lngToX = (lng: number) => ((lng - minLng) / (maxLng - minLng)) * mapWidth

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

        {/* SVG Map */}
        <div className="overflow-auto flex justify-center mb-8">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${mapWidth} ${mapHeight}`}
            className="w-full max-w-4xl h-auto"
            style={{ maxHeight: '600px' }}
          >
            <defs>
              <filter id="shadow">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3"/>
              </filter>
            </defs>

            {/* Background */}
            <rect width={mapWidth} height={mapHeight} fill="#ffffff" stroke="#dc2626" strokeWidth="2" rx="8"/>

            {/* County circles/markers */}
            {countyList.map((countyName) => {
              const coords = COUNTY_COORDINATES[countyName]
              if (!coords) return null

              const [lat, lng] = coords
              const x = lngToX(lng)
              const y = latToY(lat)
              const countyData = counties.get(countyName)
              const score = countyData?.activity_score ?? 0
              const color = getCountyColor(score)
              const isHovered = hoveredCounty === countyName
              const radius = 15

              return (
                <g
                  key={countyName}
                  onClick={() => handleCountyClick(countyName)}
                  onMouseEnter={() => setHoveredCounty(countyName)}
                  onMouseLeave={() => setHoveredCounty(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* County marker circle */}
                  <circle
                    cx={x}
                    cy={y}
                    r={radius}
                    fill={color}
                    stroke={isHovered ? '#fbbf24' : '#dc2626'}
                    strokeWidth={isHovered ? 3 : 2}
                    style={{
                      transition: 'stroke-width 150ms, filter 150ms',
                      filter: isHovered ? 'url(#shadow)' : 'none',
                    }}
                  />

                  {/* County label - only show on hover or if needed */}
                  {isHovered && (
                    <text
                      x={x}
                      y={y - radius - 5}
                      textAnchor="middle"
                      fill="#1e293b"
                      fontSize="12"
                      fontWeight="bold"
                      pointerEvents="none"
                      style={{
                        textShadow: '0 0 3px white',
                        background: 'white',
                        padding: '2px 4px',
                      }}
                    >
                      {countyName}
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

        {/* Hover Tooltip */}
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
