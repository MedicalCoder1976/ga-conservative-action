-- Check data integrity

-- How many unique counties in 2016?
SELECT COUNT(DISTINCT county) as counties_2016 
FROM county_voter_statistics 
WHERE election_year = 2016;

-- How many unique counties in 2024?
SELECT COUNT(DISTINCT county) as counties_2024 
FROM county_voter_statistics 
WHERE election_year = 2024;

-- Counties in 2016 but NOT in 2024
SELECT DISTINCT c16.county
FROM county_voter_statistics c16
WHERE c16.election_year = 2016
AND c16.county NOT IN (
  SELECT county FROM county_voter_statistics WHERE election_year = 2024
)
ORDER BY c16.county;

-- Counties in 2024 but NOT in 2016
SELECT DISTINCT c24.county
FROM county_voter_statistics c24
WHERE c24.election_year = 2024
AND c24.county NOT IN (
  SELECT county FROM county_voter_statistics WHERE election_year = 2016
)
ORDER BY c24.county;

-- Check specific counties to verify their data
SELECT county, election_year, democrat_votes, republican_votes, total_votes
FROM county_voter_statistics
WHERE county IN ('Appling', 'Baker', 'Muscogee', 'Fulton', 'DeKalb')
ORDER BY county, election_year;
