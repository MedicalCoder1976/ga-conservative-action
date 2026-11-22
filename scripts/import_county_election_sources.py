import argparse
import csv
import io
import json
import tempfile
import urllib.request
import zipfile
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "data" / "georgia-county-election-results-2016-2024.csv"

SOURCES = {
    2016: {
        "url": "https://raw.githubusercontent.com/MEDSL/official-precinct-returns/5965d5e572dfb9affaf8b295e6ddee94773a6cf8/source/2016-ga-precinct.zip",
        "file": "2016-ga-precinct.csv",
        "name": "MIT Election Data and Science Lab, 2016 Georgia precinct returns",
    },
    2018: {
        "url": "https://raw.githubusercontent.com/MEDSL/2018-elections-official/42055b11dcd5477bc125cdec5a18fbcc60fb6bed/individual_states/2018-ga-precinct-general.zip",
        "file": "2018-ga-precinct-general.csv",
        "name": "MIT Election Data and Science Lab, 2018 Georgia precinct returns",
    },
    2020: {
        "url": "https://raw.githubusercontent.com/MEDSL/2020-elections-official/ad22f37e3f1e3355f078ba5a1efce6c221333ef1/individual_states/2020-ga-precinct-general.zip",
        "file": "2020-ga-precinct-general.csv",
        "name": "MIT Election Data and Science Lab, 2020 Georgia precinct returns",
    },
    2022: {
        "url": "https://raw.githubusercontent.com/MEDSL/2022-elections-official/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f/individual_states/2022-ga-local-precinct-general.zip",
        "file": "ga22_cleaned.csv",
        "name": "MIT Election Data and Science Lab, 2022 Georgia precinct returns",
    },
    2024: {
        "url": "https://raw.githubusercontent.com/MEDSL/2024-elections-official/df531089c78e6d0098db1a6bfb3849a066a06995/individual_states/ga24.zip",
        "file": "ga24.csv",
        "name": "MIT Election Data and Science Lab, 2024 Georgia precinct returns",
    },
}

OFFICE_MAP = {
    "US PRESIDENT": "US President",
    "PRESIDENT": "US President",
    "US SENATE": "US Senate",
    "U.S. SENATE": "US Senate",
    "U.S. SENATE (SPECIAL)": "US Senate (Special)",
    "US HOUSE": "US House",
    "U.S. HOUSE": "US House",
    "GOVERNOR": "Governor",
    "STATE SENATE": "Georgia State Senate",
    "STATE HOUSE": "Georgia State House",
}

TITLE_CASE = {
    "DEKALB": "DeKalb",
    "JEFF DAVIS": "Jeff Davis",
    "MCDUFFIE": "McDuffie",
    "MCINTOSH": "McIntosh",
    "BEN HILL": "Ben Hill",
}


def read_bytes(url: str) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": "ga-issues-import/1.0"})
    with urllib.request.urlopen(request) as response:
        return response.read()


def open_source(year: int, directory: Path):
    source = SOURCES[year]
    expected = directory / source["file"]
    if expected.exists():
        return expected.open("r", encoding="utf-8-sig", newline="")

    payload = read_bytes(source["url"])
    if source["url"].endswith(".zip"):
        with zipfile.ZipFile(io.BytesIO(payload)) as archive:
            matches = [name for name in archive.namelist() if Path(name).name == source["file"]]
            if len(matches) != 1:
                raise RuntimeError(f"Expected one {source['file']} in {source['url']}, found {matches}")
            expected.write_bytes(archive.read(matches[0]))
    else:
        expected.write_bytes(payload)

    return expected.open("r", encoding="utf-8-sig", newline="")


def normalize_county(value: str) -> str | None:
    county = value.strip().upper()
    if county.endswith(" COUNTY"):
        county = county[:-7]
    if county in {"", "STATE FLOATING"}:
        return None
    if county in TITLE_CASE:
        return TITLE_CASE[county]
    return county.title()


