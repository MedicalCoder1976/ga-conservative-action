'use client';

import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { GEORGIA_COUNTIES } from '@/lib/constants/georgia-counties';

const GEO_URL = "https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json";

// Georgia FIPS codes start with 13
const isGeorgia = (geo: any) => geo.id?.toString().startsWith('13');

// Map FIPS county names to Georgia county names
const FIPS_TO_COUNTY: Record<string, string> = {
  '13001': 'Appling', '13003': 'Atkinson', '13005': 'Bacon', '13007': 'Baker',
  '13009': 'Baldwin', '13011': 'Banks', '13013': 'Barrow', '13015': 'Bartow',
  '13017': 'Ben Hill', '13019': 'Berrien', '13021': 'Bibb', '13023': 'Bleckley',
  '13025': 'Brantley', '13027': 'Brooks', '13029': 'Bryan', '13031': 'Bulloch',
  '13033': 'Burke', '13035': 'Butts', '13037': 'Calhoun', '13039': 'Camden',
  '13041': 'Campbell', '13043': 'Candler', '13045': 'Carroll', '13047': 'Catoosa',
  '13049': 'Charlton', '13051': 'Chatham', '13053': 'Chattahoochee', '13055': 'Chattooga',
  '13057': 'Cherokee', '13059': 'Clarke', '13061': 'Clay', '13063': 'Clayton',
  '13065': 'Clinch', '13067': 'Cobb', '13069': 'Coffee', '13071': 'Colquitt',
  '13073': 'Columbia', '13075': 'Cook', '13077': 'Coweta', '13079': 'Crawford',
  '13081': 'Crisp', '13083': 'Dade', '13085': 'Dawson', '13087': 'Decatur',
  '13089': 'DeKalb', '13091': 'Dodge', '13093': 'Dooly', '13095': 'Dougherty',
  '13097': 'Douglas', '13099': 'Early', '13101': 'Echols', '13103': 'Effingham',
  '13105': 'Elbert', '13107': 'Emanuel', '13109': 'Evans', '13111': 'Fannin',
  '13113': 'Fayette', '13115': 'Floyd', '13117': 'Forsyth', '13119': 'Franklin',
  '13121': 'Fulton', '13123': 'Gilmer', '13125': 'Glascock', '13127': 'Glynn',
  '13129': 'Gordon', '13131': 'Grady', '13133': 'Greene', '13135': 'Gwinnett',
  '13137': 'Habersham', '13139': 'Hall', '13141': 'Hancock', '13143': 'Haralson',
  '13145': 'Harris', '13147': 'Hart', '13149': 'Heard', '13151': 'Henry',
  '13153': 'Houston', '13155': 'Irwin', '13157': 'Jackson', '13159': 'Jasper',
  '13161': 'Jeff Davis', '13163': 'Jefferson', '13165': 'Jenkins', '13167': 'Johnson',
  '13169': 'Jones', '13171': 'Lamar', '13173': 'Lanier', '13175': 'Laurens',
  '13177': 'Lee', '13179': 'Liberty', '13181': 'Lincoln', '13183': 'Long',
  '13185': 'Lowndes', '13187': 'Lumpkin', '13189': 'Macon', '13191': 'Madison',
  '13193': 'Marion', '13195': 'McDuffie', '13197': 'McIntosh', '13199': 'Meriwether',
  '13201': 'Miller', '13205': 'Milton', '13207': 'Mitchell', '13209': 'Monroe',
  '13211': 'Montgomery', '13213': 'Morgan', '13215': 'Murray', '13217': 'Muscogee',
  '13219': 'Newton', '13221': 'Oconee', '13223': 'Oglethorpe', '13225': 'Paulding',
  '13227': 'Peach', '13229': 'Pickens', '13231': 'Pierce', '13233': 'Pike',
  '13235': 'Polk', '13237': 'Pulaski', '13239': 'Putnam', '13241': 'Quitman',
  '13243': 'Rabun', '13245': 'Randolph', '13247': 'Richmond', '13249': 'Rockdale',
  '13251': 'Schley', '13253': 'Screven', '13255': 'Seminole', '13257': 'Spalding',
  '13259': 'Stephens', '13261': 'Stewart', '13263': 'Sumter', '13265': 'Talbot',
  '13267': 'Taliaferro', '13269': 'Tattnall', '13271': 'Taylor', '13273': 'Telfair',
  '13275': 'Terrell', '13277': 'Thomas', '13279': 'Tift', '13281': 'Toombs',
  '13283': 'Towns', '13285': 'Treutlen', '13287': 'Troup', '13289': 'Turner',
  '13291': 'Twiggs', '13293': 'Union', '13295': 'Upson', '13297': 'Walker',
  '13299': 'Walton', '13301': 'Ware', '13303': 'Warren', '13305': 'Washington',
  '13307': 'Wayne', '13309': 'Webster', '13311': 'Wheeler', '13313': 'White',
  '13315': 'Whitfield', '13317': 'Wilcox', '13319': 'Wilkes', '13321': 'Wilkinson',
  '13323': 'Worth'
};

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

