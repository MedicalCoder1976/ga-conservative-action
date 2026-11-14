'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getCountyColor } from '@/lib/color-calculator'
import type { County } from '@/lib/types'
import Link from 'next/link'

// Georgia counties with approximate SVG polygon coordinates
// This is a simplified but representative map of Georgia
const GEORGIA_COUNTY_PATHS: Record<string, string> = {
  'Appling': 'M 600,420 L 620,420 L 625,440 L 600,440 Z',
  'Atkinson': 'M 570,460 L 590,460 L 595,480 L 570,480 Z',
  'Bacon': 'M 620,460 L 640,460 L 645,480 L 620,480 Z',
  'Baker': 'M 170,380 L 190,380 L 195,400 L 170,400 Z',
  'Baldwin': 'M 400,340 L 420,340 L 425,360 L 400,360 Z',
  'Banks': 'M 500,120 L 520,120 L 525,140 L 500,140 Z',
  'Barrow': 'M 520,140 L 540,140 L 545,160 L 520,160 Z',
  'Bartow': 'M 300,100 L 320,100 L 325,120 L 300,120 Z',
  'Ben Hill': 'M 450,380 L 470,380 L 475,400 L 450,400 Z',
  'Berrien': 'M 500,480 L 520,480 L 525,500 L 500,500 Z',
  'Bibb': 'M 380,340 L 400,340 L 405,360 L 380,360 Z',
  'Bleckley': 'M 420,340 L 440,340 L 445,360 L 420,360 Z',
  'Brantley': 'M 660,440 L 680,440 L 685,460 L 660,460 Z',
  'Brooks': 'M 520,500 L 540,500 L 545,520 L 520,520 Z',
  'Bryan': 'M 700,420 L 720,420 L 725,440 L 700,440 Z',
  'Bulloch': 'M 660,400 L 680,400 L 685,420 L 660,420 Z',
  'Burke': 'M 560,340 L 580,340 L 585,360 L 560,360 Z',
  'Butts': 'M 380,280 L 400,280 L 405,300 L 380,300 Z',
  'Calhoun': 'M 190,400 L 210,400 L 215,420 L 190,420 Z',
  'Camden': 'M 740,480 L 760,480 L 765,500 L 740,500 Z',
  'Campbell': 'M 310,240 L 330,240 L 335,260 L 310,260 Z',
  'Candler': 'M 620,380 L 640,380 L 645,400 L 620,400 Z',
  'Carroll': 'M 240,200 L 260,200 L 265,220 L 240,220 Z',
  'Catoosa': 'M 220,60 L 240,60 L 245,80 L 220,80 Z',
  'Charlton': 'M 700,500 L 720,500 L 725,520 L 700,520 Z',
  'Chatham': 'M 700,420 L 720,420 L 725,440 L 700,440 Z',
  'Chattahoochee': 'M 160,380 L 180,380 L 185,400 L 160,400 Z',
  'Chattooga': 'M 240,120 L 260,120 L 265,140 L 240,140 Z',
  'Cherokee': 'M 360,140 L 380,140 L 385,160 L 360,160 Z',
  'Cherry': 'M 580,360 L 600,360 L 605,380 L 580,380 Z',
  'Chester': 'M 420,280 L 440,280 L 445,300 L 420,300 Z',
  'Cobb': 'M 300,160 L 320,160 L 325,180 L 300,180 Z',
  'Coffee': 'M 540,420 L 560,420 L 565,440 L 540,440 Z',
  'Colquitt': 'M 480,480 L 500,480 L 505,500 L 480,500 Z',
  'Columbia': 'M 580,300 L 600,300 L 605,320 L 580,320 Z',
  'Cook': 'M 510,500 L 530,500 L 535,520 L 510,520 Z',
  'Coweta': 'M 330,240 L 350,240 L 355,260 L 330,260 Z',
  'Crawford': 'M 360,300 L 380,300 L 385,320 L 360,320 Z',
  'Crisp': 'M 390,380 L 410,380 L 415,400 L 390,400 Z',
  'Dade': 'M 180,80 L 200,80 L 205,100 L 180,100 Z',
  'Dawson': 'M 480,140 L 500,140 L 505,160 L 480,160 Z',
  'Decatur': 'M 440,500 L 460,500 L 465,520 L 440,520 Z',
  'DeKalb': 'M 380,200 L 400,200 L 405,220 L 380,220 Z',
  'Dodge': 'M 460,360 L 480,360 L 485,380 L 460,380 Z',
  'Dooly': 'M 350,340 L 370,340 L 375,360 L 350,360 Z',
  'Dougherty': 'M 280,400 L 300,400 L 305,420 L 280,420 Z',
  'Douglas': 'M 300,240 L 320,240 L 325,260 L 300,260 Z',
  'Early': 'M 420,480 L 440,480 L 445,500 L 420,500 Z',
  'Echols': 'M 540,540 L 560,540 L 565,560 L 540,560 Z',
  'Effingham': 'M 680,380 L 700,380 L 705,400 L 680,400 Z',
  'Elbert': 'M 540,160 L 560,160 L 565,180 L 540,180 Z',
  'Emanuel': 'M 560,360 L 580,360 L 585,380 L 560,380 Z',
  'Evans': 'M 600,360 L 620,360 L 625,380 L 600,380 Z',
  'Fannin': 'M 420,60 L 440,60 L 445,80 L 420,80 Z',
  'Fayette': 'M 350,240 L 370,240 L 375,260 L 350,260 Z',
  'Floyd': 'M 280,120 L 300,120 L 305,140 L 280,140 Z',
  'Forsyth': 'M 420,140 L 440,140 L 445,160 L 420,160 Z',
  'Franklin': 'M 520,160 L 540,160 L 545,180 L 520,180 Z',
  'Fulton': 'M 340,200 L 360,200 L 365,220 L 340,220 Z',
  'Gilmer': 'M 360,80 L 380,80 L 385,100 L 360,100 Z',
  'Glascock': 'M 520,280 L 540,280 L 545,300 L 520,300 Z',
  'Glynn': 'M 740,460 L 760,460 L 765,480 L 740,480 Z',
  'Gordon': 'M 260,100 L 280,100 L 285,120 L 260,120 Z',
  'Grady': 'M 400,420 L 420,420 L 425,440 L 400,440 Z',
  'Greene': 'M 480,280 L 500,280 L 505,300 L 480,300 Z',
  'Gwinnett': 'M 400,160 L 420,160 L 425,180 L 400,180 Z',
  'Habersham': 'M 500,100 L 520,100 L 525,120 L 500,120 Z',
  'Hall': 'M 480,120 L 500,120 L 505,140 L 480,140 Z',
  'Hancock': 'M 500,280 L 520,280 L 525,300 L 500,300 Z',
  'Haralson': 'M 280,180 L 300,180 L 305,200 L 280,200 Z',
  'Harris': 'M 280,340 L 300,340 L 305,360 L 280,360 Z',
  'Hart': 'M 560,140 L 580,140 L 585,160 L 560,160 Z',
  'Heard': 'M 310,260 L 330,260 L 335,280 L 310,280 Z',
  'Henry': 'M 380,260 L 400,260 L 405,280 L 380,280 Z',
  'Houston': 'M 380,380 L 400,380 L 405,400 L 380,400 Z',
  'Irwin': 'M 500,440 L 520,440 L 525,460 L 500,460 Z',
  'Jackson': 'M 500,200 L 520,200 L 525,220 L 500,220 Z',
  'Jasper': 'M 380,280 L 400,280 L 405,300 L 380,300 Z',
  'Jeff Davis': 'M 480,400 L 500,400 L 505,420 L 480,420 Z',
  'Jefferson': 'M 540,280 L 560,280 L 565,300 L 540,300 Z',
  'Jenkins': 'M 560,340 L 580,340 L 585,360 L 560,360 Z',
  'Johnson': 'M 360,340 L 380,340 L 385,360 L 360,360 Z',
  'Jones': 'M 420,300 L 440,300 L 445,320 L 420,320 Z',
  'Lamar': 'M 360,300 L 380,300 L 385,320 L 360,320 Z',
  'Lanier': 'M 480,420 L 500,420 L 505,440 L 480,440 Z',
  'Laurens': 'M 440,360 L 460,360 L 465,380 L 440,380 Z',
  'Lee': 'M 310,400 L 330,400 L 335,420 L 310,420 Z',
  'Liberty': 'M 720,440 L 740,440 L 745,460 L 720,460 Z',
  'Lincoln': 'M 520,240 L 540,240 L 545,260 L 520,260 Z',
  'Long': 'M 720,420 L 740,420 L 745,440 L 720,440 Z',
  'Lowndes': 'M 500,520 L 520,520 L 525,540 L 500,540 Z',
  'Lumpkin': 'M 440,100 L 460,100 L 465,120 L 440,120 Z',
  'Macon': 'M 340,340 L 360,340 L 365,360 L 340,360 Z',
  'Madison': 'M 460,220 L 480,220 L 485,240 L 460,240 Z',
  'Marion': 'M 250,360 L 270,360 L 275,380 L 250,380 Z',
  'McDuffie': 'M 560,240 L 580,240 L 585,260 L 560,260 Z',
  'McIntosh': 'M 720,460 L 740,460 L 745,480 L 720,480 Z',
  'Meriwether': 'M 330,280 L 350,280 L 355,300 L 330,300 Z',
  'Miller': 'M 370,480 L 390,480 L 395,500 L 370,500 Z',
  'Milton': 'M 380,140 L 400,140 L 405,160 L 380,160 Z',
  'Mitchell': 'M 420,440 L 440,440 L 445,460 L 420,460 Z',
  'Monroe': 'M 420,260 L 440,260 L 445,280 L 420,280 Z',
  'Montgomery': 'M 460,340 L 480,340 L 485,360 L 460,360 Z',
  'Morgan': 'M 480,240 L 500,240 L 505,260 L 480,260 Z',
  'Murray': 'M 200,100 L 220,100 L 225,120 L 200,120 Z',
  'Muscogee': 'M 220,340 L 240,340 L 245,360 L 220,360 Z',
  'Newton': 'M 400,240 L 420,240 L 425,260 L 400,260 Z',
  'Oconee': 'M 440,220 L 460,220 L 465,240 L 440,240 Z',
  'Oglethorpe': 'M 540,200 L 560,200 L 565,220 L 540,220 Z',
  'Paulding': 'M 280,200 L 300,200 L 305,220 L 280,220 Z',
  'Peach': 'M 350,300 L 370,300 L 375,320 L 350,320 Z',
  'Pickens': 'M 360,100 L 380,100 L 385,120 L 360,120 Z',
  'Pierce': 'M 620,480 L 640,480 L 645,500 L 620,500 Z',
  'Pike': 'M 310,260 L 330,260 L 335,280 L 310,280 Z',
  'Polk': 'M 220,120 L 240,120 L 245,140 L 220,140 Z',
  'Pulaski': 'M 400,340 L 420,340 L 425,360 L 400,360 Z',
  'Putnam': 'M 460,240 L 480,240 L 485,260 L 460,260 Z',
  'Quitman': 'M 150,420 L 170,420 L 175,440 L 150,440 Z',
  'Rabun': 'M 540,80 L 560,80 L 565,100 L 540,100 Z',
  'Randolph': 'M 310,420 L 330,420 L 335,440 L 310,440 Z',
  'Richmond': 'M 580,300 L 600,300 L 605,320 L 580,320 Z',
  'Rockdale': 'M 420,220 L 440,220 L 445,240 L 420,240 Z',
  'Schley': 'M 280,360 L 300,360 L 305,380 L 280,380 Z',
  'Screven': 'M 600,340 L 620,340 L 625,360 L 600,360 Z',
  'Seminole': 'M 380,480 L 400,480 L 405,500 L 380,500 Z',
  'Spalding': 'M 380,320 L 400,320 L 405,340 L 380,340 Z',
  'Stephens': 'M 560,120 L 580,120 L 585,140 L 560,140 Z',
  'Stewart': 'M 200,360 L 220,360 L 225,380 L 200,380 Z',
  'Sumter': 'M 330,380 L 350,380 L 355,400 L 330,400 Z',
  'Talbot': 'M 290,320 L 310,320 L 315,340 L 290,340 Z',
  'Taliaferro': 'M 520,240 L 540,240 L 545,260 L 520,260 Z',
  'Tattnall': 'M 640,400 L 660,400 L 665,420 L 640,420 Z',
  'Taylor': 'M 310,320 L 330,320 L 335,340 L 310,340 Z',
  'Telfair': 'M 460,360 L 480,360 L 485,380 L 460,380 Z',
  'Terrell': 'M 270,380 L 290,380 L 295,400 L 270,400 Z',
  'Thomas': 'M 430,460 L 450,460 L 455,480 L 430,480 Z',
  'Tift': 'M 480,440 L 500,440 L 505,460 L 480,460 Z',
  'Toombs': 'M 600,380 L 620,380 L 625,400 L 600,400 Z',
  'Towns': 'M 520,60 L 540,60 L 545,80 L 520,80 Z',
  'Treutlen': 'M 580,380 L 600,380 L 605,400 L 580,400 Z',
  'Troup': 'M 300,280 L 320,280 L 325,300 L 300,300 Z',
  'Turner': 'M 440,460 L 460,460 L 465,480 L 440,480 Z',
  'Twiggs': 'M 420,320 L 440,320 L 445,340 L 420,340 Z',
  'Union': 'M 400,80 L 420,80 L 425,100 L 400,100 Z',
  'Upson': 'M 320,300 L 340,300 L 345,320 L 320,320 Z',
  'Walker': 'M 160,100 L 180,100 L 185,120 L 160,120 Z',
  'Walton': 'M 440,200 L 460,200 L 465,220 L 440,220 Z',
  'Ware': 'M 680,500 L 700,500 L 705,520 L 680,520 Z',
  'Warren': 'M 540,240 L 560,240 L 565,260 L 540,260 Z',
  'Washington': 'M 520,300 L 540,300 L 545,320 L 520,320 Z',
  'Wayne': 'M 660,460 L 680,460 L 685,480 L 660,480 Z',
  'Webster': 'M 240,360 L 260,360 L 265,380 L 240,380 Z',
  'Wheeler': 'M 520,360 L 540,360 L 545,380 L 520,380 Z',
  'White': 'M 460,120 L 480,120 L 485,140 L 460,140 Z',
  'Whitfield': 'M 180,80 L 200,80 L 205,100 L 180,100 Z',
  'Wilcox': 'M 420,380 L 440,380 L 445,400 L 420,400 Z',
  'Wilkes': 'M 560,200 L 580,200 L 585,220 L 560,220 Z',
  'Wilkinson': 'M 460,300 L 480,300 L 485,320 L 460,320 Z',
  'Worth': 'M 460,500 L 480,500 L 485,520 L 460,520 Z',
  'Clayton': 'M 360,240 L 380,240 L 385,260 L 360,260 Z',
}

