import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { GEORGIA_COUNTIES } from '@/lib/constants/georgia-counties';

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
      .select('county, democrat_votes, republican_votes, total_votes')
      .eq('election_year', 2016);

    // Fetch current year data
    const { data: currentYear, error: errCurrent } = await supabase
      .from('county_voter_statistics')
      .select('county, democrat_votes, republican_votes, total_votes')
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
      });
    });

    currentYear?.forEach((row: any) => {
      currentMap.set(row.county, {
        dem: row.democrat_votes || 0,
        rep: row.republican_votes || 0,
        total: row.total_votes || 1,
      });
    });

    // Calculate drift for each county
    const driftData: Record<string, any> = {};
    GEORGIA_COUNTIES.forEach((countyName) => {
      const baseline = baselineMap.get(countyName);
      const current = currentMap.get(countyName);

      if (baseline && current) {
        const baselineRepPct = (baseline.rep / baseline.total) * 100;
        const currentRepPct = (current.rep / current.total) * 100;
        const drift = currentRepPct - baselineRepPct;
        
        driftData[countyName] = {
          county: countyName,
          drift_pct: drift,
          dem_votes_2016: baseline.dem,
          rep_votes_2016: baseline.rep,
          total_votes_2016: baseline.total,
          dem_votes_current: current.dem,
          rep_votes_current: current.rep,
          total_votes_current: current.total,
          votes_growth_pct: ((current.total - baseline.total) / baseline.total) * 100,
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
