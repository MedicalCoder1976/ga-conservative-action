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

  const fetchCounties = async () => {
    try {
      const supabase = createClient()
      const { data, error: err } = await supabase
        .from('counties')
        .select('name, activity_score, color_intensity, fips, last_demographics_refresh')

      if (err) {
        console.error('Error fetching counties:', err)
        setError('Failed to load counties data')
        // Use mock data for demo purposes
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
      // Use mock data for demo purposes
      initializeMockCounties()
    } finally {
      setLoading(false)
    }
  }

  const initializeMockCounties = () => {
    // Initialize with mock data for testing/demo
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

    // Set up refresh interval (every 10 seconds)
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

          return (
            <button
              key={countyName}
              onClick={() => handleCountyClick(countyName)}
              style={{
                backgroundColor: backgroundColor,
                transition: 'all 0.3s ease-in-out',
              }}
              className="
                p-3 md:p-4
                rounded-lg
                text-white
                font-semibold
                text-xs md:text-sm
                text-center
                shadow-md
                hover:shadow-lg
                hover:scale-105
                active:scale-95
                transition-all
                duration-200
                min-h-16 md:min-h-20
                flex items-center justify-center
                cursor-pointer
                border border-slate-300
              "
              title={`${countyName}: ${activityScore} points`}
            >
              <span className="break-words">{countyName}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <h3 className="font-semibold text-slate-900 mb-2">Color Legend</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded border border-slate-300"
              style={{ backgroundColor: 'rgb(0, 0, 255)' }}
            />
            <div>
              <p className="font-medium">Blue (0 points)</p>
              <p className="text-slate-600">No activity yet</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded border border-slate-300"
              style={{ backgroundColor: 'rgb(128, 0, 127)' }}
            />
            <div>
              <p className="font-medium">Purple (128 points)</p>
              <p className="text-slate-600">Moderate activity</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded border border-slate-300"
              style={{ backgroundColor: 'rgb(255, 0, 0)' }}
            />
            <div>
              <p className="font-medium">Red (255+ points)</p>
              <p className="text-slate-600">High activity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
