'use client';

import { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { GEORGIA_COUNTIES } from '@/lib/constants/georgia-counties';

interface DriftData {
  county: string;
  drift_pct: number;
  dem_votes_2016: number;
  rep_votes_2016: number;
  total_votes_2016: number;
  dem_votes_current: number;
  rep_votes_current: number;
  total_votes_current: number;
}

const ELECTIONS = [
  { year: 2026, label: '2026 (Most Recent)' },
  { year: 2024, label: '2024' },
  { year: 2022, label: '2022' },
  { year: 2020, label: '2020' },
  { year: 2018, label: '2018' },
];

const GEO_URL = '/data/us-counties.json';

const getColor = (countyName: string | null, driftData: Record<string, DriftData>) => {
  if (!countyName) return '#e5e7eb';
  
  const data = driftData[countyName];
  if (!data) return '#dcfce7';

  const drift = data.drift_pct;
  const absDrift = Math.abs(drift);

  if (absDrift < 1) {
    return '#22c55e';
  } else if (drift > 0) {
    if (absDrift < 3) return '#ef4444';
    if (absDrift < 6) return '#dc2626';
    if (absDrift < 10) return '#b91c1c';
    return '#7f1d1d';
  } else {
    if (absDrift < 3) return '#3b82f6';
    if (absDrift < 6) return '#2563eb';
    if (absDrift < 10) return '#1d4ed8';
    return '#1e40af';
  }
};

const getDriftLabel = (drift: number): string => {
  if (drift > 0) {
    return `R+${drift.toFixed(1)}%`;
  } else if (drift < 0) {
    return `D+${Math.abs(drift).toFixed(1)}%`;
  }
  return 'Even';
};

export default function GeorgiaInteractiveMapSVG({
  onCountyClick,
}: {
  onCountyClick?: (county: string) => void;
}) {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [driftData, setDriftData] = useState<Record<string, DriftData>>({});
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch voter drift data
  useEffect(() => {
    const fetchVoterDrift = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/voter-drift?year=${selectedYear}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch voter drift data');
        }

        const { driftData: fetchedData } = await response.json();
        setDriftData(fetchedData || {});
      } catch (err) {
        console.error('Error fetching voter drift:', err);
        setError(err instanceof Error ? err.message : 'Failed to load map data');
        setDriftData({});
      } finally {
        setLoading(false);
      }
    };

    fetchVoterDrift();
  }, [selectedYear]);

  const handleCountyHover = (county: string, e: React.MouseEvent) => {
    setHoveredCounty(county);
    const data = driftData[county];
    const tooltipText = data 
      ? `${county}: ${getDriftLabel(data.drift_pct)} (2016→${selectedYear})`
      : county;
    setTooltip({
      x: e.clientX,
      y: e.clientY,
      text: tooltipText
    });
  };

  const handleCountyLeave = () => {
    setHoveredCounty(null);
    setTooltip(null);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-white rounded-lg border-2 border-green-600 overflow-hidden">
      {/* Year Selector */}
      <div className="w-full bg-gradient-to-r from-green-50 to-white border-b border-green-300 px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-900">Select Election Year for Voter Drift:</h3>
          <div className="flex flex-wrap gap-2">
            {ELECTIONS.map(({ year, label }) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedYear === year
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-white border-2 border-slate-300 text-slate-700 hover:border-green-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="w-full bg-white border-b border-green-200 px-6 py-4">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <span className="text-slate-700 font-semibold">Baseline (&plusmn;&lt;1%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500"></div>
            <span className="text-slate-700 font-semibold">Dem Gains</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500"></div>
            <span className="text-slate-700 font-semibold">GOP Gains</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="w-full h-screen sm:h-[600px] md:h-[700px] lg:h-screen relative flex items-center justify-center bg-blue-50 overflow-auto">
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-slate-600 font-semibold">Loading Georgia map...</p>
          </div>
        ) : error ? (
          <div className="text-center p-8">
            <div className="text-red-600 font-bold mb-4">⚠️ Error Loading Map</div>
            <p className="text-slate-600 mb-4">{error}</p>
            <div className="mt-6">
              <h4 className="font-bold text-slate-900 mb-3">🗺️ Georgia Counties Grid View</h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-w-2xl">
                {GEORGIA_COUNTIES.map((county) => {
                  const data = driftData[county];
                  const color = getColor(county, driftData);
                  return (
                    <button
                      key={county}
                      onClick={() => onCountyClick?.(county)}
                      onMouseEnter={(e) => handleCountyHover(county, e)}
                      onMouseLeave={handleCountyLeave}
                      className="p-2 rounded text-xs font-semibold text-white transition hover:opacity-80 cursor-pointer"
                      style={{ backgroundColor: color }}
                      title={data ? `${county}: ${getDriftLabel(data.drift_pct)}` : county}
                    >
                      {county.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <ComposableMap projection="geoAlbersUsa" projectionConfig={{ scale: 4000, center: [-83.6, 32.9] }}>
            <Geographies geography={GEO_URL}>
              {({ geographies }) => {
                // Filter to Georgia counties (FIPS codes 13001-13331)
                return geographies
                  .filter((geo: any) => {
                    const fips = geo.properties.STATEFP + geo.properties.COUNTYFP;
                    return fips.startsWith('13'); // Georgia FIPS code
                  })
                  .map((geo: any) => {
                    const countyFips = geo.properties.COUNTYFP;
                    const countyName = geo.properties.NAME || '';
                    
                    // Find matching county by name
                    const matchedCounty = GEORGIA_COUNTIES.find(c => 
                      c.toLowerCase() === countyName.toLowerCase() ||
                      c.split(' ')[0].toLowerCase() === countyName.split(' ')[0].toLowerCase()
                    );
                    
                    const color = getColor(matchedCounty || null, driftData);
                    const isHovered = hoveredCounty === matchedCounty;

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        style={{
                          default: {
                            fill: color,
                            stroke: '#333',
                            strokeWidth: 0.75,
                            outline: 'none',
                            cursor: matchedCounty ? 'pointer' : 'default',
                            opacity: isHovered ? 0.9 : 0.7,
                            transition: 'all 0.3s ease',
                          } as any,
                          hover: {
                            fill: color,
                            stroke: '#FFD700',
                            strokeWidth: 1.5,
                            outline: 'none',
                            cursor: matchedCounty ? 'pointer' : 'default',
                            opacity: 0.95,
                            transition: 'all 0.3s ease',
                          } as any,
                          pressed: {
                            fill: color,
                            stroke: '#333',
                            strokeWidth: 2,
                            outline: 'none',
                            cursor: matchedCounty ? 'pointer' : 'default',
                            opacity: 1,
                          } as any,
                        } as any}
                        onMouseEnter={(e) => {
                          if (matchedCounty) {
                            handleCountyHover(matchedCounty, e as unknown as React.MouseEvent);
                          }
                        }}
                        onMouseLeave={handleCountyLeave}
                        onClick={() => {
                          if (matchedCounty) {
                            onCountyClick?.(matchedCounty);
                          }
                        }}
                      />
                    );
                  });
              }}
            </Geographies>
          </ComposableMap>
        )}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed bg-slate-900 text-white px-3 py-2 rounded shadow-lg text-sm font-semibold z-50 pointer-events-none"
          style={{
            left: `${tooltip.x + 10}px`,
            top: `${tooltip.y + 10}px`,
          }}
        >
          {tooltip.text}
        </div>
      )}

      {/* Info Section */}
      <div className="w-full bg-green-50 border-t border-green-200 px-6 py-4">
        <p className="text-sm text-green-900 font-semibold">
          💚 <strong>Green</strong> = Baseline (2016 baseline &plusmn;&lt;1%) | 
          🔴 <strong>Red</strong> = Republican gains | 
          🔵 <strong>Blue</strong> = Democratic gains
        </p>
      </div>
    </div>
  );
}
