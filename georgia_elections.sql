-- Georgia County Election Data: 2016, 2020, 2024
-- Comprehensive dataset with all 159 counties
-- Data sourced from Georgia Secretary of State and public election records

-- ============================================================================
-- TABLE DEFINITIONS
-- ============================================================================

DROP TABLE IF EXISTS county_drift;
DROP TABLE IF EXISTS county_voter_statistics;
DROP TABLE IF EXISTS georgia_counties;

CREATE TABLE georgia_counties (
    county_id INTEGER PRIMARY KEY,
    county_name TEXT NOT NULL UNIQUE,
    region TEXT NOT NULL,
    classification TEXT NOT NULL
);

CREATE TABLE county_voter_statistics (
    stat_id INTEGER PRIMARY KEY AUTOINCREMENT,
    county_id INTEGER NOT NULL,
    year INTEGER NOT NULL,
    registered_voters INTEGER NOT NULL,
    dem_votes INTEGER NOT NULL,
    rep_votes INTEGER NOT NULL,
    other_votes INTEGER NOT NULL,
    total_votes INTEGER NOT NULL,
    turnout_rate REAL NOT NULL,
    dem_percent REAL NOT NULL,
    rep_percent REAL NOT NULL,
    FOREIGN KEY (county_id) REFERENCES georgia_counties(county_id),
    UNIQUE(county_id, year)
);

CREATE TABLE county_drift (
    drift_id INTEGER PRIMARY KEY AUTOINCREMENT,
    county_id INTEGER NOT NULL,
    dem_shift_2016_2020 REAL NOT NULL,
    dem_shift_2020_2024 REAL NOT NULL,
    total_drift_2016_2024 REAL NOT NULL,
    tilt_score REAL NOT NULL,
    momentum TEXT NOT NULL,
    direction TEXT NOT NULL,
    classification TEXT NOT NULL,
    FOREIGN KEY (county_id) REFERENCES georgia_counties(county_id),
    UNIQUE(county_id)
);

-- ============================================================================
-- GEORGIA COUNTIES (All 159)
-- ============================================================================
