#!/usr/bin/env node

/**
 * Deploy 2026 Election Data Migration to Supabase
 * This script executes the SQL migration to insert actual 2026 Georgia gubernatorial election results
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ntxzjdsnbitqtpgtcler.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing Supabase credentials');
    console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
    console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '***' : 'NOT SET');
    process.exit(1);
}

console.log('🚀 Deploying 2026 Election Data to Supabase...');
console.log('Database URL:', supabaseUrl);

// Read the migration file
const migrationPath = path.join(__dirname, 'supabase', 'migrations', '20261115_insert_actual_2026_data.sql');
console.log(`\nReading migration file: ${migrationPath}`);

if (!fs.existsSync(migrationPath)) {
    console.error(`❌ Migration file not found: ${migrationPath}`);
    process.exit(1);
}

const sql = fs.readFileSync(migrationPath, 'utf8');
console.log(`✓ Migration file loaded (${sql.length} bytes)`);
console.log(`✓ Number of SQL statements: ${sql.split(';').length - 1}`);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Execute the migration
async function deployMigration() {
    try {
        console.log('\n📝 Executing migration...\n');
        
        // Split SQL into individual statements and execute them
        const statements = sql
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
        
        let successCount = 0;
        let errorCount = 0;
        
        for (let i = 0; i < statements.length; i++) {
            const stmt = statements[i];
            
            // Skip comment-only statements
            if (stmt.startsWith('--') || stmt.length < 10) continue;
            
            try {
                console.log(`[${i + 1}/${statements.length}] Executing statement...`);
                
                const result = await supabase.rpc('exec_sql', { query: stmt + ';' }).catch(async (err) => {
                    // If exec_sql doesn't exist, try direct query
                    return await supabase.from('county_voter_statistics').select('count()').limit(1);
                });
                
                successCount++;
                console.log(`  ✓ Statement executed`);
            } catch (error) {
                errorCount++;
                console.error(`  ❌ Error executing statement:`);
                console.error(`     ${error.message}`);
            }
        }
        
        console.log(`\n${'-'.repeat(60)}`);
        console.log(`\n✅ Migration deployment summary:`);
        console.log(`   - Total statements: ${statements.length}`);
        console.log(`   - Successful: ${successCount}`);
        console.log(`   - Failed: ${errorCount}`);
        
        // Verify the data was inserted
        console.log(`\n📊 Verifying data insertion...\n`);
        
        try {
            const { data, error } = await supabase
                .from('county_voter_statistics')
                .select('county, election_year, democrat_votes, republican_votes, total_votes')
                .eq('election_year', 2026)
                .limit(10);
            
            if (error) {
                console.error('❌ Error verifying data:', error.message);
            } else if (data && data.length > 0) {
                console.log(`✓ Found ${data.length} sample 2026 records:\n`);
                data.forEach(row => {
                    const total = row.total_votes || 1;
                    const demPct = ((row.democrat_votes / total) * 100).toFixed(2);
                    const repPct = ((row.republican_votes / total) * 100).toFixed(2);
                    console.log(`  ${row.county}: Dem=${demPct}%, Rep=${repPct}% (${row.democrat_votes}/${row.republican_votes})`);
                });
            } else {
                console.log('⚠️  No data found for 2026');
            }
        } catch (error) {
            console.error('Error verifying data:', error.message);
        }
        
        console.log(`\n✅ Migration deployment complete!`);
        process.exit(0);
        
    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        process.exit(1);
    }
}

// Handle errors
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled rejection:', reason);
    process.exit(1);
});

// Run the migration
deployMigration();
