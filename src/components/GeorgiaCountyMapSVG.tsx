'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getCountyColor } from '@/lib/color-calculator'
import type { County } from '@/lib/types'

// Simplified Georgia county map with realistic county representation
// Using polygons that approximate Georgia county boundaries
const GEORGIA_COUNTIES_SVG = {
  paths: [
    // North Georgia - Mountain Region
    { name: 'Towns', d: 'M 550 50 L 570 50 L 575 70 L 550 70 Z' },
    { name: 'Union', d: 'M 520 60 L 545 60 L 550 85 L 520 85 Z' },
    { name: 'Rabun', d: 'M 570 45 L 595 45 L 600 75 L 575 75 Z' },
    { name: 'Lumpkin', d: 'M 520 85 L 550 85 L 555 110 L 520 110 Z' },
    { name: 'White', d: 'M 500 100 L 525 100 L 530 125 L 505 125 Z' },
    { name: 'Gilmer', d: 'M 480 80 L 510 80 L 515 105 L 485 105 Z' },
    { name: 'Pickens', d: 'M 460 85 L 485 85 L 490 110 L 465 110 Z' },
    { name: 'Fannin', d: 'M 430 60 L 460 60 L 465 85 L 435 85 Z' },
    { name: 'Bartow', d: 'M 390 80 L 430 80 L 435 115 L 395 115 Z' },
    
    // North Central Georgia
    { name: 'Forsyth', d: 'M 480 125 L 510 125 L 515 145 L 485 145 Z' },
    { name: 'Hall', d: 'M 520 115 L 550 115 L 555 140 L 525 140 Z' },
    { name: 'Habersham', d: 'M 560 100 L 590 100 L 595 130 L 565 130 Z' },
    { name: 'Banks', d: 'M 540 85 L 570 85 L 575 110 L 545 110 Z' },
    { name: 'Dawson', d: 'M 500 130 L 530 130 L 535 155 L 505 155 Z' },
    
    // Metro Atlanta North
    { name: 'Cherokee', d: 'M 430 130 L 470 130 L 475 160 L 435 160 Z' },
    { name: 'Milton', d: 'M 390 125 L 430 125 L 435 155 L 395 155 Z' },
    { name: 'Cobb', d: 'M 350 140 L 390 140 L 395 175 L 355 175 Z' },
    { name: 'Fulton', d: 'M 390 175 L 430 175 L 435 210 L 395 210 Z' },
    { name: 'DeKalb', d: 'M 440 175 L 480 175 L 485 210 L 445 210 Z' },
    { name: 'Gwinnett', d: 'M 470 145 L 510 145 L 515 180 L 475 180 Z' },
    
    // Metro Atlanta South
    { name: 'Henry', d: 'M 470 240 L 510 240 L 515 270 L 475 270 Z' },
    { name: 'Clayton', d: 'M 420 210 L 450 210 L 455 240 L 425 240 Z' },
    { name: 'Spalding', d: 'M 400 280 L 440 280 L 445 310 L 405 310 Z' },
    { name: 'Fayette', d: 'M 360 200 L 400 200 L 405 230 L 365 230 Z' },
    
    // West Metro & Douglas County
    { name: 'Douglas', d: 'M 330 200 L 360 200 L 365 230 L 335 230 Z' },
    { name: 'Carroll', d: 'M 290 180 L 330 180 L 335 210 L 295 210 Z' },
    { name: 'Coweta', d: 'M 330 230 L 370 230 L 375 260 L 335 260 Z' },
    { name: 'Meriwether', d: 'M 320 260 L 360 260 L 365 290 L 325 290 Z' },
    
    // North Central Non-Metro
    { name: 'Oconee', d: 'M 480 155 L 520 155 L 525 185 L 485 185 Z' },
    { name: 'Clarke', d: 'M 520 160 L 560 160 L 565 190 L 525 190 Z' },
    { name: 'MadisonCounty', d: 'M 500 185 L 540 185 L 545 215 L 505 215 Z' },
    { name: 'Jackson', d: 'M 550 165 L 590 165 L 595 195 L 555 195 Z' },
    
    // Central Georgia - Macon Region
    { name: 'Bibb', d: 'M 430 280 L 470 280 L 475 310 L 435 310 Z' },
    { name: 'Twiggs', d: 'M 470 280 L 510 280 L 515 310 L 475 310 Z' },
    { name: 'Jones', d: 'M 470 310 L 510 310 L 515 340 L 475 340 Z' },
    { name: 'Peach', d: 'M 430 310 L 470 310 L 475 340 L 435 340 Z' },
    { name: 'Houston', d: 'M 420 340 L 460 340 L 465 370 L 425 370 Z' },
    { name: 'Upson', d: 'M 380 280 L 420 280 L 425 310 L 385 310 Z' },
    
    // South Central Georgia
    { name: 'Pulaski', d: 'M 440 350 L 480 350 L 485 380 L 445 380 Z' },
    { name: 'Crisp', d: 'M 400 350 L 440 350 L 445 380 L 405 380 Z' },
    { name: 'Dooly', d: 'M 360 320 L 400 320 L 405 350 L 365 350 Z' },
    { name: 'Sumter', d: 'M 360 350 L 400 350 L 405 380 L 365 380 Z' },
    
    // Southwest Georgia
    { name: 'Dougherty', d: 'M 340 370 L 380 370 L 385 400 L 345 400 Z' },
    { name: 'Worth', d: 'M 380 400 L 420 400 L 425 430 L 385 430 Z' },
    { name: 'Colquitt', d: 'M 420 420 L 460 420 L 465 450 L 425 450 Z' },
    
    // Southeast Georgia  
    { name: 'Laurens', d: 'M 510 340 L 550 340 L 555 370 L 515 370 Z' },
    { name: 'Telfair', d: 'M 500 370 L 540 370 L 545 400 L 505 400 Z' },
    { name: 'Tattnall', d: 'M 580 380 L 620 380 L 625 410 L 585 410 Z' },
    { name: 'Emanuel', d: 'M 540 400 L 580 400 L 585 430 L 545 430 Z' },
    
    // East Georgia
    { name: 'Columbia', d: 'M 600 300 L 640 300 L 645 330 L 605 330 Z' },
    { name: 'Richmond', d: 'M 600 330 L 640 330 L 645 360 L 605 360 Z' },
    { name: 'Burke', d: 'M 620 360 L 660 360 L 665 390 L 625 390 Z' },
    { name: 'Jenkins', d: 'M 580 340 L 620 340 L 625 370 L 585 370 Z' },
    
    // Coastal Georgia
    { name: 'Chatham', d: 'M 700 380 L 740 380 L 745 410 L 705 410 Z' },
    { name: 'Effingham', d: 'M 680 350 L 720 350 L 725 380 L 685 380 Z' },
    { name: 'Screven', d: 'M 640 330 L 680 330 L 685 360 L 645 360 Z' },
    { name: 'Bryan', d: 'M 710 340 L 750 340 L 755 370 L 715 370 Z' },
    
    // South Georgia Wiregrass
    { name: 'Ware', d: 'M 680 450 L 720 450 L 725 480 L 685 480 Z' },
    { name: 'Charlton', d: 'M 720 480 L 760 480 L 765 510 L 725 510 Z' },
    { name: 'Clinch', d: 'M 680 480 L 720 480 L 725 510 L 685 510 Z' },
    { name: 'Echols', d: 'M 720 510 L 760 510 L 765 540 L 725 540 Z' },
    { name: 'Lowndes', d: 'M 680 510 L 720 510 L 725 540 L 685 540 Z' },
    
    // Southwest wiregrass
    { name: 'Decatur', d: 'M 440 480 L 480 480 L 485 510 L 445 510 Z' },
    { name: 'Early', d: 'M 400 450 L 440 450 L 445 480 L 405 480 Z' },
    { name: 'Seminole', d: 'M 380 450 L 420 450 L 425 480 L 385 480 Z' },
    
    // Western Georgia
    { name: 'Muscogee', d: 'M 320 380 L 360 380 L 365 410 L 325 410 Z' },
    { name: 'Marion', d: 'M 280 360 L 320 360 L 325 390 L 285 390 Z' },
    { name: 'Chattahoochee', d: 'M 280 390 L 320 390 L 325 420 L 285 420 Z' },
    { name: 'Harris', d: 'M 320 410 L 360 410 L 365 440 L 325 440 Z' },
    
    // North Central
    { name: 'Elbert', d: 'M 600 200 L 640 200 L 645 230 L 605 230 Z' },
    { name: 'MadisonNorth', d: 'M 560 210 L 600 210 L 605 240 L 565 240 Z' },
    { name: 'Greene', d: 'M 550 240 L 590 240 L 595 270 L 555 270 Z' },
    { name: 'Hancock', d: 'M 590 270 L 630 270 L 635 300 L 595 300 Z' },
    { name: 'Washington', d: 'M 550 270 L 590 270 L 595 300 L 555 300 Z' },
    
    // Additional Mid-State Counties (partial list for space)
    { name: 'Jasper', d: 'M 420 260 L 460 260 L 465 290 L 425 290 Z' },
    { name: 'Monroe', d: 'M 460 260 L 500 260 L 505 290 L 465 290 Z' },
    { name: 'Pike', d: 'M 360 260 L 400 260 L 405 290 L 365 290 Z' },
    { name: 'Troup', d: 'M 330 280 L 370 280 L 375 310 L 335 310 Z' },
    { name: 'Polk', d: 'M 280 320 L 320 320 L 325 350 L 285 350 Z' },
    { name: 'Gordon', d: 'M 280 280 L 320 280 L 325 310 L 285 310 Z' },
    
    // More coastal/eastern
    { name: 'Bulloch', d: 'M 650 380 L 690 380 L 695 410 L 655 410 Z' },
    { name: 'McIntosh', d: 'M 720 410 L 760 410 L 765 440 L 725 440 Z' },
    { name: 'Glynn', d: 'M 750 440 L 790 440 L 795 470 L 755 470 Z' },
    
    // Remaining placeholder counties (simplified)
    ...Array.from({ length: 30 }, (_, i) => ({
      name: `County_${i}`,
      d: `M ${300 + i * 15} ${400 + (i % 5) * 30} L ${315 + i * 15} ${400 + (i % 5) * 30} L ${320 + i * 15} ${420 + (i % 5) * 30} L ${305 + i * 15} ${420 + (i % 5) * 30} Z`
    }))
  ]
}

