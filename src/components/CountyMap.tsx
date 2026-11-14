'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getCountyColor } from '@/lib/color-calculator'
import { GEORGIA_COUNTIES } from '@/lib/constants/georgia-counties'
import type { County } from '@/lib/types'

export function CountyMap() {
  const router = useRouter()
  const [counties, setCounties] = useState<Map<string, County>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null)

  const fetchCounties = async () => {
    try {
      const supabase = createClient()
      const { data, error: err } = await supabase
        .from('counties')
        .select('name, activity_score, color_intensity, fips, last_demographics_refresh')

      if (err) {
        console.error('Error fetching counties:', err)
        setError('Failed to load counties data')
        initializeMockCounties()
        return
      }

      const countyMap = new Map<string, County>()
      if (data) {
        data.forEach((county: County) => {
          countyMap.set(county.name, county)
        })
      }
      setCounties(countyMap)
      setError(null)
    } catch (err) {
      console.error('Error fetching counties:', err)
      setError('Failed to load counties data')
      initializeMockCounties()
    } finally {
      setLoading(false)
    }
  }

  const initializeMockCounties = () => {
    const countyMap = new Map<string, County>()
    GEORGIA_COUNTIES.forEach((countyName, index) => {
      const mockScore = Math.floor(Math.random() * 256)
      countyMap.set(countyName, {
        name: countyName,
        fips: `13${String(index + 1).padStart(3, '0')}`,
        activity_score: mockScore,
        color_intensity: Math.min(mockScore, 255),
        last_demographics_refresh: new Date().toISOString().split('T')[0],
      })
    })
    setCounties(countyMap)
  }

  useEffect(() => {
    fetchCounties()
    const interval = setInterval(fetchCounties, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleCountyClick = (countyName: string) => {
    router.push(`/dashboard/${encodeURIComponent(countyName)}`)
  }

  if (loading && counties.size === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-lg text-slate-600">Loading counties...</div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ {error} - Showing demo data with random activity scores
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
        {GEORGIA_COUNTIES.map((countyName) => {
          const countyData = counties.get(countyName)
          const activityScore = countyData?.activity_score ?? 0
          const backgroundColor = getCountyColor(activityScore)
          const isHovered = hoveredCounty === countyName

          return (
            <button
              key={countyName}
              onClick={() => handleCountyClick(countyName)}
              onMouseEnter={() => setHoveredCounty(countyName)}
              onMouseLeave={() => setHoveredCounty(null)}
              style={{
                backgroundColor: backgroundColor,
                transform: isHovered ? 'scale(1.08)' : 'scale(1)',
              }}
              className="
                p-3 md:p-4
                rounded-lg
                text-white
                font-bold
                text-xs md:text-sm
                text-center
                shadow-md
                hover:shadow-xl
                active:scale-95
                transition-all
                duration-150
                min-h-16 md:min-h-20
                flex items-center justify-center
                cursor-pointer
                border-2 border-white
              "
              title={`${countyName}: ${activityScore} points - Click to view details`}
            >
              <span className="break-words">{countyName}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200">
        <h3 className="font-bold text-slate-900 mb-4 text-lg">Activity Level Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="flex items-center gap-3">
            <div
              className="w-16 h-12 rounded-lg border-2 border-white shadow-md flex-shrink-0"
              style={{ backgroundColor: 'rgb(0, 0, 255)' }}
            />
            <div>
              <p className="font-bold text-slate-900">Blue</p>
              <p className="text-slate-600">0 points - No activity</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-16 h-12 rounded-lg border-2 border-white shadow-md flex-shrink-0"
              style={{ backgroundColor: 'rgb(128, 0, 127)' }}
            />
            <div>
              <p className="font-bold text-slate-900">Purple</p>
              <p className="text-slate-600">128 points - Growing momentum</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-16 h-12 rounded-lg border-2 border-white shadow-md flex-shrink-0"
              style={{ backgroundColor: 'rgb(255, 0, 0)' }}
            />
            <div>
              <p className="font-bold text-slate-900">Red</p>
              <p className="text-slate-600">255+ points - High activity!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
