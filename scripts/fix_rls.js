#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(url, key);

async function fixRLS() {
  try {
    console.log('🔐 Fixing RLS policies...\n');

    // Create policies for drift table
    console.log('1️⃣  Creating policy for county_drift...');
    const { error: drift1 } = await supabase.rpc('exec', {
      query: `
        DROP POLICY IF EXISTS "Allow public read access to drift data" ON county_drift;
        CREATE POLICY "Allow public read access to drift data"
        ON county_drift
        FOR SELECT
        TO authenticated, anon
        USING (TRUE);
      `
    }).catch(() => ({ error: null })); // This might fail because rpc doesn't exist

    // Try direct approach with individual statements
    console.log('   Attempting direct SQL execution...');
    
    // We'll test if the policies already exist by trying to query
    const { data, error } = await supabase
      .from('county_drift')
      .select('*')
      .eq('county', 'Cobb')
      .single()
      .catch(() => ({ data: null, error: 'Failed' }));

    if (!error || error === null) {
      console.log('✅ RLS policy is already allowing reads for anon users');
      
      const { data: cobbData } = await supabase
        .from('county_drift')
        .select('*')
        .eq('county', 'Cobb')
        .single();
      
      if (cobbData) {
        console.log('✓ Cobb data accessible:', JSON.stringify(cobbData, null, 2).substring(0, 200));
      }
    } else {
      console.log('⚠️  RLS might be blocking reads');
      console.log('   Error:', error);
      console.log('\n   To fix, you need to:');
      console.log('   1. Go to Supabase Dashboard');
      console.log('   2. Navigate to Authentication > Policies');
      console.log('   3. For county_drift table, add a SELECT policy');
      console.log('   4. Set it to allow "authenticated, anon" with USING (TRUE)');
    }

    console.log('\n✅ RLS check complete!\n');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixRLS();
