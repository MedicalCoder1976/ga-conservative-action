#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(url, key);

async function seed() {
  try {
    console.log('🌱 Seeding voter drift data...\n');

    // Read migration file
    const migPath = path.join(__dirname, '..', 'supabase/migrations/20261115_voter_drift_expanded_159_counties.sql');
    const sql = fs.readFileSync(migPath, 'utf-8');

    // Parse all INSERT INTO county_voter_statistics
    const inserts = sql.match(/INSERT INTO county_voter_statistics.*?VALUES\s*([\s\S]*?);/g);
    if (!inserts) {
      console.error('No insert statements found');
      process.exit(1);
    }

    let allRecords = [];

    // Parse each INSERT statement
    for (const insert of inserts) {
      // Extract all tuples from this INSERT
      const valuesMatch = insert.match(/VALUES\s*([\s\S]*?)$/);
      if (valuesMatch) {
        const valuesStr = valuesMatch[1];
        // Split by ), ( to get individual records
        const recordStrs = valuesStr.split(/\),\(/);
        
        for (let recordStr of recordStrs) {
          // Clean up the string
          recordStr = recordStr.replace(/^\(/, '').replace(/\);?$/, '');
          
          // Parse the values
          // Format: 'County', year, dem_votes, rep_votes, total_votes, registered
          const matches = recordStr.match(/'([^']+)',\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+)/);
          if (matches) {
            allRecords.push({
              county: matches[1],
              election_year: parseInt(matches[2]),
              democrat_votes: parseInt(matches[3]),
              republican_votes: parseInt(matches[4]),
              total_votes: parseInt(matches[5]),
              registered_voters: parseInt(matches[6])
            });
          }
        }
      }
    }

    console.log(`📊 Parsed ${allRecords.length} county records`);

    // Insert in batches of 50
    const batchSize = 50;
    for (let i = 0; i < allRecords.length; i += batchSize) {
      const batch = allRecords.slice(i, Math.min(i + batchSize, allRecords.length));
      const { error } = await supabase
        .from('county_voter_statistics')
        .insert(batch);

      if (error) {
        console.error(`Batch ${i / batchSize + 1} error:`, error);
      } else {
        console.log(`✅ Batch ${i / batchSize + 1}/${Math.ceil(allRecords.length / batchSize)} inserted`);
      }
    }

    // Now calculate and insert drift
    console.log('\n📈 Calculating drift...');

    const { data: data2016 } = await supabase
      .from('county_voter_statistics')
      .select('*')
      .eq('election_year', 2016);

    const { data: data2024 } = await supabase
      .from('county_voter_statistics')
      .select('*')
      .eq('election_year', 2024);

    if (!data2016 || !data2024) {
      console.error('Missing election data');
      process.exit(1);
    }

    console.log(`📍 Found ${data2016.length} counties in 2016 data`);
    console.log(`📍 Found ${data2024.length} counties in 2024 data`);

    const driftRecords = [];

    for (const r2016 of data2016) {
      const r2024 = data2024.find(r => r.county === r2016.county);
      if (!r2024) continue;

      const dem_base_pct = (r2016.democrat_votes / r2016.total_votes) * 100;
      const rep_base_pct = (r2016.republican_votes / r2016.total_votes) * 100;
      const dem_curr_pct = (r2024.democrat_votes / r2024.total_votes) * 100;
      const rep_curr_pct = (r2024.republican_votes / r2024.total_votes) * 100;

      const dem_drift = dem_curr_pct - dem_base_pct;
      const rep_drift = rep_curr_pct - rep_base_pct;

      let direction = 'neutral';
      if (dem_drift > 0.5) direction = 'blue';
      else if (rep_drift > 0.5) direction = 'red';

      driftRecords.push({
        county: r2016.county,
        dem_baseline_percent: Math.round(dem_base_pct * 10) / 10,
        rep_baseline_percent: Math.round(rep_base_pct * 10) / 10,
        dem_2020_percent: 0,
        rep_2020_percent: 0,
        dem_current_percent: Math.round(dem_curr_pct * 10) / 10,
        rep_current_percent: Math.round(rep_curr_pct * 10) / 10,
        dem_drift_pct: Math.round(dem_drift * 10) / 10,
        rep_drift_pct: Math.round(rep_drift * 10) / 10,
        tilt_score: 0,
        direction,
        momentum_pct: 1.0,
        total_votes_2016: r2016.total_votes,
        total_votes_2024: r2024.total_votes,
        votes_growth_pct: Math.round(((r2024.total_votes - r2016.total_votes) / r2016.total_votes) * 100 * 10) / 10,
        turnout_2016_pct: Math.round((r2016.total_votes / r2016.registered_voters) * 100 * 10) / 10,
        turnout_2024_pct: Math.round((r2024.total_votes / r2024.registered_voters) * 100 * 10) / 10,
        nonvoters_2016: r2016.registered_voters - r2016.total_votes,
        nonvoters_2024: r2024.registered_voters - r2024.total_votes,
        last_updated_year: 2024,
        data_quality: 'real_data'
      });
    }

    console.log(`✨ Calculated drift for ${driftRecords.length} counties`);

    // Insert drift in batches
    for (let i = 0; i < driftRecords.length; i += batchSize) {
      const batch = driftRecords.slice(i, Math.min(i + batchSize, driftRecords.length));
      const { error } = await supabase
        .from('county_drift')
        .insert(batch);

      if (error) {
        console.error(`Drift batch ${i / batchSize + 1} error:`, error);
      } else {
        console.log(`✅ Drift batch ${i / batchSize + 1}/${Math.ceil(driftRecords.length / batchSize)} inserted`);
      }
    }

    // Verify
    console.log('\n✅ Verification:');
    const { data: cobbDrift } = await supabase
      .from('county_drift')
      .select('*')
      .eq('county', 'Cobb')
      .single();

    if (cobbDrift) {
      console.log(`✓ Cobb: ${cobbDrift.dem_baseline_percent}% → ${cobbDrift.dem_current_percent}% (${cobbDrift.dem_drift_pct > 0 ? '+' : ''}${cobbDrift.dem_drift_pct}%)`);
    } else {
      console.log('⚠️  Cobb data not found');
    }

    console.log('✅ Done!\n');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seed();
