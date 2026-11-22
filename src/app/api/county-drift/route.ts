import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept',
        'Content-Type': 'application/json',
      },
    }
  )
}

export async function GET(request: NextRequest) {
  try {
    // Handle CORS and Accept headers
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
    }

    const county = request.nextUrl.searchParams.get('county')

    if (!county) {
      return NextResponse.json({ error: 'County parameter required' }, { status: 400, headers })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { error: 'Missing Supabase credentials' },
        { status: 500, headers },
      )
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const decodedCounty = decodeURIComponent(county)

    const { data: voterRows, error: voterError } = await supabase
      .from('county_voter_statistics')
      .select('election_year, democrat_votes, republican_votes, total_votes')
      .eq('county', decodedCounty)
      .in('election_year', [2016, 2020, 2024, 2026])

    if (voterError || !voterRows?.length) {
      console.error('Voter totals query error:', voterError)
      return NextResponse.json({ error: 'County totals not found' }, { status: 404, headers })
    }

    const byYear = new Map(voterRows.map((row) => [row.election_year, row]))
    const y2016 = byYear.get(2016)
    const y2020 = byYear.get(2020)
    const y2024 = byYear.get(2024)
    const y2026 = byYear.get(2026)
    if (!y2016 || !y2026) {
      return NextResponse.json({ error: '2016 and 2026 totals required' }, { status: 404, headers })
    }

    const partyPercent = (row: { democrat_votes: number; republican_votes: number; total_votes: number }) => ({
      dem: (row.democrat_votes / row.total_votes) * 100,
      rep: (row.republican_votes / row.total_votes) * 100,
    })
    const p2016 = partyPercent(y2016)
    const p2020 = y2020 ? partyPercent(y2020) : null
    const p2024 = y2024 ? partyPercent(y2024) : null
    const p2026 = partyPercent(y2026)
    const margin2016 = p2016.rep - p2016.dem
    const margin2020 = p2020 ? p2020.rep - p2020.dem : null
    const margin2024 = p2024 ? p2024.rep - p2024.dem : null
    const margin2026 = p2026.rep - p2026.dem
    const repDrift2026 = p2026.rep - p2016.rep
    const demDrift2026 = p2026.dem - p2016.dem

    return NextResponse.json({
      county: decodedCounty,
      dem_baseline_percent: p2016.dem,
      rep_baseline_percent: p2016.rep,
      dem_2020_percent: p2020?.dem ?? null,
      rep_2020_percent: p2020?.rep ?? null,
      dem_current_percent: p2024?.dem ?? null,
      rep_current_percent: p2024?.rep ?? null,
      dem_2026_percent: p2026.dem,
      rep_2026_percent: p2026.rep,
      dem_drift_pct: demDrift2026,
      rep_drift_pct: repDrift2026,
      tilt_score: repDrift2026 / 100,
      direction: Math.abs(repDrift2026) < 0.5 ? 'neutral' : repDrift2026 > 0 ? 'red' : 'blue',
      total_votes_2016: y2016.total_votes,
      total_votes_2020: y2020?.total_votes ?? null,
      total_votes_2024: y2024?.total_votes ?? null,
      total_votes_2026: y2026.total_votes,
      votes_growth_pct: y2016.total_votes > 0
        ? ((y2026.total_votes - y2016.total_votes) / y2016.total_votes) * 100
        : null,
      last_updated_year: 2026,
      data_quality: 'Georgia SOS 2026; MIT 2016, 2020, 2024',
      margin_2016_pct: margin2016,
      margin_2020_pct: margin2020,
      margin_2024_pct: margin2024,
      margin_2026_pct: margin2026,
      margin_change_2016_2020_pct: p2020 ? margin2020! - margin2016 : null,
      margin_change_2020_2024_pct: p2020 && p2024 ? margin2024! - margin2020! : null,
      margin_change_2024_2026_pct: p2024 ? margin2026 - margin2024! : null,
      margin_change_2016_2024_pct: p2024 ? margin2024! - margin2016 : null,
      margin_change_2016_2026_pct: margin2026 - margin2016,
      dem_change_2016_2020_pct: p2020 ? p2020.dem - p2016.dem : null,
      dem_change_2020_2024_pct: p2020 && p2024 ? p2024.dem - p2020.dem : null,
      dem_change_2024_2026_pct: p2024 ? p2026.dem - p2024.dem : null,
      dem_change_2016_2026_pct: demDrift2026,
      rep_change_2016_2020_pct: p2020 ? p2020.rep - p2016.rep : null,
      rep_change_2020_2024_pct: p2020 && p2024 ? p2024.rep - p2020.rep : null,
      rep_change_2024_2026_pct: p2024 ? p2026.rep - p2024.rep : null,
      rep_change_2016_2026_pct: repDrift2026,
      third_party_2016_pct: 100 - p2016.dem - p2016.rep,
      third_party_2020_pct: p2020 ? 100 - p2020.dem - p2020.rep : null,
      third_party_2024_pct: p2024 ? 100 - p2024.dem - p2024.rep : null,
      third_party_2026_pct: 100 - p2026.dem - p2026.rep,
    }, { headers })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
