#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Scrape Georgia election data from public sources and generate drift analysis
Sources:
- EveryElectionResult.com (2016, 2020, 2024 presidential results)
- GeorgiaVotes.com (2026 early voting data)
"""

import sys
import os
import requests
from bs4 import BeautifulSoup
import json
import csv
from datetime import datetime
from typing import Dict, List, Tuple
import re

# Fix Windows console encoding
if sys.platform == 'win32':
    os.system('chcp 65001 >nul 2>&1')

class GeorgiaElectionScraper:
    def __init__(self):
        self.base_url = "https://everyelectionresult.com/united-states/georgia"
        self.georgia_votes_url = "https://georgiavotes.com/county"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        self.counties = {}
        
    def scrape_2026_data(self) -> Dict[str, Dict]:
        """Scrape 2026 early voting data from GeorgiaVotes.com"""
        print("[*] Fetching 2026 early voting data from GeorgiaVotes...")
        try:
            response = requests.get(self.georgia_votes_url, headers=self.headers, timeout=10)
            response.raise_for_status()
            
            # Parse the HTML table
            soup = BeautifulSoup(response.content, 'html.parser')
            tables = soup.find_all('table')
            
            data_2026 = {}
            
            # Find the main data table
            if tables:
                rows = tables[0].find_all('tr')[1:]  # Skip header
                for row in rows:
                    cols = row.find_all('td')
                    if len(cols) >= 7:
                        county_link = cols[0].find('a')
                        if county_link:
                            county = county_link.text.strip()
                            registered_voters = int(cols[1].text.strip().replace(',', ''))
                            total_votes = int(cols[2].text.strip().replace(',', ''))
                            
                            data_2026[county] = {
                                'year': 2026,
                                'registered_voters': registered_voters,
                                'total_votes': total_votes,
                                'turnout_rate': (total_votes / registered_voters * 100) if registered_voters > 0 else 0,
                                'votes_not_cast': registered_voters - total_votes,
                                'source': 'GeorgiaVotes.com'
                            }
            
            print(f"[OK] Scraped 2026 data for {len(data_2026)} counties")
            return data_2026
            
        except Exception as e:
            print(f"[ERROR] Error scraping 2026 data: {e}")
            return {}
    
    def scrape_year_results(self, year: int) -> Dict[str, Dict]:
        """Scrape presidential results for a given year"""
        print(f"[*] Fetching {year} election data...")
        url = f"{self.base_url}/{year}/"
        
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Look for tables with election results
            tables = soup.find_all('table')
            year_data = {}
            
            for table in tables:
                rows = table.find_all('tr')
                for row in rows[1:]:  # Skip header
                    cols = row.find_all('td')
                    if len(cols) >= 4:
                        county_link = cols[0].find('a')
                        if county_link:
                            county = county_link.text.strip()
                            
                            # Extract Democratic and Republican votes
                            # Format varies by source, so be flexible
                            text_content = row.get_text()
                            dem_votes = 0
                            rep_votes = 0
                            
                            try:
                                # Parse vote counts from cells
                                dem_votes = int(cols[1].text.strip().replace(',', ''))
                                rep_votes = int(cols[2].text.strip().replace(',', ''))
                            except:
                                # Try alternative parsing
                                pass
                            
                            if dem_votes > 0 or rep_votes > 0:
                                total = dem_votes + rep_votes
                                year_data[county] = {
                                    'year': year,
                                    'dem_votes': dem_votes,
                                    'rep_votes': rep_votes,
                                    'total_votes': total,
                                    'dem_percent': (dem_votes / total * 100) if total > 0 else 0,
                                    'rep_percent': (rep_votes / total * 100) if total > 0 else 0,
                                    'source': 'EveryElectionResult.com'
                                }
            
            print(f"[OK] Scraped {year} data for {len(year_data)} counties")
            return year_data
            
        except Exception as e:
            print(f"[ERROR] Error scraping {year} data: {e}")
            return {}
    
    def calculate_drift(self, data_2016: Dict, data_2020: Dict, data_2024: Dict) -> Dict[str, Dict]:
        """Calculate voter drift for each county across election cycles"""
        print("[*] Calculating voter drift patterns...")
        drift_analysis = {}
        
        # Get all unique counties
        all_counties = set(data_2016.keys()) | set(data_2020.keys()) | set(data_2024.keys())
        
        for county in all_counties:
            county_2016 = data_2016.get(county, {})
            county_2020 = data_2020.get(county, {})
            county_2024 = data_2024.get(county, {})
            
            if not county_2016 or not county_2024:
                continue
            
            # Calculate percent changes
            dem_2016 = county_2016.get('dem_percent', 50)
            rep_2016 = county_2016.get('rep_percent', 50)
            dem_2024 = county_2024.get('dem_percent', 50)
            rep_2024 = county_2024.get('rep_percent', 50)
            
            # Drift = change from 2016 to 2024
            dem_drift = dem_2024 - dem_2016
            rep_drift = rep_2024 - rep_2016
            
            # Tilt score: -1 (blue shift) to +1 (red shift)
            # Negative = trending Democratic, Positive = trending Republican
            net_drift = rep_drift - dem_drift
            tilt = net_drift / 4  # Normalize to -1 to +1 range
            tilt = max(-1, min(1, tilt))  # Clamp to -1 to +1
            
            # Determine direction (momentum)
            if dem_drift > 0:
                direction = "blue"
                momentum = abs(dem_drift)
            elif rep_drift > 0:
                direction = "red"
                momentum = abs(rep_drift)
            else:
                direction = "neutral"
                momentum = 0
            
            # 2020 intermediate
            dem_2020 = county_2020.get('dem_percent', 50)
            rep_2020 = county_2020.get('rep_percent', 50)
            
            drift_analysis[county] = {
                'county': county,
                'baseline_year': 2016,
                'dem_2016': round(dem_2016, 1),
                'rep_2016': round(rep_2016, 1),
                'dem_2020': round(dem_2020, 1),
                'rep_2020': round(rep_2020, 1),
                'dem_2024': round(dem_2024, 1),
                'rep_2024': round(rep_2024, 1),
                'dem_drift_pct': round(dem_drift, 1),
                'rep_drift_pct': round(rep_drift, 1),
                'tilt_score': round(tilt, 3),  # -1 to +1
                'direction': direction,  # 'blue', 'red', 'neutral'
                'momentum_pct': round(momentum, 1),
                'total_votes_2024': county_2024.get('total_votes', 0),
                'total_votes_2016': county_2016.get('total_votes', 0),
                'turnout_change': round((county_2024.get('total_votes', 0) / county_2016.get('total_votes', 1) - 1) * 100, 1),
            }
        
        print(f"[OK] Calculated drift for {len(drift_analysis)} counties")
        return drift_analysis
    
    def export_sql(self, drift_analysis: Dict, data_2026: Dict) -> str:
        """Generate SQL statements to populate the database"""
        print("[*] Generating SQL statements...")
        
        sql_lines = [
            "-- ============================================",
            "-- COUNTY VOTER STATISTICS & DRIFT ANALYSIS",
            "-- Generated: " + datetime.now().isoformat(),
            "-- Source: EveryElectionResult.com, GeorgiaVotes.com",
            "-- ============================================\n",
            "-- Drop and recreate tables",
            "DROP TABLE IF EXISTS county_drift;",
            "DROP TABLE IF EXISTS county_voter_statistics;\n",
            "-- Create county_voter_statistics table",
            """CREATE TABLE county_voter_statistics (
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
);""",
            "\n-- Create county_drift table",
            """CREATE TABLE county_drift (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    county text NOT NULL UNIQUE,
    baseline_year integer DEFAULT 2016,
    dem_baseline_percent float,
    rep_baseline_percent float,
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
);""",
        ]
        
        # Insert voter statistics
        sql_lines.append("\n-- ============================================")
        sql_lines.append("-- INSERT VOTER STATISTICS FOR ALL YEARS")
        sql_lines.append("-- ============================================\n")
        
        for county, analysis in sorted(drift_analysis.items()):
            # 2016 data
            sql_lines.append(
                f"INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) "
                f"VALUES ('{county}', 2016, "
                f"{int(analysis['dem_2016'] * analysis['total_votes_2016'] / 100)}, "
                f"{int(analysis['rep_2016'] * analysis['total_votes_2016'] / 100)}, "
                f"{analysis['total_votes_2016']}) "
                f"ON CONFLICT(county, election_year) DO NOTHING;"
            )
            
            # 2024 data
            sql_lines.append(
                f"INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) "
                f"VALUES ('{county}', 2024, "
                f"{int(analysis['dem_2024'] * analysis['total_votes_2024'] / 100)}, "
                f"{int(analysis['rep_2024'] * analysis['total_votes_2024'] / 100)}, "
                f"{analysis['total_votes_2024']}) "
                f"ON CONFLICT(county, election_year) DO NOTHING;"
            )
        
        # Insert drift analysis
        sql_lines.append("\n-- ============================================")
        sql_lines.append("-- INSERT DRIFT ANALYSIS")
        sql_lines.append("-- ============================================\n")
        
        for county, analysis in sorted(drift_analysis.items()):
            sql_lines.append(
                f"""INSERT INTO county_drift (county, dem_baseline_percent, rep_baseline_percent, dem_current_percent, rep_current_percent, dem_drift_pct, rep_drift_pct, tilt_score, direction, momentum_pct, last_updated_year)
