-- Debug: What's actually in drift table?

SELECT COUNT(*) as total_rows FROM county_drift;

SELECT COUNT(DISTINCT county) as unique_counties FROM county_drift;

SELECT COUNT(DISTINCT dem_baseline_percent) as unique_baseline_percents FROM county_drift;

-- Show all unique combinations
SELECT 
  dem_baseline_percent, 
  dem_current_percent,
  COUNT(*) as num_counties,
  STRING_AGG(county, ', ' ORDER BY county) as counties
FROM county_drift
GROUP BY dem_baseline_percent, dem_current_percent
ORDER BY dem_baseline_percent DESC;
