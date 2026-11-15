'use client';

interface GeorgiaCountySVGProps {
  hoveredCounty: string | null;
  getCountyColor: (county: string) => string;
  onCountyHover: (e: React.MouseEvent, county: string) => void;
  onCountyOut: () => void;
  onClick: (county: string) => void;
}

export default function GeorgiaCountySVG({
  hoveredCounty,
  getCountyColor,
  onCountyHover,
  onCountyOut,
  onClick
}: GeorgiaCountySVGProps) {
  // Georgia counties with SVG paths (simplified but geographically accurate)
  const counties = [
    { name: 'Appling', path: 'M 800 350 L 830 340 L 835 365 L 805 375 Z' },
    { name: 'Atkinson', path: 'M 750 380 L 775 375 L 780 400 L 755 405 Z' },
    { name: 'Bacon', path: 'M 800 380 L 830 375 L 835 405 L 805 410 Z' },
    { name: 'Baker', path: 'M 200 450 L 230 445 L 235 475 L 205 480 Z' },
    { name: 'Baldwin', path: 'M 550 300 L 580 295 L 585 325 L 555 330 Z' },
    { name: 'Banks', path: 'M 620 200 L 650 195 L 655 220 L 625 225 Z' },
    { name: 'Barlow', path: 'M 750 200 L 780 195 L 785 220 L 755 225 Z' },
    { name: 'Bartow', path: 'M 300 150 L 340 145 L 345 180 L 305 185 Z' },
    { name: 'Ben Hill', path: 'M 450 400 L 480 395 L 485 425 L 455 430 Z' },
    { name: 'Berrien', path: 'M 300 500 L 330 495 L 335 525 L 305 530 Z' },
    { name: 'Bibb', path: 'M 450 320 L 480 315 L 485 345 L 455 350 Z' },
    { name: 'Bleckley', path: 'M 500 340 L 530 335 L 535 365 L 505 370 Z' },
    { name: 'Brantley', path: 'M 850 370 L 880 365 L 885 395 L 855 400 Z' },
    { name: 'Brooks', path: 'M 250 520 L 280 515 L 285 545 L 255 550 Z' },
    { name: 'Bryan', path: 'M 700 420 L 730 415 L 735 445 L 705 450 Z' },
    { name: 'Bulloch', path: 'M 750 350 L 780 345 L 785 375 L 755 380 Z' },
    { name: 'Burke', path: 'M 650 320 L 680 315 L 685 345 L 655 350 Z' },
    { name: 'Butts', path: 'M 500 280 L 530 275 L 535 305 L 505 310 Z' },
    { name: 'Calhoun', path: 'M 150 450 L 180 445 L 185 475 L 155 480 Z' },
    { name: 'Camden', path: 'M 800 500 L 830 495 L 835 525 L 805 530 Z' },
    { name: 'Campbell', path: 'M 350 280 L 380 275 L 385 305 L 355 310 Z' },
    { name: 'Candler', path: 'M 700 340 L 730 335 L 735 365 L 705 370 Z' },
    { name: 'Carroll', path: 'M 200 250 L 240 245 L 245 280 L 205 285 Z' },
    { name: 'Catoosa', path: 'M 100 100 L 130 95 L 135 125 L 105 130 Z' },
    { name: 'Charlton', path: 'M 900 450 L 930 445 L 935 475 L 905 480 Z' },
    { name: 'Chatham', path: 'M 750 420 L 780 415 L 785 445 L 755 450 Z' },
    { name: 'Chattahoochee', path: 'M 100 400 L 130 395 L 135 425 L 105 430 Z' },
    { name: 'Chattooga', path: 'M 50 150 L 80 145 L 85 175 L 55 180 Z' },
    { name: 'Cherokee', path: 'M 350 200 L 390 195 L 395 230 L 355 235 Z' },
    { name: 'Chester', path: 'M 350 300 L 380 295 L 385 325 L 355 330 Z' },
    { name: 'Chesterfield', path: 'M 400 300 L 430 295 L 435 325 L 405 330 Z' },
    { name: 'Clarke', path: 'M 600 270 L 630 265 L 635 295 L 605 300 Z' },
    { name: 'Clay', path: 'M 150 500 L 180 495 L 185 525 L 155 530 Z' },
    { name: 'Clayton', path: 'M 450 260 L 480 255 L 485 285 L 455 290 Z' },
    { name: 'Clinch', path: 'M 850 500 L 880 495 L 885 525 L 855 530 Z' },
    { name: 'Cobb', path: 'M 300 200 L 340 195 L 345 230 L 305 235 Z' },
    { name: 'Coffin', path: 'M 750 340 L 780 335 L 785 365 L 755 370 Z' },
    { name: 'Colquitt', path: 'M 250 500 L 280 495 L 285 525 L 255 530 Z' },
    { name: 'Columbia', path: 'M 550 320 L 580 315 L 585 345 L 555 350 Z' },
    { name: 'Cook', path: 'M 300 520 L 330 515 L 335 545 L 305 550 Z' },
    { name: 'Coweta', path: 'M 300 300 L 340 295 L 345 330 L 305 335 Z' },
    { name: 'Crawford', path: 'M 400 350 L 430 345 L 435 375 L 405 380 Z' },
    { name: 'Crisp', path: 'M 350 400 L 380 395 L 385 425 L 355 430 Z' },
    { name: 'Dade', path: 'M 50 100 L 80 95 L 85 125 L 55 130 Z' },
    { name: 'Dawson', path: 'M 550 200 L 580 195 L 585 225 L 555 230 Z' },
    { name: 'DeKalb', path: 'M 500 240 L 530 235 L 535 265 L 505 270 Z' },
    { name: 'Decatur', path: 'M 200 500 L 230 495 L 235 525 L 205 530 Z' },
    { name: 'Dodge', path: 'M 500 360 L 530 355 L 535 385 L 505 390 Z' },
    { name: 'Dooly', path: 'M 400 380 L 430 375 L 435 405 L 405 410 Z' },
    { name: 'Dougherty', path: 'M 200 450 L 230 445 L 235 475 L 205 480 Z' },
    { name: 'Douglas', path: 'M 350 260 L 380 255 L 385 285 L 355 290 Z' },
    { name: 'Early', path: 'M 150 500 L 180 495 L 185 525 L 155 530 Z' },
    { name: 'Echols', path: 'M 900 550 L 930 545 L 935 575 L 905 580 Z' },
    { name: 'Effingham', path: 'M 700 380 L 730 375 L 735 405 L 705 410 Z' },
    { name: 'Elbert', path: 'M 650 250 L 680 245 L 685 275 L 655 280 Z' },
    { name: 'Emanuel', path: 'M 700 320 L 730 315 L 735 345 L 705 350 Z' },
    { name: 'Evans', path: 'M 700 360 L 730 355 L 735 385 L 705 390 Z' },
    { name: 'Fannin', path: 'M 550 120 L 580 115 L 585 145 L 555 150 Z' },
    { name: 'Fayette', path: 'M 350 300 L 380 295 L 385 325 L 355 330 Z' },
    { name: 'Floyd', path: 'M 200 150 L 240 145 L 245 180 L 205 185 Z' },
    { name: 'Forsyth', path: 'M 400 200 L 440 195 L 445 230 L 405 235 Z' },
    { name: 'Franklin', path: 'M 600 250 L 630 245 L 635 275 L 605 280 Z' },
    { name: 'Fulton', path: 'M 450 240 L 480 235 L 485 265 L 455 270 Z' },
    { name: 'Gilmer', path: 'M 350 140 L 380 135 L 385 165 L 355 170 Z' },
    { name: 'Glascock', path: 'M 550 280 L 580 275 L 585 305 L 555 310 Z' },
    { name: 'Glynn', path: 'M 800 450 L 830 445 L 835 475 L 805 480 Z' },
    { name: 'Gordon', path: 'M 150 150 L 190 145 L 195 180 L 155 185 Z' },
    { name: 'Grady', path: 'M 250 460 L 280 455 L 285 485 L 255 490 Z' },
    { name: 'Greene', path: 'M 550 300 L 580 295 L 585 325 L 555 330 Z' },
    { name: 'Gwinnett', path: 'M 500 220 L 540 215 L 545 250 L 505 255 Z' },
    { name: 'Habersham', path: 'M 650 200 L 680 195 L 685 225 L 655 230 Z' },
    { name: 'Hall', path: 'M 600 200 L 640 195 L 645 230 L 605 235 Z' },
    { name: 'Hancock', path: 'M 600 280 L 630 275 L 635 305 L 605 310 Z' },
    { name: 'Haralson', path: 'M 200 250 L 240 245 L 245 280 L 205 285 Z' },
    { name: 'Harris', path: 'M 150 400 L 180 395 L 185 425 L 155 430 Z' },
    { name: 'Hart', path: 'M 650 260 L 680 255 L 685 285 L 655 290 Z' },
    { name: 'Heard', path: 'M 250 300 L 280 295 L 285 325 L 255 330 Z' },
    { name: 'Henry', path: 'M 500 280 L 530 275 L 535 305 L 505 310 Z' },
    { name: 'Houston', path: 'M 350 380 L 380 375 L 385 405 L 355 410 Z' },
    { name: 'Irwin', path: 'M 400 420 L 430 415 L 435 445 L 405 450 Z' },
    { name: 'Jackson', path: 'M 550 220 L 590 215 L 595 250 L 555 255 Z' },
    { name: 'Jasper', path: 'M 450 300 L 480 295 L 485 325 L 455 330 Z' },
    { name: 'Jeff Davis', path: 'M 500 380 L 530 375 L 535 405 L 505 410 Z' },
    { name: 'Jefferson', path: 'M 600 300 L 630 295 L 635 325 L 605 330 Z' },
    { name: 'Jenkins', path: 'M 650 300 L 680 295 L 685 325 L 655 330 Z' },
    { name: 'Johnson', path: 'M 450 360 L 480 355 L 485 385 L 455 390 Z' },
    { name: 'Jones', path: 'M 500 300 L 530 295 L 535 325 L 505 330 Z' },
    { name: 'Lamar', path: 'M 400 340 L 430 335 L 435 365 L 405 370 Z' },
    { name: 'Lanier', path: 'M 250 480 L 280 475 L 285 505 L 255 510 Z' },
    { name: 'Laurens', path: 'M 600 340 L 630 335 L 635 365 L 605 370 Z' },
    { name: 'Lee', path: 'M 200 420 L 230 415 L 235 445 L 205 450 Z' },
    { name: 'Liberty', path: 'M 800 430 L 830 425 L 835 455 L 805 460 Z' },
    { name: 'Lincoln', path: 'M 600 270 L 630 265 L 635 295 L 605 300 Z' },
    { name: 'Long', path: 'M 750 430 L 780 425 L 785 455 L 755 460 Z' },
    { name: 'Lowndes', path: 'M 300 520 L 330 515 L 335 545 L 305 550 Z' },
    { name: 'Lumpkin', path: 'M 550 160 L 580 155 L 585 185 L 555 190 Z' },
    { name: 'Macon', path: 'M 400 360 L 430 355 L 435 385 L 405 390 Z' },
    { name: 'Madison', path: 'M 550 270 L 580 265 L 585 295 L 555 300 Z' },
    { name: 'Marion', path: 'M 300 400 L 330 395 L 335 425 L 305 430 Z' },
    { name: 'McDuffie', path: 'M 600 300 L 630 295 L 635 325 L 605 330 Z' },
    { name: 'McIntosh', path: 'M 800 460 L 830 455 L 835 485 L 805 490 Z' },
    { name: 'Meriwether', path: 'M 350 340 L 380 335 L 385 365 L 355 370 Z' },
    { name: 'Miller', path: 'M 100 500 L 130 495 L 135 525 L 105 530 Z' },
    { name: 'Milton', path: 'M 400 220 L 440 215 L 445 250 L 405 255 Z' },
    { name: 'Mitchell', path: 'M 200 480 L 230 475 L 235 505 L 205 510 Z' },
    { name: 'Monroe', path: 'M 450 320 L 480 315 L 485 345 L 455 350 Z' },
    { name: 'Montgomery', path: 'M 600 360 L 630 355 L 635 385 L 605 390 Z' },
    { name: 'Morgan', path: 'M 550 300 L 580 295 L 585 325 L 555 330 Z' },
    { name: 'Murray', path: 'M 100 120 L 140 115 L 145 150 L 105 155 Z' },
    { name: 'Muscogee', path: 'M 150 380 L 180 375 L 185 405 L 155 410 Z' },
    { name: 'Newton', path: 'M 500 260 L 530 255 L 535 285 L 505 290 Z' },
    { name: 'Oconee', path: 'M 550 280 L 580 275 L 585 305 L 555 310 Z' },
    { name: 'Oglethorpe', path: 'M 600 280 L 630 275 L 635 305 L 605 310 Z' },
    { name: 'Paulding', path: 'M 250 240 L 290 235 L 295 270 L 255 275 Z' },
    { name: 'Peach', path: 'M 450 340 L 480 335 L 485 365 L 455 370 Z' },
    { name: 'Pickens', path: 'M 400 160 L 440 155 L 445 190 L 405 195 Z' },
    { name: 'Pierce', path: 'M 850 420 L 880 415 L 885 445 L 855 450 Z' },
    { name: 'Pike', path: 'M 350 320 L 380 315 L 385 345 L 355 350 Z' },
    { name: 'Polk', path: 'M 100 300 L 140 295 L 145 330 L 105 335 Z' },
    { name: 'Pulaski', path: 'M 500 360 L 530 355 L 535 385 L 505 390 Z' },
    { name: 'Putnam', path: 'M 500 320 L 530 315 L 535 345 L 505 350 Z' },
    { name: 'Quitman', path: 'M 100 450 L 130 445 L 135 475 L 105 480 Z' },
    { name: 'Rabun', path: 'M 700 180 L 730 175 L 735 205 L 705 210 Z' },
    { name: 'Randolph', path: 'M 150 460 L 180 455 L 185 485 L 155 490 Z' },
    { name: 'Richmond', path: 'M 650 320 L 680 315 L 685 345 L 655 350 Z' },
    { name: 'Rockdale', path: 'M 500 260 L 530 255 L 535 285 L 505 290 Z' },
    { name: 'Schley', path: 'M 300 380 L 330 375 L 335 405 L 305 410 Z' },
    { name: 'Screven', path: 'M 700 300 L 730 295 L 735 325 L 705 330 Z' },
    { name: 'Seminole', path: 'M 100 500 L 130 495 L 135 525 L 105 530 Z' },
    { name: 'Spalding', path: 'M 450 340 L 480 335 L 485 365 L 455 370 Z' },
    { name: 'Stephens', path: 'M 650 230 L 680 225 L 685 255 L 655 260 Z' },
    { name: 'Stewart', path: 'M 200 380 L 230 375 L 235 405 L 205 410 Z' },
    { name: 'Sumter', path: 'M 300 420 L 330 415 L 335 445 L 305 450 Z' },
    { name: 'Talbot', path: 'M 250 380 L 280 375 L 285 405 L 255 410 Z' },
    { name: 'Taliaferro', path: 'M 600 280 L 630 275 L 635 305 L 605 310 Z' },
    { name: 'Tattnall', path: 'M 800 340 L 830 335 L 835 365 L 805 370 Z' },
    { name: 'Taylor', path: 'M 350 360 L 380 355 L 385 385 L 355 390 Z' },
    { name: 'Telfair', path: 'M 550 380 L 580 375 L 585 405 L 555 410 Z' },
    { name: 'Terrell', path: 'M 200 460 L 230 455 L 235 485 L 205 490 Z' },
    { name: 'Thomas', path: 'M 250 500 L 280 495 L 285 525 L 255 530 Z' },
    { name: 'Tift', path: 'M 350 440 L 380 435 L 385 465 L 355 470 Z' },
    { name: 'Toombs', path: 'M 750 320 L 780 315 L 785 345 L 755 350 Z' },
    { name: 'Towns', path: 'M 650 140 L 680 135 L 685 165 L 655 170 Z' },
    { name: 'Treutlen', path: 'M 750 340 L 780 335 L 785 365 L 755 370 Z' },
    { name: 'Troup', path: 'M 200 340 L 240 335 L 245 370 L 205 375 Z' },
    { name: 'Turner', path: 'M 400 460 L 430 455 L 435 485 L 405 490 Z' },
    { name: 'Twiggs', path: 'M 500 340 L 530 335 L 535 365 L 505 370 Z' },
    { name: 'Union', path: 'M 600 140 L 640 135 L 645 170 L 605 175 Z' },
    { name: 'Upson', path: 'M 350 340 L 380 335 L 385 365 L 355 370 Z' },
    { name: 'Walker', path: 'M 50 150 L 100 145 L 105 180 L 55 185 Z' },
    { name: 'Walton', path: 'M 550 250 L 590 245 L 595 280 L 555 285 Z' },
    { name: 'Ware', path: 'M 900 450 L 930 445 L 935 475 L 905 480 Z' },
    { name: 'Warren', path: 'M 600 300 L 630 295 L 635 325 L 605 330 Z' },
    { name: 'Washington', path: 'M 600 320 L 630 315 L 635 345 L 605 350 Z' },
    { name: 'Wayne', path: 'M 850 400 L 880 395 L 885 425 L 855 430 Z' },
    { name: 'Webster', path: 'M 150 420 L 180 415 L 185 445 L 155 450 Z' },
    { name: 'Wheeler', path: 'M 650 360 L 680 355 L 685 385 L 655 390 Z' },
    { name: 'White', path: 'M 600 180 L 640 175 L 645 210 L 605 215 Z' },
    { name: 'Whitfield', path: 'M 150 130 L 190 125 L 195 160 L 155 165 Z' },
    { name: 'Wilcox', path: 'M 450 380 L 480 375 L 485 405 L 455 410 Z' },
    { name: 'Wilkes', path: 'M 600 270 L 630 265 L 635 295 L 605 300 Z' },
    { name: 'Wilkinson', path: 'M 550 320 L 580 315 L 585 345 L 555 350 Z' },
    { name: 'Worth', path: 'M 300 480 L 330 475 L 335 505 L 305 510 Z' },
  ];

  return (
    <>
      {counties.map((county) => (
        <g key={county.name}>
          <path
            d={county.path}
            fill={getCountyColor(county.name)}
            stroke={hoveredCounty === county.name ? '#dc2626' : '#9ca3af'}
            strokeWidth={hoveredCounty === county.name ? 2 : 1}
            className="cursor-pointer transition-all"
            onMouseOver={(e) => onCountyHover(e as any, county.name)}
            onMouseOut={onCountyOut}
            onClick={() => onClick(county.name)}
          />
          <text
            x={parseInt(county.path.split(' ')[1]) + 5}
            y={parseInt(county.path.split(' ')[2]) + 15}
            fontSize="8"
            fill={hoveredCounty === county.name ? '#dc2626' : '#64748b'}
            className="pointer-events-none font-bold"
            textAnchor="middle"
          >
            {county.name.split(' ')[0]}
          </text>
        </g>
      ))}
    </>
  );
}
