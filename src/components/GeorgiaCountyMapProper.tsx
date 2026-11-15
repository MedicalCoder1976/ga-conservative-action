'use client';

import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { useState } from 'react';

const GEO_URL = "https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json";

// Georgia FIPS codes start with 13
const isGeorgia = (geo: any) => geo.id?.toString().startsWith('13');

interface CountyData {
  name: string;
  republican_votes: number;
  democrat_votes: number;
  republican_pct: number;
  democrat_pct: number;
}

export default function GeorgiaCountyMap({ 
  isLoggedIn = false, 
  electionData = {},
  onCountyClick 
}: {
  isLoggedIn?: boolean;
  electionData?: Record<string, CountyData>;
  onCountyClick?: (county: string) => void;
}) {
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  const getColor = (countyName: string) => {
    if (!isLoggedIn) return '#e5e7eb';
    
    const data = electionData[countyName];
    if (!data) return '#e5e7eb';
    
    const repPct = data.republican_pct || 0;
    const demPct = data.democrat_pct || 0;

    if (repPct > demPct) {
      // Lean Republican - shift toward red
      const intensity = Math.min(100, (repPct - demPct) * 2);
      return `rgb(220, ${100 - intensity}, ${100 - intensity})`;
    } else {
      // Lean Democratic - shift toward blue
      const intensity = Math.min(100, (demPct - repPct) * 2);
      return `rgb(${100 - intensity}, ${150 - intensity}, 220)`;
    }
  };

  const handleMouseOver = (e: React.MouseEvent, countyName: string) => {
    setHoveredCounty(countyName);
    const data = electionData[countyName];
    const tooltipText = data 
      ? `${countyName}: R ${data.republican_pct?.toFixed(1)}% D ${data.democrat_pct?.toFixed(1)}%`
      : countyName;
    setTooltip({
      x: e.clientX,
      y: e.clientY,
      text: tooltipText
    });
  };

  const handleMouseOut = () => {
    setHoveredCounty(null);
    setTooltip(null);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-lg border-2 border-red-600 overflow-hidden">
      <div className="w-full h-96 md:h-full relative flex items-center justify-center bg-white">
        <ComposableMap 
          projection="geoMercator" 
          projectionConfig={{ 
            scale: 4000, 
            center: [-83.5, 32.7] as [number, number]
          }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: any[] }) =>
              geographies
                .filter(isGeorgia)
                .map((geo: any) => {
                  const name = geo.properties?.name || 'Unknown';
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getColor(name)}
                      stroke="#fff"
                      strokeWidth={0.5}
                      onClick={() => onCountyClick?.(name)}
                      onMouseEnter={(e: React.MouseEvent) => handleMouseOver(e, name)}
                      onMouseLeave={handleMouseOut}
                    />
                  );
                })
            }
          </Geographies>
        </ComposableMap>

        {/* Tooltip */}
        {tooltip && (
          <div 
            className="fixed bg-slate-900 text-white px-3 py-2 rounded text-xs font-semibold pointer-events-none z-50"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y - 30}px`,
            }}
          >
            {tooltip.text}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex gap-6 justify-center py-4 px-4 bg-white border-t border-gray-200 w-full flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-500 border border-red-600 rounded"></div>
          <span className="text-sm font-semibold text-slate-700">Republican</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 border border-blue-600 rounded"></div>
          <span className="text-sm font-semibold text-slate-700">Democrat</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-300 border border-gray-400 rounded"></div>
          <span className="text-sm font-semibold text-slate-700">No Data</span>
        </div>
      </div>

      <div className="text-center text-xs text-slate-600 px-4 py-2">
        📍 Click a county to view local engagement. Hover for election results.
      </div>
    </div>
  );
}
