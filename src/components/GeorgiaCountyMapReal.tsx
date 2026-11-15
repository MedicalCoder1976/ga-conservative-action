'use client';

import { useState } from 'react';

interface CountyData {
  name: string;
  republican_votes: number;
  democrat_votes: number;
  republican_pct: number;
  democrat_pct: number;
}

interface GeorgiaMapProps {
  isLoggedIn?: boolean;
  electionData?: Record<string, CountyData>;
  onCountyClick?: (county: string) => void;
}

export default function GeorgiaCountyMapReal({ 
  isLoggedIn = false, 
  electionData = {},
  onCountyClick 
}: GeorgiaMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  // Georgia counties with approximate SVG path data (simplified shapes)
  // These are representative county positions and shapes for Georgia
  const counties: Record<string, { path: string; label: { x: number; y: number } }> = {
    // North Georgia - Mountains
    Dade: { 
      path: 'M 120 40 L 140 35 L 145 55 L 125 60 Z',
      label: { x: 130, y: 48 }
    },
    Fannin: { 
      path: 'M 160 35 L 190 30 L 195 50 L 165 55 Z',
      label: { x: 175, y: 42 }
    },
    Union: { 
      path: 'M 200 25 L 230 22 L 235 45 L 205 48 Z',
      label: { x: 217, y: 35 }
    },
    Towns: { 
      path: 'M 245 20 L 275 18 L 280 42 L 250 45 Z',
      label: { x: 260, y: 30 }
    },
    Rabun: { 
      path: 'M 285 25 L 315 22 L 320 48 L 290 50 Z',
      label: { x: 300, y: 35 }
    },
    Gilmer: { 
      path: 'M 180 60 L 210 58 L 215 80 L 185 82 Z',
      label: { x: 195, y: 70 }
    },
    Pickens: { 
      path: 'M 140 70 L 170 68 L 175 92 L 145 94 Z',
      label: { x: 155, y: 80 }
    },
    Cherokee: { 
      path: 'M 100 85 L 135 82 L 140 110 L 105 113 Z',
      label: { x: 118, y: 97 }
    },
    Forsyth: { 
      path: 'M 145 115 L 185 112 L 190 145 L 150 148 Z',
      label: { x: 168, y: 130 }
    },
    Hall: { 
      path: 'M 195 110 L 235 108 L 240 138 L 200 140 Z',
      label: { x: 218, y: 123 }
    },
    Habersham: { 
      path: 'M 250 75 L 285 73 L 290 105 L 255 107 Z',
      label: { x: 270, y: 88 }
    },
    White: { 
      path: 'M 225 90 L 255 88 L 260 112 L 230 114 Z',
      label: { x: 242, y: 101 }
    },
    
    // Metro Atlanta Area
    Fulton: { 
      path: 'M 140 160 L 175 158 L 180 195 L 145 197 Z',
      label: { x: 160, y: 177 }
    },
    DeKalb: { 
      path: 'M 180 160 L 225 158 L 230 195 L 185 197 Z',
      label: { x: 205, y: 177 }
    },
    Gwinnett: { 
      path: 'M 215 140 L 260 138 L 265 175 L 220 177 Z',
      label: { x: 240, y: 157 }
    },
    Cobb: { 
      path: 'M 100 140 L 140 138 L 145 175 L 105 177 Z',
      label: { x: 122, y: 157 }
    },
    Clayton: { 
      path: 'M 140 200 L 180 198 L 185 240 L 145 242 Z',
      label: { x: 162, y: 220 }
    },
    Henry: { 
      path: 'M 185 200 L 230 198 L 235 240 L 190 242 Z',
      label: { x: 212, y: 220 }
    },
    Rockdale: { 
      path: 'M 235 175 L 270 173 L 275 210 L 240 212 Z',
      label: { x: 255, y: 191 }
    },
    Newton: { 
      path: 'M 230 215 L 275 213 L 280 255 L 235 257 Z',
      label: { x: 255, y: 235 }
    },
    Douglas: { 
      path: 'M 85 175 L 120 173 L 125 210 L 90 212 Z',
      label: { x: 105, y: 191 }
    },
    Paulding: { 
      path: 'M 70 130 L 105 128 L 110 160 L 75 162 Z',
      label: { x: 90, y: 145 }
    },
    Bartow: { 
      path: 'M 100 100 L 135 98 L 140 130 L 105 132 Z',
      label: { x: 118, y: 115 }
    },

    // Central Georgia
    Muscogee: { 
      path: 'M 50 220 L 85 218 L 90 260 L 55 262 Z',
      label: { x: 70, y: 240 }
    },
    Richmond: { 
      path: 'M 300 200 L 340 198 L 345 240 L 305 242 Z',
      label: { x: 320, y: 220 }
    },
    Bibb: { 
      path: 'M 175 250 L 210 248 L 215 290 L 180 292 Z',
      label: { x: 195, y: 270 }
    },
    
    // South Georgia
    Chatham: { 
      path: 'M 340 280 L 375 278 L 380 320 L 345 322 Z',
      label: { x: 360, y: 300 }
    },
    Glynn: { 
      path: 'M 320 340 L 355 338 L 360 380 L 325 382 Z',
      label: { x: 340, y: 360 }
    },
    Lowndes: { 
      path: 'M 200 380 L 240 378 L 245 420 L 205 422 Z',
      label: { x: 222, y: 400 }
    },
    Dougherty: { 
      path: 'M 110 340 L 150 338 L 155 380 L 115 382 Z',
      label: { x: 132, y: 360 }
    },
  };

  const getCountyColor = (countyName: string): string => {
    const data = electionData[countyName];
    if (!data) return '#e5e7eb'; // gray if no data
    
    const repPct = data.republican_pct;
    const demPct = data.democrat_pct;
    
    // Color based on election results
    if (repPct > demPct) {
      // Red for Republican (lighter to darker based on margin)
      const intensity = Math.min(1, (repPct - demPct) / 50);
      return `rgb(${220 + intensity * 35}, ${20}, ${20})`; // Red scale
    } else {
      // Blue for Democrat
      const intensity = Math.min(1, (demPct - repPct) / 50);
      const blueIntensity = 80 + intensity * 150;
      return `rgb(30, ${blueIntensity}, 220)`; // Blue scale
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <svg 
        viewBox="0 0 420 450" 
        className="w-full h-auto border-2 border-slate-300 rounded-lg bg-gradient-to-br from-slate-50 to-blue-50 shadow-lg"
        style={{ maxHeight: '600px' }}
      >
        {/* Georgia state background */}
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="1" stdDeviation="2" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Georgia outline (simplified) */}
        <path
          d="M 50 100 L 380 80 L 390 350 L 200 420 L 50 350 Z"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="2"
          opacity="0.5"
        />

        {/* Counties */}
        {Object.entries(counties).map(([countyName, { path, label }]) => {
          const data = electionData[countyName];
          const isHovered = hovered === countyName;
          const color = getCountyColor(countyName);
          
          return (
            <g key={countyName}>
              {/* County shape */}
              <path
                d={path}
                fill={color}
                stroke="#fff"
                strokeWidth={isHovered ? "2" : "1"}
                className="cursor-pointer transition-all hover:opacity-80"
                opacity={isHovered ? 1 : 0.85}
                onMouseEnter={() => setHovered(countyName)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onCountyClick?.(countyName)}
                style={{
                  filter: isHovered ? 'url(#shadow)' : 'none',
                }}
              />
              
              {/* County label on hover */}
              {isHovered && (
                <g>
                  <rect
                    x={label.x - 35}
                    y={label.y - 25}
                    width="70"
                    height="20"
                    fill="rgba(0, 0, 0, 0.8)"
                    rx="3"
                  />
                  <text
                    x={label.x}
                    y={label.y - 10}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="700"
                    fill="#fff"
                  >
                    {countyName}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-8 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-600 rounded border border-gray-300"></div>
          <span className="font-semibold text-gray-700">Republican</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded border border-gray-300"></div>
          <span className="font-semibold text-gray-700">Democrat</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-300 rounded border border-gray-300"></div>
          <span className="font-semibold text-gray-700">No Data</span>
        </div>
      </div>

      {/* Hover info */}
      {hovered && electionData[hovered] && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <h3 className="font-bold text-lg text-gray-900">{hovered} County</h3>
          <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
            <div>
              <p className="text-gray-600">Republican</p>
              <p className="font-bold text-red-600">{electionData[hovered].republican_pct.toFixed(1)}%</p>
              <p className="text-xs text-gray-500">{electionData[hovered].republican_votes.toLocaleString()} votes</p>
            </div>
            <div>
              <p className="text-gray-600">Democrat</p>
              <p className="font-bold text-blue-600">{electionData[hovered].democrat_pct.toFixed(1)}%</p>
              <p className="text-xs text-gray-500">{electionData[hovered].democrat_votes.toLocaleString()} votes</p>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-4 text-center">
        📍 Click a county to view local engagement. Hover for election results.
      </p>
    </div>
  );
}
