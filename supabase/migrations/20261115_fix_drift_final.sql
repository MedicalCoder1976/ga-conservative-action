-- ============================================
-- COMPLETE FIX: Direct JOIN approach (no CTEs)
-- ============================================

TRUNCATE TABLE county_drift;

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
  y16.county,
  
  -- 2016 baseline
  ROUND(CAST(100.0 * y16.democrat_votes AS NUMERIC) / y16.total_votes, 1) as dem_pct_2016,
  ROUND(CAST(100.0 * y16.republican_votes AS NUMERIC) / y16.total_votes, 1) as rep_pct_2016,
  
  -- 2020 intermediate
  COALESCE(ROUND(CAST(100.0 * y20.democrat_votes AS NUMERIC) / y20.total_votes, 1), 0) as dem_pct_2020,
  COALESCE(ROUND(CAST(100.0 * y20.republican_votes AS NUMERIC) / y20.total_votes, 1), 0) as rep_pct_2020,
  
  -- 2024 current
  ROUND(CAST(100.0 * y24.democrat_votes AS NUMERIC) / y24.total_votes, 1) as dem_pct_2024,
  ROUND(CAST(100.0 * y24.republican_votes AS NUMERIC) / y24.total_votes, 1) as rep_pct_2024,
  
  -- Drift calculations
  ROUND(CAST(100.0 * y24.democrat_votes AS NUMERIC) / y24.total_votes, 1) - 
  ROUND(CAST(100.0 * y16.democrat_votes AS NUMERIC) / y16.total_votes, 1) as dem_drift,
  
  ROUND(CAST(100.0 * y24.republican_votes AS NUMERIC) / y24.total_votes, 1) - 
  ROUND(CAST(100.0 * y16.republican_votes AS NUMERIC) / y16.total_votes, 1) as rep_drift,
  
  -- Tilt score
  ROUND(CAST(
    (ROUND(CAST(100.0 * y24.republican_votes AS NUMERIC) / y24.total_votes, 1) - 
     ROUND(CAST(100.0 * y16.republican_votes AS NUMERIC) / y16.total_votes, 1)) -
    (ROUND(CAST(100.0 * y24.democrat_votes AS NUMERIC) / y24.total_votes, 1) - 
     ROUND(CAST(100.0 * y16.democrat_votes AS NUMERIC) / y16.total_votes, 1))
  / 4.0 AS NUMERIC), 3) as tilt,
  
  -- Direction
  CASE 
    WHEN (ROUND(CAST(100.0 * y24.democrat_votes AS NUMERIC) / y24.total_votes, 1) - 
          ROUND(CAST(100.0 * y16.democrat_votes AS NUMERIC) / y16.total_votes, 1)) > 0.5 THEN 'blue'
    WHEN (ROUND(CAST(100.0 * y24.republican_votes AS NUMERIC) / y24.total_votes, 1) - 
          ROUND(CAST(100.0 * y16.republican_votes AS NUMERIC) / y16.total_votes, 1)) > 0.5 THEN 'red'
    ELSE 'neutral'
  END as direction,
  
  -- Momentum
  ROUND(CAST(GREATEST(
    ABS(ROUND(CAST(100.0 * y24.democrat_votes AS NUMERIC) / y24.total_votes, 1) - 
        ROUND(CAST(100.0 * y16.democrat_votes AS NUMERIC) / y16.total_votes, 1)),
    ABS(ROUND(CAST(100.0 * y24.republican_votes AS NUMERIC) / y24.total_votes, 1) - 
        ROUND(CAST(100.0 * y16.republican_votes AS NUMERIC) / y16.total_votes, 1))
  ) AS NUMERIC), 1) as momentum,
  
  -- Vote totals
  y16.total_votes,
  y24.total_votes,
  ROUND(CAST(100.0 * (y24.total_votes - y16.total_votes) AS NUMERIC) / y16.total_votes, 1),
  ROUND(CAST(100.0 * y16.total_votes AS NUMERIC) / y16.registered_voters, 1),
  ROUND(CAST(100.0 * y24.total_votes AS NUMERIC) / y24.registered_voters, 1),
  
  -- Non-voters
  COALESCE(y16.registered_voters - y16.total_votes, 0),
  COALESCE(y24.registered_voters - y24.total_votes, 0),
  
  2024,
  'real_data_from_wikipedia_open_elections'

FROM county_voter_statistics y16
JOIN county_voter_statistics y24 ON y16.county = y24.county
LEFT JOIN county_voter_statistics y20 ON y16.county = y20.county AND y20.election_year = 2020

WHERE y16.election_year = 2016 
  AND y24.election_year = 2024;

-- Verify
SELECT 
  'Total Counties' as metric,
  CAST(COUNT(*) AS text) as value
FROM county_drift
UNION ALL
SELECT 'Blue Drift', CAST(COUNT(*) AS text) FROM county_drift WHERE direction = 'blue'
UNION ALL
SELECT 'Red Drift', CAST(COUNT(*) AS text) FROM county_drift WHERE direction = 'red'
UNION ALL
SELECT 'Neutral', CAST(COUNT(*) AS text) FROM county_drift WHERE direction = 'neutral';

-- Sample results
SELECT 
  county, 
  dem_baseline_percent, 
  dem_current_percent, 
  dem_drift_pct,
  direction,
  momentum_pct
FROM county_drift
ORDER BY ABS(dem_drift_pct) DESC
LIMIT 20;
