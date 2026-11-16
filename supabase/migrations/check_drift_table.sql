-- Check what's actually in county_drift table
SELECT 
  county,
  dem_baseline_percent,
  dem_current_percent,
  dem_drift_pct,
  direction
FROM county_drift
ORDER BY county
LIMIT 20;

-- Count of each drift direction
SELECT direction, COUNT(*) FROM county_drift GROUP BY direction;

-- Check for duplicates or oddities
SELECT dem_baseline_percent, dem_current_percent, COUNT(*) as cnt
FROM county_drift
GROUP BY dem_baseline_percent, dem_current_percent
ORDER BY cnt DESC;
