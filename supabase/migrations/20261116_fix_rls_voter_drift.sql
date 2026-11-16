-- Fix RLS on county_voter_statistics table
-- Enable public read access for the voter drift map

-- Step 1: Disable row-level security on the table
ALTER TABLE public.county_voter_statistics DISABLE ROW LEVEL SECURITY;

-- Step 2: If RLS is re-enabled in future, create a public read policy
CREATE POLICY "Public read access" ON public.county_voter_statistics
  FOR SELECT
  USING (true);

-- Step 3: Verify data is accessible
-- Run this to test: SELECT COUNT(*) FROM county_voter_statistics WHERE election_year = 2016;
