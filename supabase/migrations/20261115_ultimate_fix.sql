-- ============================================
-- COMPLETE REWRITE: Simplest possible approach
-- ============================================

-- Step 1: Delete all existing drift records (not truncate)
DELETE FROM county_drift WHERE county IS NOT NULL;

-- Step 2: Build drift with explicit calculations
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
  t16.county,
  ROUND(CAST(t16.democrat_votes AS NUMERIC) * 100 / CAST(t16.total_votes AS NUMERIC), 1),
  ROUND(CAST(t16.republican_votes AS NUMERIC) * 100 / CAST(t16.total_votes AS NUMERIC), 1),
  COALESCE(ROUND(CAST(t20.democrat_votes AS NUMERIC) * 100 / CAST(t20.total_votes AS NUMERIC), 1), 0),
  COALESCE(ROUND(CAST(t20.republican_votes AS NUMERIC) * 100 / CAST(t20.total_votes AS NUMERIC), 1), 0),
  ROUND(CAST(t24.democrat_votes AS NUMERIC) * 100 / CAST(t24.total_votes AS NUMERIC), 1),
  ROUND(CAST(t24.republican_votes AS NUMERIC) * 100 / CAST(t24.total_votes AS NUMERIC), 1),
  ROUND(CAST(t24.democrat_votes AS NUMERIC) * 100 / CAST(t24.total_votes AS NUMERIC), 1) - 
    ROUND(CAST(t16.democrat_votes AS NUMERIC) * 100 / CAST(t16.total_votes AS NUMERIC), 1),
  ROUND(CAST(t24.republican_votes AS NUMERIC) * 100 / CAST(t24.total_votes AS NUMERIC), 1) - 
    ROUND(CAST(t16.republican_votes AS NUMERIC) * 100 / CAST(t16.total_votes AS NUMERIC), 1),
  0,
  CASE 
    WHEN ROUND(CAST(t24.democrat_votes AS NUMERIC) * 100 / CAST(t24.total_votes AS NUMERIC), 1) - 
         ROUND(CAST(t16.democrat_votes AS NUMERIC) * 100 / CAST(t16.total_votes AS NUMERIC), 1) > 0.5 THEN 'blue'
    WHEN ROUND(CAST(t24.republican_votes AS NUMERIC) * 100 / CAST(t24.total_votes AS NUMERIC), 1) - 
         ROUND(CAST(t16.republican_votes AS NUMERIC) * 100 / CAST(t16.total_votes AS NUMERIC), 1) > 0.5 THEN 'red'
    ELSE 'neutral'
  END,
  1.0,
  t16.total_votes,
  t24.total_votes,
  ROUND(CAST(t24.total_votes - t16.total_votes AS NUMERIC) * 100 / CAST(t16.total_votes AS NUMERIC), 1),
  ROUND(CAST(t16.total_votes AS NUMERIC) * 100 / CAST(t16.registered_voters AS NUMERIC), 1),
  ROUND(CAST(t24.total_votes AS NUMERIC) * 100 / CAST(t24.registered_voters AS NUMERIC), 1),
  t16.registered_voters - t16.total_votes,
  t24.registered_voters - t24.total_votes,
  2024,
  'real_data'
FROM county_voter_statistics t16
INNER JOIN county_voter_statistics t24 ON t16.county = t24.county AND t24.election_year = 2024
LEFT JOIN county_voter_statistics t20 ON t16.county = t20.county AND t20.election_year = 2020
WHERE t16.election_year = 2016;

-- Verify results
SELECT COUNT(*) as total_counties FROM county_drift;

SELECT direction, COUNT(*) as cnt FROM county_drift GROUP BY direction;

SELECT county, dem_baseline_percent, dem_current_percent, dem_drift_pct, direction
FROM county_drift
ORDER BY dem_baseline_percent DESC
LIMIT 15;
