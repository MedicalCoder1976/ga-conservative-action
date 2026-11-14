'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import { GEORGIA_COUNTIES } from '@/lib/georgia-counties'

interface ElectionYear {
  year: number
  bluePercentage: number
}

const ELECTION_YEARS: ElectionYear[] = [
  { year: 2012, bluePercentage: 35 },
  { year: 2016, bluePercentage: 37 },
  { year: 2020, bluePercentage: 49 },
  { year: 2024, bluePercentage: 55 },
  { year: 2026, bluePercentage: 62 },
]

export function GeorgiaVisualMap() {
  const [selectedYear, setSelectedYear] = useState(2026)
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null)

  const currentElection = ELECTION_YEARS.find((e) => e.year === selectedYear) || ELECTION_YEARS[ELECTION_YEARS.length - 1]
  const bluePercentage = currentElection.bluePercentage

  // Normalize coordinates to grid (0-100 scale)
  const minLat = 30.36
  const maxLat = 34.98
  const minLng = -85.60
  const maxLng = -80.84

  const normalizeCoords = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 100
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100
    return { x, y }
  }

  // Color based on election year
  const getCountyColor = () => {
    const blue = Math.round((bluePercentage / 100) * 255)
    const red = 255 - blue
    return `rgb(${red}, 0, ${blue})`
  }

  return (
    <div className="w-full bg-gradient-to-b from-white to-red-50 border-2 border-red-600 rounded-2xl p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-black mb-2 text-slate-900">
          Georgia County Map - 159 Counties
        </h2>
        <p className="text-slate-700 mb-6 font-semibold text-lg">
          Watch how Georgia has shifted from 2012 to 2026. Click any county to explore data.
        </p>

        {/* Election Year Selector */}
        <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
          <button
            onClick={() => {
              const idx = ELECTION_YEARS.findIndex((e) => e.year === selectedYear)
              if (idx > 0) setSelectedYear(ELECTION_YEARS[idx - 1].year)
            }}
            disabled={selectedYear === ELECTION_YEARS[0].year}
            className="p-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex gap-2 sm:gap-3 flex-wrap justify-center">
            {ELECTION_YEARS.map((election) => (
              <button
                key={election.year}
                onClick={() => setSelectedYear(election.year)}
                className={`px-4 sm:px-6 py-2 rounded-lg font-black transition ${
                  selectedYear === election.year
                    ? 'bg-red-600 text-white scale-110'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {election.year}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              const idx = ELECTION_YEARS.findIndex((e) => e.year === selectedYear)
              if (idx < ELECTION_YEARS.length - 1) setSelectedYear(ELECTION_YEARS[idx + 1].year)
            }}
            disabled={selectedYear === ELECTION_YEARS[ELECTION_YEARS.length - 1].year}
            className="p-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-white"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Blue Percentage Display */}
        <div className="text-center mb-8">
          <div className="text-5xl sm:text-6xl font-black text-blue-600 mb-2">
            {bluePercentage}%
          </div>
          <p className="text-slate-700 text-lg font-semibold">
            Democratic voting percentage in {selectedYear}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="flex-1 max-w-md h-4 bg-slate-300 rounded-full overflow-hidden border-2 border-slate-400">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${bluePercentage}%`,
                  background: `linear-gradient(90deg, rgb(255, 0, 0), rgb(0, 0, 255))`,
                }}
              ></div>
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-6 text-lg font-bold">
            <span className="text-red-600">Republican: {100 - bluePercentage}%</span>
            <span className="text-blue-600">Democratic: {bluePercentage}%</span>
          </div>
        </div>
      </div>

      {/* Georgia Map - Counties positioned geographically */}
      <div className="relative bg-gradient-to-br from-slate-100 to-slate-50 border-2 border-slate-300 rounded-xl p-4 mb-8">
        <div className="relative w-full" style={{ aspectRatio: '1.2 / 1' }}>
          {/* SVG Background for visual reference */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 85"
            preserveAspectRatio="none"
            style={{ opacity: 0.1 }}
          >
            <rect width="100" height="85" fill="none" stroke="#999" strokeWidth="0.5" />
            <circle cx="50" cy="42.5" r="40" fill="none" stroke="#999" strokeWidth="0.2" opacity="0.3" />
          </svg>

          {/* Counties as positioned dots */}
          <div className="absolute inset-0">
            {GEORGIA_COUNTIES.map((county) => {
              const { x, y } = normalizeCoords(county.lat, county.lng)
              const isHovered = hoveredCounty === county.name

              return (
                <Link
                  key={county.name}
                  href={`/dashboard/${encodeURIComponent(county.name)}`}
                  className="absolute"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onMouseEnter={() => setHoveredCounty(county.name)}
                  onMouseLeave={() => setHoveredCounty(null)}
                  title={county.name}
                >
                  <div
                    className={`transition-all duration-300 rounded-full flex items-center justify-center font-bold text-white cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-125 ${
                      isHovered ? 'z-50' : 'z-10'
                    }`}
                    style={{
                      width: isHovered ? '80px' : '40px',
                      height: isHovered ? '80px' : '40px',
                      backgroundColor: getCountyColor(),
                      border: '2px solid white',
                      fontSize: isHovered ? '12px' : '10px',
                      textShadow: '0 0 2px rgba(0,0,0,0.8)',
                    }}
                  >
                    <div className="text-center px-1">
                      {isHovered ? county.name : county.name.substring(0, 2).toUpperCase()}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border-2 border-red-600 rounded-lg p-4 text-center">
          <div className="text-red-600 text-3xl font-black mb-2">35%</div>
          <p className="text-slate-700 font-semibold">2012: Republican Lean</p>
        </div>
        <div className="bg-white border-2 border-purple-600 rounded-lg p-4 text-center">
          <div className="text-purple-600 text-3xl font-black mb-2">49%</div>
          <p className="text-slate-700 font-semibold">2020: Nearly Tied</p>
        </div>
        <div className="bg-white border-2 border-blue-600 rounded-lg p-4 text-center">
          <div className="text-blue-600 text-3xl font-black mb-2">62%</div>
          <p className="text-slate-700 font-semibold">2026: Democratic Majority</p>
        </div>
      </div>

      {/* Instructions */}
      <div className="p-6 bg-red-50 border-2 border-red-600 rounded-xl">
        <div className="flex gap-3 items-start">
          <MapPin className="w-6 h-6 text-red-600 flex-shrink-0 mt-1 font-bold" />
          <div>
            <h4 className="font-black text-slate-900 mb-3 text-lg">How to Use the Map</h4>
            <ul className="text-slate-700 space-y-2 font-semibold">
              <li>• Each circle represents one Georgia county positioned geographically</li>
              <li>• Color shows 2026 election trend: Red = Republican, Blue = Democratic</li>
              <li>• Hover over a county to see its full name (gets bigger)</li>
              <li>• Click any county to view detailed election data and demographics</li>
              <li>• Use the year selector to see how Georgia has changed since 2012</li>
              <li>• All county data is public - no login required to explore</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
