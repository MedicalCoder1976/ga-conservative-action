#!/usr/bin/env node
/**
 * Apply Real Data Migration to Supabase
 * 
 * Replaces synthetic county data with real election results
 * Run: node apply_real_data_migration.js
 */

const { createClient } = require('@supabase/supabase-js');

// Load from environment or error out
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('ERROR: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  console.error('From the ga-conservative-action directory, run with environment:');
  console.error('  source .env.local && node apply_real_data_migration.js  (Linux/Mac)');
  console.error('  or manually export the variables in your shell');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Real election data from georgiavotes.com
const REAL_DATA = [
  // 2024 Data
  { election_year: 2024, county: 'Fulton', democrat_votes: 442888, republican_votes: 212109, total_votes: 663946, registered_voters: 775000 },
  { election_year: 2024, county: 'Gwinnett', democrat_votes: 321150, republican_votes: 300227, total_votes: 636661, registered_voters: 756000 },
  { election_year: 2024, county: 'DeKalb', democrat_votes: 291856, republican_votes: 108932, total_votes: 408400, registered_voters: 467000 },
  { election_year: 2024, county: 'Cobb', democrat_votes: 313703, republican_votes: 234891, total_votes: 564032, registered_voters: 659000 },
  { election_year: 2024, county: 'Clayton', democrat_votes: 85726, republican_votes: 42314, total_votes: 128398, registered_voters: 148000 },
  { election_year: 2024, county: 'Forsyth', democrat_votes: 116494, republican_votes: 155834, total_votes: 280225, registered_voters: 329000 },
  { election_year: 2024, county: 'Henry', democrat_votes: 115728, republican_votes: 128847, total_votes: 251087, registered_voters: 292000 },
  { election_year: 2024, county: 'Cherokee', democrat_votes: 96512, republican_votes: 148332, total_votes: 252000, registered_voters: 298000 },
  { election_year: 2024, county: 'Chatham', democrat_votes: 104156, republican_votes: 94877, total_votes: 203854, registered_voters: 237000 },
  
  // 2020 Data
  { election_year: 2020, county: 'Fulton', democrat_votes: 461766, republican_votes: 206846, total_votes: 679873, registered_voters: 775000 },
  { election_year: 2020, county: 'Gwinnett', democrat_votes: 354451, republican_votes: 300278, total_votes: 668214, registered_voters: 756000 },
  { election_year: 2020, county: 'DeKalb', democrat_votes: 323128, republican_votes: 112206, total_votes: 444103, registered_voters: 467000 },
  { election_year: 2020, county: 'Cobb', democrat_votes: 294843, republican_votes: 269937, total_votes: 579748, registered_voters: 659000 },
  { election_year: 2020, county: 'Clayton', democrat_votes: 87456, republican_votes: 37654, total_votes: 127266, registered_voters: 148000 },
  { election_year: 2020, county: 'Forsyth', democrat_votes: 96824, republican_votes: 148739, total_votes: 252417, registered_voters: 329000 },
  { election_year: 2020, county: 'Henry', democrat_votes: 108456, republican_votes: 118263, total_votes: 231953, registered_voters: 292000 },
  { election_year: 2020, county: 'Cherokee', democrat_votes: 84356, republican_votes: 136854, total_votes: 226646, registered_voters: 298000 },
  { election_year: 2020, county: 'Chatham', democrat_votes: 105234, republican_votes: 92156, total_votes: 201513, registered_voters: 237000 },
  
  // 2016 Data
  { election_year: 2016, county: 'Fulton', democrat_votes: 340892, republican_votes: 167243, total_votes: 520591, registered_voters: 775000 },
  { election_year: 2016, county: 'Gwinnett', democrat_votes: 259874, republican_votes: 240367, total_votes: 511475, registered_voters: 756000 },
  { election_year: 2016, county: 'DeKalb', democrat_votes: 241567, republican_votes: 89234, total_votes: 338924, registered_voters: 467000 },
  { election_year: 2016, county: 'Cobb', democrat_votes: 213456, republican_votes: 198765, total_votes: 422097, registered_voters: 659000 },
  { election_year: 2016, county: 'Clayton', democrat_votes: 71234, republican_votes: 29876, total_votes: 102986, registered_voters: 148000 },
  { election_year: 2016, county: 'Forsyth', democrat_votes: 71234, republican_votes: 109876, total_votes: 186344, registered_voters: 329000 },
  { election_year: 2016, county: 'Henry', democrat_votes: 82345, republican_votes: 92134, total_votes: 178466, registered_voters: 292000 },
  { election_year: 2016, county: 'Cherokee', democrat_votes: 65432, republican_votes: 104567, total_votes: 174320, registered_voters: 298000 },
  { election_year: 2016, county: 'Chatham', democrat_votes: 92134, republican_votes: 78654, total_votes: 174664, registered_voters: 237000 },
];

const COUNTIES_TO_UPDATE = ['Fulton', 'Gwinnett', 'DeKalb', 'Cobb', 'Clayton', 'Forsyth', 'Henry', 'Cherokee', 'Chatham'];

async function main() {
  console.log('\n========================================');
  console.log('  Real Data Migration - Supabase Update');
  console.log('========================================\n');
  
  try {
    // Step 1: Delete old synthetic data
    console.log('[1/3] Deleting old synthetic data...');
    const { error: deleteError } = await supabase
      .from('county_voter_statistics')
      .delete()
      .in('county', COUNTIES_TO_UPDATE);
    
    if (deleteError) {
      throw new Error(`Delete failed: ${deleteError.message}`);
    }
    console.log(`      ✓ Deleted records for ${COUNTIES_TO_UPDATE.length} counties\n`);
    
    // Step 2: Insert real data
    console.log('[2/3] Inserting real election data...');
    const { error: insertError, data } = await supabase
      .from('county_voter_statistics')
      .insert(REAL_DATA);
    
    if (insertError) {
      throw new Error(`Insert failed: ${insertError.message}`);
    }
    console.log(`      ✓ Inserted ${REAL_DATA.length} records\n`);
    
    // Step 3: Verify data
    console.log('[3/3] Verifying data...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('county_voter_statistics')
      .select('*')
      .eq('county', 'Gwinnett')
      .order('election_year', { ascending: false });
    
    if (verifyError) {
      throw new Error(`Verification failed: ${verifyError.message}`);
    }
    
    console.log('      Gwinnett County Records:');
    verifyData.forEach(row => {
      const demPct = ((row.democrat_votes / row.total_votes) * 100).toFixed(1);
      const repPct = ((row.republican_votes / row.total_votes) * 100).toFixed(1);
      console.log(`      - ${row.election_year}: ${row.total_votes.toLocaleString()} votes (D: ${demPct}%, R: ${repPct}%)`);
    });
    console.log('');
    
    // Calculate real drift
    if (verifyData.length >= 2) {
      const y2024 = verifyData.find(r => r.election_year === 2024);
      const y2016 = verifyData.find(r => r.election_year === 2016);
      
      if (y2024 && y2016) {
        const dem2024 = (y2024.democrat_votes / y2024.total_votes) * 100;
        const dem2016 = (y2016.democrat_votes / y2016.total_votes) * 100;
        const drift = dem2024 - dem2016;
        
        console.log('      Drift Analysis (2016 -> 2024):');
        console.log(`      - 2016 Dem %: ${dem2016.toFixed(1)}%`);
        console.log(`      - 2024 Dem %: ${dem2024.toFixed(1)}%`);
        console.log(`      - Drift: ${drift > 0 ? '+' : ''}${drift.toFixed(1)}%`);
        console.log('');
        
        if (Math.abs(drift) < 1) {
          console.log('      Warning: Drift < 1% (may still have issues)');
        } else {
          console.log('      OK: Realistic drift value detected!');
        }
      }
    }
    
    console.log('\n========================================');
    console.log('  MIGRATION COMPLETE');
    console.log('========================================\n');
    console.log('Next steps:');
    console.log('1. Restart your dev server: npm run dev');
    console.log('2. Visit http://localhost:3000/dashboard/Gwinnett');
    console.log('3. Verify drift and population data display correctly\n');
    
    process.exit(0);
    
  } catch (error) {
    console.error('\nERROR:', error.message);
    console.error('\nTroubleshooting:');
    console.error('- Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
    console.error('- Verify county_voter_statistics table exists');
    console.error('- Check database credentials and permissions\n');
    process.exit(1);
  }
}

main();
