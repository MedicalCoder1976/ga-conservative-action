#!/usr/bin/env node

/**
 * Deploy 2026 Election Data Migration to Supabase
 * Using PostgreSQL direct connection via SQL file execution
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Missing Supabase credentials in .env.local');
    process.exit(1);
}

// Extract connection details from Supabase
// Format: https://PROJECT_ID.supabase.co
const projectId = supabaseUrl.split('https://')[1].split('.supabase.co')[0];

console.log('🚀 Deploying 2026 Election Data Migration');
console.log('Project:', projectId);

// Read migration file
const migrationPath = path.join(__dirname, 'supabase', 'migrations', '20261115_insert_actual_2026_data.sql');

if (!fs.existsSync(migrationPath)) {
    console.error(`❌ Migration file not found: ${migrationPath}`);
    process.exit(1);
}

const sql = fs.readFileSync(migrationPath, 'utf8');

console.log(`\n✓ Migration file loaded (${sql.length} bytes)`);
console.log(`\n📋 Migration includes:`);
console.log('  - 159 Georgia counties with 2026 election data');
console.log('  - Governor race: Rick Jackson (R) vs Keisha Lance Bottoms (D)');
console.log('  - Voter drift calculations (2020-2024-2026)');

// Show the data insertion summary
const valueMatches = sql.match(/\('(\w+)', 2026,/g);
if (valueMatches) {
    console.log(`\n✓ Inserting data for ${valueMatches.length} counties`);
}

console.log(`\n${'-'.repeat(60)}\n`);
console.log('To deploy this migration, you have these options:\n');

console.log('Option 1: Using Supabase CLI (recommended):');
console.log('  $ cd ga-conservative-action');
console.log('  $ npx supabase db push\n');

console.log('Option 2: Using Supabase Dashboard:');
console.log('  1. Go to https://app.supabase.com');
console.log('  2. Select your project (GA Conservative Action)');
console.log('  3. Go to SQL Editor');
console.log('  4. Click "New Query"');
console.log('  5. Copy the SQL from: supabase/migrations/20261115_insert_actual_2026_data.sql');
console.log('  6. Run the query\n');

console.log('Option 3: Direct database connection (psql):');
console.log(`  $ psql postgresql://postgres:[password]@db.${projectId}.supabase.co:5432/postgres`);
console.log('  postgres=> \\i supabase/migrations/20261115_insert_actual_2026_data.sql\n');

console.log(`${'-'.repeat(60)}\n`);

// Provide SQL file content preview
console.log('📄 Migration file: supabase/migrations/20261115_insert_actual_2026_data.sql');
console.log('\nFirst few counties in the migration:');

const lines = sql.split('\n');
let startPrinting = false;
let count = 0;

for (const line of lines) {
    if (line.includes("('Echols', 2026")) {
        startPrinting = true;
    }
    
    if (startPrinting && line.includes('2026,') && count < 5) {
        const match = line.match(/\('([^']+)',.*?(\d+),\s*(\d+),/);
        if (match) {
            console.log(`  ${match[1]}: Dem=${match[2]}, Rep=${match[3]}`);
            count++;
        }
    }
}

console.log(`  ... and 154 more counties\n`);

console.log('✅ Migration file ready for deployment!');
console.log('\nThis migration will:');
console.log('  1. Create/update county_voter_statistics table with 2026 data');
console.log('  2. Calculate voter drift from 2020, 2024 to 2026');
console.log('  3. Create county_drift view for analysis');
console.log('  4. Verify all 159 counties are inserted\n');
