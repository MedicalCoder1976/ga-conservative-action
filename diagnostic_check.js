#!/usr/bin/env node
/**
 * Diagnostic script to check voter drift map issue
 * Tests if Supabase has the required election data
 */

const fs = require('fs');
const path = require('path');

// Load environment
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function runDiagnostics() {
  console.log('🔍 VOTER DRIFT MAP DIAGNOSIS\n');
  console.log('='.repeat(50));

  try {
    // Test 1: Check if 2016 baseline data exists
    console.log('\n1️⃣  Checking 2016 baseline data...');
    const { data: data2016, error: err2016 } = await supabase
      .from('county_voter_statistics')
      .select('county, election_year, democrat_votes, republican_votes, total_votes')
      .eq('election_year', 2016);

    if (err2016) {
      console.error('   ❌ Error:', err2016.message);
    } else if (!data2016 || data2016.length === 0) {
      console.log('   ❌ NO 2016 DATA FOUND');
      console.log('   Expected: 159 counties, Got: 0 rows');
    } else {
      console.log(`   ✅ Found 2016 data: ${data2016.length} rows`);
      console.log(`   Sample: ${data2016[0].county}`);
    }

    // Test 2: Check if 2026 data exists
    console.log('\n2️⃣  Checking 2026 election data...');
    const { data: data2026, error: err2026 } = await supabase
      .from('county_voter_statistics')
      .select('county, election_year, democrat_votes, republican_votes, total_votes')
      .eq('election_year', 2026);

    if (err2026) {
      console.error('   ❌ Error:', err2026.message);
    } else if (!data2026 || data2026.length === 0) {
      console.log('   ❌ NO 2026 DATA FOUND');
      console.log('   Expected: 159 counties, Got: 0 rows');
    } else {
      console.log(`   ✅ Found 2026 data: ${data2026.length} rows`);
      console.log(`   Sample: ${data2026[0].county}`);
    }

    // Test 3: Check for other election years
    console.log('\n3️⃣  Checking all available election years...');
    const { data: allYears, error: errYears } = await supabase
      .from('county_voter_statistics')
      .select('election_year', { count: 'exact' });

    if (errYears) {
      console.error('   ❌ Error:', errYears.message);
    } else if (!allYears || allYears.length === 0) {
      console.log('   ❌ NO ELECTION YEARS FOUND - Table is empty!');
    } else {
      const years = [...new Set(allYears.map(r => r.election_year))].sort((a, b) => a - b);
      console.log(`   ✅ Available years: ${years.join(', ')}`);
    }

    // Test 4: Sample drift calculation
    if (data2016 && data2016.length > 0 && data2026 && data2026.length > 0) {
      console.log('\n4️⃣  Testing drift calculation...');
      const baseline2016 = new Map();
      const current2026 = new Map();

      data2016.forEach(row => {
        baseline2016.set(row.county, {
          dem: row.democrat_votes,
          rep: row.republican_votes,
          total: row.total_votes
        });
      });

      data2026.forEach(row => {
        current2026.set(row.county, {
          dem: row.democrat_votes,
          rep: row.republican_votes,
          total: row.total_votes
        });
      });

      let calculatedCount = 0;
      let sampleDrifts = [];

      for (const county of baseline2016.keys()) {
        const baseline = baseline2016.get(county);
        const current = current2026.get(county);

        if (baseline && current) {
          const baselineRepPct = (baseline.rep / baseline.total) * 100;
          const currentRepPct = (current.rep / current.total) * 100;
          const drift = currentRepPct - baselineRepPct;

          calculatedCount++;
          if (sampleDrifts.length < 5) {
            sampleDrifts.push({ county, drift: drift.toFixed(2) });
          }
        }
      }

      console.log(`   ✅ Successfully calculated drift for ${calculatedCount} counties`);
      console.log('   Sample drifts:');
      sampleDrifts.forEach(({ county, drift }) => {
        const direction = drift > 0 ? 'R+' : drift < 0 ? 'D+' : '';
        console.log(`      ${county}: ${direction}${Math.abs(drift)}%`);
      });
    }

    // Test 5: Check table structure
    console.log('\n5️⃣  Checking table schema...');
    const { data: tables, error: errTables } = await supabase
      .rpc('get_table_columns', { p_table_name: 'county_voter_statistics' })
      .catch(() => ({ data: null, error: { message: 'RPC not available' } }));

    if (!errTables && tables) {
      console.log('   ✅ Table structure verified');
    } else {
      console.log('   ⚠️  Could not verify table structure');
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 DIAGNOSIS SUMMARY:\n');

    if ((!data2016 || data2016.length === 0) && (!data2026 || data2026.length === 0)) {
      console.log('🔴 ROOT CAUSE: Database is empty');
      console.log('   The county_voter_statistics table has no data at all.');
      console.log('   NEXT STEP: Run the INSERT_2026_ELECTION_DATA.sql file in Supabase');
    } else if (!data2016 || data2016.length === 0) {
      console.log('🔴 ROOT CAUSE: Missing 2016 baseline data');
      console.log('   The component requires 2016 data to calculate drift.');
      console.log('   It compares 2016 baseline against selected year.');
      console.log('   NEXT STEP: Need to insert 2016 baseline election data');
    } else if (!data2026 || data2026.length === 0) {
      console.log('🟡 PARTIAL: 2016 data exists, but 2026 data missing');
      console.log('   The component can display drift for other years if they exist.');
      console.log('   NEXT STEP: Run INSERT_2026_ELECTION_DATA.sql for 2026 data');
    } else {
      console.log('✅ All data present');
      console.log('   Both 2016 baseline and 2026 current data are in the database.');
      console.log('   ISSUE IS NOT DATA - must be in the component logic or mapping');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }

  process.exit(0);
}

runDiagnostics();
