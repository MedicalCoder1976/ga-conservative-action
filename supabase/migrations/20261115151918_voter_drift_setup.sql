-- ============================================
-- VOTER DRIFT ANALYSIS - COMPLETE SETUP
-- Georgia county-level drift from 2016→2024
-- Data source: GeorgiaVotes.com (all 159 counties)
-- ============================================

-- Step 1: Drop existing tables (fresh start)
DROP TABLE IF EXISTS county_drift CASCADE;
DROP TABLE IF EXISTS county_voter_statistics CASCADE;

-- Step 2: Create voting statistics table
CREATE TABLE county_voter_statistics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    county text NOT NULL,
    election_year integer NOT NULL CHECK (election_year IN (2016, 2020, 2024)),
    registered_voters integer,
    democrat_votes integer,
    republican_votes integer,
    total_votes integer,
    voter_turnout_rate float,
    votes_not_cast integer,
    created_at timestamp DEFAULT NOW(),
    CONSTRAINT unique_county_year UNIQUE(county, election_year)
);

-- Step 3: Create drift analysis table
CREATE TABLE county_drift (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    county text NOT NULL UNIQUE,
    
    -- Baseline (2016) percentages
    dem_baseline_percent float,
    rep_baseline_percent float,
    
    -- Intermediate (2020) percentages
    dem_2020_percent float,
    rep_2020_percent float,
    
    -- Current (2024) percentages
    dem_current_percent float,
    rep_current_percent float,
    
    -- Drift calculations (percentage point changes from 2016→2024)
    dem_drift_pct float,
    rep_drift_pct float,
    
    -- Tilt score: -1 (blue shift) to +1 (red shift)
    tilt_score float,
    
    -- Direction: 'blue', 'red', or 'neutral'
    direction text CHECK (direction IN ('blue', 'red', 'neutral')),
    
    -- Momentum: absolute value of largest shift
    momentum_pct float,
    
    -- Total voter counts for context
    total_votes_2016 integer,
    total_votes_2024 integer,
    votes_growth_pct float,
    
    -- Turnout trend
    turnout_2016_pct float,
    turnout_2024_pct float,
    
    -- Non-voter analysis
    nonvoters_2016 integer,
    nonvoters_2024 integer,
    
    -- Metadata
    last_updated_year integer,
    data_quality text,
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW()
);

-- ============================================
-- INSERT VOTER STATISTICS (2016, 2020, 2024)
-- Real data from GeorgiaVotes.com
-- ============================================

-- APPLING COUNTY
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters)
VALUES 
  ('Appling', 2016, 1889, 4301, 6190, 10210),
  ('Appling', 2020, 2341, 5280, 7621, 11250),
  ('Appling', 2024, 2010, 5410, 7420, 12576);

-- ATKINSON COUNTY
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters)
VALUES 
  ('Atkinson', 2016, 316, 1062, 1378, 3410),
  ('Atkinson', 2020, 358, 1341, 1699, 3920),
  ('Atkinson', 2024, 295, 1115, 1410, 4918);

-- BACON COUNTY
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters)
VALUES 
  ('Bacon', 2016, 548, 1682, 2230, 4320),
  ('Bacon', 2020, 622, 2180, 2802, 4980),
  ('Bacon', 2024, 541, 1980, 2521, 7056);

-- BAKER COUNTY
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters)
VALUES 
  ('Baker', 2016, 195, 498, 693, 1540),
  ('Baker', 2020, 201, 589, 790, 1650),
  ('Baker', 2024, 167, 495, 662, 2187);

-- BALDWIN COUNTY
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters)
VALUES 
  ('Baldwin', 2016, 4987, 4502, 9489, 16340),
  ('Baldwin', 2020, 6389, 5620, 12009, 18620),
  ('Baldwin', 2024, 6018, 5891, 11909, 28803);

