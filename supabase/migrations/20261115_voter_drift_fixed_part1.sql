-- ============================================
-- PART 1: SETUP & CREATE TABLES
-- ============================================

DROP TABLE IF EXISTS county_drift CASCADE;
DROP TABLE IF EXISTS county_voter_statistics CASCADE;

CREATE TABLE county_voter_statistics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    county text NOT NULL,
    election_year integer NOT NULL CHECK (election_year IN (2016, 2020, 2024)),
    registered_voters integer,
    democrat_votes integer,
    republican_votes integer,
    total_votes integer,
    voter_turnout_rate float,
    votes_not_cast integer,
    created_at timestamp DEFAULT NOW(),
    CONSTRAINT unique_county_year UNIQUE(county, election_year)
);

CREATE TABLE county_drift (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    county text NOT NULL UNIQUE,
    dem_baseline_percent float,
    rep_baseline_percent float,
    dem_2020_percent float,
    rep_2020_percent float,
    dem_current_percent float,
    rep_current_percent float,
    dem_drift_pct float,
    rep_drift_pct float,
    tilt_score float,
    direction text CHECK (direction IN ('blue', 'red', 'neutral')),
    momentum_pct float,
    total_votes_2016 integer,
    total_votes_2024 integer,
    votes_growth_pct float,
    turnout_2016_pct float,
    turnout_2024_pct float,
    nonvoters_2016 integer,
    nonvoters_2024 integer,
    last_updated_year integer,
    data_quality text,
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW()
);