VALUES ('{county}', {analysis['dem_2016']}, {analysis['rep_2016']}, {analysis['dem_2024']}, {analysis['rep_2024']}, {analysis['dem_drift_pct']}, {analysis['rep_drift_pct']}, {analysis['tilt_score']}, '{analysis['direction']}', {analysis['momentum_pct']}, 2024)
ON CONFLICT(county) DO UPDATE SET dem_current_percent = EXCLUDED.dem_current_percent, rep_current_percent = EXCLUDED.rep_current_percent, tilt_score = EXCLUDED.tilt_score, updated_at = NOW();"""
            )
        
        sql_lines.append("\n-- ============================================")
        sql_lines.append("-- VERIFICATION QUERY")
        sql_lines.append("-- ============================================\n")
        sql_lines.append("""SELECT 
    'Total Counties' as metric,
    COUNT(*) as value
FROM county_drift
UNION ALL
SELECT 
    'Blue Trend Counties',
    COUNT(*) 
FROM county_drift 
WHERE direction = 'blue'
UNION ALL
SELECT 
    'Red Trend Counties',
    COUNT(*) 
FROM county_drift 
WHERE direction = 'red'
UNION ALL
SELECT 
    'Neutral Drift Counties',
    COUNT(*) 
FROM county_drift 
WHERE direction = 'neutral';""")
        
        return "\n".join(sql_lines)
        
        sql_lines = [
            "-- ============================================",
            "-- COUNTY VOTER STATISTICS & DRIFT ANALYSIS",
            "-- Generated: " + datetime.now().isoformat(),
            "-- Source: EveryElectionResult.com, GeorgiaVotes.com",
            "-- ============================================\n",
            "-- Drop and recreate tables",
            "DROP TABLE IF EXISTS county_drift;",
            "DROP TABLE IF EXISTS county_voter_statistics;\n",
            "-- Create county_voter_statistics table",
            """CREATE TABLE county_voter_statistics (
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
);""",
            "\n-- Create county_drift table",
            """CREATE TABLE county_drift (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    county text NOT NULL UNIQUE,
    baseline_year integer DEFAULT 2016,
    dem_baseline_percent float,
    rep_baseline_percent float,
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
);""",
        ]
        
        # Insert voter statistics
        sql_lines.append("\n-- ============================================")
        sql_lines.append("-- INSERT VOTER STATISTICS FOR ALL YEARS")
        sql_lines.append("-- ============================================\n")
        
        for county, analysis in sorted(drift_analysis.items()):
            # 2016 data
            sql_lines.append(
                f"INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) "
                f"VALUES ('{county}', 2016, "
                f"{int(analysis['dem_2016'] * analysis['total_votes_2016'] / 100)}, "
                f"{int(analysis['rep_2016'] * analysis['total_votes_2016'] / 100)}, "
                f"{analysis['total_votes_2016']}) "
                f"ON CONFLICT(county, election_year) DO NOTHING;"
            )
            
            # 2024 data
            sql_lines.append(
                f"INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes) "
                f"VALUES ('{county}', 2024, "
                f"{int(analysis['dem_2024'] * analysis['total_votes_2024'] / 100)}, "
                f"{int(analysis['rep_2024'] * analysis['total_votes_2024'] / 100)}, "
                f"{analysis['total_votes_2024']}) "
                f"ON CONFLICT(county, election_year) DO NOTHING;"
            )
        
        # Insert drift analysis
        sql_lines.append("\n-- ============================================")
        sql_lines.append("-- INSERT DRIFT ANALYSIS")
        sql_lines.append("-- ============================================\n")
        
        for county, analysis in sorted(drift_analysis.items()):
            sql_lines.append(
                f"""INSERT INTO county_drift (county, dem_baseline_percent, rep_baseline_percent, dem_current_percent, rep_current_percent, dem_drift_pct, rep_drift_pct, tilt_score, direction, momentum_pct, last_updated_year)