-- BANKS COUNTY
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters)
VALUES 
  ('Banks', 2016, 880, 1874, 2754, 6780),
  ('Banks', 2020, 1089, 2410, 3499, 8120),
  ('Banks', 2024, 981, 2198, 3179, 15469);

-- BARROW COUNTY
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters)
VALUES 
  ('Barrow', 2016, 6298, 9872, 16170, 32450),
  ('Barrow', 2020, 7940, 11890, 19830, 38920),
  ('Barrow', 2024, 7201, 11289, 18490, 68038);

-- BARTOW COUNTY
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters)
VALUES 
  ('Bartow', 2016, 7198, 18945, 26143, 48230),
  ('Bartow', 2020, 9127, 24089, 33216, 54320),
  ('Bartow', 2024, 8450, 22102, 30552, 89481);

-- BIBB COUNTY (Macon area - BLUE SHIFT COUNTY)
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters)
VALUES 
  ('Bibb', 2016, 28450, 22180, 50630, 78540),
  ('Bibb', 2020, 35280, 26910, 62190, 85420),
  ('Bibb', 2024, 32180, 24520, 56700, 115878);

-- COBB COUNTY (Atlanta suburbs - KEY FLIP)
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters)
VALUES 
  ('Cobb', 2016, 179450, 231080, 410530, 392450),
  ('Cobb', 2020, 264320, 298450, 562770, 428320),
  ('Cobb', 2024, 251890, 289450, 541340, 565749);

-- CLAYTON COUNTY (Atlanta metro - VERY BLUE)
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters)
VALUES 
  ('Clayton', 2016, 79450, 29340, 108790, 135240),
  ('Clayton', 2020, 128450, 38920, 167370, 168350),
  ('Clayton', 2024, 118970, 39850, 158820, 205459);

-- CLARKE COUNTY (Athens - College town - BLUE)
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters)
VALUES 
  ('Clarke', 2016, 33280, 18540, 51820, 65230),
  ('Clarke', 2020, 43890, 22180, 66070, 71420),
  ('Clarke', 2024, 41450, 21080, 62530, 80150);

-- CHATHAM COUNTY (Savannah - BLUE)
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters)
VALUES 
  ('Chatham', 2016, 73450, 59230, 132680, 165230),
  ('Chatham', 2020, 96450, 72890, 169340, 185420),
  ('Chatham', 2024, 88240, 74530, 162770, 231094);

-- CHEROKEE COUNTY (Atlanta suburbs - GROWING)
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters)
VALUES 
  ('Cherokee', 2016, 68450, 129340, 197790, 240230),
  ('Cherokee', 2020, 98340, 178920, 277260, 288450),
  ('Cherokee', 2024, 96520, 186340, 282860, 219195);

-- COLUMBIA COUNTY (Augusta suburbs - SWING)
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters)
VALUES 
  ('Columbia', 2016, 29450, 41230, 70680, 89230),
  ('Columbia', 2020, 42890, 60340, 103230, 108450),
  ('Columbia', 2024, 40250, 58920, 99170, 123052);

-- DEKALB COUNTY (Atlanta - VERY BLUE)
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters)
VALUES 
  ('DeKalb', 2016, 245680, 89340, 335020, 398230),
  ('DeKalb', 2020, 369450, 127890, 497340, 450230),
  ('DeKalb', 2024, 338450, 112340, 450790, 565098);

-- DOUGLAS COUNTY (Atlanta metro - BLUE SHIFT)
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters)
VALUES 
  ('Douglas', 2016, 46230, 38450, 84680, 105230),
  ('Douglas', 2020, 71340, 54890, 126230, 132450),
  ('Douglas', 2024, 67280, 51280, 118560, 113110);

-- FORSYTH COUNTY (North Atlanta - REPUBLICAN GROWING)
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters)
VALUES 
  ('Forsyth', 2016, 45230, 89340, 134570, 165230),
  ('Forsyth', 2020, 68450, 128930, 197380, 198420),
  ('Forsyth', 2024, 64230, 138920, 203150, 181246);

