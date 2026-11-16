#!/usr/bin/env node
/**
 * Check county name mismatches between database and constant
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Import the constant from TypeScript
const GEORGIA_COUNTIES = [
  'Appling',
  'Atkinson',
  'Bacon',
  'Baker',
  'Baldwin',
  'Banks',
  'Barrow',
  'Bartow',
  'Ben Hill',
  'Berrien',
  'Bibb',
  'Bleckley',
  'Brantley',
  'Brooks',
  'Bryan',
  'Bulloch',
  'Burke',
  'Butts',
  'Calhoun',
  'Camden',
  'Campbell',
  'Candler',
  'Carroll',
  'Catoosa',
  'Charlton',
  'Chatham',
  'Chattahoochee',
  'Chattooga',
  'Cherokee',
  'Cherry',
  'Clarke',
  'Clay',
  'Clayton',
  'Clinch',
  'Cobb',
  'Coffee',
  'Colquitt',
  'Columbia',
  'Cook',
  'Coweta',
  'Crawford',
  'Crisp',
  'Dade',
  'Dawson',
  'Decatur',
  'DeKalb',
  'Dodge',
  'Dooly',
  'Dougherty',
  'Douglas',
  'Down',
  'Ware',
  'Warren',
  'Washington',
  'Wayne',
  'Webster',
  'Wheeler',
  'White',
  'Whitfield',
  'Wilcox',
  'Wilkes',
  'Wilkinson',
  'Worth',
  'Echols',
  'Effingham',
  'Elbert',
  'Emanuel',
  'Evans',
  'Fannin',
  'Fayette',
  'Fern',
  'Floyd',
  'Forsyth',
  'Franklin',
  'Fulton',
  'Gilmer',
  'Glascock',
  'Glynn',
  'Gordon',
  'Grady',
  'Greene',
  'Gwinnett',
  'Habersham',
  'Hall',
  'Hancock',
  'Haralson',
  'Harris',
  'Hart',
  'Heard',
  'Henry',
  'Houston',
  'Irwin',
  'Jackson',
  'Jasper',
  'Jeff Davis',
  'Jefferson',
  'Jenkins',
  'Johnson',
  'Jones',
  'Lamar',
  'Lanier',
  'Laurens',
  'Lee',
  'Liberty',
  'Lincoln',
  'Long',
  'Lowndes',
  'Lumpkin',
  'Macon',
  'Madison',
  'Marion',
  'McDuffie',
  'McIntosh',
  'Meriwether',
  'Miller',
  'Milton',
  'Mitchell',
  'Monroe',
  'Montgomery',
  'Morgan',
  'Murray',
  'Muscogee',
  'Newton',
  'Oconee',
  'Oglethorpe',
  'Okeechobee',
  'Paulding',
  'Peach',
  'Pickens',
  'Pierce',
  'Pike',
  'Polk',
  'Pulaski',
  'Putnam',
  'Quitman',
  'Rabun',
  'Randolph',
  'Richmond',
  'Rockdale',
  'Schley',
  'Screven',
  'Seminole',
  'Spalding',
  'Stephens',
  'Stewart',
  'Sumter',
  'Talbot',
  'Taliaferro',
  'Tattnall',
  'Taylor',
  'Telfair',
  'Terrell',
  'Thomas',
  'Tift',
  'Toombs',
  'Towns',
  'Treutlen',
  'Troup',
  'Turner',
  'Twiggs',
  'Union',
  'Upson',
  'Uvalde',
];

async function findMismatches() {
  console.log('🔍 Checking county name mismatches\n');

  const { data: dbCounties } = await supabase
    .from('county_voter_statistics')
    .select('county')
    .eq('election_year', 2026);

  if (!dbCounties) {
    console.log('❌ No data found');
    return;
  }

  const dbCountyNames = new Set(dbCounties.map(row => row.county));
  const constantCountyNames = new Set(GEORGIA_COUNTIES);

  console.log(`📊 Database counties: ${dbCountyNames.size}`);
  console.log(`📊 Constant counties: ${constantCountyNames.size}\n`);

  // Find mismatches
  const inConstantNotInDB = Array.from(constantCountyNames).filter(c => !dbCountyNames.has(c));
  const inDBNotInConstant = Array.from(dbCountyNames).filter(c => !constantCountyNames.has(c));

  if (inConstantNotInDB.length > 0) {
    console.log('❌ In CONSTANT but NOT in DATABASE:');
    inConstantNotInDB.forEach(c => console.log(`   - ${c}`));
  }

  if (inDBNotInConstant.length > 0) {
    console.log('\n✅ In DATABASE but NOT in constant (REAL GEORGIA COUNTIES):');
    inDBNotInConstant.forEach(c => console.log(`   + ${c}`));
  }

  if (inConstantNotInDB.length === 0 && inDBNotInConstant.length === 0) {
    console.log('✅ All counties match perfectly!');
  } else {
    console.log('\n' + '='.repeat(50));
    console.log('🔴 ROOT CAUSE: County name mismatch');
    console.log('\nFIX: Update GEORGIA_COUNTIES in src/lib/constants/georgia-counties.ts');
    console.log('Remove these non-Georgia counties:');
    inConstantNotInDB.forEach(c => console.log(`  - ${c}`));
    console.log('\nAdd these real Georgia counties:');
    inDBNotInConstant.forEach(c => console.log(`  + ${c}`));
  }
}

findMismatches().then(() => process.exit(0));