VALUES ('{county}', {analysis['dem_2016']}, {analysis['rep_2016']}, {analysis['dem_2024']}, {analysis['rep_2024']}, {analysis['dem_drift_pct']}, {analysis['rep_drift_pct']}, {analysis['tilt_score']}, '{analysis['direction']}', {analysis['momentum_pct']}, 2024)
ON CONFLICT(county) DO UPDATE SET dem_current_percent = EXCLUDED.dem_current_percent, rep_current_percent = EXCLUDED.rep_current_percent, tilt_score = EXCLUDED.tilt_score, updated_at = NOW();"""
            )
        
        sql_lines.append("\n-- ============================================")
        sql_lines.append("-- VERIFICATION QUERY")
        sql_lines.append("-- ============================================\n")
        sql_lines.append("""SELECT 
    'Total Counties' as metric,
    COUNT(*) as value
FROM county_drift
UNION ALL
SELECT 
    'Blue Trend Counties',
    COUNT(*) 
FROM county_drift 
WHERE direction = 'blue'
UNION ALL
SELECT 
    'Red Trend Counties',
    COUNT(*) 
FROM county_drift 
WHERE direction = 'red'
UNION ALL
SELECT 
    'Neutral Drift Counties',
    COUNT(*) 
FROM county_drift 
WHERE direction = 'neutral';""")
        
        return "\n".join(sql_lines)

def main():
    scraper = GeorgiaElectionScraper()
    
    # Scrape election data
    print("[*] Starting Georgia Election Data Scraper...\n")
    
    data_2016 = scraper.scrape_year_results(2016)
    data_2020 = scraper.scrape_year_results(2020)
    data_2024 = scraper.scrape_year_results(2024)
    data_2026 = scraper.scrape_2026_data()
    
    # Calculate drift
    drift_analysis = scraper.calculate_drift(data_2016, data_2020, data_2024)
    
    # Export to SQL
    sql_output = scraper.export_sql(drift_analysis, data_2026)
    
    # Save SQL file
    output_file = "SETUP_VOTER_DRIFT.sql"
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(sql_output)
    print(f"\n[OK] SQL file saved to: {output_file}")
    
    # Save drift analysis as JSON for reference
    json_file = "county_drift_analysis.json"
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(drift_analysis, f, indent=2)
    print(f"[OK] JSON analysis saved to: {json_file}")
    
    # Print summary
    blue_counties = sum(1 for d in drift_analysis.values() if d['direction'] == 'blue')
    red_counties = sum(1 for d in drift_analysis.values() if d['direction'] == 'red')
    neutral_counties = sum(1 for d in drift_analysis.values() if d['direction'] == 'neutral')
    
    print(f"\n[SUMMARY]:")
    print(f"   Total Counties: {len(drift_analysis)}")
    print(f"   [BLUE] Trending Blue: {blue_counties}")
    print(f"   [RED] Trending Red: {red_counties}")
    print(f"   [NEUTRAL] Neutral: {neutral_counties}")

if __name__ == "__main__":
    main()