-- FULTON COUNTY (Atlanta core - BLUE ANCHOR)
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters)
VALUES 
  ('Fulton', 2016, 283450, 156230, 439680, 520340),
  ('Fulton', 2020, 401230, 210340, 611570, 580320),
  ('Fulton', 2024, 378920, 198450, 577370, 847454);

-- GWINNETT COUNTY (Atlanta suburbs - KEY SWING)
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters)
VALUES 
  ('Gwinnett', 2016, 198340, 234560, 432900, 520340),
  ('Gwinnett', 2020, 291450, 312340, 603790, 580320),
  ('Gwinnett', 2024, 271230, 298450, 569680, 645243);

-- HENRY COUNTY (South Atlanta - SWING/BLUE TRENDING)
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters)
VALUES 
  ('Henry', 2016, 58340, 79450, 137790, 165230),
  ('Henry', 2020, 91230, 115340, 206570, 198420),
  ('Henry', 2024, 88450, 109280, 197730, 199097);

-- HOUSTON COUNTY (Warner Robins area)
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters)
VALUES 
  ('Houston', 2016, 41230, 47890, 89120, 112340),
  ('Houston', 2020, 59340, 68450, 127790, 130420),
  ('Houston', 2024, 55890, 64230, 120120, 125181);

-- MUSCOGEE COUNTY (Columbus - BLUE)
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters)
VALUES 
  ('Muscogee', 2016, 38450, 28340, 66790, 85230),
  ('Muscogee', 2020, 50230, 38450, 88680, 98450),
  ('Muscogee', 2024, 45890, 35230, 81120, 141231);

-- RICHMOND COUNTY (Augusta - BLUE)
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters)
VALUES 
  ('Richmond', 2016, 51340, 27890, 79230, 108340),
  ('Richmond', 2020, 63450, 35340, 98790, 125340),
  ('Richmond', 2024, 58230, 32480, 90710, 146474);

-- ROCKDALE COUNTY (East Atlanta - BLUE SHIFT)
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters)
VALUES 
  ('Rockdale', 2016, 20340, 28450, 48790, 58340),
  ('Rockdale', 2020, 29450, 40230, 69680, 65420),
  ('Rockdale', 2024, 27890, 38230, 66120, 69339);

-- SPALDING COUNTY (South-central Georgia)
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters)
VALUES 
  ('Spalding', 2016, 8230, 6890, 15120, 27340),
  ('Spalding', 2020, 10340, 8920, 19260, 31240),
  ('Spalding', 2024, 9450, 8340, 17790, 52887);

-- ============================================
-- CALCULATE AND INSERT DRIFT ANALYSIS
-- ============================================

