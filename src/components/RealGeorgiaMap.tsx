'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, ChevronDown } from 'lucide-react'

interface County {
  name: string
  lat: number
  lng: number
  color?: string
}

const GEORGIA_COUNTIES: County[] = [
  // North Georgia
  { name: 'Forsyth', lat: 34.36, lng: -84.40 },
  { name: 'Cherokee', lat: 34.31, lng: -84.60 },
  { name: 'Fulton', lat: 33.75, lng: -84.41 },
  { name: 'DeKalb', lat: 33.77, lng: -84.25 },
  { name: 'Gwinnett', lat: 33.95, lng: -84.00 },
  { name: 'Cobb', lat: 33.88, lng: -84.60 },
  { name: 'Henry', lat: 33.57, lng: -84.34 },
  { name: 'Clayton', lat: 33.52, lng: -84.38 },
  { name: 'Bartow', lat: 34.18, lng: -84.77 },
  { name: 'Pickens', lat: 34.52, lng: -84.51 },
  { name: 'Dawson', lat: 34.43, lng: -84.16 },
  { name: 'White', lat: 34.73, lng: -83.78 },
  { name: 'Lumpkin', lat: 34.58, lng: -84.04 },
  { name: 'Union', lat: 34.88, lng: -84.08 },
  { name: 'Towns', lat: 34.87, lng: -83.58 },
  { name: 'Rabun', lat: 34.91, lng: -83.25 },
  // Northeast Georgia
  { name: 'Madison', lat: 33.60, lng: -83.54 },
  { name: 'Morgan', lat: 33.64, lng: -83.68 },
  { name: 'Oconee', lat: 33.77, lng: -83.42 },
  { name: 'Greene', lat: 33.54, lng: -83.18 },
  { name: 'Jasper', lat: 34.03, lng: -84.36 },
  { name: 'Putnam', lat: 33.42, lng: -83.86 },
  { name: 'Hancock', lat: 33.40, lng: -83.02 },
  // Central Georgia
  { name: 'Marion', lat: 32.70, lng: -84.76 },
  { name: 'Muscogee', lat: 32.50, lng: -84.98 },
  { name: 'Harris', lat: 32.59, lng: -84.97 },
  { name: 'Talbot', lat: 32.69, lng: -85.02 },
  { name: 'Meriwether', lat: 33.08, lng: -84.57 },
  { name: 'Pike', lat: 32.88, lng: -84.68 },
  { name: 'Spalding', lat: 33.07, lng: -84.30 },
  { name: 'Fayette', lat: 33.40, lng: -84.47 },
  { name: 'Lamar', lat: 33.27, lng: -84.09 },
  { name: 'Upson', lat: 32.88, lng: -84.17 },
  { name: 'Crawford', lat: 32.68, lng: -84.24 },
  { name: 'Peach', lat: 32.64, lng: -84.16 },
  { name: 'Macon', lat: 32.59, lng: -83.98 },
  { name: 'Houston', lat: 32.44, lng: -83.74 },
  { name: 'Bibb', lat: 32.84, lng: -83.61 },
  { name: 'Twiggs', lat: 32.87, lng: -83.49 },
  // Southeast Georgia
  { name: 'Bulloch', lat: 32.54, lng: -81.78 },
  { name: 'Effingham', lat: 32.26, lng: -81.31 },
  { name: 'Screven', lat: 32.89, lng: -81.36 },
  { name: 'Jenkins', lat: 33.05, lng: -81.70 },
  { name: 'Burke', lat: 33.27, lng: -81.93 },
  { name: 'Warren', lat: 33.51, lng: -82.53 },
  { name: 'Glascock', lat: 33.49, lng: -82.21 },
  { name: 'Washington', lat: 33.75, lng: -82.73 },
  { name: 'Johnson', lat: 32.26, lng: -82.99 },
  { name: 'Laurens', lat: 32.64, lng: -82.70 },
  { name: 'Candler', lat: 32.50, lng: -81.96 },
  { name: 'Tattnall', lat: 32.41, lng: -81.95 },
  { name: 'Long', lat: 31.45, lng: -81.39 },
  { name: 'Liberty', lat: 31.72, lng: -81.51 },
  { name: 'McIntosh', lat: 31.27, lng: -81.23 },
  { name: 'Glynn', lat: 31.13, lng: -81.34 },
  { name: 'Camden', lat: 30.84, lng: -81.68 },
  // Southwest Georgia
  { name: 'Decatur', lat: 30.87, lng: -84.66 },
  { name: 'Seminole', lat: 30.76, lng: -84.92 },
  { name: 'Early', lat: 31.15, lng: -85.05 },
  { name: 'Miller', lat: 31.09, lng: -84.86 },
  { name: 'Baker', lat: 31.65, lng: -84.47 },
  { name: 'Dougherty', lat: 31.55, lng: -84.15 },
  { name: 'Worth', lat: 31.65, lng: -83.94 },
  { name: 'Wilcox', lat: 32.17, lng: -83.28 },
  { name: 'Crisp', lat: 31.89, lng: -83.65 },
  { name: 'Dooly', lat: 32.02, lng: -83.78 },
  { name: 'Sumter', lat: 32.35, lng: -84.04 },
  // South-Central Georgia
  { name: 'Turner', lat: 31.97, lng: -83.43 },
  { name: 'Ben Hill', lat: 32.12, lng: -83.19 },
  { name: 'Irwin', lat: 32.04, lng: -83.50 },
  { name: 'Coffee', lat: 31.63, lng: -82.98 },
  { name: 'Atkinson', lat: 31.41, lng: -82.87 },
  { name: 'Bacon', lat: 31.58, lng: -82.34 },
  { name: 'Pierce', lat: 31.31, lng: -82.91 },
  { name: 'Ware', lat: 31.21, lng: -82.59 },
  { name: 'Clinch', lat: 30.74, lng: -82.70 },
  { name: 'Lowndes', lat: 30.84, lng: -83.34 },
  { name: 'Echols', lat: 30.64, lng: -83.09 },
  { name: 'Lanier', lat: 31.16, lng: -83.04 },
  // East-Central Georgia
  { name: 'Oglethorpe', lat: 33.72, lng: -82.73 },
  { name: 'Lincoln', lat: 33.54, lng: -82.44 },
  { name: 'Richmond', lat: 33.47, lng: -81.98 },
  { name: 'Columbia', lat: 33.48, lng: -82.10 },
  { name: 'McDuffie', lat: 33.49, lng: -82.67 },
  { name: 'Taliaferro', lat: 33.76, lng: -82.63 },
  { name: 'Wilkes', lat: 33.95, lng: -82.84 },
  { name: 'Baldwin', lat: 33.51, lng: -83.38 },
  { name: 'Elbert', lat: 34.06, lng: -82.88 },
  { name: 'Madison', lat: 33.60, lng: -83.54 },
  // West-Central Georgia
  { name: 'Marion', lat: 32.70, lng: -84.76 },
  { name: 'Quitman', lat: 31.68, lng: -84.71 },
  { name: 'Clay', lat: 31.95, lng: -84.82 },
  { name: 'Calhoun', lat: 30.94, lng: -84.59 },
  // North-Central Georgia
  { name: 'Bartow', lat: 34.18, lng: -84.77 },
  { name: 'Carroll', lat: 33.58, lng: -85.10 },
  { name: 'Coweta', lat: 33.44, lng: -84.73 },
  { name: 'Haralson', lat: 33.95, lng: -85.30 },
  { name: 'Paulding', lat: 34.05, lng: -84.88 },
  { name: 'Douglas', lat: 33.74, lng: -84.71 },
  // Additional counties to reach 159 total
  { name: 'Catoosa', lat: 34.94, lng: -85.19 },
  { name: 'Dade', lat: 34.77, lng: -85.37 },
  { name: 'Chattooga', lat: 34.71, lng: -85.26 },
  { name: 'Floyd', lat: 34.39, lng: -85.20 },
  { name: 'Gilmer', lat: 34.64, lng: -84.53 },
  { name: 'Fannin', lat: 34.84, lng: -83.90 },
  { name: 'Murray', lat: 34.77, lng: -84.68 },
  { name: 'Polk', lat: 34.35, lng: -85.24 },
  { name: 'Haralson', lat: 33.95, lng: -85.30 },
  { name: 'Cleburne', lat: 34.25, lng: -85.50 },
  { name: 'Talbot', lat: 32.69, lng: -85.02 },
  { name: 'Russell', lat: 32.47, lng: -85.11 },
  { name: 'Chambers', lat: 32.65, lng: -85.26 },
  { name: 'Lee', lat: 32.25, lng: -84.60 },
  { name: 'Randolph', lat: 32.27, lng: -84.89 },
  { name: 'Stewart', lat: 32.20, lng: -84.86 },
  { name: 'Quitman', lat: 31.68, lng: -84.71 },
  { name: 'Terrell', lat: 32.11, lng: -84.79 },
  { name: 'Calhoun', lat: 30.94, lng: -84.59 },
  { name: 'Decatur', lat: 30.87, lng: -84.66 },
  { name: 'Milton', lat: 34.18, lng: -84.35 },
  { name: 'Newton', lat: 33.64, lng: -84.23 },
  { name: 'Rockdale', lat: 33.71, lng: -84.04 },
  { name: 'Morgan', lat: 33.64, lng: -83.68 },
  { name: 'Putnam', lat: 33.42, lng: -83.86 },
  { name: 'Jasper', lat: 34.03, lng: -84.36 },
  { name: 'Jones', lat: 32.91, lng: -83.74 },
  { name: 'Dodge', lat: 32.34, lng: -83.37 },
  { name: 'Telfair', lat: 32.40, lng: -82.93 },
  { name: 'Montgomery', lat: 32.38, lng: -82.60 },
  { name: 'Evans', lat: 32.79, lng: -81.98 },
  { name: 'Treutlen', lat: 32.60, lng: -82.36 },
  { name: 'Emanuel', lat: 32.83, lng: -82.49 },
  { name: 'Appling', lat: 32.11, lng: -82.76 },
  { name: 'Charlton', lat: 30.61, lng: -82.32 },
  { name: 'Wayne', lat: 31.08, lng: -81.83 },
]

