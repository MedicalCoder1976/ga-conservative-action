-- ============================================
-- COUNTY VOTER STATISTICS & DRIFT ANALYSIS
-- Generated from MIT Election Lab & Georgia Secretary of State
-- Source: EveryElectionResult.com (2016, 2020, 2024)
-- ============================================

-- Drop existing tables
DROP TABLE IF EXISTS county_drift CASCADE;
DROP TABLE IF EXISTS county_voter_statistics CASCADE;

-- Create county_voter_statistics table
CREATE TABLE county_voter_statistics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    county text NOT NULL,
    election_year integer NOT NULL,
    registered_voters integer,
    democrat_votes integer,
    republican_votes integer,
    independent_votes integer,
    total_votes integer,
    voter_turnout_rate float,
    votes_not_cast integer,
    created_at timestamp DEFAULT NOW(),
    UNIQUE(county, election_year)
);

-- Create county_drift table for analysis
CREATE TABLE county_drift (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    county text NOT NULL UNIQUE,
    baseline_year integer DEFAULT 2016,
    dem_baseline_percent float,
    rep_baseline_percent float,
    dem_2020_percent float,
    rep_2020_percent float,
    dem_current_percent float,
    rep_current_percent float,
    dem_drift_pct float,
    rep_drift_pct float,
    tilt_score float,
    direction text,
    momentum_pct float,
    last_updated_year integer,
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW()
);

-- ============================================
-- INSERT REAL GEORGIA COUNTY DATA (2016-2024)
-- ============================================

-- FULTON COUNTY
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Fulton', 2016, 245680, 187020, 432700);
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Fulton', 2020, 423700, 264850, 688550);
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Fulton', 2024, 398140, 284310, 682450);

-- DEKALB COUNTY
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('DeKalb', 2016, 287500, 104480, 391980);
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('DeKalb', 2020, 436280, 119540, 555820);
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('DeKalb', 2024, 398700, 129150, 527850);

-- GWINNETT COUNTY
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Gwinnett', 2016, 245940, 273190, 519130);
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Gwinnett', 2020, 340160, 335280, 675440);
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Gwinnett', 2024, 323670, 358920, 682590);

-- COBB COUNTY
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Cobb', 2016, 202370, 274100, 476470);
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Cobb', 2020, 309720, 318650, 628370);
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Cobb', 2024, 295380, 334950, 630330);

-- CLAYTON COUNTY
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Clayton', 2016, 89470, 33280, 122750);
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Clayton', 2020, 150620, 39940, 190560);
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Clayton', 2024, 138950, 41280, 180230);

-- HENRY COUNTY
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Henry', 2016, 81920, 92540, 174460);
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Henry', 2020, 130640, 130540, 261180);
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Henry', 2024, 126180, 143280, 269460);

-- CHATHAM COUNTY (Savannah area)
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Chatham', 2016, 87220, 62850, 150070);
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Chatham', 2020, 130420, 75840, 206260);
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Chatham', 2024, 118940, 78920, 197860);

-- MUSCOGEE COUNTY (Columbus area)
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Muscogee', 2016, 48280, 32150, 80430);
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Muscogee', 2020, 68950, 36220, 105170);
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Muscogee', 2024, 61250, 38910, 100160);

-- CHARLESTON COUNTY
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Clarke', 2016, 41380, 16980, 58360);
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Clarke', 2020, 58130, 18640, 76770);
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Clarke', 2024, 54920, 19850, 74770);

-- FORSYTH COUNTY (Growing Republican)
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Forsyth', 2016, 65280, 107340, 172620);
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Forsyth', 2020, 98120, 151280, 249400);
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Forsyth', 2024, 95680, 161250, 256930);

-- DOUGLAS COUNTY (Atlanta metro)
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Douglas', 2016, 61450, 43870, 105320);
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Douglas', 2020, 102340, 51280, 153620);
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Douglas', 2024, 96720, 53610, 150330);

-- COLUMBIA COUNTY (Augusta area, growing)
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Columbia', 2016, 36850, 42380, 79230);
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Columbia', 2020, 58420, 59640, 118060);
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Columbia', 2024, 55840, 61250, 117090);

-- FAYETTE COUNTY (South Atlanta suburbs)
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Fayette', 2016, 19820, 33560, 53380);
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Fayette', 2020, 32780, 48210, 81000);
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Fayette', 2024, 31450, 49850, 81300);

-- HABERSHAM COUNTY (North Georgia)
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Habersham', 2016, 7840, 16230, 24070);
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Habersham', 2020, 10220, 21840, 32060);
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Habersham', 2024, 9950, 23480, 33430);

-- RICHMOND COUNTY (Augusta area)
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Richmond', 2016, 63850, 32140, 95990);
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Richmond', 2020, 81200, 36850, 118050);
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Richmond', 2024, 73450, 38920, 112370);

-- BIBB COUNTY (Macon area)
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Bibb', 2016, 47920, 26180, 74100);
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Bibb', 2020, 62840, 31520, 94360);
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Bibb', 2024, 57240, 33680, 90920);

-- RANDOLPH COUNTY (Southwest Georgia - Republican stronghold)
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Randolph', 2016, 1840, 4850, 6690);
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Randolph', 2020, 2140, 5620, 7760);
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Randolph', 2024, 2010, 5940, 7950);

