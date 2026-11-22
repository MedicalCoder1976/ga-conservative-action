import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const selectedYear = request.nextUrl.searchParams.get('year') || '2024';
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { error: 'Missing Supabase credentials' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Fetch 2016 baseline data
    const { data: baseline2016, error: err2016 } = await supabase
      .from('county_voter_statistics')
      .select('county, democrat_votes, republican_votes, total_votes, registered_voters')
      .eq('election_year', 2016);

    // Fetch current year data
    const { data: currentYear, error: errCurrent } = await supabase
      .from('county_voter_statistics')
      .select('county, democrat_votes, republican_votes, total_votes, registered_voters')
      .eq('election_year', parseInt(selectedYear));

    if (err2016 || errCurrent) {
      console.error('Supabase errors:', err2016, errCurrent);
      return NextResponse.json(
        { error: 'Failed to fetch election data' },
        { status: 500 }
      );
    }

    // Create lookup maps
    const baselineMap = new Map();
    const currentMap = new Map();
    
    baseline2016?.forEach((row: any) => {
      baselineMap.set(row.county, {
        dem: row.democrat_votes || 0,
        rep: row.republican_votes || 0,
        total: row.total_votes || 1,
        registered_voters: row.registered_voters || 0,
      });
    });

    currentYear?.forEach((row: any) => {
      currentMap.set(row.county, {
        dem: row.democrat_votes || 0,
        rep: row.republican_votes || 0,
        total: row.total_votes || 1,
        registered_voters: row.registered_voters || 0,
      });
    });

    // Calculate drift for each county
    const driftData: Record<string, any> = {};
    const GEORGIA_COUNTIES = [
      'Appling', 'Atkinson', 'Bacon', 'Baker', 'Baldwin', 'Banks', 'Barrow', 'Bartow', 'Ben Hill', 'Berrien',
      'Bibb', 'Bleckley', 'Brantley', 'Brooks', 'Bryan', 'Bulloch', 'Burke', 'Butts', 'Calhoun', 'Camden',
      'Campbell', 'Candler', 'Carroll', 'Catoosa', 'Charlton', 'Chatham', 'Chattahoochee', 'Chattooga', 'Cherokee', 'Clarke',
      'Clay', 'Clayton', 'Clinch', 'Cobb', 'Coffee', 'Colquitt', 'Columbia', 'Cook', 'Coweta', 'Crawford',
      'Crisp', 'Dade', 'Dawson', 'Decatur', 'DeKalb', 'Dodge', 'Dooly', 'Dougherty', 'Douglas', 'Early',
      'Echols', 'Effingham', 'Elbert', 'Emanuel', 'Evans', 'Fannin', 'Fayette', 'Floyd', 'Forsyth', 'Franklin',
      'Fulton', 'Gilmer', 'Glascock', 'Glynn', 'Gordon', 'Grady', 'Greene', 'Greenville', 'Gwinnett', 'Habersham',
      'Hall', 'Hancock', 'Haralson', 'Harris', 'Hart', 'Heard', 'Henry', 'Houston', 'Irwin', 'Jackson',
      'Jasper', 'Jeff Davis', 'Jefferson', 'Jenkins', 'Johnson', 'Jones', 'Lamar', 'Lanier', 'Laurens', 'Lee',
      'Liberty', 'Lincoln', 'Long', 'Lowndes', 'Lumpkin', 'Macon', 'Madison', 'Marion', 'McDuffie', 'McIntosh',
      'Meriwether', 'Miller', 'Milton', 'Mitchell', 'Monroe', 'Montgomery', 'Morgan', 'Murray', 'Muscogee', 'Newton',
      'Oconee', 'Oglethorpe', 'Paulding', 'Peach', 'Pickens', 'Pierce', 'Pike', 'Polk', 'Pulaski', 'Putnam',
      'Quitman', 'Rabun', 'Randolph', 'Richmond', 'Rockdale', 'Schley', 'Screven', 'Seminole', 'Spalding', 'Stephens',
      'Stewart', 'Sumter', 'Talbot', 'Taliaferro', 'Tattnall', 'Taylor', 'Telfair', 'Terrell', 'Thomas', 'Tift',
      'Toombs', 'Towns', 'Treutlen', 'Troup', 'Turner', 'Twiggs', 'Union', 'Upson', 'Ware', 'Warren',
      'Washington', 'Wayne', 'Webster', 'Wheeler', 'White', 'Whitfield', 'Wilcox', 'Wilkes', 'Wilkinson', 'Worth',
    ];

    GEORGIA_COUNTIES.forEach((countyName) => {
      const baseline = baselineMap.get(countyName);
      const current = currentMap.get(countyName);

      if (baseline && current) {
        const baselineRepPct = (baseline.rep / baseline.total) * 100;
        const currentRepPct = (current.rep / current.total) * 100;
        const drift = currentRepPct - baselineRepPct;
        
        // Calculate population growth
        const popGrowth = current.registered_voters - baseline.registered_voters;
        const popGrowthPct = baseline.registered_voters > 0 
          ? (popGrowth / baseline.registered_voters) * 100 
          : 0;

        driftData[countyName] = {
          county: countyName,
          drift_pct: drift,
          dem_votes_2016: baseline.dem,
          rep_votes_2016: baseline.rep,
          total_votes_2016: baseline.total,
          registered_voters_2016: baseline.registered_voters,
          dem_votes_current: current.dem,
          rep_votes_current: current.rep,
          total_votes_current: current.total,
          registered_voters_current: current.registered_voters,
          population_growth_absolute: popGrowth,
          population_growth_pct: popGrowthPct,
        };
      }
    });

    return NextResponse.json({ driftData, selectedYear });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