def normalize_party(value: str) -> str:
    party = value.strip().upper()
    aliases = {
        "DEMOCRATIC": "DEMOCRAT",
        "DEMOCRAT": "DEMOCRAT",
        "REPUBLICAN": "REPUBLICAN",
        "LIBERTARIAN": "LIBERTARIAN",
        "GREEN": "GREEN",
    }
    return aliases.get(party, party or "OTHER")


def build_party_lookup(source_file) -> dict[tuple[str, str], str]:
    lookup = {}
    for row in csv.DictReader(source_file):
        office = OFFICE_MAP.get(row.get("office", "").strip().upper())
        candidate = row.get("candidate", "").strip().upper()
        explicit_party = row.get("party_simplified") or row.get("party") or ""
        if office and candidate and explicit_party.strip():
            lookup[(office, candidate)] = normalize_party(explicit_party)
    source_file.seek(0)
    return lookup


def parse_votes(value: str) -> int:
    value = value.strip()
    if value in {"", "*"}:
        raise ValueError("Vote value is unavailable")
    return int(float(value.replace(",", "")))


def row_values(year: int, row: dict, party_lookup: dict[tuple[str, str], str]):
    raw_office = row.get("office", "").strip().upper()
    office = OFFICE_MAP.get(raw_office)
    if year == 2020 and raw_office == "US SENATE" and row.get("special", "").upper() == "TRUE":
        office = "US Senate (Special)"
    if not office:
        return None
    if row.get("stage", "").upper() not in {"GEN", "GEN RUNOFF"}:
        return None

    county_value = row.get("county_name") or row.get("county")
    county = normalize_county(county_value or "")
    if county is None:
        return None

    mode = row.get("mode", "").strip().upper()
    if year == 2022 and mode != "TOTAL":
        return None
    if year == 2024 and mode != "TOTAL":
        return None

    votes = parse_votes(row["votes"])

    district = row.get("district", "").strip().upper()
    if district in {"", "STATEWIDE"}:
        district = ""
    candidate = row.get("candidate", "").strip().upper()
    explicit_party = row.get("party_simplified") or row.get("party") or ""
    party = (
        normalize_party(explicit_party)
        if explicit_party.strip()
        else party_lookup.get((office, candidate), "OTHER")
    )
    county_fips = row.get("county_fips", "").strip()
    election_date = row.get("date", "").strip() or {
        2016: "2016-11-08",
        2018: "2018-11-06",
        2020: "2020-11-03",
        2022: "2022-11-08",
        2024: "2024-11-05",
    }[year]
    stage = "runoff" if "RUNOFF" in row.get("stage", "").upper() else "general"

    return {
        "election_year": year,
        "election_date": election_date,
        "stage": stage,
        "office": office,
        "district": district,
        "county": county,
        "county_fips": county_fips,
        "candidate": candidate,
        "party": party,
        "votes": votes,
        "source_name": SOURCES[year]["name"],
        "source_url": SOURCES[year]["url"],
        "source_file": SOURCES[year]["file"],
    }


def aggregate(year: int, directory: Path):
    totals = defaultdict(int)
    metadata = {}
    raw_rows = 0
    relevant_rows = 0
    excluded_state_floating = 0

    with open_source(year, directory) as source_file:
        party_lookup = build_party_lookup(source_file)
        for row in csv.DictReader(source_file):
            raw_rows += 1
            if (row.get("county_name") or row.get("county", "")).strip().upper() == "STATE FLOATING":
                excluded_state_floating += 1
                continue
            values = row_values(year, row, party_lookup)
            if values is None:
                continue
            relevant_rows += 1
            key = (
                values["election_year"],
                values["election_date"],
                values["stage"],
                values["office"],
                values["district"],
                values["county"],
                values["county_fips"],
                values["candidate"],
                values["party"],
                values["source_name"],
                values["source_url"],
                values["source_file"],
            )
            totals[key] += values["votes"]
            metadata[key] = values

    rows = []
    for key, votes in totals.items():
        values = dict(metadata[key])
        values["votes"] = votes
        rows.append(values)

    return rows, {
        "year": year,
        "raw_rows": raw_rows,
        "relevant_rows": relevant_rows,
        "aggregated_rows": len(rows),
        "excluded_state_floating_rows": excluded_state_floating,
    }


