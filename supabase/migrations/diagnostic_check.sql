-- DIAGNOSTIC: Check actual voter data to see if values differ

-- Sample 2016 data by county
SELECT 
  county,
  democrat_votes,
  republican_votes,
  total_votes,
  ROUND(CAST(100.0 * democrat_votes AS NUMERIC) / total_votes, 1) as dem_pct
FROM county_voter_statistics
WHERE election_year = 2016
ORDER BY county
LIMIT 20;

-- Sample 2024 data by county
SELECT 
  county,
  democrat_votes,
  republican_votes,
  total_votes,
  ROUND(CAST(100.0 * democrat_votes AS NUMERIC) / total_votes, 1) as dem_pct
FROM county_voter_statistics
WHERE election_year = 2024
ORDER BY county
LIMIT 20;

-- Check a specific county's drift (Muscogee as example)
SELECT 
  y16.county,
  y16.democrat_votes as dem_2016,
  y16.republican_votes as rep_2016,
  y16.total_votes as total_2016,
  y24.democrat_votes as dem_2024,
  y24.republican_votes as rep_2024,
  y24.total_votes as total_2024,
  ROUND(CAST(100.0 * y16.democrat_votes AS NUMERIC) / y16.total_votes, 1) as dem_pct_2016,
  ROUND(CAST(100.0 * y24.democrat_votes AS NUMERIC) / y24.total_votes, 1) as dem_pct_2024
FROM county_voter_statistics y16
JOIN county_voter_statistics y24 ON y16.county = y24.county
WHERE y16.election_year = 2016 AND y24.election_year = 2024
  AND y16.county IN ('Muscogee', 'Fulton', 'DeKalb', 'Appling', 'Baker')
ORDER BY y16.county;
