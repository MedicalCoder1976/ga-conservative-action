-- Fix RLS policies to allow public read access to drift data
-- This allows the anon key (browser) to read drift data

-- First, check if RLS is enabled
-- ALTER TABLE county_drift ENABLE ROW LEVEL SECURITY;

-- Allow anon users to read all drift data
CREATE POLICY "Allow public read access to drift data"
ON county_drift
FOR SELECT
TO authenticated, anon
USING (TRUE);

-- Also ensure voter statistics are readable
CREATE POLICY "Allow public read access to voter statistics"
ON county_voter_statistics
FOR SELECT
TO authenticated, anon
USING (TRUE);

-- Verify the policies exist
SELECT tablename, policyname, cmd, rol, qual
FROM pg_policies
WHERE tablename IN ('county_drift', 'county_voter_statistics')
ORDER BY tablename, policyname;
