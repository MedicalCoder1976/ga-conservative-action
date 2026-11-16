-- Show both Dem and Rep percentages to verify accuracy

SELECT 
  county,
  dem_baseline_percent,
  rep_baseline_percent,
  dem_current_percent,
  rep_current_percent,
  dem_drift_pct,
  rep_drift_pct,
  direction
FROM county_drift
ORDER BY dem_baseline_percent DESC
LIMIT 20;
