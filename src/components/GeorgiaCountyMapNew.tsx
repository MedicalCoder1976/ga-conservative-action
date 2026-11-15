'use client';

import { useState, useMemo } from 'react';

// All 159 Georgia counties
const GEORGIA_COUNTIES = [
  "Appling","Atkinson","Bacon","Baker","Baldwin","Banks","Barrow","Bartow","Ben Hill","Berrien",
  "Bibb","Bleckley","Brantley","Brooks","Bryan","Bulloch","Burke","Butts","Calhoun","Camden",
  "Candler","Carroll","Catoosa","Charlton","Chatham","Chattahoochee","Chattooga","Cherokee","Clarke","Clay",
  "Clayton","Clinch","Cobb","Coffee","Colquitt","Columbia","Cook","Coweta","Crawford","Crisp",
  "Dade","Dawson","Decatur","DeKalb","Dodge","Dooly","Dougherty","Douglas","Early","Echols",
  "Effingham","Elbert","Emanuel","Evans","Fannin","Fayette","Floyd","Forsyth","Franklin","Fulton",
  "Gilmer","Glascock","Glynn","Gordon","Grady","Greene","Gwinnett","Habersham","Hall","Hancock",
  "Haralson","Harris","Hart","Heard","Henry","Houston","Irwin","Jackson","Jasper","Jeff Davis",
  "Jefferson","Jenkins","Johnson","Jones","Lamar","Lanier","Laurens","Lee","Liberty","Lincoln",
  "Long","Lowndes","Lumpkin","Macon","Madison","Marion","McDuffie","McIntosh","Meriwether","Miller",
  "Mitchell","Monroe","Montgomery","Morgan","Murray","Muscogee","Newton","Oconee","Oglethorpe","Paulding",
  "Peach","Pickens","Pierce","Pike","Polk","Pulaski","Putnam","Quitman","Rabun","Randolph",
  "Richmond","Rockdale","Schley","Screven","Seminole","Spalding","Stephens","Stewart","Sumter","Talbot",
  "Taliaferro","Tattnall","Taylor","Telfair","Terrell","Thomas","Tift","Toombs","Towns","Treutlen",
  "Troup","Turner","Twiggs","Union","Upson","Walker","Walton","Ware","Warren","Washington",
  "Wayne","Webster","Wheeler","White","Whitfield","Wilcox","Wilkes","Wilkinson","Worth"
];

// Rough geographic positioning (x, y) for a visual grid that roughly matches Georgia shape
// These are approximate for a demo map. Replace with real SVG paths for production.
const COUNTY_POSITIONS: Record<string, { x: number; y: number }> = {
  // North Georgia
  Dade: { x: 40, y: 30 }, Walker: { x: 80, y: 25 }, Catoosa: { x: 120, y: 20 }, Whitfield: { x: 160, y: 25 },
  Murray: { x: 200, y: 30 }, Fannin: { x: 240, y: 20 }, Union: { x: 280, y: 15 }, Towns: { x: 320, y: 20 },
  Rabun: { x: 360, y: 25 }, Gilmer: { x: 200, y: 60 }, Pickens: { x: 160, y: 70 }, Cherokee: { x: 120, y: 80 },
  Forsyth: { x: 140, y: 110 }, Hall: { x: 200, y: 100 }, Habersham: { x: 280, y: 70 }, White: { x: 240, y: 80 },
  Lumpkin: { x: 200, y: 90 }, Dawson: { x: 160, y: 100 },
  // Metro Atlanta
  Cobb: { x: 100, y: 140 }, Fulton: { x: 140, y: 160 }, DeKalb: { x: 180, y: 160 }, Gwinnett: { x: 200, y: 140 },
  Clayton: { x: 140, y: 200 }, Henry: { x: 180, y: 200 }, Rockdale: { x: 220, y: 180 }, Newton: { x: 220, y: 210 },
  Douglas: { x: 80, y: 170 }, Paulding: { x: 80, y: 120 }, Bartow: { x: 100, y: 100 },
  // South & other major
  Chatham: { x: 340, y: 280 }, Glynn: { x: 320, y: 340 }, Lowndes: { x: 200, y: 380 }, Muscogee: { x: 60, y: 220 },
  Richmond: { x: 300, y: 200 }, Bibb: { x: 180, y: 240 }, Dougherty: { x: 120, y: 340 },
};

type CountyScore = Record<string, number>;

interface GeorgiaMapProps {
  isLoggedIn?: boolean;
  countyScores?: CountyScore;
  onCountyClick?: (county: string) => void;
}

export default function GeorgiaCountyMap({ 
  isLoggedIn = false, 
  countyScores = {}, 
  onCountyClick 
}: GeorgiaMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  const getCountyColor = (county: string) => {
    if (!isLoggedIn) return '#e5e7eb'; // gray
    const score = countyScores[county] || 0;
    if (score === 0) return '#3b82f6'; // blue
    // Shift from blue toward red based on score
    const intensity = Math.min(1, score / 100);
    const r = Math.round(59 + (220 - 59) * intensity);
    const g = Math.round(130 * (1 - intensity));
    const b = Math.round(246 * (1 - intensity));
    return `rgb(${r},${g},${b})`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <svg 
        viewBox="0 0 420 450" 
        className="w-full h-auto border border-gray-200 rounded-lg bg-slate-50"
        style={{ maxHeight: '70vh' }}
      >
        {/* Georgia outline background */}
        <rect x="0" y="0" width="420" height="450" fill="#f8fafc" />
        
        {/* Counties as positioned circles/rects for visual map */}
        {GEORGIA_COUNTIES.map((county) => {
          const pos = COUNTY_POSITIONS[county] || { 
            x: 40 + (GEORGIA_COUNTIES.indexOf(county) % 15) * 24, 
            y: 40 + Math.floor(GEORGIA_COUNTIES.indexOf(county) / 15) * 22 
          };
          const isHovered = hovered === county;
          const score = countyScores[county] || 0;
          
          return (
            <g key={county}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isHovered ? 10 : 8}
                fill={getCountyColor(county)}
                stroke="#fff"
                strokeWidth="1"
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHovered(county)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onCountyClick?.(county)}
              />
              {isHovered && (
                <text
                  x={pos.x}
                  y={pos.y - 14}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#1f2937"
                  fontWeight="600"
                >
                  {county} ({score})
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {hovered && (
        <div className="mt-2 text-center text-sm text-gray-600">
          {hovered} County — Score: {countyScores[hovered] || 0}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-2 text-center">
        Interactive Georgia map. Click a county. Gray = not logged in. Blue = logged in. Red = activity.
      </p>
    </div>
  );
}

// Usage example:
// <GeorgiaCountyMap 
//   isLoggedIn={true} 
//   countyScores={{ Fulton: 45, Gwinnett: 12, Cobb: 80 }} 
//   onCountyClick={(county) => router.push(`/dashboard/${county}`)} 
// />
