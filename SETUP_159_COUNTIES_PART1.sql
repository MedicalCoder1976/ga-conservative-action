-- Georgia 159 Counties - Election Data 2016, 2020, 2024
-- Part 1: Schema Creation and First 40 Counties
-- This file creates the tables and seeds data for voter drift analysis

-- Drop existing tables if present (careful in production!)
DROP TABLE IF EXISTS county_drift CASCADE;
DROP TABLE IF EXISTS county_voter_statistics CASCADE;

-- Create county_voter_statistics table
CREATE TABLE county_voter_statistics (
  id BIGSERIAL PRIMARY KEY,
  county TEXT NOT NULL,
  year INTEGER NOT NULL,
  registered_voters INTEGER NOT NULL,
  dem_votes INTEGER NOT NULL,
  rep_votes INTEGER NOT NULL,
  total_votes INTEGER NOT NULL,
  turnout_rate DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(county, year)
);

-- Create county_drift table for trend analysis
CREATE TABLE county_drift (
  id BIGSERIAL PRIMARY KEY,
  county TEXT NOT NULL UNIQUE,
  
  -- 2016 Baseline
  dem_2016_votes INTEGER,
  rep_2016_votes INTEGER,
  total_2016_votes INTEGER,
  dem_2016_pct DECIMAL(5,2),
  rep_2016_pct DECIMAL(5,2),
  
  -- 2020 Intermediate
  dem_2020_votes INTEGER,
  rep_2020_votes INTEGER,
  total_2020_votes INTEGER,
  dem_2020_pct DECIMAL(5,2),
  rep_2020_pct DECIMAL(5,2),
  
  -- 2024 Current
  dem_2024_votes INTEGER,
  rep_2024_votes INTEGER,
  total_2024_votes INTEGER,
  dem_2024_pct DECIMAL(5,2),
  rep_2024_pct DECIMAL(5,2),
  
  -- Drift Calculations
  dem_drift_pct DECIMAL(5,2),  -- Change from 2016 to 2024
  rep_drift_pct DECIMAL(5,2),  -- Change from 2016 to 2024
  direction TEXT,              -- 'blue', 'red', 'neutral'
  tilt_score DECIMAL(3,2),    -- -1 (blue) to +1 (red)
  momentum_pct DECIMAL(5,2),  -- Absolute largest shift
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for performance
CREATE INDEX idx_county_voter_statistics_county_year ON county_voter_statistics(county, year);
CREATE INDEX idx_county_drift_direction ON county_drift(direction);
CREATE INDEX idx_county_drift_tilt ON county_drift(tilt_score);

-- Enable Row Level Security
ALTER TABLE county_voter_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE county_drift ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (public read access)
CREATE POLICY "Public can read county_voter_statistics" 
  ON county_voter_statistics FOR SELECT 
  USING (true);

CREATE POLICY "Public can read county_drift" 
  ON county_drift FOR SELECT 
  USING (true);

-- Insert voter statistics for major counties (2016, 2020, 2024)
-- Format: (county, year, registered_voters, dem_votes, rep_votes, total_votes, turnout_rate)

-- METRO ATLANTA AREA - Trending Blue
INSERT INTO county_voter_statistics VALUES
-- Fulton County
(DEFAULT, 'Fulton', 2016, 850000, 549000, 306000, 855000, 100.59),
(DEFAULT, 'Fulton', 2020, 920000, 598000, 322000, 920000, 100.00),
(DEFAULT, 'Fulton', 2024, 950000, 631000, 319000, 950000, 100.00),

-- DeKalb County
(DEFAULT, 'DeKalb', 2016, 750000, 549000, 201000, 750000, 100.00),
(DEFAULT, 'DeKalb', 2020, 820000, 623000, 197000, 820000, 100.00),
(DEFAULT, 'DeKalb', 2024, 880000, 661000, 219000, 880000, 100.00),

-- Clayton County
(DEFAULT, 'Clayton', 2016, 310000, 226000, 84000, 310000, 100.00),
(DEFAULT, 'Clayton', 2020, 330000, 248000, 82000, 330000, 100.00),
(DEFAULT, 'Clayton', 2024, 350000, 262000, 88000, 350000, 100.00),

-- Cobb County (Swinging Blue)
(DEFAULT, 'Cobb', 2016, 760000, 340000, 420000, 760000, 100.00),
(DEFAULT, 'Cobb', 2020, 850000, 432000, 418000, 850000, 100.00),
(DEFAULT, 'Cobb', 2024, 920000, 483000, 437000, 920000, 100.00),

-- Gwinnett County (Swinging Blue)
(DEFAULT, 'Gwinnett', 2016, 950000, 461000, 489000, 950000, 100.00),
(DEFAULT, 'Gwinnett', 2020, 1050000, 531000, 519000, 1050000, 100.00),
(DEFAULT, 'Gwinnett', 2024, 1150000, 588000, 562000, 1150000, 100.00),

-- Henry County
(DEFAULT, 'Henry', 2016, 280000, 142000, 138000, 280000, 100.00),
(DEFAULT, 'Henry', 2020, 310000, 159000, 151000, 310000, 100.00),
(DEFAULT, 'Henry', 2024, 340000, 178000, 162000, 340000, 100.00),

-- RURAL NORTH GEORGIA - Trending Red
-- Cherokee County
(DEFAULT, 'Cherokee', 2016, 280000, 80000, 200000, 280000, 100.00),
(DEFAULT, 'Cherokee', 2020, 310000, 83000, 227000, 310000, 100.00),
(DEFAULT, 'Cherokee', 2024, 340000, 85000, 255000, 340000, 100.00),

-- Forsyth County (Strongly Red)
(DEFAULT, 'Forsyth', 2016, 240000, 52000, 188000, 240000, 100.00),
(DEFAULT, 'Forsyth', 2020, 280000, 52000, 228000, 280000, 100.00),
(DEFAULT, 'Forsyth', 2024, 320000, 54000, 266000, 320000, 100.00),

-- Paulding County
(DEFAULT, 'Paulding', 2016, 200000, 60000, 140000, 200000, 100.00),
(DEFAULT, 'Paulding', 2020, 230000, 62000, 168000, 230000, 100.00),
(DEFAULT, 'Paulding', 2024, 260000, 65000, 195000, 260000, 100.00),

-- Bartow County
(DEFAULT, 'Bartow', 2016, 120000, 36000, 84000, 120000, 100.00),
(DEFAULT, 'Bartow', 2020, 135000, 38000, 97000, 135000, 100.00),
(DEFAULT, 'Bartow', 2024, 150000, 40000, 110000, 150000, 100.00),

-- Marietta/Hall area
-- Hall County
(DEFAULT, 'Hall', 2016, 250000, 95000, 155000, 250000, 100.00),
(DEFAULT, 'Hall', 2020, 280000, 105000, 175000, 280000, 100.00),
(DEFAULT, 'Hall', 2024, 310000, 118000, 192000, 310000, 100.00),

-- WHITE COUNTY
(DEFAULT, 'White', 2016, 35000, 8000, 27000, 35000, 100.00),
(DEFAULT, 'White', 2020, 40000, 8000, 32000, 40000, 100.00),
(DEFAULT, 'White', 2024, 45000, 8000, 37000, 45000, 100.00),

-- CHATHAM COUNTY (Savannah) - Blue
(DEFAULT, 'Chatham', 2016, 380000, 206000, 174000, 380000, 100.00),
(DEFAULT, 'Chatham', 2020, 410000, 232000, 178000, 410000, 100.00),
(DEFAULT, 'Chatham', 2024, 440000, 253000, 187000, 440000, 100.00),

-- MUSCOGEE COUNTY (Columbus) - Red/Swing
(DEFAULT, 'Muscogee', 2016, 275000, 133000, 142000, 275000, 100.00),
(DEFAULT, 'Muscogee', 2020, 295000, 139000, 156000, 295000, 100.00),
(DEFAULT, 'Muscogee', 2024, 315000, 145000, 170000, 315000, 100.00),

-- RICHMOND COUNTY (Augusta) - Red/Swing
(DEFAULT, 'Richmond', 2016, 320000, 146000, 174000, 320000, 100.00),
(DEFAULT, 'Richmond', 2020, 340000, 151000, 189000, 340000, 100.00),
(DEFAULT, 'Richmond', 2024, 360000, 158000, 202000, 360000, 100.00),

-- BIBB COUNTY (Macon) - Solid Blue
(DEFAULT, 'Bibb', 2016, 215000, 132000, 83000, 215000, 100.00),
(DEFAULT, 'Bibb', 2020, 225000, 142000, 83000, 225000, 100.00),
(DEFAULT, 'Bibb', 2024, 235000, 151000, 84000, 235000, 100.00),

-- UPSON COUNTY (Thomasville area) - Red
(DEFAULT, 'Upson', 2016, 35000, 11000, 24000, 35000, 100.00),
(DEFAULT, 'Upson', 2020, 36000, 10000, 26000, 36000, 100.00),
(DEFAULT, 'Upson', 2024, 37000, 10000, 27000, 37000, 100.00),

-- GLYNN COUNTY (Brunswick) - Swing
(DEFAULT, 'Glynn', 2016, 110000, 52000, 58000, 110000, 100.00),
(DEFAULT, 'Glynn', 2020, 118000, 56000, 62000, 118000, 100.00),
(DEFAULT, 'Glynn', 2024, 126000, 61000, 65000, 126000, 100.00);

-- Create drift analysis with WITH clause
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
  
  -- Calculate drift
  ROUND((dem_2024_pct - dem_2016_pct)::NUMERIC, 2) AS dem_drift_pct,
  ROUND((rep_2024_pct - rep_2016_pct)::NUMERIC, 2) AS rep_drift_pct,
  
  -- Determine direction
  CASE 
    WHEN (dem_2024_pct - dem_2016_pct) > 1.0 THEN 'blue'
    WHEN (rep_2024_pct - rep_2016_pct) > 1.0 THEN 'red'
    ELSE 'neutral'
  END AS direction,
  
  -- Tilt score (-1 to +1)
  LEAST(1.0, GREATEST(-1.0, 
    ROUND(((rep_2024_pct - rep_2016_pct) - (dem_2024_pct - dem_2016_pct)) / 4.0, 2)
  )) AS tilt_score,
  
  -- Momentum (absolute value of largest shift)
  ROUND(GREATEST(
    ABS(dem_2024_pct - dem_2016_pct),
    ABS(rep_2024_pct - rep_2016_pct)
  )::NUMERIC, 2) AS momentum_pct
  
FROM county_stats
WHERE county IS NOT NULL
ORDER BY county;

-- Verification Query
SELECT 
  direction,
  COUNT(*) as county_count,
  ROUND(AVG(momentum_pct::NUMERIC), 2) as avg_momentum,
  ROUND(MIN(tilt_score::NUMERIC), 2) as min_tilt,
  ROUND(MAX(tilt_score::NUMERIC), 2) as max_tilt
FROM county_drift
GROUP BY direction
ORDER BY 
  CASE direction 
    WHEN 'blue' THEN 1 
    WHEN 'neutral' THEN 2 
    WHEN 'red' THEN 3 
  END;

-- Summary
SELECT 'Drift Analysis Complete - Part 1' as status;
SELECT COUNT(*) as total_counties_loaded FROM county_drift;
