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

    // Get drift data
    const { data: driftData, error: driftError } = await supabase
      .from('county_drift')
      .select('*')
      .eq('county', decodedCounty)
      .single()

    if (driftError) {
      console.error('Drift query error:', driftError)
      return NextResponse.json({ error: 'County not found' }, { status: 404, headers })
    }

    const margin2016 = driftData.rep_baseline_percent - driftData.dem_baseline_percent
    const margin2020 = driftData.rep_2020_percent - driftData.dem_2020_percent
    const margin2024 = driftData.rep_current_percent - driftData.dem_current_percent

    const { data: voters2020, error: voters2020Error } = await supabase
      .from('county_voter_statistics')
      .select('total_votes')
      .eq('county', decodedCounty)
      .eq('election_year', 2020)
      .single()

    if (voters2020Error) {
      console.error('2020 vote query error:', voters2020Error)
      return NextResponse.json({ error: 'County 2020 totals not found' }, { status: 404, headers })
    }

    return NextResponse.json({
      ...driftData,
      margin_2016_pct: margin2016,
      margin_2020_pct: margin2020,
      margin_2024_pct: margin2024,
      margin_change_2016_2020_pct: margin2020 - margin2016,
      margin_change_2020_2024_pct: margin2024 - margin2020,
      margin_change_2016_2024_pct: margin2024 - margin2016,
      dem_change_2016_2020_pct: driftData.dem_2020_percent - driftData.dem_baseline_percent,
      dem_change_2020_2024_pct: driftData.dem_current_percent - driftData.dem_2020_percent,
      rep_change_2016_2020_pct: driftData.rep_2020_percent - driftData.rep_baseline_percent,
      rep_change_2020_2024_pct: driftData.rep_current_percent - driftData.rep_2020_percent,
      third_party_2020_pct: 100 - driftData.dem_2020_percent - driftData.rep_2020_percent,
      third_party_2016_pct: 100 - driftData.dem_baseline_percent - driftData.rep_baseline_percent,
      third_party_2024_pct: 100 - driftData.dem_current_percent - driftData.rep_current_percent,
      total_votes_2020: voters2020.total_votes,
    }, { headers })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
