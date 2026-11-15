-- ============================================
-- FIX: RECALCULATE DRIFT FOR ALL 159 COUNTIES
-- ============================================

-- Step 1: Clear existing drift data (keep structure)
TRUNCATE TABLE county_drift;

-- Step 2: Get baseline counties list
WITH county_list AS (
  SELECT DISTINCT county FROM county_voter_statistics WHERE election_year = 2016
),

-- Get 2016 baseline data
baseline_2016 AS (
  SELECT 
    county,
    democrat_votes,
    republican_votes,
    total_votes,
    registered_voters,
    ROUND(CAST(100.0 * democrat_votes AS NUMERIC) / NULLIF(total_votes, 0), 1) as dem_pct_2016,
    ROUND(CAST(100.0 * republican_votes AS NUMERIC) / NULLIF(total_votes, 0), 1) as rep_pct_2016
  FROM county_voter_statistics
  WHERE election_year = 2016
),

-- Get 2020 intermediate data
intermediate_2020 AS (
  SELECT 
    county,
    ROUND(CAST(100.0 * democrat_votes AS NUMERIC) / NULLIF(total_votes, 0), 1) as dem_pct_2020,
    ROUND(CAST(100.0 * republican_votes AS NUMERIC) / NULLIF(total_votes, 0), 1) as rep_pct_2020
  FROM county_voter_statistics
  WHERE election_year = 2020
),

-- Get 2024 current data
current_2024 AS (
  SELECT 
    county,
    democrat_votes,
    republican_votes,
    total_votes,
    registered_voters,
    ROUND(CAST(100.0 * democrat_votes AS NUMERIC) / NULLIF(total_votes, 0), 1) as dem_pct_2024,
    ROUND(CAST(100.0 * republican_votes AS NUMERIC) / NULLIF(total_votes, 0), 1) as rep_pct_2024
  FROM county_voter_statistics
  WHERE election_year = 2024
),

-- Combine all data
drift_analysis AS (
  SELECT 
    b.county,
    b.dem_pct_2016,
    b.rep_pct_2016,
    b.total_votes as votes_2016,
    b.registered_voters as reg_2016,
    COALESCE(m.dem_pct_2020, 0) as dem_pct_2020,
    COALESCE(m.rep_pct_2020, 0) as rep_pct_2020,
    c.dem_pct_2024,
    c.rep_pct_2024,
    c.total_votes as votes_2024,
    c.registered_voters as reg_2024,
    COALESCE(c.registered_voters - c.total_votes, 0) as nonvoters_2024,
    COALESCE(b.registered_voters - b.total_votes, 0) as nonvoters_2016
  FROM baseline_2016 b
  LEFT JOIN intermediate_2020 m ON b.county = m.county
  LEFT JOIN current_2024 c ON b.county = c.county
)
INSERT INTO county_drift (
  county, dem_baseline_percent, rep_baseline_percent, 
  dem_2020_percent, rep_2020_percent,
  dem_current_percent, rep_current_percent, 
  dem_drift_pct, rep_drift_pct, tilt_score,
  direction, momentum_pct, 
  total_votes_2016, total_votes_2024, votes_growth_pct,
  turnout_2016_pct, turnout_2024_pct, 
  nonvoters_2016, nonvoters_2024,
  last_updated_year, data_quality
)
SELECT 
  county,
  dem_pct_2016, rep_pct_2016, 
  dem_pct_2020, rep_pct_2020,
  dem_pct_2024, rep_pct_2024,
  (dem_pct_2024 - dem_pct_2016) as dem_drift,
  (rep_pct_2024 - rep_pct_2016) as rep_drift,
  ROUND(CAST(((rep_pct_2024 - rep_pct_2016) - (dem_pct_2024 - dem_pct_2016)) / 4.0 AS NUMERIC), 3) as tilt,
  CASE 
    WHEN (dem_pct_2024 - dem_pct_2016) > 0.5 THEN 'blue'
    WHEN (rep_pct_2024 - rep_pct_2016) > 0.5 THEN 'red'
    ELSE 'neutral'
  END as direction,
  ROUND(CAST(GREATEST(ABS(dem_pct_2024 - dem_pct_2016), ABS(rep_pct_2024 - rep_pct_2016)) AS NUMERIC), 1) as momentum,
  votes_2016, votes_2024,
  ROUND(CAST(100.0 * (votes_2024 - votes_2016) AS NUMERIC) / NULLIF(votes_2016, 0), 1),
  ROUND(CAST(100.0 * votes_2016 AS NUMERIC) / NULLIF(reg_2016, 0), 1),
  ROUND(CAST(100.0 * votes_2024 AS NUMERIC) / NULLIF(reg_2024, 0), 1),
  nonvoters_2016, nonvoters_2024,
  2024,
  'real_data_from_wikipedia_open_elections'
FROM drift_analysis;

-- Step 3: Verify the calculation
SELECT 
  'Total Counties Analyzed' as metric,
  CAST(COUNT(*) AS text) as value
FROM county_drift
UNION ALL
SELECT 
  'Counties Trending BLUE',
  CAST(COUNT(*) AS text)
FROM county_drift 
WHERE direction = 'blue'
UNION ALL
SELECT 
  'Counties Trending RED',
  CAST(COUNT(*) AS text)
FROM county_drift 
WHERE direction = 'red'
UNION ALL
SELECT 
  'Neutral Counties',
  CAST(COUNT(*) AS text)
FROM county_drift 
WHERE direction = 'neutral';

-- Step 4: Sample top shifting counties
SELECT 
  county, 
  dem_baseline_percent, 
  dem_current_percent, 
  dem_drift_pct, 
  direction,
  momentum_pct
FROM county_drift
WHERE direction IS NOT NULL
ORDER BY ABS(dem_drift_pct) DESC
LIMIT 15;
