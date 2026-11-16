-- ============================================
-- COUNTY VOTER STATISTICS & DRIFT ANALYSIS
-- Generated: 2026-11-15T12:38:37.612834
-- Source: EveryElectionResult.com, GeorgiaVotes.com
-- ============================================

-- Drop and recreate tables
DROP TABLE IF EXISTS county_drift;
DROP TABLE IF EXISTS county_voter_statistics;

-- Create county_voter_statistics table
CREATE TABLE county_voter_statistics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    county text NOT NULL,
    election_year integer NOT NULL,
    registered_voters integer,
    democrat_votes integer,
    republican_votes integer,
    independent_votes integer,
    total_votes integer,
    voter_turnout_rate float,
    votes_not_cast integer,
    created_at timestamp DEFAULT NOW(),
    UNIQUE(county, election_year)
);

-- Create county_drift table
CREATE TABLE county_drift (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    county text NOT NULL UNIQUE,
    baseline_year integer DEFAULT 2016,
    dem_baseline_percent float,
    rep_baseline_percent float,
    dem_current_percent float,
    rep_current_percent float,
    dem_drift_pct float,
    rep_drift_pct float,
    tilt_score float,
    direction text,
    momentum_pct float,
    last_updated_year integer,
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW()
);

-- ============================================
-- INSERT VOTER STATISTICS FOR ALL YEARS
-- ============================================


-- ============================================
-- INSERT DRIFT ANALYSIS
-- ============================================


-- ============================================
-- VERIFICATION QUERY
-- ============================================

SELECT 
    'Total Counties' as metric,
    COUNT(*) as value
FROM county_drift
UNION ALL
SELECT 
    'Blue Trend Counties',
    COUNT(*) 
FROM county_drift 
WHERE direction = 'blue'
UNION ALL
SELECT 
    'Red Trend Counties',
    COUNT(*) 
FROM county_drift 
WHERE direction = 'red'
UNION ALL
SELECT 
    'Neutral Drift Counties',
    COUNT(*) 
FROM county_drift 
WHERE direction = 'neutral';