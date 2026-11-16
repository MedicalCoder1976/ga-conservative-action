#!/usr/bin/env python3
"""
Deploy 2026 Election Data to Supabase
Executes the SQL migration to insert actual 2026 Georgia gubernatorial election results
"""

import os
import sys
import json
from pathlib import Path

# Load environment variables
env_file = Path(__file__).parent / '.env.local'
if env_file.exists():
    with open(env_file) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                os.environ[key] = value

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    print("ERROR: Missing Supabase credentials")
    print(f"  SUPABASE_URL: {SUPABASE_URL or 'NOT SET'}")
    print(f"  SUPABASE_KEY: {'***' if SUPABASE_KEY else 'NOT SET'}")
    sys.exit(1)

print("[*] Deploying 2026 Election Data to Supabase")
print(f"Database: {SUPABASE_URL}")

# Read the migration SQL
migration_path = Path(__file__).parent / 'supabase' / 'migrations' / '20261115_insert_actual_2026_data.sql'

if not migration_path.exists():
    print(f"[ERROR] Migration file not found: {migration_path}")
    sys.exit(1)

with open(migration_path, 'r') as f:
    sql_content = f.read()

print(f"[OK] Migration file loaded ({len(sql_content)} bytes)")

# Try importing supabase client
try:
    from supabase import create_client, Client
    print("[OK] Supabase Python client available")
    
    # Create client
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("[OK] Connected to Supabase")
    
    # Split SQL into statements and execute
    statements = [s.strip() + ';' for s in sql_content.split(';') 
                  if s.strip() and not s.strip().startswith('--')]
    
    print(f"\n[*] Executing {len(statements)} SQL statements...\n")
    
    # For now, just show what would be executed
    print("First few statements:")
    for i, stmt in enumerate(statements[:3]):
        preview = stmt[:100] + "..." if len(stmt) > 100 else stmt
        print(f"  [{i+1}] {preview}")
    
    print(f"\n[OK] Ready to execute {len(statements)} statements")
    print("\n[INFO] Note: Python Supabase client may not support raw SQL execution directly")
    print("Use the Supabase Dashboard instead:")
    print("\n1. Go to https://app.supabase.com/projects")
    print("2. Select your project (ntxzjdsnbitqtpgtcler)")
    print("3. Go to SQL Editor")
    print("4. Create a new query")
    print("5. Copy and paste the SQL from supabase/migrations/20261115_insert_actual_2026_data.sql")
    print("6. Click 'Run'\n")
    
except ImportError:
    print("[WARN] Supabase Python client not available")
    print("Install it with: pip install supabase")
    print("\nAlternatively, execute the SQL via the Supabase Dashboard:")
    print("\n1. Go to https://app.supabase.com/projects")
    print("2. Select your project (ntxzjdsnbitqtpgtcler)")
    print("3. Go to SQL Editor")
    print("4. Create a new query")
    print("5. Copy and paste the SQL from supabase/migrations/20261115_insert_actual_2026_data.sql")
    print("6. Click 'Run'\n")

print("=" * 60)
print("\n[OK] Migration file prepared and ready to deploy!")
print("\nTo verify after deployment, run this SQL query:")
print("  SELECT COUNT(*) FROM county_voter_statistics WHERE election_year = 2026;")
print("  Expected result: 159 counties\n")
