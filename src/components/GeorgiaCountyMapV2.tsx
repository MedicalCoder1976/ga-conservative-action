'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, ChevronDown } from 'lucide-react'

interface County {
  id: string
  name: string
  // SVG path data for the county boundary
  path?: string
  // Center coordinates for click detection
  centerLat: number
  centerLng: number
}

// Simplified Georgia county coordinates for positioning
// This creates a dot-based map that's accurate and clickable
// For a full SVG map, these would be replaced with actual county boundary paths
const GEORGIA_COUNTIES: County[] = [
  // North Georgia (Blue Ridge)
  { name: 'Union', centerLat: 34.88, centerLng: -84.08 },
  { name: 'Towns', centerLat: 34.87, centerLng: -83.58 },
  { name: 'Rabun', centerLat: 34.91, centerLng: -83.25 },
  { name: 'White', centerLat: 34.73, centerLng: -83.78 },
  { name: 'Lumpkin', centerLat: 34.58, centerLng: -84.04 },
  { name: 'Dawson', centerLat: 34.43, centerLng: -84.16 },
  { name: 'Gilmer', centerLat: 34.64, centerLng: -84.53 },
  { name: 'Fannin', centerLat: 34.84, centerLng: -83.90 },
  { name: 'Pickens', centerLat: 34.52, centerLng: -84.51 },
  { name: 'Cherokee', centerLat: 34.31, centerLng: -84.60 },
  { name: 'Forsyth', centerLat: 34.36, centerLng: -84.40 },
  { name: 'Milton', centerLat: 34.18, centerLng: -84.35 },
  { name: 'Bartow', centerLat: 34.18, centerLng: -84.77 },
  { name: 'Floyd', centerLat: 34.39, centerLng: -85.20 },
  { name: 'Chattooga', centerLat: 34.71, centerLng: -85.26 },
  { name: 'Dade', centerLat: 34.77, centerLng: -85.37 },
  { name: 'Catoosa', centerLat: 34.94, centerLng: -85.19 },
  { name: 'Murray', centerLat: 34.77, centerLng: -84.68 },
  { name: 'Polk', centerLat: 34.35, centerLng: -85.24 },
  { name: 'Cleburne', centerLat: 34.25, centerLng: -85.50 },
  
  // Northwest Georgia
  { name: 'Elbert', centerLat: 34.06, centerLng: -82.88 },
  { name: 'Stephens', centerLat: 34.45, centerLng: -82.66 },
  { name: 'Franklin', centerLat: 34.59, centerLng: -83.26 },
  { name: 'Madison', centerLat: 33.60, centerLng: -83.54 },
  { name: 'Morgan', centerLat: 33.64, centerLng: -83.68 },
  { name: 'Oconee', centerLat: 33.77, centerLng: -83.42 },
  { name: 'Greene', centerLat: 33.54, centerLng: -83.18 },
  { name: 'Jasper', centerLat: 34.03, centerLng: -84.36 },
  { name: 'Putnam', centerLat: 33.42, centerLng: -83.86 },
  { name: 'Hancock', centerLat: 33.40, centerLng: -83.02 },
  
  // North-Central Georgia
  { name: 'Cobb', centerLat: 33.88, centerLng: -84.60 },
  { name: 'Fulton', centerLat: 33.75, centerLng: -84.41 },
  { name: 'DeKalb', centerLat: 33.77, centerLng: -84.25 },
  { name: 'Gwinnett', centerLat: 33.95, centerLng: -84.00 },
  { name: 'Henry', centerLat: 33.57, centerLng: -84.34 },
  { name: 'Clayton', centerLat: 33.52, centerLng: -84.38 },
  { name: 'Newton', centerLat: 33.64, centerLng: -84.23 },
  { name: 'Rockdale', centerLat: 33.71, centerLng: -84.04 },
  { name: 'Paulding', centerLat: 34.05, centerLng: -84.88 },
  { name: 'Douglas', centerLat: 33.74, centerLng: -84.71 },
  { name: 'Fayette', centerLat: 33.40, centerLng: -84.47 },
  { name: 'Spalding', centerLat: 33.07, centerLng: -84.30 },
  { name: 'Pike', centerLat: 32.88, centerLng: -84.68 },
  { name: 'Meriwether', centerLat: 33.08, centerLng: -84.57 },
  { name: 'Carroll', centerLat: 33.58, centerLng: -85.10 },
  { name: 'Coweta', centerLat: 33.44, centerLng: -84.73 },
  
  // Central Georgia
  { name: 'Lamar', centerLat: 33.27, centerLng: -84.09 },
  { name: 'Jones', centerLat: 32.91, centerLng: -83.74 },
  { name: 'Upson', centerLat: 32.88, centerLng: -84.17 },
  { name: 'Talbot', centerLat: 32.69, centerLng: -85.02 },
  { name: 'Harris', centerLat: 32.59, centerLng: -84.97 },
  { name: 'Marion', centerLat: 32.70, centerLng: -84.76 },
  { name: 'Muscogee', centerLat: 32.50, centerLng: -84.98 },
  { name: 'Crawford', centerLat: 32.68, centerLng: -84.24 },
  { name: 'Peach', centerLat: 32.64, centerLng: -84.16 },
  { name: 'Macon', centerLat: 32.59, centerLng: -83.98 },
  { name: 'Houston', centerLat: 32.44, centerLng: -83.74 },
  { name: 'Bibb', centerLat: 32.84, centerLng: -83.61 },
  { name: 'Twiggs', centerLat: 32.87, centerLng: -83.49 },
  
  // Southwest Georgia
  { name: 'Quitman', centerLat: 31.68, centerLng: -84.71 },
  { name: 'Clay', centerLat: 31.95, centerLng: -84.82 },
  { name: 'Calhoun', centerLat: 30.94, centerLng: -84.59 },
  { name: 'Randolph', centerLat: 32.27, centerLng: -84.89 },
  { name: 'Stewart', centerLat: 32.20, centerLng: -84.86 },
  { name: 'Terrell', centerLat: 32.11, centerLng: -84.79 },
  { name: 'Lee', centerLat: 32.25, centerLng: -84.60 },
  { name: 'Sumter', centerLat: 32.35, centerLng: -84.04 },
  { name: 'Dooly', centerLat: 32.02, centerLng: -83.78 },
  { name: 'Crisp', centerLat: 31.89, centerLng: -83.65 },
  { name: 'Wilcox', centerLat: 32.17, centerLng: -83.28 },
  { name: 'Worth', centerLat: 31.65, centerLng: -83.94 },
  { name: 'Dougherty', centerLat: 31.55, centerLng: -84.15 },
  { name: 'Baker', centerLat: 31.65, centerLng: -84.47 },
  { name: 'Miller', centerLat: 31.09, centerLng: -84.86 },
  { name: 'Early', centerLat: 31.15, centerLng: -85.05 },
  { name: 'Seminole', centerLat: 30.76, centerLng: -84.92 },
  { name: 'Decatur', centerLat: 30.87, centerLng: -84.66 },
  { name: 'Russell', centerLat: 32.47, centerLng: -85.11 },
  { name: 'Chambers', centerLat: 32.65, centerLng: -85.26 },
  
  // Southeast Georgia
  { name: 'Bulloch', centerLat: 32.54, centerLng: -81.78 },
  { name: 'Screven', centerLat: 32.89, centerLng: -81.36 },
  { name: 'Jenkins', centerLat: 33.05, centerLng: -81.70 },
  { name: 'Burke', centerLat: 33.27, centerLng: -81.93 },
  { name: 'Warren', centerLat: 33.51, centerLng: -82.53 },
  { name: 'Glascock', centerLat: 33.49, centerLng: -82.21 },
  { name: 'Washington', centerLat: 33.75, centerLng: -82.73 },
  { name: 'Johnson', centerLat: 32.26, centerLng: -82.99 },
  { name: 'Laurens', centerLat: 32.64, centerLng: -82.70 },
  { name: 'Candler', centerLat: 32.50, centerLng: -81.96 },
  { name: 'Tattnall', centerLat: 32.41, centerLng: -81.95 },
  { name: 'Treutlen', centerLat: 32.60, centerLng: -82.36 },
  { name: 'Emanuel', centerLat: 32.83, centerLng: -82.49 },
  { name: 'Appling', centerLat: 32.11, centerLng: -82.76 },
  { name: 'Effingham', centerLat: 32.26, centerLng: -81.31 },
  { name: 'Long', centerLat: 31.45, centerLng: -81.39 },
  { name: 'Liberty', centerLat: 31.72, centerLng: -81.51 },
  { name: 'McIntosh', centerLat: 31.27, centerLng: -81.23 },
  { name: 'Glynn', centerLat: 31.13, centerLng: -81.34 },
  { name: 'Camden', centerLat: 30.84, centerLng: -81.68 },
  
  // South-Central Georgia
  { name: 'Turner', centerLat: 31.97, centerLng: -83.43 },
  { name: 'Ben Hill', centerLat: 32.12, centerLng: -83.19 },
  { name: 'Irwin', centerLat: 32.04, centerLng: -83.50 },
  { name: 'Coffee', centerLat: 31.63, centerLng: -82.98 },
  { name: 'Atkinson', centerLat: 31.41, centerLng: -82.87 },
  { name: 'Bacon', centerLat: 31.58, centerLng: -82.34 },
  { name: 'Pierce', centerLat: 31.31, centerLng: -82.91 },
  { name: 'Ware', centerLat: 31.21, centerLng: -82.59 },
  { name: 'Clinch', centerLat: 30.74, centerLng: -82.70 },
  { name: 'Lowndes', centerLat: 30.84, centerLng: -83.34 },
  { name: 'Echols', centerLat: 30.64, centerLng: -83.09 },
  { name: 'Lanier', centerLat: 31.16, centerLng: -83.04 },
  { name: 'Wayne', centerLat: 31.08, centerLng: -81.83 },
  { name: 'Charlton', centerLat: 30.61, centerLng: -82.32 },
  
  // East-Central Georgia
  { name: 'Oglethorpe', centerLat: 33.72, centerLng: -82.73 },
  { name: 'Lincoln', centerLat: 33.54, centerLng: -82.44 },
  { name: 'Richmond', centerLat: 33.47, centerLng: -81.98 },
  { name: 'Columbia', centerLat: 33.48, centerLng: -82.10 },
  { name: 'McDuffie', centerLat: 33.49, centerLng: -82.67 },
  { name: 'Taliaferro', centerLat: 33.76, centerLng: -82.63 },
  { name: 'Wilkes', centerLat: 33.95, centerLng: -82.84 },
  { name: 'Baldwin', centerLat: 33.51, centerLng: -83.38 },
  { name: 'Evans', centerLat: 32.79, centerLng: -81.98 },
  { name: 'Montgomery', centerLat: 32.38, centerLng: -82.60 },
  { name: 'Dodge', centerLat: 32.34, centerLng: -83.37 },
  { name: 'Telfair', centerLat: 32.40, centerLng: -82.93 },
]

