-- =====================================================
-- FIX ELECTION YEAR CONSTRAINT TO ALLOW 2026
-- =====================================================

-- First, check what election years exist in the table
SELECT DISTINCT election_year FROM public.county_voter_statistics ORDER BY election_year;

-- Drop the old constraint
ALTER TABLE public.county_voter_statistics 
DROP CONSTRAINT IF EXISTS county_voter_statistics_election_year_check;

-- Add new constraint that allows all existing years plus 2026
-- This constraint will be more permissive to handle any years that might exist
ALTER TABLE public.county_voter_statistics
ADD CONSTRAINT county_voter_statistics_election_year_check 
CHECK (election_year >= 2000 AND election_year <= 2030);

-- Verify constraint was added
SELECT constraint_name FROM information_schema.table_constraints
WHERE table_name = 'county_voter_statistics' AND constraint_type = 'CHECK';
