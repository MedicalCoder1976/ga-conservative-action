'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getCountyColor } from '@/lib/color-calculator'
import type { County } from '@/lib/types'
import { GEORGIA_COUNTIES } from '@/lib/constants/georgia-counties'
import Link from 'next/link'
import { MapPin, TrendingUp, Users, BookOpen } from 'lucide-react'

// County coordinates for geographic positioning
const COUNTY_COORDINATES: Record<string, [number, number]> = {
  'Fulton': [33.75, -84.35],
  'DeKalb': [33.75, -84.20],
  'Cobb': [33.95, -84.55],
  'Gwinnett': [33.95, -84.00],
  'Clayton': [33.50, -84.40],
  'Henry': [33.25, -84.27],
  'Forsyth': [34.35, -84.05],
  'Cherokee': [34.20, -84.35],
  'Hall': [34.50, -83.73],
  'Bibb': [32.82, -83.68],
  'Chatham': [32.05, -81.10],
  'Richmond': [33.38, -82.30],
  'Muscogee': [32.50, -84.95],
  'Marietta': [33.95, -84.55],
}

export function GeorgiaMapView() {
  const router = useRouter()
  const [counties, setCounties] = useState<Map<string, County>>(new Map())
  const [loading, setLoading] = useState(true)
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null)

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
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  const mapWidth = 1200
  const mapHeight = 800
  const minLat = 30.5
  const maxLat = 35.2
  const minLng = -85.8
  const maxLng = -80.8

  const latToY = (lat: number) => ((maxLat - lat) / (maxLat - minLat)) * mapHeight
  const lngToX = (lng: number) => ((lng - minLng) / (maxLng - minLng)) * mapWidth

  const countyList = Array.from(counties.keys()).sort()

  return (
    <div className="relative w-full overflow-hidden">
      {/* Modernized SVG Map */}
      <svg
        viewBox={`0 0 ${mapWidth} ${mapHeight}`}
        className="w-full h-auto"
        style={{ minHeight: '400px' }}
      >
        {/* Background gradient */}
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#f5f5f5', stopOpacity: 1 }} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <rect width={mapWidth} height={mapHeight} fill="url(#bgGradient)"/>

        {/* County markers */}
        {countyList.map((countyName) => {
          const coords = COUNTY_COORDINATES[countyName]
          if (!coords) {
            // Generate approximate position from first letter if not in coordinates
            const charCode = countyName.charCodeAt(0)
            const tempLat = 30.5 + ((charCode % 5) * 1.0)
            const tempLng = -85.8 + (((charCode * 7) % 5) * 1.0)
            return null
          }

          const [lat, lng] = coords
          const x = lngToX(lng)
          const y = latToY(lat)
          const countyData = counties.get(countyName)
          const score = countyData?.activity_score ?? 0
          const color = getCountyColor(score)
          const isHovered = hoveredCounty === countyName
          const radius = isHovered ? 18 : 14

          return (
            <g key={countyName} style={{ cursor: 'pointer' }}>
              <circle
                cx={x}
                cy={y}
                r={radius}
                fill={color}
                stroke={isHovered ? '#ffffff' : '#cc0000'}
                strokeWidth={isHovered ? 3 : 2}
                opacity={isHovered ? 1 : 0.85}
                style={{ transition: 'all 200ms ease' }}
                onMouseEnter={() => setHoveredCounty(countyName)}
                onMouseLeave={() => setHoveredCounty(null)}
                onClick={() => router.push(`/dashboard/${encodeURIComponent(countyName)}`)}
                filter={isHovered ? 'url(#glow)' : 'none'}
              />
              {isHovered && (
                <text
                  x={x}
                  y={y - radius - 8}
                  textAnchor="middle"
                  fill="#1f2937"
                  fontSize="11"
                  fontWeight="600"
                  pointerEvents="none"
                  style={{ textShadow: '0 0 3px white' }}
                >
                  {countyName}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {/* Legend */}
      <div className="mt-6 flex gap-6 justify-center flex-wrap text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-slate-700 font-medium">Starting</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span className="text-slate-700 font-medium">Active</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-600"></div>
          <span className="text-slate-700 font-medium">Leading</span>
        </div>
      </div>

      {hoveredCounty && (
        <div className="absolute bottom-4 left-4 right-4 bg-white border-2 border-red-600 rounded-lg p-4 shadow-lg max-w-xs">
          <h3 className="font-bold text-lg text-slate-900">{hoveredCounty} County</h3>
          <p className="text-sm text-slate-600 mt-1">Activity Score: {Math.floor(counties.get(hoveredCounty)?.activity_score ?? 0)}</p>
          <button 
            onClick={() => router.push(`/dashboard/${encodeURIComponent(hoveredCounty)}`)}
            className="mt-3 w-full bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition"
          >
            View County Details
          </button>
        </div>
      )}
    </div>
  )
}
