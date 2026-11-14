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

const REGION_COLORS = {
  'North': '#3b82f6',
  'Northeast': '#1e40af',
  'North-Central': '#60a5fa',
  'East': '#0ea5e9',
  'Southeast': '#06b6d4',
  'Central': '#8b5cf6',
  'South-Central': '#ec4899',
  'South': '#f43f5e',
  'Southwest': '#ea580c',
  'West': '#f59e0b',
  'Northwest': '#d97706',
}

export function GeorgiaCountyMap() {
  const [selectedYear, setSelectedYear] = useState(2026)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null)
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null)

  const currentElection = ELECTION_YEARS.find((e) => e.year === selectedYear) || ELECTION_YEARS[ELECTION_YEARS.length - 1]
  const bluePercentage = currentElection.bluePercentage

  const displayCounties = selectedRegion
    ? GEORGIA_COUNTIES.filter(c => c.region === selectedRegion)
    : GEORGIA_COUNTIES

  const regions = Array.from(new Set(GEORGIA_COUNTIES.map(c => c.region))).sort()

  const handleCountyClick = (countyName: string) => {
    setSelectedCounty(countyName)
    // Will navigate via Link component below
  }

  return (
    <div className="w-full bg-gradient-to-b from-slate-900/50 to-slate-950/50 border border-slate-800 rounded-2xl p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-black mb-2 text-white">
          Georgia County Map - 159 Counties
        </h2>
        <p className="text-slate-400 mb-6">
          All Georgia counties organized by geographic region. Click any county to explore data.
        </p>

        {/* Election Year Selector */}
        <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
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

          <div className="flex gap-2 sm:gap-3 flex-wrap justify-center">
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
            {bluePercentage}%
          </div>
          <p className="text-slate-300 text-lg">
            Democratic voting percentage in {selectedYear}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="flex-1 max-w-md h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 via-slate-500 to-blue-600 transition-all duration-500"
                style={{ width: `${bluePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Region Filter Tabs */}
      <div className="mb-8 p-4 bg-slate-800/30 border border-slate-700 rounded-xl">
        <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase">Filter by Region</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          <button
            onClick={() => setSelectedRegion(null)}
            className={`px-3 py-2 rounded-lg text-sm font-bold transition ${
              selectedRegion === null
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            All Counties ({GEORGIA_COUNTIES.length})
          </button>
          {regions.map((region) => {
            const count = GEORGIA_COUNTIES.filter(c => c.region === region).length
            return (
              <button
                key={region}
                onClick={() => setSelectedRegion(selectedRegion === region ? null : region)}
                className={`px-3 py-2 rounded-lg text-sm font-bold transition ${
                  selectedRegion === region
                    ? 'text-white border-2'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
                style={
                  selectedRegion === region
                    ? { backgroundColor: REGION_COLORS[region as keyof typeof REGION_COLORS] || '#3b82f6', borderColor: 'white' }
                    : {}
                }
              >
                {region} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Counties Grid */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-white mb-4">
          {selectedRegion ? `${selectedRegion} Region` : 'All Georgia Counties'} - {displayCounties.length} Counties
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-96 overflow-y-auto p-2 bg-slate-900/30 rounded-lg border border-slate-700">
          {displayCounties.map((county) => (
            <Link
              key={county.name}
              href={`/dashboard/${encodeURIComponent(county.name)}`}
              onMouseEnter={() => setHoveredCounty(county.name)}
              onMouseLeave={() => setHoveredCounty(null)}
              className={`p-3 rounded-lg font-bold transition transform hover:scale-105 text-center block ${
                hoveredCounty === county.name
                  ? 'ring-2 ring-blue-400'
                  : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              }`}
              style={
                hoveredCounty === county.name
                  ? {
                      backgroundColor: REGION_COLORS[county.region as keyof typeof REGION_COLORS] || '#3b82f6',
                      color: 'white',
                    }
                  : {}
              }
            >
              <div className="text-sm">{county.name}</div>
              <div className="text-xs text-slate-400 mt-1">{county.region}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 p-6 bg-slate-800/30 border border-slate-700 rounded-xl">
        <div className="text-center">
          <div className="text-3xl font-black text-red-400">
            {Math.round(100 - bluePercentage)}%
          </div>
          <p className="text-sm text-red-300 mt-1">Republican</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-black text-slate-400">
            5%
          </div>
          <p className="text-sm text-slate-300 mt-1">Other</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-black text-blue-400">
            {bluePercentage}%
          </div>
          <p className="text-sm text-blue-300 mt-1">Democratic</p>
        </div>
      </div>

      {/* Instructions */}
      <div className="p-6 bg-gradient-to-r from-blue-600/10 to-cyan-500/10 border border-blue-500/30 rounded-xl">
        <div className="flex gap-3 items-start">
          <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-white mb-2">How to Use</h4>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Click any county to view detailed election data and demographics</li>
              <li>• Use region filter to focus on specific areas of Georgia</li>
              <li>• Select election years to see voting trends from 2012-2026</li>
              <li>• Sign in to track local engagement and participate</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