export function GeorgiaCountyMapSVG() {
  const router = useRouter()
  const [counties, setCounties] = useState<Map<string, County>>(new Map())
  const [loading, setLoading] = useState(true)
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null)

  useEffect(() => {
    const fetchCounties = async () => {
      try {
        const supabase = createClient()
        const { data } = await supabase.from('counties').select('name, activity_score, color_intensity')
        
        const countyMap = new Map<string, County>()
        if (data && data.length > 0) {
          data.forEach((row: any) => {
            countyMap.set(row.name, {
              name: row.name,
              fips: '',
              activity_score: row.activity_score || 0,
              color_intensity: row.color_intensity || 0,
              last_demographics_refresh: '',
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

    fetchCounties()
  }, [])

  const handleCountyClick = (countyName: string) => {
    if (!countyName.includes('County_')) {
      router.push(`/dashboard/${encodeURIComponent(countyName)}`)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading Georgia map...</p>
        </div>
      </div>
    )
  }

  const majorCounties = ['Fulton', 'DeKalb', 'Gwinnett', 'Cobb', 'Clayton', 'Henry', 'Chatham', 'Muscogee', 'Bibb', 'Richmond']

  return (
    <div className="w-full bg-white border-2 border-red-600 rounded-lg overflow-hidden shadow-lg">
      {/* SVG Map Container */}
      <div className="relative bg-gradient-to-b from-gray-50 to-gray-100">
        <svg
          viewBox="0 0 850 550"
          className="w-full h-auto"
          preserveAspectRatio="xMidYMid meet"
          style={{ minHeight: '450px' }}
        >
          <defs>
            <style>{`
              .county-rect {
                cursor: pointer;
                stroke: #fff;
                stroke-width: 1.5;
                transition: all 0.2s;
              }
              .county-rect:hover {
                stroke-width: 2.5;
                filter: brightness(1.2);
              }
              .map-text {
                font-size: 11px;
                font-weight: bold;
                text-anchor: middle;
                pointer-events: none;
                fill: #333;
                text-shadow: 1px 1px 2px rgba(255,255,255,0.9);
              }
            `}</style>
          </defs>

          {/* Background */}
          <rect width="850" height="550" fill="#f9f9f9"/>

          {/* Georgia County Grid */}
          {GEORGIA_COUNTIES_SVG.paths.map((county) => {
            const data = counties.get(county.name)
            const color = data ? getCountyColor(data.activity_score) : '#e0e0e0'
            
            return (
              <path
                key={county.name}
                d={county.d}
                className="county-rect"
                fill={color}
                onClick={() => handleCountyClick(county.name)}
                onMouseEnter={() => setHoveredCounty(county.name)}
                onMouseLeave={() => setHoveredCounty(null)}
              />
            )
          })}

          {/* Hover Tooltip */}
          {hoveredCounty && !hoveredCounty.includes('County_') && (
            <text x="425" y="30" className="map-text" fontSize="16" fill="#d12121" fontWeight="bold">
              Click to view {hoveredCounty} County
            </text>
          )}

          {/* Default Instructions */}
          {!hoveredCounty && (
            <text x="425" y="30" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#666">
              Click any county • Hover for county name
            </text>
          )}

          {/* Map Legend */}
          <g transform="translate(20, 500)">
            <text x="0" y="0" className="map-text" fontSize="12" fontWeight="bold" fill="#333">County Status:</text>
            <rect x="100" y="-12" width="16" height="16" fill={getCountyColor(0)} stroke="#fff" strokeWidth="1"/>
            <text x="125" y="0" className="map-text" fontSize="10">Democratic</text>
            <rect x="220" y="-12" width="16" height="16" fill={getCountyColor(127)} stroke="#fff" strokeWidth="1"/>
            <text x="245" y="0" className="map-text" fontSize="10">Competitive</text>
            <rect x="360" y="-12" width="16" height="16" fill={getCountyColor(200)} stroke="#fff" strokeWidth="1"/>
            <text x="385" y="0" className="map-text" fontSize="10">Republican</text>
          </g>
        </svg>
      </div>

      {/* Quick Access Section */}
      <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
        <p className="text-xs font-bold text-slate-600 uppercase mb-3">Quick Access - Major Counties</p>
        <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2">
          {majorCounties.map((county) => (
            <button
              key={county}
              onClick={() => handleCountyClick(county)}
              className="text-xs font-semibold px-2 py-1 rounded bg-white border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition whitespace-nowrap"
            >
              {county}
            </button>
          ))}
        </div>
      </div>

      {/* Info Footer */}
      <div className="p-4 bg-white border-t border-gray-200 text-center">
        <p className="text-xs text-slate-600 font-semibold">
          <span className="text-red-600 font-bold">159 Georgia Counties</span> • Colors show engagement level
        </p>
      </div>
    </div>
  )
}
