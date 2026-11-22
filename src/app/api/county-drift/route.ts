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

    // Get 2016 voter statistics for population
    const { data: voters2016 } = await supabase
      .from('county_voter_statistics')
      .select('registered_voters, total_votes')
      .eq('county', decodedCounty)
      .eq('election_year', 2016)
      .single()

    // Get 2024 voter statistics for population
    const { data: voters2024 } = await supabase
      .from('county_voter_statistics')
      .select('registered_voters, total_votes')
      .eq('county', decodedCounty)
      .eq('election_year', 2024)
      .single()

    // Calculate population metrics
    const reg2016 = voters2016?.registered_voters || 0
    const reg2024 = voters2024?.registered_voters || 0
    const total2016 = voters2016?.total_votes || 1
    const total2024 = voters2024?.total_votes || 1

    const popGrowth = reg2024 - reg2016
    const popGrowthPct = reg2016 > 0 ? (popGrowth / reg2016) * 100 : 0
    const nonVoters2016 = reg2016 - total2016
    const nonVoters2024 = reg2024 - total2024
    const turnout2016 = (total2016 / (reg2016 || 1)) * 100
    const turnout2024 = (total2024 / (reg2024 || 1)) * 100

    // Merge data
    return NextResponse.json({
      ...driftData,
      registered_voters_2016: reg2016,
      registered_voters_current: reg2024,
      population_growth_absolute: popGrowth,
      population_growth_pct: popGrowthPct,
      non_voters_2016: nonVoters2016,
      non_voters_current: nonVoters2024,
      turnout_rate_2016: turnout2016,
      turnout_rate_current: turnout2024,
    }, { headers })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
