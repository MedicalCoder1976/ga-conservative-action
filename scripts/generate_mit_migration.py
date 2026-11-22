import csv
from pathlib import Path


root = Path(__file__).resolve().parents[2]
source = root / "georgia_election_data_MIT_VERIFIED_2016_2024.csv"
output = (
    root
    / "ga-conservative-action"
    / "supabase"
    / "migrations"
    / "20261122_replace_synthetic_elections_with_mit.sql"
)

with source.open(newline="", encoding="utf-8") as csv_file:
    rows = list(csv.DictReader(csv_file))

lines = [
    "-- MIT Election Data and Science Lab: County Presidential Election Returns 2000-2024",
    "-- Harvard Dataverse DOI: https://doi.org/10.7910/DVN/VOQCHQ",
    "-- Verified 477-row presidential county dataset; no synthetic registration or turnout values",
    "BEGIN;",
    "DELETE FROM county_drift;",
    "DELETE FROM county_voter_statistics;",
    "",
]

for row in rows:
    county = row["county"].replace("'", "''")
    lines.append(
        "INSERT INTO county_voter_statistics "
        "(county, election_year, registered_voters, democrat_votes, republican_votes, "
        "total_votes, voter_turnout_rate, votes_not_cast) "
        f"VALUES ('{county}', {row['year']}, NULL, {row['dem_votes']}, "
        f"{row['rep_votes']}, {row['total_votes']}, NULL, NULL) "
        "ON CONFLICT (county, election_year) DO UPDATE SET "
        "registered_voters=NULL, democrat_votes=EXCLUDED.democrat_votes, "
        "republican_votes=EXCLUDED.republican_votes, total_votes=EXCLUDED.total_votes, "
        "voter_turnout_rate=NULL, votes_not_cast=NULL;"
    )

lines += [
    "",
    "INSERT INTO county_drift "
    "(county, dem_baseline_percent, rep_baseline_percent, dem_2020_percent, "
    "rep_2020_percent, dem_current_percent, rep_current_percent, dem_drift_pct, "
    "rep_drift_pct, tilt_score, direction, momentum_pct, total_votes_2016, "
    "total_votes_2024, votes_growth_pct, turnout_2016_pct, turnout_2024_pct, "
    "nonvoters_2016, nonvoters_2024, last_updated_year, data_quality)",
    "SELECT y16.county, "
    "y16.democrat_votes::float/y16.total_votes*100, "
    "y16.republican_votes::float/y16.total_votes*100, "
    "y20.democrat_votes::float/y20.total_votes*100, "
    "y20.republican_votes::float/y20.total_votes*100, "
    "y24.democrat_votes::float/y24.total_votes*100, "
    "y24.republican_votes::float/y24.total_votes*100, "
    "(y24.democrat_votes::float/y24.total_votes*100)-(y16.democrat_votes::float/y16.total_votes*100), "
    "(y24.republican_votes::float/y24.total_votes*100)-(y16.republican_votes::float/y16.total_votes*100), "
    "((y24.republican_votes::float/y24.total_votes*100)-(y16.republican_votes::float/y16.total_votes*100))/100, "
    "CASE WHEN y24.republican_votes::float/y24.total_votes >= y16.republican_votes::float/y16.total_votes THEN 'red' ELSE 'blue' END, "
    "ABS((y24.republican_votes::float/y24.total_votes*100)-(y16.republican_votes::float/y16.total_votes*100)), "
    "y16.total_votes, y24.total_votes, "
    "CASE WHEN y16.total_votes>0 THEN (y24.total_votes-y16.total_votes)::float/y16.total_votes*100 ELSE NULL END, "
    "NULL, NULL, NULL, NULL, 2024, 'MIT verified'",
    "FROM county_voter_statistics y16",
    "JOIN county_voter_statistics y24 ON y24.county=y16.county AND y24.election_year=2024",
    "JOIN county_voter_statistics y20 ON y20.county=y16.county AND y20.election_year=2020",
    "WHERE y16.election_year=2016",
    "ON CONFLICT (county) DO NOTHING;",
    "",
    "COMMIT;",
]

output.write_text("\n".join(lines), encoding="utf-8")
print(f"Wrote {output} with {len(rows)} rows")