def validate(rows: list[dict], report: list[dict]):
    counties_by_year = defaultdict(set)
    offices_by_year = defaultdict(set)
    for row in rows:
        counties_by_year[row["election_year"]].add(row["county"])
        offices_by_year[row["election_year"]].add(row["office"])

    errors = []
    expected_offices = {
        2016: {"US President", "US Senate", "US House", "Georgia State House", "Georgia State Senate"},
        2018: {"Governor", "US House", "Georgia State House", "Georgia State Senate"},
        2020: {"US President", "US Senate", "US Senate (Special)", "US House", "Georgia State House", "Georgia State Senate"},
        2022: {"Governor", "US Senate", "US House", "Georgia State House", "Georgia State Senate"},
        2024: {"US President", "US House", "Georgia State House", "Georgia State Senate"},
    }
    statewide_offices = {
        (2016, "US President"),
        (2016, "US Senate"),
        (2020, "US President"),
        (2020, "US Senate"),
        (2020, "US Senate (Special)"),
        (2018, "Governor"),
        (2022, "Governor"),
        (2022, "US Senate"),
        (2024, "US President"),
    }
    for year in expected_offices:
        missing_offices = expected_offices[year] - offices_by_year[year]
        if missing_offices:
            errors.append(f"{year} missing offices: {sorted(missing_offices)}")
        for county_year in sorted(item for item in statewide_offices if item[0] == year):
            office = county_year[1]
            office_counties = {row["county"] for row in rows if row["election_year"] == year and row["office"] == office}
            if len(office_counties) != 159:
                errors.append(f"{year} {office} has {len(office_counties)} counties instead of 159")
    if any(row["votes"] < 0 for row in rows):
        errors.append("Negative vote totals found")
    if errors:
        raise RuntimeError("Validation failed:\n- " + "\n- ".join(errors))

    print(json.dumps(report, indent=2))
    for year in sorted(counties_by_year):
        print(f"{year}: {len(counties_by_year[year])} counties, {len(offices_by_year[year])} requested offices")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-dir", type=Path, default=None)
    args = parser.parse_args()

    with tempfile.TemporaryDirectory(prefix="ga-election-") as temporary:
        source_dir = args.source_dir or Path(temporary)
        source_dir.mkdir(parents=True, exist_ok=True)
        all_rows = []
        report = []
        for year in sorted(SOURCES):
            rows, summary = aggregate(year, source_dir)
            all_rows.extend(rows)
            report.append(summary)

    validate(all_rows, report)
    county_fips = {
        row["county"]: row["county_fips"]
        for row in all_rows
        if row["county_fips"]
    }
    for row in all_rows:
        if not row["county_fips"]:
            row["county_fips"] = county_fips[row["county"]]
    all_rows.sort(
        key=lambda row: (
            row["election_year"],
            row["office"],
            row["district"],
            row["county"],
            row["candidate"],
        )
    )
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    fields = [
        "election_year",
        "election_date",
        "stage",
        "office",
        "district",
        "county",
        "county_fips",
        "candidate",
        "party",
        "votes",
        "source_name",
        "source_url",
        "source_file",
    ]
    with OUTPUT.open("w", encoding="utf-8", newline="") as output:
        writer = csv.DictWriter(output, fieldnames=fields)
        writer.writeheader()
        writer.writerows(all_rows)
    print(f"Wrote {len(all_rows)} verified county rows to {OUTPUT}")


if __name__ == "__main__":
    main()