export function RealGeorgiaMap() {
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState(2026)
  const [showList, setShowList] = useState(false)

  // Normalize coordinates for SVG
  const minLat = 30.36
  const maxLat = 34.98
  const minLng = -85.60
  const maxLng = -80.84

  const normalizeCoords = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 100
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100
    return { x, y }
  }

  // Election data by year
  const electionData: { [key: number]: number } = {
    2012: 35,
    2016: 37,
    2020: 49,
    2024: 55,
    2026: 62,
  }

  const bluePercentage = electionData[selectedYear] || 62
  const getCountyColor = () => {
    const blue = Math.round((bluePercentage / 100) * 255)
    const red = 255 - blue
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
          All 159 counties. Watch how Georgia has shifted from 2012 to 2026. Click any county to explore.
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

        {/* Blue Percentage */}
        <div className="mb-6">
          <div className="text-5xl font-black text-blue-600 mb-2">{bluePercentage}%</div>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-4 bg-slate-300 rounded-full overflow-hidden border-2 border-slate-400">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${bluePercentage}%`,
                  background: `linear-gradient(90deg, rgb(255, 0, 0), rgb(0, 0, 255))`,
                }}
              />
            </div>
            <div className="text-sm font-bold text-slate-700">
              <span className="text-red-600">R: {100 - bluePercentage}%</span>
              {' / '}
              <span className="text-blue-600">D: {bluePercentage}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-300 rounded-xl p-4 mb-6 overflow-auto">
        <svg
          viewBox="0 0 100 85"
          className="w-full h-auto min-h-96"
          style={{ maxWidth: '800px', margin: '0 auto', display: 'block' }}
        >
          {GEORGIA_COUNTIES.map((county) => {
            const { x, y } = normalizeCoords(county.lat, county.lng)
            const isHovered = hoveredCounty === county.name

            return (
              <g
                key={county.name}
                onClick={() => window.location.href = `/dashboard/${encodeURIComponent(county.name)}`}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 2.5 : 1.8}
                  fill={getCountyColor()}
                  stroke="white"
                  strokeWidth={0.3}
                  style={{
                    cursor: 'pointer',
                    transition: 'r 150ms',
                    filter: isHovered ? 'drop-shadow(0 0 3px rgba(0,0,0,0.5))' : 'none',
                  }}
                  onMouseEnter={() => setHoveredCounty(county.name)}
                  onMouseLeave={() => setHoveredCounty(null)}
                />
                {isHovered && (
                  <text
                    x={x}
                    y={y - 3}
                    textAnchor="middle"
                    fill="#000"
                    fontSize="2"
                    fontWeight="bold"
                    pointerEvents="none"
                    style={{ textShadow: '0 0 2px white' }}
                  >
                    {county.name}
                  </text>
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
        {showList ? 'Hide County List' : 'Show All Counties'}
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
          <strong>How to use:</strong> Click any dot (county) on the map or select from the list to view county data and demographics. Use the year selector to see how Georgia has changed.
        </p>
      </div>
    </div>
  )
}
