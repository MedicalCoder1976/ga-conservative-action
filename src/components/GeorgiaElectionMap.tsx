'use client';

import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

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

interface ElectionData {
  county: string;
  republican_votes: number;
  democrat_votes: number;
  republican_pct: number;
  democrat_pct: number;
}

const ELECTIONS = [
  { year: 2026, label: '2026 (Most Recent)' },
  { year: 2024, label: '2024' },
  { year: 2022, label: '2022' },
  { year: 2020, label: '2020' },
  { year: 2018, label: '2018' },
  { year: 2016, label: '2016' },
];

export default function GeorgiaElectionMap({ 
  onCountyClick 
}: {
  onCountyClick?: (county: string) => void;
}) {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [electionData, setElectionData] = useState<Record<string, ElectionData>>({});
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch election data from Supabase
  useEffect(() => {
    const fetchElectionData = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('election_results')
          .select('county, republican_votes, democrat_votes, republican_pct, democrat_pct, year')
          .eq('year', selectedYear)
          .eq('race', 'Governor');

        if (error) {
          console.error('Error fetching election data:', error);
          setElectionData({});
        } else {
          const dataMap: Record<string, ElectionData> = {};
          data?.forEach((row: any) => {
            dataMap[row.county] = {
              county: row.county,
              republican_votes: row.republican_votes || 0,
              democrat_votes: row.democrat_votes || 0,
              republican_pct: row.republican_pct || 0,
              democrat_pct: row.democrat_pct || 0,
            };
          });
          setElectionData(dataMap);
        }
      } catch (err) {
        console.error('Error:', err);
        setElectionData({});
      } finally {
        setLoading(false);
      }
    };

    fetchElectionData();
  }, [selectedYear]);

  const getCountyName = (fips: string) => {
    return FIPS_TO_COUNTY[fips] || null;
  };

  const getColor = (countyName: string | null) => {
    if (!countyName) return '#e5e7eb';
    
    const data = electionData[countyName];
    if (!data) return '#e5e7eb'; // Gray for no data
    
    const repPct = data.republican_pct || 0;
    const demPct = data.democrat_pct || 0;

    if (repPct > demPct) {
      // Republican - red
      const intensity = Math.min(100, (repPct - demPct) * 2.5);
      const r = Math.round(220 + Math.max(0, 35 - intensity));
      const g = Math.round(53 - Math.min(53, intensity / 2));
      const b = Math.round(53 - Math.min(53, intensity / 2));
      return `rgb(${r},${g},${b})`;
    } else {
      // Democrat - blue
      const intensity = Math.min(100, (demPct - repPct) * 2.5);
      const r = Math.round(59 - Math.min(59, intensity / 2));
      const g = Math.round(130 - Math.min(130, intensity / 3));
      const b = Math.round(246);
      return `rgb(${r},${g},${b})`;
    }
  };

  const handleMouseOver = (e: React.MouseEvent, countyName: string | null) => {
    if (!countyName) return;
    
    setHoveredCounty(countyName);
    const data = electionData[countyName];
    const tooltipText = data 
      ? `${countyName}: R ${data.republican_pct?.toFixed(1)}% (${data.republican_votes?.toLocaleString()}) vs D ${data.democrat_pct?.toFixed(1)}% (${data.democrat_votes?.toLocaleString()})`
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
    <div className="w-full flex flex-col items-center justify-center bg-white rounded-lg border-2 border-red-600 overflow-hidden">
      {/* Year Selector */}
      <div className="w-full bg-gradient-to-r from-red-50 to-white border-b border-red-200 px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-900">Select Election Year:</h3>
          <div className="flex flex-wrap gap-2">
            {ELECTIONS.map(({ year, label }) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedYear === year
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-white border-2 border-red-600 text-red-600 hover:bg-red-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="w-full h-96 md:h-[500px] relative flex items-center justify-center bg-white">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-slate-600 font-semibold">Loading election data for {selectedYear}...</p>
            </div>
          </div>
        ) : (
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
                    const fipsCode = geo.id?.toString().padStart(5, '0');
                    const name = getCountyName(fipsCode);
                    
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={getColor(name)}
                        stroke="#fff"
                        strokeWidth={hoveredCounty === name ? 1.5 : 0.75}
                        onClick={() => name && onCountyClick?.(name)}
                        onMouseEnter={(e: React.MouseEvent) => handleMouseOver(e, name)}
                        onMouseLeave={handleMouseOut}
                        style={{
                          default: { 
                            outline: 'none',
                            cursor: name ? 'pointer' : 'default',
                            transition: 'all 0.2s'
                          },
                          hover: { 
                            outline: 'none', 
                            cursor: name ? 'pointer' : 'default',
                            filter: 'brightness(1.15)',
                            strokeWidth: 2
                          },
                          pressed: { outline: 'none' },
                        } as any}
                      />
                    );
                  })
              }
            </Geographies>
          </ComposableMap>
        )}

        {/* Tooltip */}
        {tooltip && (
          <div 
            className="fixed bg-slate-900 text-white px-4 py-3 rounded-lg text-xs font-semibold pointer-events-none z-50 max-w-xs shadow-lg"
            style={{
              left: `${Math.min(tooltip.x, window.innerWidth - 300)}px`,
              top: `${tooltip.y - 40}px`,
            }}
          >
            {tooltip.text}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="w-full bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex flex-wrap gap-8 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 border-2 border-red-700 rounded"></div>
            <div>
              <p className="text-sm font-bold text-slate-900">Republican Win</p>
              <p className="text-xs text-slate-600">R &gt; D</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 border-2 border-blue-700 rounded"></div>
            <div>
              <p className="text-sm font-bold text-slate-900">Democrat Win</p>
              <p className="text-xs text-slate-600">D &gt; R</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-300 border-2 border-gray-400 rounded"></div>
            <div>
              <p className="text-sm font-bold text-slate-900">No Data</p>
              <p className="text-xs text-slate-600">Not available</p>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-slate-600 mt-4">
          📍 Darker color = wider victory margin | Click a county for details | Data source: Georgia Secretary of State
        </p>
      </div>
    </div>
  );
}
