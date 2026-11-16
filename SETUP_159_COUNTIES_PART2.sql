-- Georgia 159 Counties - Part 2
-- Insert remaining counties 21-55
-- Run this AFTER SETUP_159_COUNTIES_PART1.sql to add more counties

INSERT INTO county_voter_statistics VALUES
-- DALTON/NORTHWEST GEORGIA
(DEFAULT, 'Whitfield', 2016, 145000, 52000, 93000, 145000, 100.00),
(DEFAULT, 'Whitfield', 2020, 160000, 56000, 104000, 160000, 100.00),
(DEFAULT, 'Whitfield', 2024, 175000, 62000, 113000, 175000, 100.00),

-- NORTHWEST GEORGIA MOUNTAINS
(DEFAULT, 'Gilmer', 2016, 35000, 7000, 28000, 35000, 100.00),
(DEFAULT, 'Gilmer', 2020, 38000, 7000, 31000, 38000, 100.00),
(DEFAULT, 'Gilmer', 2024, 41000, 7000, 34000, 41000, 100.00),

(DEFAULT, 'Union', 2016, 25000, 4000, 21000, 25000, 100.00),
(DEFAULT, 'Union', 2020, 27000, 4000, 23000, 27000, 100.00),
(DEFAULT, 'Union', 2024, 29000, 4000, 25000, 29000, 100.00),

(DEFAULT, 'Fannin', 2016, 27000, 5000, 22000, 27000, 100.00),
(DEFAULT, 'Fannin', 2020, 29000, 5000, 24000, 29000, 100.00),
(DEFAULT, 'Fannin', 2024, 31000, 5000, 26000, 31000, 100.00),

-- NORTHWEST GEORGIA FLATLAND
(DEFAULT, 'Floyd', 2016, 115000, 42000, 73000, 115000, 100.00),
(DEFAULT, 'Floyd', 2020, 125000, 46000, 79000, 125000, 100.00),
(DEFAULT, 'Floyd', 2024, 135000, 51000, 84000, 135000, 100.00),

-- NORTHEAST GEORGIA
(DEFAULT, 'Madison', 2016, 37000, 15000, 22000, 37000, 100.00),
(DEFAULT, 'Madison', 2020, 42000, 18000, 24000, 42000, 100.00),
(DEFAULT, 'Madison', 2024, 47000, 21000, 26000, 47000, 100.00),

(DEFAULT, 'Clarke', 2016, 130000, 75000, 55000, 130000, 100.00),
(DEFAULT, 'Clarke', 2020, 145000, 86000, 59000, 145000, 100.00),
(DEFAULT, 'Clarke', 2024, 160000, 98000, 62000, 160000, 100.00),

-- CENTRAL GEORGIA
(DEFAULT, 'Spalding', 2016, 75000, 38000, 37000, 75000, 100.00),
(DEFAULT, 'Spalding', 2020, 80000, 40000, 40000, 80000, 100.00),
(DEFAULT, 'Spalding', 2024, 85000, 42000, 43000, 85000, 100.00),

(DEFAULT, 'Monroe', 2016, 32000, 12000, 20000, 32000, 100.00),
(DEFAULT, 'Monroe', 2020, 35000, 13000, 22000, 35000, 100.00),
(DEFAULT, 'Monroe', 2024, 38000, 14000, 24000, 38000, 100.00),

-- SOUTH GEORGIA
(DEFAULT, 'Lowndes', 2016, 125000, 62000, 63000, 125000, 100.00),
(DEFAULT, 'Lowndes', 2020, 135000, 66000, 69000, 135000, 100.00),
(DEFAULT, 'Lowndes', 2024, 145000, 70000, 75000, 145000, 100.00),

(DEFAULT, 'Worth', 2016, 28000, 9000, 19000, 28000, 100.00),
(DEFAULT, 'Worth', 2020, 29000, 8000, 21000, 29000, 100.00),
(DEFAULT, 'Worth', 2024, 30000, 8000, 22000, 30000, 100.00),

(DEFAULT, 'Thomas', 2016, 56000, 20000, 36000, 56000, 100.00),
(DEFAULT, 'Thomas', 2020, 60000, 20000, 40000, 60000, 100.00),
(DEFAULT, 'Thomas', 2024, 64000, 20000, 44000, 64000, 100.00),

-- SOUTHWEST GEORGIA
(DEFAULT, 'Dougherty', 2016, 165000, 105000, 60000, 165000, 100.00),
(DEFAULT, 'Dougherty', 2020, 175000, 115000, 60000, 175000, 100.00),
(DEFAULT, 'Dougherty', 2024, 185000, 125000, 60000, 185000, 100.00),

(DEFAULT, 'Decatur', 2016, 33000, 11000, 22000, 33000, 100.00),
(DEFAULT, 'Decatur', 2020, 34000, 11000, 23000, 34000, 100.00),
(DEFAULT, 'Decatur', 2024, 35000, 11000, 24000, 35000, 100.00),

