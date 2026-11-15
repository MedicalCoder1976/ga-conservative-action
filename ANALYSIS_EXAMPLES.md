# Georgia Presidential Election Analysis - Sample Code

## Sample Analysis Scripts

### Python: Complete Analysis Workflow

```python
#!/usr/bin/env python3
"""
Georgia Presidential Election Data Analysis
2016, 2020, 2024 Presidential Election Results
"""

import pandas as pd
import json
from datetime import datetime

# ============================================
# 1. LOAD DATA
# ============================================

# Load from CSV
df = pd.read_csv('georgia_election_data.csv')

# Load from JSON (alternative)
# with open('georgia_election_data.json') as f:
#     data = json.load(f)
#     df = pd.DataFrame([
#         {'year': int(year), 'county': county, **values}
#         for year, counties in data['data'].items()
#         for county, values in counties.items()
#     ])

print("Dataset loaded successfully!")
print(f"Total records: {len(df)}")
print(f"Counties: {df['county'].nunique()}")
print(f"Years: {sorted(df['year'].unique())}")
print("\n" + "="*60)

# ============================================
# 2. BASIC STATISTICS
# ============================================

print("\n📊 BASIC STATISTICS")
print("="*60)

# Statewide totals by year
statewide = df.groupby('year')[['dem_votes', 'rep_votes', 'other_votes', 'total_votes']].sum()
print("\nStatewide Vote Totals:")
print(statewide)

# Calculate margins
statewide['dem_pct'] = (statewide['dem_votes'] / statewide['total_votes'] * 100).round(1)
statewide['rep_pct'] = (statewide['rep_votes'] / statewide['total_votes'] * 100).round(1)
statewide['margin'] = statewide['dem_votes'] - statewide['rep_votes']

print("\nStatewide Percentages & Margins:")
print(statewide[['dem_pct', 'rep_pct', 'margin']])

# ============================================
# 3. COUNTY-LEVEL ANALYSIS
# ============================================

print("\n" + "="*60)
print("📍 COUNTY-LEVEL ANALYSIS")
print("="*60)

# Most Democratic counties (2024)
print("\nTop 10 Democratic Counties (2024):")
dem_2024 = df[df['year'] == 2024].copy()
dem_2024['dem_pct'] = (dem_2024['dem_votes'] / dem_2024['total_votes'] * 100).round(1)
dem_2024_top = dem_2024.nlargest(10, 'dem_votes')[['county', 'dem_votes', 'rep_votes', 'dem_pct']]
print(dem_2024_top.to_string())

# Most Republican counties (2024)
print("\nTop 10 Republican Counties (2024):")
rep_2024 = df[df['year'] == 2024].copy()
rep_2024['rep_pct'] = (rep_2024['rep_votes'] / rep_2024['total_votes'] * 100).round(1)
rep_2024_top = rep_2024.nlargest(10, 'rep_votes')[['county', 'dem_votes', 'rep_votes', 'rep_pct']]
print(rep_2024_top.to_string())

# ============================================
# 4. TREND ANALYSIS
# ============================================

print("\n" + "="*60)
print("📈 TREND ANALYSIS: 2016 → 2024")
print("="*60)

# Calculate Democratic percentage by county and year
df['dem_pct'] = (df['dem_votes'] / df['total_votes'] * 100).round(1)

# Pivot to show trends
trend = df.pivot_table(
    values='dem_pct', 
    index='county', 
    columns='year',
    aggfunc='first'
)

# Calculate change
trend['2016→2024_change'] = (trend[2024] - trend[2016]).round(1)
trend['2020→2024_change'] = (trend[2024] - trend[2020]).round(1)

# Most improved for Democrats
print("\nCounties with Largest Democratic Gains (2016→2024):")
print(trend.nlargest(10, '2016→2024_change')[['2016', '2020', '2024', '2016→2024_change']].to_string())

# Most improved for Republicans (largest losses for Democrats)
print("\nCounties with Largest Democratic Losses (2016→2024):")
print(trend.nsmallest(10, '2016→2024_change')[['2016', '2020', '2024', '2016→2024_change']].to_string())

# ============================================
# 5. COUNTY TYPE ANALYSIS
# ============================================

print("\n" + "="*60)
print("🏘️  COUNTY TYPE ANALYSIS")
print("="*60)

# Define county groups
urban_counties = {'Fulton', 'DeKalb', 'Gwinnett', 'Cobb', 'Clayton', 'Henry', 
                 'Chatham', 'Richmond', 'Muscogee', 'Bibb', 'Dougherty', 'Douglas'}
suburban_counties = {'Cherokee', 'Forsyth', 'Fayette', 'Newton', 'Spalding', 'Houston'}

df['county_type'] = df['county'].apply(lambda x: 
    'Urban' if x in urban_counties else 
    'Suburban' if x in suburban_counties else 
    'Rural'
)

# Analysis by county type
type_analysis = df.groupby(['year', 'county_type'])[['dem_votes', 'rep_votes', 'total_votes']].sum()
type_analysis['dem_pct'] = (type_analysis['dem_votes'] / type_analysis['total_votes'] * 100).round(1)

print("\nDemocratic Percentage by County Type & Year:")
print(type_analysis['dem_pct'].unstack())

# ============================================
# 6. TURNOUT ANALYSIS
# ============================================

print("\n" + "="*60)
print("🗳️  TURNOUT ANALYSIS")
print("="*60)

df['turnout_pct'] = (df['total_votes'] / df['registered_voters'] * 100).round(1)

turnout_by_year = df.groupby('year')['turnout_pct'].agg(['mean', 'min', 'max'])
print("\nVoter Turnout by Year:")
print(turnout_by_year)

# Highest turnout counties (2024)
print("\nHighest Turnout Counties (2024):")
print(df[df['year'] == 2024].nlargest(10, 'turnout_pct')[['county', 'turnout_pct', 'total_votes', 'registered_voters']].to_string())

# ============================================
# 7. EXPORT RESULTS
# ============================================

print("\n" + "="*60)
print("💾 EXPORTING ANALYSIS")
print("="*60)

# Save trend analysis
trend.to_csv('county_trend_analysis.csv')
print("\n✓ Saved: county_trend_analysis.csv")

# Save by county type
type_analysis.to_csv('county_type_analysis.csv')
print("✓ Saved: county_type_analysis.csv")

# Save turnout analysis
turnout_detail = df[['year', 'county', 'total_votes', 'registered_voters', 'turnout_pct']].copy()
turnout_detail.to_csv('turnout_by_county.csv', index=False)
print("✓ Saved: turnout_by_county.csv")

print("\n" + "="*60)
print("Analysis complete! Generated 3 output CSV files.")
print("="*60)
```

