'use client'

import { Card, CardContent } from '@/components/ui/card'
import ActivityLogger from '@/components/ActivityLogger'
import GuestActivityLogger from '@/components/GuestActivityLogger'
import { createClient } from '@/lib/supabase/client'
import { useParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { ArrowLeft, Users, BarChart3, TrendingUp, Calendar, MapPin } from 'lucide-react'
import Link from 'next/link'
import CountyElectionHistory from '@/components/CountyElectionHistory'

interface CountyData {
  county: any
  election: any
  demographics: any
  polls: any[]
  user: any
  leaders: any[]
  talkingPoints: any[]
  podcasters: any[]
  drift: any
  electionHistory: any[]
  turnoutSnapshot: Record<string, string> | null
  electionTrends?: {
    total_votes_2016: number
    total_votes_2020: number
    total_votes_2024: number
    votes_growth_pct: number
    dem_baseline_percent: number
    rep_baseline_percent: number
    dem_2020_percent: number
    rep_2020_percent: number
    dem_current_percent: number
    rep_current_percent: number
    margin_2016_pct: number
    margin_2020_pct: number
    margin_2024_pct: number
    margin_change_2016_2020_pct: number
    margin_change_2020_2024_pct: number
    margin_change_2016_2024_pct: number
    dem_change_2016_2020_pct: number
    dem_change_2020_2024_pct: number
    rep_change_2016_2020_pct: number
    rep_change_2020_2024_pct: number
    third_party_2016_pct: number
    third_party_2020_pct: number
    third_party_2024_pct: number
  } | null
}

async function getCountyData(county: string, supabase: any) {
  if (!supabase) {
    return {
      county: null,
      election: null,
      demographics: null,
      polls: [],
      user: null,
      leaders: [],
      talkingPoints: [],
      podcasters: [],
      drift: null,
      electionHistory: [],
      turnoutSnapshot: null,
    }
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const [countyRes, electionRes, demographicsRes, pollsRes, leadersRes, pointsRes, driftRes, historyRes, turnoutRes] = await Promise.all([
      supabase
        .from('counties')
        .select('*')
        .eq('name', decodeURIComponent(county))
        .single(),
      supabase
        .from('county_voter_statistics')
        .select('*')
        .eq('county', decodeURIComponent(county))
        .eq('election_year', 2024)
        .single(),
      supabase
        .from('demographics')
        .select('*')
        .eq('county', decodeURIComponent(county))
        .single(),
      supabase
        .from('exit_polls')
        .select('*')
        .eq('county', decodeURIComponent(county)),
      supabase
        .from('party_leaders')
        .select('*')
        .or(`county.eq.${decodeURIComponent(county)},level.eq.state,level.eq.regional`)
        .order('level', { ascending: true })
        .order('title', { ascending: true }),
      supabase
        .from('talking_points')
        .select('*')
        .or(`county.eq.${decodeURIComponent(county)},county.is.null`)
        .eq('active', true)
        .order('date', { ascending: false })
        .limit(10),
      // Fetch drift data via API to bypass RLS
      fetch(`/api/county-drift?county=${encodeURIComponent(decodeURIComponent(county))}`).then(r => {
        if (!r.ok) {
          console.error(`Drift API returned ${r.status}:`, r.statusText)
          return { error: `HTTP ${r.status}` }
        }
        return r.json()
      }).catch(err => {
        console.error('Drift fetch error:', err)
        return { error: err.message }
      }),
      fetch(`/api/county-elections?county=${encodeURIComponent(decodeURIComponent(county))}`).then(r => {
        if (!r.ok) {
          console.error(`County elections API returned ${r.status}:`, r.statusText)
          return { error: `HTTP ${r.status}`, rows: [] }
        }
        return r.json()
      }).catch(err => {
        console.error('County elections fetch error:', err)
        return { error: err.message, rows: [] }
      }),
      fetch(`/api/county-turnout?county=${encodeURIComponent(decodeURIComponent(county))}`).then(r => {
        if (!r.ok) {
          console.error(`County turnout API returned ${r.status}:`, r.statusText)
          return null
        }
        return r.json()
      }).catch(err => {
        console.error('County turnout fetch error:', err)
        return null
      }),
    ])

    // Transform election data to include percentages
    let formattedElection = null
    if (electionRes.data) {
      const { democrat_votes, republican_votes, total_votes, election_year } = electionRes.data
      formattedElection = {
        ...electionRes.data,
        democrat_pct: (democrat_votes / total_votes * 100),
        republican_pct: (republican_votes / total_votes * 100),
        year: election_year,
      }
    }

    // Handle drift data - comes from API, so handle differently than Supabase responses
    let driftData = null
    if (driftRes && driftRes.county) {
      driftData = driftRes
    } else if (driftRes && driftRes.error) {
      console.log('Drift API error:', driftRes.error)
    }

    // Mock podcasters data for now (can be replaced with actual DB table later)
    const mockPodcasters = [
      {
        id: 1,
        name: 'Georgia Politics Today',
        host: 'John Mitchell',
        platform: 'Apple Podcasts',
        url: 'https://podcasts.apple.com',
        description: 'Daily updates on Georgia politics and activism',
      },
      {
        id: 2,
        name: 'Peach State Voices',
        host: 'Sarah Chen',
        platform: 'Spotify',
        url: 'https://open.spotify.com',
        description: 'Conservative perspectives on state issues',
      },
      {
        id: 3,
        name: 'Get Out The Vote GA',
        host: 'Michael Rodriguez',
        platform: 'YouTube',
        url: 'https://www.youtube.com',
        description: 'Grassroots organizing and outreach tips',
      },
    ]

    return {
      county: countyRes.data || null,
      election: formattedElection,
      demographics: demographicsRes.data || null,
      polls: pollsRes.data || [],
      user: user || null,
      leaders: leadersRes.data || [],
      talkingPoints: pointsRes.data || [],
      podcasters: mockPodcasters,
      drift: driftData,
      electionHistory: historyRes.rows || [],
      turnoutSnapshot: turnoutRes,
      electionTrends: driftData ? {
        total_votes_2016: driftData.total_votes_2016,
        total_votes_2020: driftData.total_votes_2020,
        total_votes_2024: driftData.total_votes_2024,
        votes_growth_pct: driftData.votes_growth_pct,
        dem_baseline_percent: driftData.dem_baseline_percent,
        rep_baseline_percent: driftData.rep_baseline_percent,
        dem_2020_percent: driftData.dem_2020_percent,
        rep_2020_percent: driftData.rep_2020_percent,
        dem_current_percent: driftData.dem_current_percent,
        rep_current_percent: driftData.rep_current_percent,
        margin_2016_pct: driftData.margin_2016_pct,
        margin_2020_pct: driftData.margin_2020_pct,
        margin_2024_pct: driftData.margin_2024_pct,
        margin_change_2016_2020_pct: driftData.margin_change_2016_2020_pct,
        margin_change_2020_2024_pct: driftData.margin_change_2020_2024_pct,
        margin_change_2016_2024_pct: driftData.margin_change_2016_2024_pct,
        dem_change_2016_2020_pct: driftData.dem_change_2016_2020_pct,
        dem_change_2020_2024_pct: driftData.dem_change_2020_2024_pct,
        rep_change_2016_2020_pct: driftData.rep_change_2016_2020_pct,
        rep_change_2020_2024_pct: driftData.rep_change_2020_2024_pct,
        third_party_2016_pct: driftData.third_party_2016_pct,
        third_party_2020_pct: driftData.third_party_2020_pct,
        third_party_2024_pct: driftData.third_party_2024_pct,
      } : null,
    }
  } catch (error) {
    console.error('Error fetching county data:', error)
    return {
      county: null,
      election: null,
      demographics: null,
      polls: [],
      user: null,
      leaders: [],
      talkingPoints: [],
      podcasters: [],
      drift: null,
      electionTrends: null,
      electionHistory: [],
      turnoutSnapshot: null,
    }
  }
}

export default function CountyDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-slate-500">Loading...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      }
    >
      <CountyDashboardContent />
    </Suspense>
  )
}