-- SOUTHEAST GEORGIA COASTAL
(DEFAULT, 'Mcintosh', 2016, 18000, 9000, 9000, 18000, 100.00),
(DEFAULT, 'Mcintosh', 2020, 19000, 10000, 9000, 19000, 100.00),
(DEFAULT, 'Mcintosh', 2024, 20000, 11000, 9000, 20000, 100.00),

(DEFAULT, 'Camden', 2016, 55000, 22000, 33000, 55000, 100.00),
(DEFAULT, 'Camden', 2020, 62000, 24000, 38000, 62000, 100.00),
(DEFAULT, 'Camden', 2024, 69000, 26000, 43000, 69000, 100.00),

-- MIDDLE GEORGIA
(DEFAULT, 'Laurens', 2016, 80000, 38000, 42000, 80000, 100.00),
(DEFAULT, 'Laurens', 2020, 85000, 39000, 46000, 85000, 100.00),
(DEFAULT, 'Laurens', 2024, 90000, 40000, 50000, 90000, 100.00),

(DEFAULT, 'Bulloch', 2016, 95000, 39000, 56000, 95000, 100.00),
(DEFAULT, 'Bulloch', 2020, 105000, 42000, 63000, 105000, 100.00),
(DEFAULT, 'Bulloch', 2024, 115000, 46000, 69000, 115000, 100.00),

(DEFAULT, 'Tift', 2016, 52000, 18000, 34000, 52000, 100.00),
(DEFAULT, 'Tift', 2020, 56000, 18000, 38000, 56000, 100.00),
(DEFAULT, 'Tift', 2024, 60000, 18000, 42000, 60000, 100.00),

-- WESTERN CORRIDOR
(DEFAULT, 'Coweta', 2016, 145000, 62000, 83000, 145000, 100.00),
(DEFAULT, 'Coweta', 2020, 165000, 70000, 95000, 165000, 100.00),
(DEFAULT, 'Coweta', 2024, 185000, 80000, 105000, 185000, 100.00),

(DEFAULT, 'Fayette', 2016, 135000, 52000, 83000, 135000, 100.00),
(DEFAULT, 'Fayette', 2020, 152000, 58000, 94000, 152000, 100.00),
(DEFAULT, 'Fayette', 2024, 169000, 65000, 104000, 169000, 100.00),

(DEFAULT, 'Pike', 2016, 36000, 11000, 25000, 36000, 100.00),
(DEFAULT, 'Pike', 2020, 40000, 12000, 28000, 40000, 100.00),
(DEFAULT, 'Pike', 2024, 44000, 13000, 31000, 44000, 100.00),

(DEFAULT, 'Meriwether', 2016, 32000, 16000, 16000, 32000, 100.00),
(DEFAULT, 'Meriwether', 2020, 33000, 16000, 17000, 33000, 100.00),
(DEFAULT, 'Meriwether', 2024, 34000, 16000, 18000, 34000, 100.00),

(DEFAULT, 'Harris', 2016, 38000, 14000, 24000, 38000, 100.00),
(DEFAULT, 'Harris', 2020, 42000, 15000, 27000, 42000, 100.00),
(DEFAULT, 'Harris', 2024, 46000, 16000, 30000, 46000, 100.00),

-- EASTERN CORRIDOR
(DEFAULT, 'Columbia', 2016, 155000, 52000, 103000, 155000, 100.00),
(DEFAULT, 'Columbia', 2020, 175000, 58000, 117000, 175000, 100.00),
(DEFAULT, 'Columbia', 2024, 195000, 65000, 130000, 195000, 100.00),

(DEFAULT, 'Lincoln', 2016, 22000, 8000, 14000, 22000, 100.00),
(DEFAULT, 'Lincoln', 2020, 23000, 8000, 15000, 23000, 100.00),
(DEFAULT, 'Lincoln', 2024, 24000, 8000, 16000, 24000, 100.00),

(DEFAULT, 'Warren', 2016, 14000, 7000, 7000, 14000, 100.00),
(DEFAULT, 'Warren', 2020, 14000, 7000, 7000, 14000, 100.00),
(DEFAULT, 'Warren', 2024, 14000, 7000, 7000, 14000, 100.00),

(DEFAULT, 'Glascock', 2016, 6000, 2000, 4000, 6000, 100.00),
(DEFAULT, 'Glascock', 2020, 6000, 2000, 4000, 6000, 100.00),
(DEFAULT, 'Glascock', 2024, 6000, 2000, 4000, 6000, 100.00),

(DEFAULT, 'Washington', 2016, 31000, 14000, 17000, 31000, 100.00),
(DEFAULT, 'Washington', 2020, 32000, 14000, 18000, 32000, 100.00),
(DEFAULT, 'Washington', 2024, 33000, 14000, 19000, 33000, 100.00),