export function GeorgiaRealMap() {
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
    router.push(`/dashboard/${encodeURIComponent(countyName)}`)
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

  return (
    <div className="w-full bg-white border-2 border-red-600 rounded-lg overflow-hidden shadow-lg">
      {/* SVG Map */}
      <svg
        viewBox="0 0 960 600"
        className="w-full h-auto"
        style={{ minHeight: '500px' }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <style>{`
            .ga-county {
              cursor: pointer;
              stroke: #fff;
              stroke-width: 2;
              transition: all 0.2s;
            }
            .ga-county:hover {
              stroke-width: 3;
              filter: brightness(1.15);
            }
            .county-label {
              font-size: 9px;
              font-weight: bold;
              text-anchor: middle;
              pointer-events: none;
              fill: #333;
              text-shadow: 1px 1px 1px rgba(255,255,255,0.8);
            }
          `}</style>
        </defs>

        {/* Background */}
        <rect width="960" height="600" fill="#f5f5f5"/>

        {/* State outline/border */}
        <rect width="960" height="600" fill="none" stroke="#999" strokeWidth="2"/>

        {/* All Georgia Counties */}
        {Object.entries(GEORGIA_COUNTY_PATHS).map(([countyName, path]) => {
          const county = counties.get(countyName)
          const activityScore = county?.activity_score || 0
          const color = getCountyColor(activityScore)
          
          return (
            <g key={countyName}>
              <path
                d={path}
                className="ga-county"
                fill={color}
                onClick={() => handleCountyClick(countyName)}
                onMouseEnter={() => setHoveredCounty(countyName)}
                onMouseLeave={() => setHoveredCounty(null)}
              />
              {hoveredCounty === countyName && (
                <text x="500" y="30" className="county-label" fontSize="16" fontWeight="bold" fill="#d12121">
                  Click to view {countyName} County
                </text>
              )}
            </g>
          )
        })}

        {/* Hover Tooltip */}
        {hoveredCounty && (
          <text x="500" y="580" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#d12121">
            Click to view {hoveredCounty} County details
          </text>
        )}

        {/* Default Text */}
        {!hoveredCounty && (
          <text x="500" y="30" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#666">
            Click any county to view details • Hover for more info
          </text>
        )}
      </svg>

      {/* Legend Section */}
      <div className="p-6 bg-white border-t-2 border-red-600">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h3 className="font-bold text-slate-900 mb-3">County Status</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded" style={{ backgroundColor: getCountyColor(0) }}></div>
                <span className="text-sm font-semibold text-slate-700">Democratic Lean</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded" style={{ backgroundColor: getCountyColor(127) }}></div>
                <span className="text-sm font-semibold text-slate-700">Competitive</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded" style={{ backgroundColor: getCountyColor(200) }}></div>
                <span className="text-sm font-semibold text-slate-700">Republican Lean</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600 font-semibold">
              <span className="text-red-600 font-bold">159 Counties</span> in Georgia
            </p>
            <p className="text-xs text-slate-500 mt-1">Colors change as engagement increases</p>
          </div>
        </div>
      </div>

      {/* Quick Links to Major Counties */}
      <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
        <p className="text-xs font-bold text-slate-600 uppercase mb-3">Quick Access - Major Counties</p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {['Fulton', 'DeKalb', 'Gwinnett', 'Cobb', 'Clayton', 'Henry', 'Chatham', 'Muscogee'].map((county) => (
            <button
              key={county}
              onClick={() => handleCountyClick(county)}
              className="text-xs font-semibold px-3 py-2 rounded bg-white border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition"
            >
              {county}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
