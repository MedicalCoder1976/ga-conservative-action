'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { createClient } from '@/lib/supabase/client'
import type { County } from '@/lib/types'
import { getCountyColor } from '@/lib/color-calculator'

// Georgia county GeoJSON with simplified boundaries
const GEORGIA_COUNTIES_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: { name: 'Appling', fips: '13001' }, geometry: { type: 'Polygon', coordinates: [[[-82.5, 31.5], [-82.0, 31.5], [-82.0, 32.0], [-82.5, 32.0], [-82.5, 31.5]]] } },
    { type: 'Feature', properties: { name: 'Atkinson', fips: '13003' }, geometry: { type: 'Polygon', coordinates: [[[-82.8, 30.8], [-82.3, 30.8], [-82.3, 31.3], [-82.8, 31.3], [-82.8, 30.8]]] } },
    { type: 'Feature', properties: { name: 'Bacon', fips: '13005' }, geometry: { type: 'Polygon', coordinates: [[[-82.5, 30.8], [-82.0, 30.8], [-82.0, 31.3], [-82.5, 31.3], [-82.5, 30.8]]] } },
    { type: 'Feature', properties: { name: 'Baker', fips: '13007' }, geometry: { type: 'Polygon', coordinates: [[[-84.3, 31.0], [-83.8, 31.0], [-83.8, 31.5], [-84.3, 31.5], [-84.3, 31.0]]] } },
    { type: 'Feature', properties: { name: 'Baldwin', fips: '13009' }, geometry: { type: 'Polygon', coordinates: [[[-82.8, 33.0], [-82.3, 33.0], [-82.3, 33.5], [-82.8, 33.5], [-82.8, 33.0]]] } },
    { type: 'Feature', properties: { name: 'Fulton', fips: '13121' }, geometry: { type: 'Polygon', coordinates: [[[-84.5, 33.6], [-84.0, 33.6], [-84.0, 34.1], [-84.5, 34.1], [-84.5, 33.6]]] } },
  ]
}

export function GeorgiaLeafletMap() {
  const router = useRouter()
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const [counties, setCounties] = useState<Map<string, County>>(new Map())
  const [loading, setLoading] = useState(true)

  // Fetch county data from Supabase
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
      }
      setCounties(countyMap)
    } catch (err) {
      console.error('Error fetching counties:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCounties()
  }, [])

  // Initialize Leaflet map
  useEffect(() => {
    if (loading || !mapContainer.current || map.current) return

    // Create map centered on Georgia
    map.current = L.map(mapContainer.current).setView([32.9, -83.6], 7)

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 10,
    }).addTo(map.current)

    // Add county boundaries from GeoJSON
    const geoJsonLayer = L.geoJSON(GEORGIA_COUNTIES_GEOJSON as any, {
      style: (feature) => {
        const countyName = feature?.properties?.name
        const countyData = counties.get(countyName)
        const score = countyData?.activity_score || 0
        const color = getCountyColor(score)

        return {
          fillColor: color,
          weight: 2,
          opacity: 1,
          color: '#dc2626',
          dashArray: '3',
          fillOpacity: 0.7,
        }
      },
      onEachFeature: (feature, layer) => {
        const countyName = feature?.properties?.name
        const countyData = counties.get(countyName)

        // Add popup on hover
        const popup = L.popup()
          .setContent(`<div class="p-2"><strong>${countyName}</strong><br/>Score: ${countyData?.activity_score || 0}</div>`)

        layer.bindPopup(popup)
        layer.on('mouseover', () => layer.openPopup())
        layer.on('mouseout', () => layer.closePopup())

        // Add click handler to navigate to county dashboard
        layer.on('click', () => {
          router.push(`/dashboard/${encodeURIComponent(countyName)}`)
        })
      }
    })

    geoJsonLayer.addTo(map.current)

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [loading, counties, router])

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-white rounded-xl border-2 border-red-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-slate-700 font-semibold">Loading Georgia map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="bg-white p-4 sm:p-6 rounded-xl border-2 border-red-600 overflow-hidden">
        {/* Map Container */}
        <div
          ref={mapContainer}
          className="w-full h-96 sm:h-[500px] rounded-lg border border-red-200"
          style={{ zIndex: 1 }}
        />
        
        {/* Legend */}
        <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t-2 border-red-600">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">Blue</div>
            <p className="text-xs sm:text-sm text-slate-700 font-semibold">No Activity</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">Purple</div>
            <p className="text-xs sm:text-sm text-slate-700 font-semibold">Some Activity</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">Red</div>
            <p className="text-xs sm:text-sm text-slate-700 font-semibold">High Activity</p>
          </div>
        </div>

        <p className="text-center text-xs sm:text-sm text-slate-700 font-semibold mt-4">
          Hover over counties to see details. Click to view county dashboard.
        </p>
      </div>
    </div>
  )
}