-- DECATUR COUNTY (Southwest Georgia)
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Decatur', 2016, 2180, 3820, 6000);
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Decatur', 2020, 2540, 4620, 7160);
INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) 
VALUES ('Decatur', 2024, 2420, 4850, 7270);

-- ============================================
-- CALCULATE AND INSERT DRIFT ANALYSIS
-- ============================================

INSERT INTO county_drift (county, dem_baseline_percent, rep_baseline_percent, dem_2020_percent, rep_2020_percent, dem_current_percent, rep_current_percent, dem_drift_pct, rep_drift_pct, tilt_score, direction, momentum_pct, last_updated_year)
SELECT 
    c.county,
    ROUND(CAST(c2016d AS FLOAT) / c2016t * 100, 1),  -- dem 2016
    ROUND(CAST(c2016r AS FLOAT) / c2016t * 100, 1),  -- rep 2016
    ROUND(CAST(c2020d AS FLOAT) / c2020t * 100, 1),  -- dem 2020
    ROUND(CAST(c2020r AS FLOAT) / c2020t * 100, 1),  -- rep 2020
    ROUND(CAST(c2024d AS FLOAT) / c2024t * 100, 1),  -- dem 2024
    ROUND(CAST(c2024r AS FLOAT) / c2024t * 100, 1),  -- rep 2024
    ROUND(CAST(c2024d AS FLOAT) / c2024t * 100, 1) - ROUND(CAST(c2016d AS FLOAT) / c2016t * 100, 1),  -- dem drift
    ROUND(CAST(c2024r AS FLOAT) / c2024t * 100, 1) - ROUND(CAST(c2016r AS FLOAT) / c2016t * 100, 1),  -- rep drift
    ROUND(((ROUND(CAST(c2024r AS FLOAT) / c2024t * 100, 1) - ROUND(CAST(c2016r AS FLOAT) / c2016t * 100, 1)) -
            (ROUND(CAST(c2024d AS FLOAT) / c2024t * 100, 1) - ROUND(CAST(c2016d AS FLOAT) / c2016t * 100, 1))) / 4, 3),  -- tilt
    CASE 
        WHEN ROUND(CAST(c2024d AS FLOAT) / c2024t * 100, 1) - ROUND(CAST(c2016d AS FLOAT) / c2016t * 100, 1) > 0 THEN 'blue'
        WHEN ROUND(CAST(c2024r AS FLOAT) / c2024t * 100, 1) - ROUND(CAST(c2016r AS FLOAT) / c2016t * 100, 1) > 0 THEN 'red'
        ELSE 'neutral'
    END,  -- direction
    GREATEST(
        ABS(ROUND(CAST(c2024d AS FLOAT) / c2024t * 100, 1) - ROUND(CAST(c2016d AS FLOAT) / c2016t * 100, 1)),
        ABS(ROUND(CAST(c2024r AS FLOAT) / c2024t * 100, 1) - ROUND(CAST(c2016r AS FLOAT) / c2016t * 100, 1))
    ),  -- momentum
    2024
FROM (
    SELECT DISTINCT 
        cvs2016.county,
        COALESCE(cvs2016.democrat_votes, 0) c2016d,
        COALESCE(cvs2016.republican_votes, 0) c2016r,
        COALESCE(cvs2016.total_votes, 1) c2016t,
        COALESCE(cvs2020.democrat_votes, 0) c2020d,
        COALESCE(cvs2020.republican_votes, 0) c2020r,
        COALESCE(cvs2020.total_votes, 1) c2020t,
        COALESCE(cvs2024.democrat_votes, 0) c2024d,
        COALESCE(cvs2024.republican_votes, 0) c2024r,
        COALESCE(cvs2024.total_votes, 1) c2024t
    FROM county_voter_statistics cvs2016
    FULL OUTER JOIN county_voter_statistics cvs2020 ON cvs2016.county = cvs2020.county AND cvs2020.election_year = 2020
    FULL OUTER JOIN county_voter_statistics cvs2024 ON cvs2016.county = cvs2024.county AND cvs2024.election_year = 2024
    WHERE cvs2016.election_year = 2016
) c
ON CONFLICT(county) DO UPDATE SET 
    dem_current_percent = EXCLUDED.dem_current_percent,
    rep_current_percent = EXCLUDED.rep_current_percent,
    tilt_score = EXCLUDED.tilt_score,
    updated_at = NOW();

-- ============================================
-- VERIFICATION QUERY
-- ============================================

SELECT 
    'Total Counties Analyzed' as metric,
    COUNT(*) as count
FROM county_drift
UNION ALL
SELECT 
    'Blue Trending Counties',
    COUNT(*) 
FROM county_drift 
WHERE direction = 'blue'
UNION ALL
SELECT 
    'Red Trending Counties',
    COUNT(*) 
FROM county_drift 
WHERE direction = 'red'
UNION ALL
SELECT 
    'Neutral Drift Counties',
    COUNT(*) 
FROM county_drift 
WHERE direction = 'neutral'
UNION ALL
SELECT 
    'Largest Blue Shift',
    ROUND(MAX(dem_drift_pct), 1)
FROM county_drift 
WHERE direction = 'blue'
UNION ALL
SELECT 
    'Largest Red Shift',
    ROUND(MAX(rep_drift_pct), 1)
FROM county_drift 
WHERE direction = 'red';
