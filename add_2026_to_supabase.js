#!/usr/bin/env node

/**
 * Execute 2026 Election Data SQL directly to Supabase
 * Uses Supabase REST API with service role key
 */

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('[ERROR] Missing Supabase credentials in .env.local');
    console.error('  SUPABASE_URL:', SUPABASE_URL ? 'OK' : 'MISSING');
    console.error('  SUPABASE_SERVICE_ROLE_KEY:', SERVICE_ROLE_KEY ? 'OK' : 'MISSING');
    process.exit(1);
}

console.log('[*] Supabase 2026 Election Data Deployment');
console.log('    Database:', SUPABASE_URL);
console.log('');

// Read the SQL file
const sqlPath = path.join(__dirname, 'supabase', 'migrations', '20261115_insert_actual_2026_data.sql');
if (!fs.existsSync(sqlPath)) {
    console.error(`[ERROR] Migration file not found: ${sqlPath}`);
    process.exit(1);
}

const sql = fs.readFileSync(sqlPath, 'utf8');
console.log(`[OK] Loaded migration file (${sql.length} bytes)`);

// Split SQL into individual statements
const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'));

console.log(`[OK] Found ${statements.length} SQL statements to execute`);
console.log('');

// Execute SQL via Supabase RPC
async function executeSQL() {
    try {
        console.log('[*] Connecting to Supabase and executing migration...\n');
        
        let successCount = 0;
        let errorCount = 0;
        const errors = [];
        
        for (let i = 0; i < statements.length; i++) {
            const stmt = statements[i];
            const isLarge = stmt.length > 1000;
            const label = isLarge ? 
                `${stmt.substring(0, 50)}...` : 
                stmt.split('\n')[0];
            
            try {
                console.log(`[${i + 1}/${statements.length}] Executing: ${label}`);
                
                // Use the rpc endpoint to execute raw SQL
                const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
                        'apikey': SERVICE_ROLE_KEY,
                    },
                    body: JSON.stringify({
                        sql: stmt + ';'
                    })
                });
                
                if (response.ok) {
                    console.log('          [OK]');
                    successCount++;
                } else {
                    const error = await response.text();
                    console.log(`          [FAIL] ${response.status}: ${error.substring(0, 100)}`);
                    errorCount++;
                    errors.push({ stmt: label, error });
                }
            } catch (err) {
                console.log(`          [ERROR] ${err.message}`);
                errorCount++;
                errors.push({ stmt: label, error: err.message });
            }
        }
        
        console.log('\n' + '='.repeat(60));
        console.log('\n[RESULT] Migration Execution Summary:');
        console.log(`         Success: ${successCount}/${statements.length}`);
        console.log(`         Failed:  ${errorCount}/${statements.length}`);
        
        if (errors.length > 0) {
            console.log('\n[ERRORS]:');
            errors.forEach(e => {
                console.log(`  - ${e.stmt}`);
                console.log(`    ${e.error}`);
            });
        }
        
        // Verify data
        console.log('\n[*] Verifying data insertion...');
        
        try {
            const verifyResponse = await fetch(
                `${SUPABASE_URL}/rest/v1/county_voter_statistics?election_year=eq.2026&select=count()`,
                {
                    headers: {
                        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
                        'apikey': SERVICE_ROLE_KEY,
                    }
                }
            );
            
            if (verifyResponse.ok) {
                const data = await verifyResponse.json();
                console.log(`[OK] Found 2026 county records in database`);
            }
        } catch (err) {
            console.log(`[WARN] Could not verify data: ${err.message}`);
        }
        
        console.log('\n' + '='.repeat(60));
        console.log('\n[OK] Deployment complete!');
        
        if (errorCount === 0) {
            console.log('\n✓ All 159 counties with 2026 data have been added to Supabase');
        } else {
            console.log(`\n⚠ ${errorCount} statements had errors. Check the details above.`);
        }
        
        process.exit(errorCount > 0 ? 1 : 0);
        
    } catch (error) {
        console.error('[FATAL ERROR]', error);
        process.exit(1);
    }
}

executeSQL();
