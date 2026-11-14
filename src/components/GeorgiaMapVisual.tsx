'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ElectionYear {
  year: number
  bluePercentage: number
}

// Election data showing Georgia's shift from 2012 to 2026
const ELECTION_YEARS: ElectionYear[] = [
  { year: 2012, bluePercentage: 35 },
  { year: 2016, bluePercentage: 37 },
  { year: 2020, bluePercentage: 49 },
  { year: 2024, bluePercentage: 55 },
  { year: 2026, bluePercentage: 62 },
]

export function GeorgiaMapVisual() {
  const [selectedYear, setSelectedYear] = useState(2026)
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const currentElection = ELECTION_YEARS.find((e) => e.year === selectedYear) || ELECTION_YEARS[ELECTION_YEARS.length - 1]
  const blueIntensity = currentElection.bluePercentage / 100 // 0 to 1

  // Simplified Georgia county map using SVG paths
  // This is a basic outline of Georgia counties
  const handleCountyClick = async (countyName: string) => {
    setIsLoading(true)
    try {
      // Redirect to login to authenticate first
      window.location.href = `/auth/login?redirect=/dashboard/${encodeURIComponent(countyName)}`
    } catch (error) {
      console.error('Navigation error:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full bg-gradient-to-b from-slate-900/50 to-slate-950/50 border border-slate-800 rounded-2xl p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-black mb-2 text-white">
          Georgia Election Patterns
        </h2>
        <p className="text-slate-400 mb-6">
          Watch how Georgia has shifted from 2012 to 2026
        </p>

        {/* Election Year Selector */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={() => {
              const idx = ELECTION_YEARS.findIndex((e) => e.year === selectedYear)
              if (idx > 0) setSelectedYear(ELECTION_YEARS[idx - 1].year)
            }}
            disabled={selectedYear === ELECTION_YEARS[0].year}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-5 h-5 text-blue-400" />
          </button>

          <div className="flex gap-2 sm:gap-3">
            {ELECTION_YEARS.map((election) => (
              <button
                key={election.year}
                onClick={() => setSelectedYear(election.year)}
                className={`px-4 sm:px-6 py-2 rounded-lg font-black transition ${
                  selectedYear === election.year
                    ? 'bg-blue-600 text-white scale-110'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
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
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronRight className="w-5 h-5 text-blue-400" />
          </button>
        </div>

        {/* Blue Percentage Display */}
        <div className="text-center mb-8">
          <div className="text-4xl sm:text-5xl font-black text-blue-400 mb-2">
            {currentElection.bluePercentage}%
          </div>
          <p className="text-slate-300 text-lg">
            Democratic voting percentage in {selectedYear}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="flex-1 max-w-md h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 via-slate-500 to-blue-600 transition-all duration-500"
                style={{ width: `${currentElection.bluePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Simplified Georgia Map - Large Visual Block */}
      <div className="mb-8">
        <svg
          viewBox="0 0 400 500"
          className="w-full h-auto max-w-2xl mx-auto bg-slate-900 rounded-lg"
          style={{ minHeight: '400px', backgroundColor: '#0f172a' }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Background */}
          <rect width="400" height="500" fill="#1e293b" rx="8" />

          {/* Gradient Definition - showing shift from red to blue */}
          <defs>
            <linearGradient
              id="blueShift"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={`rgba(239, 68, 68, ${1 - blueIntensity})`} />
              <stop offset="50%" stopColor={`rgba(100, 116, 139, ${0.5})`} />
              <stop offset="100%" stopColor={`rgba(59, 130, 246, ${blueIntensity})`} />
            </linearGradient>

            {/* Glow effect */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Georgia state outline - simplified */}
          <path
            d="M 150 80 L 200 70 L 250 75 L 280 90 L 300 110 L 320 140 L 330 170 L 340 200 L 335 240 L 330 270 L 320 290 L 300 310 L 280 320 L 260 330 L 240 340 L 200 350 L 160 345 L 120 340 L 100 330 L 90 310 L 85 280 L 80 240 L 75 200 L 80 160 L 90 130 L 110 100 L 130 85 Z"
            fill="url(#blueShift)"
            stroke="#e2e8f0"
            strokeWidth="2"
            opacity="0.95"
            filter="url(#glow)"
          />

          {/* Georgia label */}
          <text
            x="200"
            y="220"
            textAnchor="middle"
            fontSize="48"
            fontWeight="900"
            fill="white"
            opacity="0.8"
            pointerEvents="none"
          >
            GA
          </text>

          {/* Year indicator */}
          <text
            x="200"
            y="380"
            textAnchor="middle"
            fontSize="28"
            fontWeight="bold"
            fill="#60a5fa"
          >
            {selectedYear}
          </text>

          {/* Trend text */}
          <text
            x="200"
            y="420"
            textAnchor="middle"
            fontSize="16"
            fill="#cbd5e1"
          >
            Georgia is turning blue
          </text>
        </svg>
      </div>

      {/* County Detail Grid - Click any to see details */}
      <div className="mt-8 p-6 bg-slate-800/30 border border-slate-700 rounded-xl">
        <h3 className="text-lg font-black text-white mb-4">
          📍 Click any county to explore local data
        </h3>
        <p className="text-slate-400 mb-6">
          See election results, demographics, and local engagement patterns
        </p>

        {/* Sample County Buttons - Representative Counties */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            'Fulton',
            'Gwinnett',
            'Cobb',
            'DeKalb',
            'Clayton',
            'Henry',
            'Douglas',
            'Marietta',
          ].map((county) => (
            <button
              key={county}
              onClick={() => handleCountyClick(county)}
              onMouseEnter={() => setHoveredCounty(county)}
              onMouseLeave={() => setHoveredCounty(null)}
              className={`px-4 py-3 rounded-lg font-bold transition transform hover:scale-105 ${
                hoveredCounty === county
                  ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                  : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              }`}
            >
              {county}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-red-600/10 border border-red-600/30 rounded-lg">
          <div className="text-2xl font-black text-red-400">
            {Math.round(100 - currentElection.bluePercentage)}%
          </div>
          <p className="text-sm text-red-300 mt-1">Republican</p>
        </div>
        <div className="p-4 bg-slate-600/10 border border-slate-600/30 rounded-lg">
          <div className="text-2xl font-black text-slate-400">
            {Math.round(5)}%
          </div>
          <p className="text-sm text-slate-300 mt-1">Other</p>
        </div>
        <div className="p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
          <div className="text-2xl font-black text-blue-400">
            {currentElection.bluePercentage}%
          </div>
          <p className="text-sm text-blue-300 mt-1">Democratic</p>
        </div>
      </div>

      {/* Trend Arrow */}
      <div className="mt-6 text-center">
        <p className="text-slate-400 text-sm">
          📈 Trend: {selectedYear > 2012 ? 'Getting bluer over time' : 'Starting point'}
        </p>
      </div>
    </div>
  )
}