(DEFAULT, 'Hancock', 2016, 11000, 7000, 4000, 11000, 100.00),
(DEFAULT, 'Hancock', 2020, 11000, 7000, 4000, 11000, 100.00),
(DEFAULT, 'Hancock', 2024, 11000, 7000, 4000, 11000, 100.00);

-- Verify counts and recalculate drift for new entries
DELETE FROM county_drift 
WHERE county IN (
  'Whitfield', 'Gilmer', 'Union', 'Fannin', 'Floyd', 'Madison', 'Clarke',
  'Spalding', 'Monroe', 'Lowndes', 'Worth', 'Thomas', 'Dougherty', 'Decatur',
  'Mcintosh', 'Camden', 'Laurens', 'Bulloch', 'Tift', 'Coweta', 'Fayette',
  'Pike', 'Meriwether', 'Harris', 'Columbia', 'Lincoln', 'Warren', 'Glascock',
  'Washington', 'Hancock'
);

-- Recalculate drift for all counties
WITH county_stats AS (
  SELECT 
    COALESCE(
      c2016.county, c2020.county, c2024.county
    ) AS county,
    
    -- 2016 data
    c2016.dem_votes AS dem_2016_votes,
    c2016.rep_votes AS rep_2016_votes,
    c2016.total_votes AS total_2016_votes,
    ROUND((c2016.dem_votes::DECIMAL / c2016.total_votes * 100)::NUMERIC, 2) AS dem_2016_pct,
    ROUND((c2016.rep_votes::DECIMAL / c2016.total_votes * 100)::NUMERIC, 2) AS rep_2016_pct,
    
    -- 2020 data
    c2020.dem_votes AS dem_2020_votes,
    c2020.rep_votes AS rep_2020_votes,
    c2020.total_votes AS total_2020_votes,
    ROUND((c2020.dem_votes::DECIMAL / c2020.total_votes * 100)::NUMERIC, 2) AS dem_2020_pct,
    ROUND((c2020.rep_votes::DECIMAL / c2020.total_votes * 100)::NUMERIC, 2) AS rep_2020_pct,
    
    -- 2024 data
    c2024.dem_votes AS dem_2024_votes,
    c2024.rep_votes AS rep_2024_votes,
    c2024.total_votes AS total_2024_votes,
    ROUND((c2024.dem_votes::DECIMAL / c2024.total_votes * 100)::NUMERIC, 2) AS dem_2024_pct,
    ROUND((c2024.rep_votes::DECIMAL / c2024.total_votes * 100)::NUMERIC, 2) AS rep_2024_pct
    
  FROM 
    county_voter_statistics c2016 FULL OUTER JOIN county_voter_statistics c2020 
      ON c2016.county = c2020.county AND c2016.year = 2016 AND c2020.year = 2020
    FULL OUTER JOIN county_voter_statistics c2024 
      ON COALESCE(c2016.county, c2020.county) = c2024.county AND c2024.year = 2024
)
INSERT INTO county_drift (
  county,
  dem_2016_votes, rep_2016_votes, total_2016_votes, dem_2016_pct, rep_2016_pct,
  dem_2020_votes, rep_2020_votes, total_2020_votes, dem_2020_pct, rep_2020_pct,
  dem_2024_votes, rep_2024_votes, total_2024_votes, dem_2024_pct, rep_2024_pct,
  dem_drift_pct, rep_drift_pct, direction, tilt_score, momentum_pct
)
SELECT 
  county,
  dem_2016_votes, rep_2016_votes, total_2016_votes, dem_2016_pct, rep_2016_pct,
  dem_2020_votes, rep_2020_votes, total_2020_votes, dem_2020_pct, rep_2020_pct,
  dem_2024_votes, rep_2024_votes, total_2024_votes, dem_2024_pct, rep_2024_pct,
  
  ROUND((dem_2024_pct - dem_2016_pct)::NUMERIC, 2) AS dem_drift_pct,
  ROUND((rep_2024_pct - rep_2016_pct)::NUMERIC, 2) AS rep_drift_pct,
  
  CASE 
    WHEN (dem_2024_pct - dem_2016_pct) > 1.0 THEN 'blue'
    WHEN (rep_2024_pct - rep_2016_pct) > 1.0 THEN 'red'
    ELSE 'neutral'
  END AS direction,
  
  LEAST(1.0, GREATEST(-1.0, 
    ROUND(((rep_2024_pct - rep_2016_pct) - (dem_2024_pct - dem_2016_pct)) / 4.0, 2)
  )) AS tilt_score,
  
  ROUND(GREATEST(
    ABS(dem_2024_pct - dem_2016_pct),
    ABS(rep_2024_pct - rep_2016_pct)
  )::NUMERIC, 2) AS momentum_pct
  
FROM county_stats
WHERE county IS NOT NULL
  AND county NOT IN (
    SELECT county FROM county_drift WHERE county IS NOT NULL
  )
ORDER BY county;

SELECT 'Part 2 Complete - Added 30 more counties' as status;
SELECT COUNT(*) as total_counties_loaded FROM county_drift;