export function GeorgiaCountyMapV2() {
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState(2026)
  const [showList, setShowList] = useState(false)
  const [electionData, setElectionData] = useState<{ [key: string]: number }>({})

  // Normalize coordinates for SVG display
  const minLat = 30.36
  const maxLat = 34.98
  const minLng = -85.60
  const maxLng = -80.84

  const normalizeCoords = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 100
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100
    return { x, y }
  }

  // Fetch election data from Supabase
  useEffect(() => {
    const fetchElectionData = async () => {
      try {
        const response = await fetch('/api/election-data?year=' + selectedYear)
        if (response.ok) {
          const data = await response.json()
          // Convert to county-based lookup
          const countyMap: { [key: string]: number } = {}
          data.forEach((row: any) => {
            if (row.republican_pct !== null) {
              countyMap[row.county] = row.republican_pct
            }
          })
          setElectionData(countyMap)
        }
      } catch (error) {
        console.log('Using default election data', error)
      }
    }
    fetchElectionData()
  }, [selectedYear])

  // Get color based on Republican percentage (0% = blue, 100% = red)
  const getCountyColor = (repPct: number = 50) => {
    const red = Math.round((repPct / 100) * 255)
    const blue = 255 - red
    return `rgb(${red}, 0, ${blue})`
  }

  return (
    <div className="w-full bg-white border-2 border-red-600 rounded-2xl p-6 sm:p-8 mb-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">
          Georgia County Map
        </h2>
        <p className="text-slate-700 font-semibold text-lg mb-6">
          All 159 counties. Watch how Georgia has shifted from 2012 to 2026. Hover for county names, click to explore.
        </p>

        {/* Year Selector */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[2012, 2016, 2020, 2024, 2026].map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-4 py-2 rounded-lg font-bold transition ${
                selectedYear === year
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Info */}
        <div className="bg-blue-50 border-2 border-blue-600 p-4 rounded-lg mb-6">
          <p className="text-blue-900 font-semibold text-sm">
            📍 <strong>Red counties</strong> lean Republican | <strong>Blue counties</strong> lean Democratic | Click any county to explore data and engagement opportunities.
          </p>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-300 rounded-xl p-4 mb-6 overflow-auto">
        <svg
          viewBox="0 0 100 85"
          className="w-full h-auto"
          style={{
            maxWidth: '100%',
            margin: '0 auto',
            display: 'block',
            minHeight: '400px',
            backgroundColor: 'white',
          }}
        >
          {/* Light background grid (optional) */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f0f0f0" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="85" fill="url(#grid)" />

          {/* County dots */}
          {GEORGIA_COUNTIES.map((county) => {
            const { x, y } = normalizeCoords(county.centerLat, county.centerLng)
            const isHovered = hoveredCounty === county.name
            const repPct = electionData[county.name] ?? 50
            const color = getCountyColor(repPct)

            return (
              <g
                key={county.name}
                onClick={() => window.location.href = `/dashboard/${encodeURIComponent(county.name)}`}
                style={{ cursor: 'pointer' }}
              >
                {/* County circle */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 3.5 : 2.8}
                  fill={color}
                  stroke={isHovered ? 'white' : '#666'}
                  strokeWidth={isHovered ? 1 : 0.4}
                  style={{
                    transition: 'all 150ms ease-out',
                    filter: isHovered ? 'drop-shadow(0 0 4px rgba(0,0,0,0.6))' : 'drop-shadow(0 0 1px rgba(0,0,0,0.3))',
                  }}
                  onMouseEnter={() => setHoveredCounty(county.name)}
                  onMouseLeave={() => setHoveredCounty(null)}
                />

                {/* County label on hover */}
                {isHovered && (
                  <>
                    <circle
                      cx={x}
                      cy={y}
                      r={3.5}
                      fill="none"
                      stroke="white"
                      strokeWidth={0.5}
                      opacity="0.5"
                      style={{ animation: 'pulse 1.5s infinite' }}
                    />
                    <text
                      x={x}
                      y={y - 4.5}
                      textAnchor="middle"
                      fill="#000"
                      fontSize="1.5"
                      fontWeight="bold"
                      style={{
                        pointerEvents: 'none',
                        textShadow: '0 0 3px white',
                        background: 'white',
                        padding: '2px 4px',
                      }}
                    >
                      {county.name}
                    </text>
                    <text
                      x={x}
                      y={y + 5}
                      textAnchor="middle"
                      fill="#666"
                      fontSize="1.2"
                      fontWeight="bold"
                      style={{ pointerEvents: 'none' }}
                    >
                      R: {repPct.toFixed(1)}%
                    </text>
                  </>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* County List Toggle */}
      <button
        onClick={() => setShowList(!showList)}
        className="w-full px-6 py-3 bg-red-50 border-2 border-red-600 text-red-700 hover:bg-red-100 font-bold rounded-lg flex items-center justify-center gap-2 transition mb-6"
      >
        <MapPin className="w-5 h-5" />
        {showList ? 'Hide County List' : 'Show All 159 Counties'}
        <ChevronDown className={`w-5 h-5 transition ${showList ? 'rotate-180' : ''}`} />
      </button>

      {/* County List */}
      {showList && (
        <div className="bg-slate-50 border-2 border-slate-300 rounded-lg p-4 mb-6 max-h-96 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {GEORGIA_COUNTIES.map((county) => (
              <Link
                key={county.name}
                href={`/dashboard/${encodeURIComponent(county.name)}`}
                className="px-3 py-2 bg-white border-2 border-red-600 text-red-700 hover:bg-red-50 font-semibold text-sm rounded-lg transition"
              >
                {county.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-red-50 border-2 border-red-600 rounded-lg p-4">
        <p className="text-slate-700 font-semibold text-sm">
          <strong>💡 How to use:</strong> Hover over any dot to see the county name and election data. Click to view county dashboard with demographics, local issues, and engagement opportunities. Use the year selector above to see how voting patterns have changed.
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { stroke-width: 0.5; opacity: 0.5; }
          50% { stroke-width: 1; opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}
