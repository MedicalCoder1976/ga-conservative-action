import csv
import re
import urllib.request
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE_URL = "https://georgiavotes.com/county"
OUTPUT = ROOT / "public" / "data" / "georgia-turnout-snapshots.csv"


class CountyTableParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_target_table = False
        self.in_cell = False
        self.rows = []
        self.row = []
        self.value = ""

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if tag == "table" and attributes.get("id") == "desktopct":
            self.in_target_table = True
        elif self.in_target_table and tag == "tr":
            self.row = []
        elif self.in_target_table and tag in {"td", "th"}:
            self.in_cell = True
            self.value = ""

    def handle_data(self, data):
        if self.in_cell:
            self.value += data

    def handle_endtag(self, tag):
        if self.in_cell and tag in {"td", "th"}:
            self.row.append(re.sub(r"\s+", " ", self.value).strip())
            self.in_cell = False
        elif self.in_target_table and tag == "tr":
            if self.row:
                self.rows.append(self.row)
            self.row = []
        elif self.in_target_table and tag == "table":
            self.in_target_table = False


def parse_number(value: str) -> int:
    cleaned = value.replace(",", "").strip()
    if not cleaned.isdigit():
        raise ValueError(f"Unexpected numeric value: {value!r}")
    return int(cleaned)


def load_county_fips():
    with (ROOT / "public" / "data" / "georgia-county-election-results-2016-2024.csv").open(
        newline="", encoding="utf-8"
    ) as source:
        rows = csv.DictReader(source)
        result = {row["county"]: row["county_fips"] for row in rows}
    if len(result) != 159:
        raise RuntimeError(f"Expected 159 county FIPS mappings, found {len(result)}")
    return result


def main():
    request = urllib.request.Request(
        SOURCE_URL,
        headers={"User-Agent": "ga-issues-verified-data/1.0"},
    )
    with urllib.request.urlopen(request) as response:
        html = response.read().decode("utf-8")

    updated_match = re.search(r"Last updated\s*(?:<!--.*?-->)?\s*([0-9-]{10} [0-9:]{8})", html)
    if not updated_match:
        raise RuntimeError("Georgia Votes update timestamp was not found")
    source_updated_at = updated_match.group(1)
    datetime.strptime(source_updated_at, "%Y-%m-%d %H:%M:%S")

    parser = CountyTableParser()
    parser.feed(html)
    if not parser.rows or parser.rows[0][:2] != ["County", "RVs"]:
        raise RuntimeError("Georgia Votes county table schema changed")

    headers = parser.rows[0]
    expected = ["County", "RVs", "Votes", "Mail (A)", "Mail (V)", "Early (V)", "% of '22"]
    if headers != expected:
        raise RuntimeError(f"Unexpected Georgia Votes columns: {headers}")

    fips = load_county_fips()
    rows = []
    for values in parser.rows[1:]:
        if len(values) != len(headers):
            raise RuntimeError(f"Malformed county row: {values}")
        county = values[0].removesuffix(" County")
        if county not in fips:
            raise RuntimeError(f"Unknown county in Georgia Votes data: {county}")
        registered_voters = parse_number(values[1])
        votes = parse_number(values[2])
        mail_voted = parse_number(values[4])
        early_voted = parse_number(values[5])
        if votes < mail_voted or votes < early_voted or votes > registered_voters:
            raise RuntimeError(f"Invalid turnout values for {county}: {values}")
        did_not_vote = registered_voters - votes
        rows.append(
            {
                "election_year": "2026",
                "snapshot_at": source_updated_at,
                "status": "preliminary",
                "measurement": "accepted absentee and early ballots before Election Day",
                "county": county,
                "county_fips": fips[county],
                "registered_voters": registered_voters,
                "votes_recorded": votes,
                "mail_voted": mail_voted,
                "early_voted": early_voted,
                "estimated_not_voted": did_not_vote,
                "turnout_pct": round((votes / registered_voters) * 100, 4),
                "not_voted_pct": round((did_not_vote / registered_voters) * 100, 4),
                "source_name": "Georgia Votes (Georgia Secretary of State absentee voter file)",
                "source_url": SOURCE_URL,
                "imported_at": datetime.now(timezone.utc).isoformat(),
            }
        )

    if len(rows) != 159 or len({row["county"] for row in rows}) != 159:
        raise RuntimeError(f"Expected 159 unique counties, found {len(rows)}")
    if sum(row["votes_recorded"] for row in rows) <= 0:
        raise RuntimeError("Statewide turnout total is not positive")

    fields = list(rows[0])
    OUTPUT.write_text("", encoding="utf-8")
    with OUTPUT.open("w", newline="", encoding="utf-8") as output:
        writer = csv.DictWriter(output, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)

    print(
        f"Wrote 159 preliminary Georgia Votes rows to {OUTPUT}; "
        f"snapshot={source_updated_at}; "
        f"votes={sum(row['votes_recorded'] for row in rows):,}"
    )


if __name__ == "__main__":
    main()
