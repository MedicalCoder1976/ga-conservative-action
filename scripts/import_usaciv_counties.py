"""Import verified USA Civ county intelligence for Georgia.

This importer downloads the official USA Civ county JSON snapshot and keeps
only the 159 Georgia county records. It does not create estimates or fill
missing values.
"""

from __future__ import annotations

import json
import statistics
import urllib.request
from pathlib import Path


SOURCE_URL = "https://karpathy.ai/usaciv/data/counties.json"
SOURCE_VINTAGE = "USA Civ county snapshot"
OUTPUT = Path("public/data/usaciv-georgia-county-intelligence.json")

KEEP_FIELDS = (
    "geoid",
    "name",
    "state",
    "population",
    "land_km2",
    "density",
    "income",
    "home_value",
    "poverty",
    "median_age",
    "foreign_born",
    "bachelors",
    "broadband",
    "commute",
    "homeownership",
    "uninsured",
    "forest",
    "crop",
    "pasture",
    "developed",
    "cbsa",
    "cell",
    "faith",
    "faith_tradition",
    "amenities",
    "mhlth",
    "loneliness",
    "disasters",
    "veterans",
    "veterans_pct",
    "armed_forces",
    "armed_forces_pct",
)

REFERENCE_LINKS = {
    "census": "https://www.census.gov/programs-surveys/acs",
    "bea": "https://apps.bea.gov/regional/",
    "nlcd": "https://www.mrlc.gov/",
    "cdc": "https://www.cdc.gov/places/",
    "fema": "https://www.fema.gov/openfema-data-page",
    "religion": "https://www.thearda.com/us-religion",
    "source": SOURCE_URL,
}


def median(rows: list[dict], field: str) -> float | None:
    values = [row[field] for row in rows if isinstance(row.get(field), (int, float))]
    return statistics.median(values) if values else None


def main() -> None:
    with urllib.request.urlopen(SOURCE_URL, timeout=60) as response:
        source = json.load(response)

    if not isinstance(source.get("rows"), list) or not source.get("columns"):
        raise RuntimeError("USA Civ county JSON has an unexpected shape")

    columns = source["columns"]
    missing = [field for field in KEEP_FIELDS if field not in columns]
    if missing:
        raise RuntimeError(f"USA Civ county JSON is missing fields: {missing}")

    column_index = {column: index for index, column in enumerate(columns)}
    georgia_rows = []

    for values in source["rows"]:
        row = {column: values[column_index[column]] for column in KEEP_FIELDS}
        if row["state"] == "GA":
            georgia_rows.append(row)

    if len(georgia_rows) != 159:
        raise RuntimeError(
            f"Expected 159 Georgia county rows, found {len(georgia_rows)}"
        )

    geoid_set = {row["geoid"] for row in georgia_rows}
    if len(geoid_set) != 159:
        raise RuntimeError("Georgia county FIPS codes are not unique")

    numeric_fields = (
        "population",
        "density",
        "income",
        "home_value",
        "poverty",
        "median_age",
        "foreign_born",
        "bachelors",
        "broadband",
        "commute",
        "homeownership",
        "uninsured",
        "forest",
        "crop",
        "pasture",
        "developed",
        "faith",
        "amenities",
        "mhlth",
        "loneliness",
        "disasters",
        "veterans",
        "veterans_pct",
        "armed_forces",
        "armed_forces_pct",
    )

    medians = {field: median(georgia_rows, field) for field in numeric_fields}
    result = {
        "version": 1,
        "source": SOURCE_URL,
        "source_vintage": source.get("vintage", SOURCE_VINTAGE),
        "retrieved_from": "USA Civ public county dataset",
        "license_note": (
            "USA Civ code is MIT licensed. Underlying federal and third-party data "
            "remain subject to their original source terms."
        ),
        "references": REFERENCE_LINKS,
        "georgia_medians": medians,
        "counties": georgia_rows,
    }

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(
        json.dumps(result, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(georgia_rows)} Georgia county records to {OUTPUT}")


if __name__ == "__main__":
    main()