function CountyDashboardContent() {
  const params = useParams()
  const county = params.county as string
  const decodedCounty = decodeURIComponent(county)
  const [data, setData] = useState<CountyData>({
    county: null,
    election: null,
    demographics: null,
    polls: [],
    user: null,
    leaders: [],
    talkingPoints: [],
    podcasters: [],
    drift: null,
    electionHistory: [],
    turnoutSnapshot: null,
    electionTrends: null,
  })
  const [loading, setLoading] = useState(true)
  const [showIntel, setShowIntel] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getCountyData(decodedCounty, supabase)
        setData(result)
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [decodedCounty, supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-slate-300 font-semibold">Loading game data...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const { county: countyData, election, demographics, polls } = data
  const score = countyData?.activity_score ?? 0
  const flipPercent = Math.min((score / 256) * 100, 100)
  const colorIntensity = Math.min(score, 255)
  const bgColor = `rgb(${colorIntensity}, 0, ${255 - colorIntensity})`

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <header className="border-b border-red-600/50 bg-slate-900/80 backdrop-blur sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-white">{decodedCounty}</h1>
            <p className="text-red-400 font-bold">Score: {score} points</p>
          </div>
          <a href="/" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition">
            ← Back to Map
          </a>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Voter Drift Progress */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-slate-600/50 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-black text-slate-300 mb-4">📊 PROGRESS</h2>
          
          {data.drift ? (
            <div className="space-y-4">
              {/* Drift Direction & Tilt */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg">Voter Drift: 2016 → 2024</span>
                  <span className={`text-2xl font-black ${
                    data.drift.direction === 'blue' ? 'text-blue-400' :
                    data.drift.direction === 'red' ? 'text-red-400' :
                    'text-slate-400'
                  }`}>
                    {data.drift.direction === 'blue' ? '← BLUE SHIFT' :
                     data.drift.direction === 'red' ? 'RED SHIFT →' :
                     '◆ NEUTRAL'}
                  </span>
                </div>
              </div>

              {/* Progress Bar - Red/Blue Only */}
              <div className="mb-6">
                <div className="flex justify-between mb-2 text-sm font-semibold">
                  <span className="text-blue-400">Democratic: {data.drift.dem_current_percent?.toFixed(1)}%</span>
                  <span className="text-red-400">Republican: {data.drift.rep_current_percent?.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-lg h-10 overflow-hidden border-2 border-slate-600 flex">
                  {/* Blue bar */}
                  <div
                    className="bg-blue-600 transition-all duration-500 flex items-center justify-center text-white font-bold text-xs"
                    style={{ width: `${data.drift.dem_current_percent || 50}%` }}
                  >
                    {data.drift.dem_current_percent > 20 && `${data.drift.dem_current_percent?.toFixed(0)}%`}
                  </div>
                  {/* Red bar */}
                  <div
                    className="bg-red-600 transition-all duration-500 flex items-center justify-center text-white font-bold text-xs"
                    style={{ width: `${data.drift.rep_current_percent || 50}%` }}
                  >
                    {data.drift.rep_current_percent > 20 && `${data.drift.rep_current_percent?.toFixed(0)}%`}
                  </div>
                </div>
              </div>

              {/* Drift Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-blue-900/30 rounded-lg p-3 border-l-4 border-blue-500">
                  <p className="text-blue-400 font-semibold text-xs mb-1">Democratic Shift</p>
                  <p className="text-lg font-bold text-blue-300">
                    {data.drift.dem_drift_pct > 0 ? '+' : ''}{data.drift.dem_drift_pct?.toFixed(1)}%
                  </p>
                </div>
                <div className="bg-red-900/30 rounded-lg p-3 border-l-4 border-red-500">
                  <p className="text-red-400 font-semibold text-xs mb-1">Republican Shift</p>
                  <p className="text-lg font-bold text-red-300">
                    {data.drift.rep_drift_pct > 0 ? '+' : ''}{data.drift.rep_drift_pct?.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Interpretation */}
              <div className="bg-slate-900/50 rounded-lg p-4 text-sm text-slate-300 border border-slate-600">
                <p className="font-semibold mb-2">What This Means:</p>
                <p>
                  {data.drift.dem_drift_pct > 0 
                    ? `This county has shifted BLUE by ${Math.abs(data.drift.dem_drift_pct).toFixed(1)}% since 2016.`
                    : data.drift.rep_drift_pct > 0
                    ? `This county has shifted RED by ${Math.abs(data.drift.rep_drift_pct).toFixed(1)}% since 2016.`
                    : 'This county has remained relatively stable since 2016.'}
                  {' '} Current results show {data.drift.direction === 'blue' ? 'Democratic' : data.drift.direction === 'red' ? 'Republican' : 'mixed'} strength.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-700/50 rounded-lg p-6 text-center text-slate-400">
              <p>No drift data available yet. Check back after running the voter analysis setup.</p>
            </div>
          )}
        </div>

        <CountyElectionHistory county={decodedCounty} rows={data.electionHistory} />

        {/* MIT Presidential Election Trends */}
        {data.electionTrends && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-slate-600/50 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-black text-slate-300 mb-2">📊 MIT PRESIDENTIAL ELECTION TRENDS</h2>
            <p className="text-sm text-slate-400 mb-6">Verified county returns for 2016, 2020, and 2024</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  label: '2016 → 2020',
                  dem: data.electionTrends.dem_change_2016_2020_pct,
                  rep: data.electionTrends.rep_change_2016_2020_pct,
                  margin: data.electionTrends.margin_change_2016_2020_pct,
                },
                {
                  label: '2020 → 2024',
                  dem: data.electionTrends.dem_change_2020_2024_pct,
                  rep: data.electionTrends.rep_change_2020_2024_pct,
                  margin: data.electionTrends.margin_change_2020_2024_pct,
                },
                {
                  label: '2016 → 2024',
                  dem: data.drift.dem_drift_pct,
                  rep: data.drift.rep_drift_pct,
                  margin: data.electionTrends.margin_change_2016_2024_pct,
                },
              ].map((period) => (
                <div key={period.label} className="bg-slate-900/45 border border-slate-600 rounded-lg p-5">
                  <h3 className="font-bold text-yellow-400 mb-4">{period.label} drift</h3>
                  <div className="relative h-40 mb-4">
                    <div className="absolute inset-x-0 top-1/2 border-t-2 border-slate-400 z-10" />
                    <div className="absolute inset-x-0 top-0 bottom-1/2 flex items-end">
                      <div className="w-full">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-red-300">R</span>
                          <strong className="text-red-200">
                            {period.rep > 0 ? '+' : ''}{period.rep.toFixed(1)} pts
                          </strong>
                        </div>
                        <div className="h-8 bg-slate-700/70 rounded-t overflow-hidden">
                          <div
                            className="h-full bg-red-600"
                            style={{ width: `${Math.max(Math.min(Math.abs(period.rep) * 8, 100), 2)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-x-0 top-1/2 bottom-0 flex items-start">
                      <div className="w-full pt-2">
                        <div className="h-8 bg-slate-700/70 rounded-b overflow-hidden">
                          <div
                            className="h-full bg-blue-600"
                            style={{ width: `${Math.max(Math.min(Math.abs(period.dem) * 8, 100), 2)}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs mt-2">
                          <span className="text-blue-300">D</span>
                          <strong className="text-blue-200">
                            {period.dem > 0 ? '+' : ''}{period.dem.toFixed(1)} pts
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-700 flex justify-between text-sm">
                    <span className="text-slate-300">Net margin shift</span>
                    <strong className={period.margin >= 0 ? 'text-red-300' : 'text-blue-300'}>
                      {period.margin > 0 ? '+' : ''}{period.margin.toFixed(1)} pts
                      {' '}{period.margin >= 0 ? 'R' : 'D'}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-4">
              Red Republican change appears above zero; blue Democratic change appears below zero. Bar size represents absolute percentage-point change.
            </p>
          </div>
        )}

        {data.turnoutSnapshot && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-yellow-500/70 rounded-xl p-8 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
              <div>
                <h2 className="text-2xl font-black text-yellow-300">2026 PARTICIPATION SNAPSHOT</h2>
                <p className="text-sm text-slate-400 mt-1">
                  {data.turnoutSnapshot.measurement}
                </p>
              </div>
              <div className="text-right">
                <span className="inline-flex rounded-full bg-yellow-500/15 border border-yellow-500/50 text-yellow-200 px-3 py-1 text-xs font-bold uppercase">
                  Preliminary
                </span>
                <p className="text-xs text-slate-500 mt-2">
                  Updated {data.turnoutSnapshot.snapshot_at}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-900/40 rounded-lg p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Registered voters</p>
                <p className="text-2xl font-black text-slate-100 mt-1">
                  {Number(data.turnoutSnapshot.registered_voters).toLocaleString()}
                </p>
              </div>
              <div className="bg-slate-900/40 rounded-lg p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Votes recorded</p>
                <p className="text-2xl font-black text-emerald-300 mt-1">
                  {Number(data.turnoutSnapshot.votes_recorded).toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {Number(data.turnoutSnapshot.turnout_pct).toFixed(1)}% recorded
                </p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-lg p-4">
                <p className="text-xs uppercase tracking-wide text-yellow-300">Not yet recorded as voted</p>
                <p className="text-2xl font-black text-yellow-200 mt-1">
                  {Number(data.turnoutSnapshot.estimated_not_voted).toLocaleString()}
                </p>
                <p className="text-xs text-yellow-400 mt-1">
                  {Number(data.turnoutSnapshot.not_voted_pct).toFixed(1)}% of registered voters
                </p>
              </div>
            </div>

            <div className="h-5 rounded-full overflow-hidden flex bg-slate-950 border border-slate-600">
              <div
                className="bg-emerald-500 h-full"
                style={{ width: `${data.turnoutSnapshot.turnout_pct}%` }}
              />
              <div
                className="bg-yellow-400 h-full"
                style={{ width: `${data.turnoutSnapshot.not_voted_pct}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>Recorded participation</span>
              <span>Estimated non-voters at snapshot</span>
            </div>
            <p className="text-xs text-slate-500 mt-4">
              This is an early-voting snapshot, not certified 2026 turnout or a party result. Registered voters minus accepted mail/early ballots equals the yellow estimate.{' '}
              <a
                className="text-blue-400 hover:text-blue-300"
                href={data.turnoutSnapshot.source_url}
                target="_blank"
                rel="noreferrer"
              >
                Georgia Votes source
              </a>
            </p>
          </div>
        )}

        {/* Today's Mission */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-yellow-600/50 rounded-xl p-8">
            <h3 className="text-2xl font-black text-yellow-400 mb-6">📋 WHAT CAN YOU DO TODAY ?</h3>
            <div className="space-y-4">
              <div className="bg-slate-700/50 rounded-lg p-4 hover:bg-slate-700 transition cursor-pointer border-l-4 border-blue-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold">Canvas 5 Doors</p>
                    <p className="text-sm text-slate-400">Talk to voters face-to-face</p>
                  </div>
                  <span className="bg-yellow-500 text-slate-900 px-3 py-1 rounded font-bold">+10 pts</span>
                </div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 hover:bg-slate-700 transition cursor-pointer border-l-4 border-green-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold">Share 3 Social Posts</p>
                    <p className="text-sm text-slate-400">Spread the message online</p>
                  </div>
                  <span className="bg-yellow-500 text-slate-900 px-3 py-1 rounded font-bold">+5 pts</span>
                </div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 hover:bg-slate-700 transition cursor-pointer border-l-4 border-purple-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold">Make 10 Calls</p>
                    <p className="text-sm text-slate-400">Phone banking</p>
                  </div>
                  <span className="bg-yellow-500 text-slate-900 px-3 py-1 rounded font-bold">+8 pts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-red-900/40 to-red-800/40 border-2 border-red-600/50 rounded-xl p-6">
              <div className="text-4xl font-black text-red-400 mb-2">{score}</div>
              <p className="text-red-300 font-bold">Your County Score</p>
              <p className="text-sm text-red-400/70 mt-2">Rank this week: #3 in Region</p>
            </div>
          </div>
        </div>

        {/* Intel Section (Collapsible) */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-slate-600/50 rounded-xl p-8 mb-8">
          <button
            onClick={() => setShowIntel(!showIntel)}
            className="w-full flex justify-between items-center mb-6 hover:opacity-70 active:opacity-50 transition px-4 py-2 rounded cursor-pointer"
            type="button"
          >
            <h3 className="text-2xl font-black text-slate-300">📊 COUNTY INTEL</h3>
            <span className="text-3xl font-black text-slate-300" style={{ transition: 'transform 0.3s' }}>
              {showIntel ? '▼' : '▶'}
            </span>
          </button>

          {showIntel && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Election Results */}
              {election && (
                <div className="bg-slate-700/50 rounded-lg p-6 border-l-4 border-red-500">
                  <h4 className="font-bold text-red-400 mb-4">2024 Presidential Election Results</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Republican</span>
                        <span className="font-bold text-red-400">{election.republican_pct.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-red-600"
                          style={{ width: `${election.republican_pct}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {election.republican_votes.toLocaleString()} votes
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Democrat</span>
                        <span className="font-bold text-blue-400">{election.democrat_pct.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-blue-600"
                          style={{ width: `${election.democrat_pct}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {election.democrat_votes.toLocaleString()} votes
                      </p>
                    </div>
                  </div>
                  {election.republican_votes && election.democrat_votes && (
                    <div className="mt-6 bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-4">
                      <p className="text-sm font-bold text-yellow-300">
                        🎯 Votes to Flip County: {Math.round((election.democrat_votes + 1 - election.republican_votes) / 1000) * 1000}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Demographics */}
              {demographics && (
                <div className="bg-slate-700/50 rounded-lg p-6 border-l-4 border-blue-500">
                  <h4 className="font-bold text-blue-400 mb-4">Population Profile</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-400 mb-2">Age Distribution</p>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span>18-29:</span>
                          <span className="font-bold">{demographics.age_18_29 || 22}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>30-44:</span>
                          <span className="font-bold">{demographics.age_30_44 || 27}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>45-64:</span>
                          <span className="font-bold">{demographics.age_45_64 || 31}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>65+:</span>
                          <span className="font-bold">{demographics.age_65_plus || 20}%</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-2">Race/Ethnicity</p>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span>White:</span>
                          <span className="font-bold">{demographics.white || 68}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Black:</span>
                          <span className="font-bold">{demographics.black || 15}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Hispanic:</span>
                          <span className="font-bold">{demographics.hispanic || 11}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Other:</span>
                          <span className="font-bold">{demographics.asian_other || 6}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Exit Polls */}
              {polls.length > 0 && (
                <div className="bg-slate-700/50 rounded-lg p-6 border-l-4 border-purple-500">
                  <h4 className="font-bold text-purple-400 mb-4">Voter Priorities</h4>
                  <div className="space-y-4">
                    {polls.slice(0, 3).map((poll, idx) => (
                      <div key={idx} className="bg-slate-600/30 rounded p-3">
                        <p className="font-bold text-sm mb-2">{poll.question}</p>
                        <div className="text-xs space-y-1">
                          <div className="flex justify-between text-slate-300">
                            <span>Rep: {poll.party_split?.split(',')[0]?.trim() || 'N/A'}</span>
                            <span>Dem: {poll.party_split?.split(',')[1]?.trim() || 'N/A'}</span>
                          </div>
                          <p className="text-slate-400 text-xs">{poll.source || '2024 Exit Poll'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Party & County Leadership */}
              {data.leaders.length > 0 && (
                <div className="bg-slate-700/50 rounded-lg p-6 border-l-4 border-orange-500">
                  <h4 className="font-bold text-orange-400 mb-4">👥 Party & County Leadership</h4>
                  <div className="space-y-4">
                    {data.leaders.map((leader: any, idx: number) => (
                      <div key={idx} className="bg-slate-600/30 rounded p-4 border-l-2 border-orange-400">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-bold text-white">{leader.name}</p>
                            <p className="text-sm text-orange-300">{leader.title}</p>
                            <p className="text-xs text-slate-400 capitalize mt-1">
                              {leader.level}{leader.district ? ` (${leader.district})` : ''}
                            </p>
                          </div>
                        </div>
                        {(leader.contact_email || leader.contact_phone) && (
                          <div className="text-xs space-y-1 mt-3 pt-3 border-t border-slate-500">
                            {leader.contact_email && (
                              <p className="text-slate-300">
                                <span className="text-slate-400">Email: </span>
                                <a href={`mailto:${leader.contact_email}`} className="text-blue-400 hover:underline">
                                  {leader.contact_email}
                                </a>
                              </p>
                            )}
                            {leader.contact_phone && (
                              <p className="text-slate-300">
                                <span className="text-slate-400">Phone: </span>
                                <a href={`tel:${leader.contact_phone}`} className="text-blue-400 hover:underline">
                                  {leader.contact_phone}
                                </a>
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Talking Points & Social Media Shares */}
              {data.talkingPoints.length > 0 && (
                <div className="bg-slate-700/50 rounded-lg p-6 border-l-4 border-cyan-500">
                  <h4 className="font-bold text-cyan-400 mb-4">💬 Talking Points & Share Content</h4>
                  <div className="space-y-4">
                    {data.talkingPoints.map((point: any, idx: number) => (
                      <div key={idx} className="bg-slate-600/30 rounded p-4 border-l-2 border-cyan-400">
                        <div className="mb-3">
                          <p className="font-bold text-white text-base">{point.title}</p>
                          <p className="text-sm text-slate-300 mt-2">{point.content}</p>
                          <p className="text-xs text-slate-400 mt-2">
                            <span className="text-cyan-300">Source:</span> {point.source}
                          </p>
                          {point.cadence && (
                            <p className="text-xs text-slate-400 mt-1">
                              <span className="bg-cyan-900/50 px-2 py-1 rounded text-cyan-300">
                                {point.cadence}
                              </span>
                            </p>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-500">
                          <button
                            onClick={() => {
                              const text = `${point.title}\n\n${point.content}\n\nSource: ${point.source}`;
                              navigator.clipboard.writeText(text);
                              alert('Copied to clipboard!');
                            }}
                            className="text-xs px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition flex items-center gap-1"
                          >
                            📋 Copy
                          </button>
                          <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(point.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition flex items-center gap-1"
                          >
                            👍 Facebook
                          </a>
                          <a
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(point.title)} - ${encodeURIComponent(point.content)}&url=${encodeURIComponent(window.location.href)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded font-semibold transition flex items-center gap-1"
                          >
                            𝕏 Post
                          </a>
                          <a
                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(point.title + ' ' + point.content + ' ' + window.location.href)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold transition flex items-center gap-1"
                          >
                            💬 WhatsApp
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Georgia Podcasters & Media Resources */}
              {data.podcasters.length > 0 && (
                <div className="bg-slate-700/50 rounded-lg p-6 border-l-4 border-pink-500">
                  <h4 className="font-bold text-pink-400 mb-4">🎙️ Georgia Podcasters & Media</h4>
                  <div className="space-y-4">
                    {data.podcasters.map((podcast: any, idx: number) => (
                      <div key={idx} className="bg-slate-600/30 rounded p-4 border-l-2 border-pink-400">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <p className="font-bold text-white">{podcast.name}</p>
                            <p className="text-sm text-pink-300">Hosted by {podcast.host}</p>
                            <p className="text-xs text-slate-300 mt-1">{podcast.description}</p>
                          </div>
                          <span className="text-xs bg-pink-900/50 px-2 py-1 rounded text-pink-300 whitespace-nowrap ml-2">
                            {podcast.platform}
                          </span>
                        </div>
                        <a
                          href={podcast.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-3 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded font-semibold transition inline-block mt-3"
                        >
                          Listen Now →
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-slate-600/50 rounded-xl p-8 mb-8">
          <h3 className="text-2xl font-black text-green-400 mb-6">✍️ LOG ACTIVITY</h3>
          {data.user ? (
            <ActivityLogger
              userId={data.user.id}
              county={decodedCounty}
              onSuccess={() => {
                // Optionally refresh data here
              }}
            />
          ) : (
            <GuestActivityLogger
              county={decodedCounty}
              onActivityLogged={() => {
                // Optionally refresh data here
              }}
            />
          )}
        </div>

        {/* Remove the separate login prompt card - it's now integrated above */}
      </div>
    </div>
  )
}

