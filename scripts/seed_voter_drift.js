#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('❌ Missing SUPABASE environment variables');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', url ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', serviceKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function executeSql(sql) {
  const { data, error } = await supabase.rpc('exec_sql_internal', {
    sql_command: sql
  }).catch(() => null);

  if (!data && error) {
    // Try direct query execution for specific queries
    return null;
  }
  return { data, error };
}

async function seedData() {
  try {
    console.log('🌱 Starting data seeding process...\n');

    // Step 1: Check if data already exists
    console.log('1️⃣  Checking existing data...');
    const { data: existingData, error: checkError } = await supabase
      .from('county_voter_statistics')
      .select('county')
      .eq('election_year', 2016)
      .limit(1);

    if (!checkError && existingData && existingData.length > 0) {
      console.log('   ✓ Voter statistics table already has data');
      
      const { data: driftData } = await supabase
        .from('county_drift')
        .select('county')
        .limit(1);

      if (driftData && driftData.length > 0) {
        console.log('   ✓ Drift table already populated');
        console.log('\n✅ Data already seeded. No action needed.\n');
        process.exit(0);
      }
    }

    // Step 2: Read migration file
    console.log('\n2️⃣  Reading migration file...');
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20261115_voter_drift_expanded_159_counties.sql');
    
    if (!fs.existsSync(migrationPath)) {
      console.error(`   ❌ Migration file not found: ${migrationPath}`);
      process.exit(1);
    }

    let sqlContent = fs.readFileSync(migrationPath, 'utf-8');
    console.log(`   ✓ Read migration file (${sqlContent.length} bytes)`);

    // Step 3: Extract INSERT statements for voter statistics
    console.log('\n3️⃣  Parsing INSERT statements...');
    
    // Extract all INSERT statements
    const insertMatches = sqlContent.match(/INSERT INTO county_voter_statistics.*?;/gs);
    if (!insertMatches) {
      console.error('   ❌ No INSERT statements found in migration file');
      process.exit(1);
    }

    console.log(`   ✓ Found ${insertMatches.length} INSERT statements`);

    // Step 4: Extract INSERT statements for drift
    const driftMatches = sqlContent.match(/INSERT INTO county_drift.*?;/gs);
    
    // Step 5: Collect all data to insert
    console.log('\n4️⃣  Extracting data from INSERT statements...');
    
    let countyRecords = [];
    for (const insert of insertMatches) {
      // Parse VALUES clauses
      const valueMatches = insert.match(/VALUES\s*\((.*?)\)/gs);
      if (valueMatches) {
        for (const valueLine of valueMatches) {
          const matches = valueLine.match(/\('([^']+)',\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)/);
          if (matches) {
            countyRecords.push({
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

    console.log(`   ✓ Parsed ${countyRecords.length} county records`);

    // Step 6: Insert data in batches
    console.log('\n5️⃣  Inserting voter statistics data...');
    const batchSize = 100;
    for (let i = 0; i < countyRecords.length; i += batchSize) {
      const batch = countyRecords.slice(i, Math.min(i + batchSize, countyRecords.length));
      const { error } = await supabase
        .from('county_voter_statistics')
        .insert(batch, { onConflict: 'county,election_year' });

      if (error) {
        console.error(`   ❌ Batch ${i / batchSize + 1} failed:`, error);
      } else {
        console.log(`   ✓ Inserted batch ${i / batchSize + 1}/${Math.ceil(countyRecords.length / batchSize)}`);
      }
    }

    // Step 7: Run drift calculation
    console.log('\n6️⃣  Calculating drift data...');
    
    const driftSql = `
    DELETE FROM county_drift WHERE county IS NOT NULL;

    INSERT INTO county_drift (
      county, dem_baseline_percent, rep_baseline_percent, 
      dem_2020_percent, rep_2020_percent,
      dem_current_percent, rep_current_percent, 
      dem_drift_pct, rep_drift_pct, tilt_score,
      direction, momentum_pct, 
      total_votes_2016, total_votes_2024, votes_growth_pct,
      turnout_2016_pct, turnout_2024_pct, 
      nonvoters_2016, nonvoters_2024,
      last_updated_year, data_quality
    )
    SELECT 
      t16.county,
      ROUND(CAST(t16.democrat_votes AS NUMERIC) * 100 / CAST(t16.total_votes AS NUMERIC), 1),
      ROUND(CAST(t16.republican_votes AS NUMERIC) * 100 / CAST(t16.total_votes AS NUMERIC), 1),
      COALESCE(ROUND(CAST(t20.democrat_votes AS NUMERIC) * 100 / CAST(t20.total_votes AS NUMERIC), 1), 0),
      COALESCE(ROUND(CAST(t20.republican_votes AS NUMERIC) * 100 / CAST(t20.total_votes AS NUMERIC), 1), 0),
      ROUND(CAST(t24.democrat_votes AS NUMERIC) * 100 / CAST(t24.total_votes AS NUMERIC), 1),
      ROUND(CAST(t24.republican_votes AS NUMERIC) * 100 / CAST(t24.total_votes AS NUMERIC), 1),
      ROUND(CAST(t24.democrat_votes AS NUMERIC) * 100 / CAST(t24.total_votes AS NUMERIC), 1) - 
        ROUND(CAST(t16.democrat_votes AS NUMERIC) * 100 / CAST(t16.total_votes AS NUMERIC), 1),
      ROUND(CAST(t24.republican_votes AS NUMERIC) * 100 / CAST(t24.total_votes AS NUMERIC), 1) - 
        ROUND(CAST(t16.republican_votes AS NUMERIC) * 100 / CAST(t16.total_votes AS NUMERIC), 1),
      0,
      CASE 
        WHEN ROUND(CAST(t24.democrat_votes AS NUMERIC) * 100 / CAST(t24.total_votes AS NUMERIC), 1) - 
             ROUND(CAST(t16.democrat_votes AS NUMERIC) * 100 / CAST(t16.total_votes AS NUMERIC), 1) > 0.5 THEN 'blue'
        WHEN ROUND(CAST(t24.republican_votes AS NUMERIC) * 100 / CAST(t24.total_votes AS NUMERIC), 1) - 
             ROUND(CAST(t16.republican_votes AS NUMERIC) * 100 / CAST(t16.total_votes AS NUMERIC), 1) > 0.5 THEN 'red'
        ELSE 'neutral'
      END,
      1.0,
      t16.total_votes,
      t24.total_votes,
      ROUND(CAST(t24.total_votes - t16.total_votes AS NUMERIC) * 100 / CAST(t16.total_votes AS NUMERIC), 1),
      ROUND(CAST(t16.total_votes AS NUMERIC) * 100 / CAST(t16.registered_voters AS NUMERIC), 1),
      ROUND(CAST(t24.total_votes AS NUMERIC) * 100 / CAST(t24.registered_voters AS NUMERIC), 1),
      t16.registered_voters - t16.total_votes,
      t24.registered_voters - t24.total_votes,
      2024,
      'real_data'
    FROM county_voter_statistics t16
    INNER JOIN county_voter_statistics t24 ON t16.county = t24.county AND t24.election_year = 2024
    LEFT JOIN county_voter_statistics t20 ON t16.county = t20.county AND t20.election_year = 2020
    WHERE t16.election_year = 2016;
    `;

    // We need to use SQL execution through the API
    // For now, let's calculate and insert drift data directly in JavaScript
    console.log('   📊 Calculating drift percentages...');

    // Get 2016 and 2024 data
    const { data: data2016 } = await supabase
      .from('county_voter_statistics')
      .select('*')
      .eq('election_year', 2016);

    const { data: data2024 } = await supabase
      .from('county_voter_statistics')
      .select('*')
      .eq('election_year', 2024);

    if (!data2016 || !data2024) {
      console.error('   ❌ Could not retrieve election data');
      process.exit(1);
    }

    // Calculate drift
    const driftData = [];
    for (const record2016 of data2016) {
      const record2024 = data2024.find(r => r.county === record2016.county);
      if (!record2024) continue;

      const dem_baseline_pct = (record2016.democrat_votes / record2016.total_votes) * 100;
      const rep_baseline_pct = (record2016.republican_votes / record2016.total_votes) * 100;
      const dem_current_pct = (record2024.democrat_votes / record2024.total_votes) * 100;
      const rep_current_pct = (record2024.republican_votes / record2024.total_votes) * 100;
      const dem_drift = dem_current_pct - dem_baseline_pct;
      const rep_drift = rep_current_pct - rep_baseline_pct;

      let direction = 'neutral';
      if (dem_drift > 0.5) direction = 'blue';
      else if (rep_drift > 0.5) direction = 'red';

      driftData.push({
        county: record2016.county,
        dem_baseline_percent: Math.round(dem_baseline_pct * 10) / 10,
        rep_baseline_percent: Math.round(rep_baseline_pct * 10) / 10,
        dem_2020_percent: 0,
        rep_2020_percent: 0,
        dem_current_percent: Math.round(dem_current_pct * 10) / 10,
        rep_current_percent: Math.round(rep_current_pct * 10) / 10,
        dem_drift_pct: Math.round(dem_drift * 10) / 10,
        rep_drift_pct: Math.round(rep_drift * 10) / 10,
        tilt_score: 0,
        direction,
        momentum_pct: 1.0,
        total_votes_2016: record2016.total_votes,
        total_votes_2024: record2024.total_votes,
        votes_growth_pct: Math.round(((record2024.total_votes - record2016.total_votes) / record2016.total_votes) * 100 * 10) / 10,
        turnout_2016_pct: Math.round((record2016.total_votes / record2016.registered_voters) * 100 * 10) / 10,
        turnout_2024_pct: Math.round((record2024.total_votes / record2024.registered_voters) * 100 * 10) / 10,
        nonvoters_2016: record2016.registered_voters - record2016.total_votes,
        nonvoters_2024: record2024.registered_voters - record2024.total_votes,
        last_updated_year: 2024,
        data_quality: 'real_data'
      });
    }

    console.log(`   ✓ Calculated drift for ${driftData.length} counties`);

    // Insert drift data in batches
    console.log('\n7️⃣  Inserting drift data...');
    for (let i = 0; i < driftData.length; i += batchSize) {
      const batch = driftData.slice(i, Math.min(i + batchSize, driftData.length));
      const { error } = await supabase
        .from('county_drift')
        .insert(batch, { onConflict: 'county' });

      if (error) {
        console.error(`   ❌ Drift batch ${i / batchSize + 1} failed:`, error);
      } else {
        console.log(`   ✓ Inserted drift batch ${i / batchSize + 1}/${Math.ceil(driftData.length / batchSize)}`);
      }
    }

    // Verify results
    console.log('\n✅ Verification:');
    const { data: cobbDrift } = await supabase
      .from('county_drift')
      .select('*')
      .eq('county', 'Cobb')
      .single();

    if (cobbDrift) {
      console.log('   ✓ Cobb county drift data:');
      console.log(`     - Democratic: ${cobbDrift.dem_baseline_percent}% → ${cobbDrift.dem_current_percent}% (${cobbDrift.dem_drift_pct > 0 ? '+' : ''}${cobbDrift.dem_drift_pct}%)`);
      console.log(`     - Republican: ${cobbDrift.rep_baseline_percent}% → ${cobbDrift.rep_current_percent}% (${cobbDrift.rep_drift_pct > 0 ? '+' : ''}${cobbDrift.rep_drift_pct}%)`);
      console.log(`     - Direction: ${cobbDrift.direction}`);
    }

    const { count } = await supabase
      .from('county_drift')
      .select('*', { count: 'exact' });

    console.log(`   ✓ Total drift records: ${count}`);
    console.log('\n🎉 Data seeding complete!\n');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

seedData();
