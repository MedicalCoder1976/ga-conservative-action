import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const county = request.nextUrl.searchParams.get('county')

    if (!county) {
      return NextResponse.json({ error: 'County parameter required' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { error: 'Missing Supabase credentials' },
        { status: 500 },
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
      return NextResponse.json({ error: 'County not found' }, { status: 404 })
    }

    // Get 2016 voter statistics for population
    const { data: voters2016 } = await supabase
      .from('county_voter_statistics')
      .select('registered_voters, total_votes')
      .eq('county', decodedCounty)
      .eq('election_year', 2016)
      .single()

    // Get 2026 voter statistics for population
    const { data: voters2026 } = await supabase
      .from('county_voter_statistics')
      .select('registered_voters, total_votes')
      .eq('county', decodedCounty)
      .eq('election_year', 2026)
      .single()

    // Calculate population metrics
    const reg2016 = voters2016?.registered_voters || 0
    const reg2026 = voters2026?.registered_voters || 0
    const total2016 = voters2016?.total_votes || 1
    const total2026 = voters2026?.total_votes || 1

    const popGrowth = reg2026 - reg2016
    const popGrowthPct = reg2016 > 0 ? (popGrowth / reg2016) * 100 : 0
    const nonVoters2016 = reg2016 - total2016
    const nonVoters2026 = reg2026 - total2026
    const turnout2016 = (total2016 / (reg2016 || 1)) * 100
    const turnout2026 = (total2026 / (reg2026 || 1)) * 100

    // Merge data
    return NextResponse.json({
      ...driftData,
      registered_voters_2016: reg2016,
      registered_voters_current: reg2026,
      population_growth_absolute: popGrowth,
      population_growth_pct: popGrowthPct,
      non_voters_2016: nonVoters2016,
      non_voters_current: nonVoters2026,
      turnout_rate_2016: turnout2016,
      turnout_rate_current: turnout2026,
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
