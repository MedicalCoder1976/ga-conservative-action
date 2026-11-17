const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing SUPABASE environment variables');
  process.exit(1);
}

const supabase = createClient(url, key);

async function calculateDrift() {
  try {
    console.log('Starting drift calculation...');

    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20261115_ultimate_fix.sql');
    const sql = fs.readFileSync(migrationPath, 'utf-8');

    // Split by semicolon and execute each statement
    const statements = sql.split(';').filter(s => s.trim() && !s.trim().startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`Executing: ${statement.substring(0, 60)}...`);
        const { data, error } = await supabase.rpc('exec_sql', {
          sql: statement.trim()
        }).then(() => ({ data: 'ok', error: null })).catch(err => ({
          data: null,
          error: err
        }));

        if (error) {
          console.error('SQL Error:', error);
        }
      }
    }

    // Verify the results
    console.log('\nVerifying drift data...');
    const { data: countData, error: countError } = await supabase
      .from('county_drift')
      .select('*')
      .limit(1);

    if (countError) {
      console.error('Verification error:', countError);
    } else {
      console.log('Sample drift record:', countData?.[0]);
    }

    console.log('Drift calculation complete!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

calculateDrift();
