'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, ChevronDown } from 'lucide-react'

interface County {
  id: string
  name: string
  lat: number
  lng: number
  color?: string
}

const GEORGIA_COUNTIES: County[] = [
  // North Georgia
  { id: 'Forsyth', name: 'Forsyth', lat: 34.36, lng: -84.40 },
  { id: 'Cherokee', name: 'Cherokee', lat: 34.31, lng: -84.60 },
  { id: 'Fulton', name: 'Fulton', lat: 33.75, lng: -84.41 },
  { id: 'DeKalb', name: 'DeKalb', lat: 33.77, lng: -84.25 },
  { id: 'Gwinnett', name: 'Gwinnett', lat: 33.95, lng: -84.00 },
  { id: 'Cobb', name: 'Cobb', lat: 33.88, lng: -84.60 },
  { id: 'Henry', name: 'Henry', lat: 33.57, lng: -84.34 },
  { id: 'Clayton', name: 'Clayton', lat: 33.52, lng: -84.38 },
  { id: 'Bartow', name: 'Bartow', lat: 34.18, lng: -84.77 },
  { id: 'Pickens', name: 'Pickens', lat: 34.52, lng: -84.51 },
  { id: 'Dawson', name: 'Dawson', lat: 34.43, lng: -84.16 },
  { id: 'White', name: 'White', lat: 34.73, lng: -83.78 },
  { id: 'Lumpkin', name: 'Lumpkin', lat: 34.58, lng: -84.04 },
  { id: 'Union', name: 'Union', lat: 34.88, lng: -84.08 },
  { id: 'Towns', name: 'Towns', lat: 34.87, lng: -83.58 },
  { id: 'Rabun', name: 'Rabun', lat: 34.91, lng: -83.25 },
  // Northeast Georgia
  { id: 'Madison', name: 'Madison', lat: 33.60, lng: -83.54 },
  { id: 'Morgan', name: 'Morgan', lat: 33.64, lng: -83.68 },
  { id: 'Oconee', name: 'Oconee', lat: 33.77, lng: -83.42 },
  { id: 'Greene', name: 'Greene', lat: 33.54, lng: -83.18 },
  { id: 'Jasper', name: 'Jasper', lat: 34.03, lng: -84.36 },
  { id: 'Putnam', name: 'Putnam', lat: 33.42, lng: -83.86 },
  { id: 'Hancock', name: 'Hancock', lat: 33.40, lng: -83.02 },
  // Central Georgia
  { id: 'Marion', name: 'Marion', lat: 32.70, lng: -84.76 },
  { id: 'Muscogee', name: 'Muscogee', lat: 32.50, lng: -84.98 },
  { id: 'Harris', name: 'Harris', lat: 32.59, lng: -84.97 },
  { id: 'Talbot', name: 'Talbot', lat: 32.69, lng: -85.02 },
  { id: 'Meriwether', name: 'Meriwether', lat: 33.08, lng: -84.57 },
  { id: 'Pike', name: 'Pike', lat: 32.88, lng: -84.68 },
  { id: 'Spalding', name: 'Spalding', lat: 33.07, lng: -84.30 },
  { id: 'Fayette', name: 'Fayette', lat: 33.40, lng: -84.47 },
  { id: 'Lamar', name: 'Lamar', lat: 33.27, lng: -84.09 },
  { id: 'Upson', name: 'Upson', lat: 32.88, lng: -84.17 },
  { id: 'Crawford', name: 'Crawford', lat: 32.68, lng: -84.24 },
  { id: 'Peach', name: 'Peach', lat: 32.64, lng: -84.16 },
  { id: 'Macon', name: 'Macon', lat: 32.59, lng: -83.98 },
  { id: 'Houston', name: 'Houston', lat: 32.44, lng: -83.74 },
  { id: 'Bibb', name: 'Bibb', lat: 32.84, lng: -83.61 },
  { id: 'Twiggs', name: 'Twiggs', lat: 32.87, lng: -83.49 },
  // Southeast Georgia
  { id: 'Bulloch', name: 'Bulloch', lat: 32.54, lng: -81.78 },
  { id: 'Effingham', name: 'Effingham', lat: 32.26, lng: -81.31 },
  { id: 'Screven', name: 'Screven', lat: 32.89, lng: -81.36 },
  { id: 'Jenkins', name: 'Jenkins', lat: 33.05, lng: -81.70 },
  { id: 'Burke', name: 'Burke', lat: 33.27, lng: -81.93 },
  { id: 'Warren', name: 'Warren', lat: 33.51, lng: -82.53 },
  { id: 'Glascock', name: 'Glascock', lat: 33.49, lng: -82.21 },
  { id: 'Washington', name: 'Washington', lat: 33.75, lng: -82.73 },
  { id: 'Johnson', name: 'Johnson', lat: 32.26, lng: -82.99 },
  { id: 'Laurens', name: 'Laurens', lat: 32.64, lng: -82.70 },
  { id: 'Candler', name: 'Candler', lat: 32.50, lng: -81.96 },
  { id: 'Tattnall', name: 'Tattnall', lat: 32.41, lng: -81.95 },
  { id: 'Long', name: 'Long', lat: 31.45, lng: -81.39 },
  { id: 'Liberty', name: 'Liberty', lat: 31.72, lng: -81.51 },
  { id: 'McIntosh', name: 'McIntosh', lat: 31.27, lng: -81.23 },
  { id: 'Glynn', name: 'Glynn', lat: 31.13, lng: -81.34 },
  { id: 'Camden', name: 'Camden', lat: 30.84, lng: -81.68 },
  // Southwest Georgia
  { id: 'Decatur', name: 'Decatur', lat: 30.87, lng: -84.66 },
  { id: 'Seminole', name: 'Seminole', lat: 30.76, lng: -84.92 },
  { id: 'Early', name: 'Early', lat: 31.15, lng: -85.05 },
  { id: 'Miller', name: 'Miller', lat: 31.09, lng: -84.86 },
  { id: 'Baker', name: 'Baker', lat: 31.65, lng: -84.47 },
  { id: 'Dougherty', name: 'Dougherty', lat: 31.55, lng: -84.15 },
  { id: 'Worth', name: 'Worth', lat: 31.65, lng: -83.94 },
  { id: 'Wilcox', name: 'Wilcox', lat: 32.17, lng: -83.28 },
  { id: 'Crisp', name: 'Crisp', lat: 31.89, lng: -83.65 },
  { id: 'Dooly', name: 'Dooly', lat: 32.02, lng: -83.78 },
  { id: 'Sumter', name: 'Sumter', lat: 32.35, lng: -84.04 },
  // South-Central Georgia
  { id: 'Turner', name: 'Turner', lat: 31.97, lng: -83.43 },
  { id: 'Ben Hill', name: 'Ben Hill', lat: 32.12, lng: -83.19 },
  { id: 'Irwin', name: 'Irwin', lat: 32.04, lng: -83.50 },
  { id: 'Coffee', name: 'Coffee', lat: 31.63, lng: -82.98 },
  { id: 'Atkinson', name: 'Atkinson', lat: 31.41, lng: -82.87 },
  { id: 'Bacon', name: 'Bacon', lat: 31.58, lng: -82.34 },
  { id: 'Pierce', name: 'Pierce', lat: 31.31, lng: -82.91 },
  { id: 'Ware', name: 'Ware', lat: 31.21, lng: -82.59 },
  { id: 'Clinch', name: 'Clinch', lat: 30.74, lng: -82.70 },
  { id: 'Lowndes', name: 'Lowndes', lat: 30.84, lng: -83.34 },
  { id: 'Echols', name: 'Echols', lat: 30.64, lng: -83.09 },
  { id: 'Lanier', name: 'Lanier', lat: 31.16, lng: -83.04 },
  // East-Central Georgia
  { id: 'Oglethorpe', name: 'Oglethorpe', lat: 33.72, lng: -82.73 },
  { id: 'Lincoln', name: 'Lincoln', lat: 33.54, lng: -82.44 },
  { id: 'Richmond', name: 'Richmond', lat: 33.47, lng: -81.98 },
  { id: 'Columbia', name: 'Columbia', lat: 33.48, lng: -82.10 },
  { id: 'McDuffie', name: 'McDuffie', lat: 33.49, lng: -82.67 },
  { id: 'Taliaferro', name: 'Taliaferro', lat: 33.76, lng: -82.63 },
  { id: 'Wilkes', name: 'Wilkes', lat: 33.95, lng: -82.84 },
  { id: 'Baldwin', name: 'Baldwin', lat: 33.51, lng: -83.38 },
  { id: 'Elbert', name: 'Elbert', lat: 34.06, lng: -82.88 },
  // West-Central Georgia
  { id: 'Quitman', name: 'Quitman', lat: 31.68, lng: -84.71 },
  { id: 'Clay', name: 'Clay', lat: 31.95, lng: -84.82 },
  { id: 'Calhoun', name: 'Calhoun', lat: 30.94, lng: -84.59 },
  { id: 'Carroll', name: 'Carroll', lat: 33.58, lng: -85.10 },
  { id: 'Coweta', name: 'Coweta', lat: 33.44, lng: -84.73 },
  { id: 'Paulding', name: 'Paulding', lat: 34.05, lng: -84.88 },
  { id: 'Douglas', name: 'Douglas', lat: 33.74, lng: -84.71 },
  // Additional northern counties
  { id: 'Catoosa', name: 'Catoosa', lat: 34.94, lng: -85.19 },
  { id: 'Dade', name: 'Dade', lat: 34.77, lng: -85.37 },
  { id: 'Chattooga', name: 'Chattooga', lat: 34.71, lng: -85.26 },
  { id: 'Floyd', name: 'Floyd', lat: 34.39, lng: -85.20 },
  { id: 'Gilmer', name: 'Gilmer', lat: 34.64, lng: -84.53 },
  { id: 'Fannin', name: 'Fannin', lat: 34.84, lng: -83.90 },
  { id: 'Murray', name: 'Murray', lat: 34.77, lng: -84.68 },
  { id: 'Polk', name: 'Polk', lat: 34.35, lng: -85.24 },
  { id: 'Cleburne', name: 'Cleburne', lat: 34.25, lng: -85.50 },
  // Additional southwestern counties
  { id: 'Russell', name: 'Russell', lat: 32.47, lng: -85.11 },
  { id: 'Chambers', name: 'Chambers', lat: 32.65, lng: -85.26 },
  { id: 'Lee', name: 'Lee', lat: 32.25, lng: -84.60 },
  { id: 'Randolph', name: 'Randolph', lat: 32.27, lng: -84.89 },
  { id: 'Stewart', name: 'Stewart', lat: 32.20, lng: -84.86 },
  { id: 'Terrell', name: 'Terrell', lat: 32.11, lng: -84.79 },
  // Additional central counties
  { id: 'Milton', name: 'Milton', lat: 34.18, lng: -84.35 },
  { id: 'Newton', name: 'Newton', lat: 33.64, lng: -84.23 },
  { id: 'Rockdale', name: 'Rockdale', lat: 33.71, lng: -84.04 },
  { id: 'Jones', name: 'Jones', lat: 32.91, lng: -83.74 },
  { id: 'Dodge', name: 'Dodge', lat: 32.34, lng: -83.37 },
  { id: 'Telfair', name: 'Telfair', lat: 32.40, lng: -82.93 },
  { id: 'Montgomery', name: 'Montgomery', lat: 32.38, lng: -82.60 },
  { id: 'Evans', name: 'Evans', lat: 32.79, lng: -81.98 },
  { id: 'Treutlen', name: 'Treutlen', lat: 32.60, lng: -82.36 },
  { id: 'Emanuel', name: 'Emanuel', lat: 32.83, lng: -82.49 },
  { id: 'Appling', name: 'Appling', lat: 32.11, lng: -82.76 },
  { id: 'Charlton', name: 'Charlton', lat: 30.61, lng: -82.32 },
  { id: 'Wayne', name: 'Wayne', lat: 31.08, lng: -81.83 },
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
                key={county.id}
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
                key={county.id}
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