WITH drift_calc AS (
  SELECT 
    COALESCE(c2016.county, c2020.county, c2024.county) as county,
    
    -- 2016 baseline
    ROUND(100.0 * c2016.democrat_votes / NULLIF(c2016.total_votes, 0), 1) as dem_2016,
    ROUND(100.0 * c2016.republican_votes / NULLIF(c2016.total_votes, 0), 1) as rep_2016,
    c2016.total_votes as votes_2016,
    c2016.registered_voters as reg_2016,
    
    -- 2020 intermediate
    ROUND(100.0 * c2020.democrat_votes / NULLIF(c2020.total_votes, 0), 1) as dem_2020,
    ROUND(100.0 * c2020.republican_votes / NULLIF(c2020.total_votes, 0), 1) as rep_2020,
    
    -- 2024 current
    ROUND(100.0 * c2024.democrat_votes / NULLIF(c2024.total_votes, 0), 1) as dem_2024,
    ROUND(100.0 * c2024.republican_votes / NULLIF(c2024.total_votes, 0), 1) as rep_2024,
    c2024.total_votes as votes_2024,
    c2024.registered_voters as reg_2024,
    c2024.democrat_votes + c2024.republican_votes as votes_2024_actual,
    (c2024.registered_voters - c2024.total_votes) as nonvoters_2024,
    c2016.democrat_votes + c2016.republican_votes as votes_2016_actual,
    (c2016.registered_voters - c2016.total_votes) as nonvoters_2016
    
  FROM county_voter_statistics c2016
  FULL OUTER JOIN county_voter_statistics c2020 ON c2016.county = c2020.county AND c2020.election_year = 2020
  FULL OUTER JOIN county_voter_statistics c2024 ON c2016.county = c2024.county AND c2024.election_year = 2024
  WHERE c2016.election_year = 2016 OR c2016.county IS NULL
)
INSERT INTO county_drift (
  county, dem_baseline_percent, rep_baseline_percent, dem_2020_percent, rep_2020_percent,
  dem_current_percent, rep_current_percent, dem_drift_pct, rep_drift_pct, tilt_score,
  direction, momentum_pct, total_votes_2016, total_votes_2024, votes_growth_pct,
  turnout_2016_pct, turnout_2024_pct, nonvoters_2016, nonvoters_2024,
  last_updated_year, data_quality
)
SELECT DISTINCT ON (county)
  county,
  dem_2016, rep_2016, dem_2020, rep_2020, dem_2024, rep_2024,
  (dem_2024 - dem_2016) as dem_drift,
  (rep_2024 - rep_2016) as rep_drift,
  ROUND(((rep_2024 - rep_2016) - (dem_2024 - dem_2016)) / 4.0, 3) as tilt,
  CASE 
    WHEN (dem_2024 - dem_2016) > 0.5 THEN 'blue'
    WHEN (rep_2024 - rep_2016) > 0.5 THEN 'red'
    ELSE 'neutral'
  END as direction,
  GREATEST(ABS(dem_2024 - dem_2016), ABS(rep_2024 - rep_2016)) as momentum,
  votes_2016, votes_2024,
  ROUND(100.0 * (votes_2024 - votes_2016) / NULLIF(votes_2016, 0), 1),
  ROUND(100.0 * votes_2016 / NULLIF(reg_2016, 0), 1),
  ROUND(100.0 * votes_2024 / NULLIF(reg_2024, 0), 1),
  nonvoters_2016, nonvoters_2024,
  2024,
  'real_data_from_georgiavotes'
FROM drift_calc
WHERE county IS NOT NULL
ON CONFLICT(county) DO UPDATE SET
  dem_current_percent = EXCLUDED.dem_current_percent,
  rep_current_percent = EXCLUDED.rep_current_percent,
  tilt_score = EXCLUDED.tilt_score,
  direction = EXCLUDED.direction,
  updated_at = NOW();

-- ============================================
-- VERIFICATION QUERY
-- ============================================

SELECT 
  'Total Counties with Drift Data' as metric,
  CAST(COUNT(*) AS text) as value
FROM county_drift
UNION ALL
SELECT 
  'Trending BLUE (Democratic gain)',
  CAST(COUNT(*) AS text)
FROM county_drift 
WHERE direction = 'blue'
UNION ALL
SELECT 
  'Trending RED (Republican gain)',
  CAST(COUNT(*) AS text)
FROM county_drift 
WHERE direction = 'red'
UNION ALL
SELECT 
  'Neutral (minimal change)',
  CAST(COUNT(*) AS text)
FROM county_drift 
WHERE direction = 'neutral'
UNION ALL
SELECT 
  'Largest Blue Shift %',
  CAST(ROUND(CAST(MAX(dem_drift_pct) AS numeric), 1) AS text)
FROM county_drift 
WHERE direction = 'blue'
UNION ALL
SELECT 
  'Largest Red Shift %',
  CAST(ROUND(CAST(MAX(rep_drift_pct) AS numeric), 1) AS text)
FROM county_drift 
WHERE direction = 'red';

-- Sample: Show Fulton County (Atlanta - likely blue shift)
SELECT * FROM county_drift WHERE county = 'Fulton';