export default function GeorgiaVoterDriftMap({ 
  onCountyClick 
}: {
  onCountyClick?: (county: string) => void;
}) {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [driftData, setDriftData] = useState<Record<string, DriftData>>({});
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch voter drift data from Supabase
  useEffect(() => {
    const fetchVoterDrift = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        
        // Fetch 2016 baseline data
        const { data: baseline2016, error: err2016 } = await supabase
          .from('county_voter_statistics')
          .select('county, democrat_votes, republican_votes, total_votes')
          .eq('election_year', 2016);

        // Fetch current year data
        const { data: currentYear, error: errCurrent } = await supabase
          .from('county_voter_statistics')
          .select('county, democrat_votes, republican_votes, total_votes')
          .eq('election_year', selectedYear);

        if (err2016 || errCurrent) {
          console.error('Error fetching drift data:', err2016 || errCurrent);
          setDriftData({});
        } else {
          const baselineMap = new Map();
          const currentMap = new Map();
          
          baseline2016?.forEach((row: any) => {
            baselineMap.set(row.county, {
              dem: row.democrat_votes || 0,
              rep: row.republican_votes || 0,
              total: row.total_votes || 1,
            });
          });

          currentYear?.forEach((row: any) => {
            currentMap.set(row.county, {
              dem: row.democrat_votes || 0,
              rep: row.republican_votes || 0,
              total: row.total_votes || 1,
            });
          });

          const dataMap: Record<string, DriftData> = {};
          GEORGIA_COUNTIES.forEach((countyName) => {
            const baseline = baselineMap.get(countyName);
            const current = currentMap.get(countyName);

            if (baseline && current) {
              const baselineRepPct = (baseline.rep / baseline.total) * 100;
              const currentRepPct = (current.rep / current.total) * 100;
              const drift = currentRepPct - baselineRepPct;

              dataMap[countyName] = {
                county: countyName,
                drift_pct: drift,
                dem_votes_2016: baseline.dem,
                rep_votes_2016: baseline.rep,
                total_votes_2016: baseline.total,
                dem_votes_current: current.dem,
                rep_votes_current: current.rep,
                total_votes_current: current.total,
              };
            }
          });

          setDriftData(dataMap);
        }
      } catch (err) {
        console.error('Error:', err);
        setDriftData({});
      } finally {
        setLoading(false);
      }
    };

    fetchVoterDrift();
  }, [selectedYear]);

  const getCountyName = (fips: string) => {
    return FIPS_TO_COUNTY[fips] || null;
  };

  const getColor = (countyName: string | null) => {
    if (!countyName) return '#e5e7eb';
    
    const data = driftData[countyName];
    if (!data) return '#dcfce7'; // Light green for no data

    const drift = data.drift_pct;
    const absDrift = Math.abs(drift);

    if (absDrift < 1) {
      // Green baseline
      return '#22c55e';
    } else if (drift > 0) {
      // Republican gains (red)
      if (absDrift < 3) return '#ef4444';
      if (absDrift < 6) return '#dc2626';
      if (absDrift < 10) return '#b91c1c';
      return '#7f1d1d';
    } else {
      // Democratic gains (blue)
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

  const handleMouseOver = (e: React.MouseEvent, countyName: string | null) => {
    if (!countyName) return;
    
    setHoveredCounty(countyName);
    const data = driftData[countyName];
    const tooltipText = data 
      ? `${countyName}: ${getDriftLabel(data.drift_pct)} (2016→${selectedYear})`
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

  const handleCountyClick = (countyName: string | null) => {
    if (countyName && onCountyClick) {
      onCountyClick(countyName);
    }
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
            <span className="text-slate-700 font-semibold">Baseline</span>
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
      <div className="w-full h-screen sm:h-[600px] md:h-[700px] lg:h-screen relative flex items-center justify-center bg-white">
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-slate-600 font-semibold">Loading Georgia map...</p>
          </div>
        ) : (
          <ComposableMap projection="geoAlbersUsa">
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies
                  .filter((geo) => isGeorgia(geo))
                  .map((geo) => {
                    const countyName = getCountyName(geo.id as string);
                    const color = getColor(countyName);
                    const isHovered = hoveredCounty === countyName;

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        style={{
                          default: {
                            fill: color,
                            stroke: isHovered ? '#fbbf24' : '#fff',
                            strokeWidth: isHovered ? 2 : 0.75,
                            outline: 'none',
                            cursor: 'pointer',
                            transition: 'all 150ms',
                          },
                          hover: {
                            fill: color,
                            stroke: '#fbbf24',
                            strokeWidth: 2,
                            outline: 'none',
                            cursor: 'pointer',
                          },
                          pressed: {
                            fill: color,
                            stroke: '#fbbf24',
                            strokeWidth: 2,
                            outline: 'none',
                            cursor: 'pointer',
                          },
                        } as any}
                        onMouseEnter={(e) => handleMouseOver(e as any, countyName)}
                        onMouseLeave={handleMouseOut}
                        onClick={() => handleCountyClick(countyName)}
                      />
                    );
                  })
              }
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
          💚 <strong>Green</strong> = Baseline (2016 starting point) | 
          🔴 <strong>Red</strong> = Republican gains | 
          🔵 <strong>Blue</strong> = Democratic gains
        </p>
      </div>
    </div>
  );
}