---

### SQL: Useful Queries

```sql
-- ============================================
-- STATEWIDE TOTALS
-- ============================================

-- Total votes by year
SELECT 
    year,
    SUM(dem_votes) as dem_total,
    SUM(rep_votes) as rep_total,
    SUM(total_votes) as votes_cast,
    ROUND(SUM(dem_votes) * 100.0 / SUM(total_votes), 2) as dem_pct
FROM georgia_elections
GROUP BY year
ORDER BY year;

-- ============================================
-- TOP COUNTIES
-- ============================================

-- Highest Democratic performance (2024)
SELECT 
    county,
    dem_votes,
    rep_votes,
    ROUND(dem_votes * 100.0 / (dem_votes + rep_votes), 1) as dem_pct
FROM georgia_elections
WHERE year = 2024
ORDER BY dem_votes DESC
LIMIT 20;

-- Highest Republican performance (2024)
SELECT 
    county,
    dem_votes,
    rep_votes,
    ROUND(rep_votes * 100.0 / (dem_votes + rep_votes), 1) as rep_pct
FROM georgia_elections
WHERE year = 2024
ORDER BY rep_votes DESC
LIMIT 20;

-- ============================================
-- TREND ANALYSIS
-- ============================================

-- Democratic performance trend by county
SELECT 
    c2016.county,
    ROUND(c2016.dem_votes * 100.0 / c2016.total_votes, 1) as dem_2016,
    ROUND(c2020.dem_votes * 100.0 / c2020.total_votes, 1) as dem_2020,
    ROUND(c2024.dem_votes * 100.0 / c2024.total_votes, 1) as dem_2024,
    ROUND(
        (c2024.dem_votes * 100.0 / c2024.total_votes) - 
        (c2016.dem_votes * 100.0 / c2016.total_votes), 
        1
    ) as change_2016_2024
FROM georgia_elections c2016
JOIN georgia_elections c2020 ON c2016.county = c2020.county AND c2020.year = 2020
JOIN georgia_elections c2024 ON c2016.county = c2024.county AND c2024.year = 2024
WHERE c2016.year = 2016
ORDER BY change_2016_2024 DESC;

-- ============================================
-- SWING COUNTIES
-- ============================================

-- Counties that flipped from Republican to Democratic (2016→2024)
SELECT 
    c2016.county,
    c2016.rep_votes - c2016.dem_votes as rep_margin_2016,
    c2024.dem_votes - c2024.rep_votes as dem_margin_2024,
    ABS((c2024.dem_votes - c2024.rep_votes) - (c2016.rep_votes - c2016.dem_votes)) as swing
FROM georgia_elections c2016
JOIN georgia_elections c2024 ON c2016.county = c2024.county
WHERE c2016.year = 2016 AND c2024.year = 2024
    AND c2016.rep_votes > c2016.dem_votes
    AND c2024.dem_votes > c2024.rep_votes
ORDER BY swing DESC;

-- ============================================
-- TURNOUT ANALYSIS
-- ============================================

-- Turnout rates by county and year
SELECT 
    year,
    county,
    total_votes,
    registered_voters,
    ROUND(total_votes * 100.0 / registered_voters, 1) as turnout_pct
FROM georgia_elections
ORDER BY year, turnout_pct DESC;

-- Average turnout by year
SELECT 
    year,
    ROUND(AVG(total_votes * 100.0 / registered_voters), 1) as avg_turnout,
    MIN(ROUND(total_votes * 100.0 / registered_voters, 1)) as min_turnout,
    MAX(ROUND(total_votes * 100.0 / registered_voters, 1)) as max_turnout
FROM georgia_elections
GROUP BY year
ORDER BY year;

-- ============================================
-- GROWTH ANALYSIS
-- ============================================

-- Vote growth from 2016 to 2024
SELECT 
    c2016.county,
    c2016.total_votes as votes_2016,
    c2024.total_votes as votes_2024,
    c2024.total_votes - c2016.total_votes as growth,
    ROUND((c2024.total_votes - c2016.total_votes) * 100.0 / c2016.total_votes, 1) as growth_pct
FROM georgia_elections c2016
JOIN georgia_elections c2024 ON c2016.county = c2024.county
WHERE c2016.year = 2016 AND c2024.year = 2024
ORDER BY growth DESC
LIMIT 20;
```

---

### Excel Formulas

```excel
# Democratic Percentage
=B2/(B2+C2)*100

# Turnout Percentage
=E2/G2*100

# Margin (positive = Democratic, negative = Republican)
=B2-C2

# Year-over-Year Change
=INDEX(F:F,MATCH(1,(A:A=2024)*(D:D=D2),0))-INDEX(F:F,MATCH(1,(A:A=2016)*(D:D=D2),0))

# Pivot Table Suggestions:
# Rows: County
# Columns: Year
# Values: Sum of dem_votes, Sum of total_votes
```

---

## Next Steps

1. **Run the Python script** for complete automated analysis
2. **Execute SQL queries** in your database for detailed insights
3. **Create visualizations** using the exported CSV files
4. **Share findings** with your team or stakeholders

Generated: 2026-11-15
