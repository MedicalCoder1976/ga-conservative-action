-- Test: Create and populate a single county
DROP TABLE IF EXISTS county_drift CASCADE;
DROP TABLE IF EXISTS county_voter_statistics CASCADE;

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

INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters)
VALUES 
  ('Fulton', 2016, 283450, 156230, 439680, 520340),
  ('Fulton', 2020, 401230, 210340, 611570, 580320),
  ('Fulton', 2024, 378920, 198450, 577370, 847454);
