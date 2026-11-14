'use client'

import { Card, CardContent } from '@/components/ui/card'
import ActivityLogger from '@/components/ActivityLogger'
import { createClient } from '@/lib/supabase/client'
import { useParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { ArrowLeft, Users, BarChart3, TrendingUp, Calendar, MapPin } from 'lucide-react'
import Link from 'next/link'

interface CountyData {
  county: any
  election: any
  demographics: any
  polls: any[]
  user: any
  leaders: any[]
  talkingPoints: any[]
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
    }
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const [countyRes, electionRes, demographicsRes, pollsRes, leadersRes, pointsRes] = await Promise.all([
      supabase
        .from('counties')
        .select('*')
        .eq('name', decodeURIComponent(county))
        .single(),
      supabase
        .from('election_results')
        .select('*')
        .eq('county', decodeURIComponent(county))
        .order('year', { ascending: false })
        .limit(1),
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
    ])

    return {
      county: countyRes.data || null,
      election: electionRes.data?.[0] || null,
      demographics: demographicsRes.data || null,
      polls: pollsRes.data || [],
      user: user || null,
      leaders: leadersRes.data || [],
      talkingPoints: pointsRes.data || [],
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
        {/* Flip Progress */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-red-600/50 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-black text-red-400 mb-4">🎮 FLIP PROGRESS</h2>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-bold text-lg">County Control</span>
              <span className="text-2xl font-black text-yellow-400">{Math.round(flipPercent)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-8 overflow-hidden border-2 border-slate-600">
              <div
                className="h-full transition-all duration-500 flex items-center justify-center font-black text-sm"
                style={{
                  width: `${flipPercent}%`,
                  background: `linear-gradient(90deg, rgb(0, 0, 255), rgb(${colorIntensity}, 0, ${255 - colorIntensity})), linear-gradient(90deg, #ec4899, #f59e0b)`,
                }}
              >
                {flipPercent > 10 && <span className="text-white drop-shadow">FLIPPING</span>}
              </div>
            </div>
            <p className="text-sm text-slate-400 mt-2">
              {flipPercent < 50
                ? `Need ${Math.ceil((128 - score) / 10)} more missions to control this county`
                : `You're winning! Keep the momentum!`}
            </p>
          </div>
        </div>

        {/* Today's Mission */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-yellow-600/50 rounded-xl p-8">
            <h3 className="text-2xl font-black text-yellow-400 mb-6">📋 TODAY'S MISSION</h3>
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
            <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 border-2 border-blue-600/50 rounded-xl p-6">
              <div className="text-4xl font-black text-blue-400 mb-2">24</div>
              <p className="text-blue-300 font-bold">Active Players</p>
              <p className="text-sm text-blue-400/70 mt-2">Competing in {decodedCounty}</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/40 border-2 border-yellow-600/50 rounded-xl p-6">
              <div className="text-4xl font-black text-yellow-400 mb-2">+45</div>
              <p className="text-yellow-300 font-bold">This Week</p>
              <p className="text-sm text-yellow-400/70 mt-2">Keep building momentum!</p>
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
                  <h4 className="font-bold text-red-400 mb-4">2026 Election Results</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Republican</span>
                        <span className="font-bold text-red-400">{election.republican_pct || 56}%</span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-red-600"
                          style={{ width: `${election.republican_pct || 56}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {election.republican_votes || 248500} votes
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Democrat</span>
                        <span className="font-bold text-blue-400">{election.democrat_pct || 43}%</span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-blue-600"
                          style={{ width: `${election.democrat_pct || 43}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {election.democrat_votes || 189300} votes
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
            </div>
          )}
        </div>

        {/* Activity Logger - Show login prompt AFTER user tries to log */}
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
            <div className="bg-white border-2 border-red-600 rounded-lg p-8 text-center">
              <div className="mb-6">
                <div className="text-5xl mb-4">📝</div>
                <h4 className="text-2xl font-black text-slate-900 mb-3">Ready to Log Activities?</h4>
                <p className="text-slate-700 font-semibold text-lg mb-4">
                  Sign in to save your progress, earn points, and track your impact over time.
                </p>
              </div>
              <a 
                href="/auth/login" 
                className="inline-block px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-lg transition"
              >
                Sign In to Start Logging
              </a>
              <p className="text-slate-600 text-sm mt-6 font-semibold">
                You can view all county data without signing in. Only your activity logs require a login.
              </p>
            </div>
          )}
        </div>

        {/* Remove the separate login prompt card - it's now integrated above */}
      </div>
    </div>
  )
}

