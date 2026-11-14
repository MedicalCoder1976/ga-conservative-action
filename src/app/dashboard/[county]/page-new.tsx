'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronUp, MapPin, TrendingUp, Trophy, Zap, ChevronDown } from 'lucide-react'

interface County {
  name: string
  activity_score: number
  color_intensity: number
}

interface Mission {
  id: string
  title: string
  points: number
  emoji: string
}

export default function CountyDashboard() {
  const params = useParams()
  const router = useRouter()
  const county = decodeURIComponent(params.county as string)
  
  const [countyData, setCountyData] = useState<County | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    intel: false,
  })

  useEffect(() => {
    const fetchCountyData = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('counties')
          .select('*')
          .eq('name', county)
          .single()

        if (error) throw error
        setCountyData(data)
      } catch (err) {
        console.error('Error fetching county:', err)
        setCountyData({
          name: county,
          activity_score: Math.floor(Math.random() * 256),
          color_intensity: Math.floor(Math.random() * 256),
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCountyData()
  }, [county])

  const missions: Mission[] = [
    { id: '1', title: 'Canvas 5 Doors', points: 10, emoji: '🚪' },
    { id: '2', title: 'Make 10 Phone Calls', points: 8, emoji: '📞' },
    { id: '3', title: 'Share 3 Social Posts', points: 5, emoji: '📱' },
    { id: '4', title: 'Recruit 1 Volunteer', points: 15, emoji: '👥' },
    { id: '5', title: 'Write Letter to Editor', points: 7, emoji: '✍️' },
  ]

  const flipProgress = countyData ? Math.min((countyData.activity_score / 256) * 100, 100) : 0
  const countyColor = countyData
    ? `rgb(${countyData.color_intensity}, 0, ${255 - countyData.color_intensity})`
    : 'rgb(100, 0, 155)'

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading {county}...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="text-slate-300 hover:text-white flex items-center gap-2"
          >
            <ChevronUp className="w-5 h-5 rotate-180" />
            <span className="hidden sm:inline">Back to Map</span>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-black">{county}</h1>
          <div className="w-12 h-12 rounded-lg flex-shrink-0" style={{ backgroundColor: countyColor }}></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Flip Progress - HERO */}
        <div className="mb-8 sm:mb-12">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 pb-4">
              <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                <TrendingUp className="w-6 h-6 text-red-500" />
                Flip Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-4">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-4xl sm:text-5xl font-black text-white">{Math.round(flipProgress)}%</span>
                  <span className="text-sm sm:text-base text-slate-400">{countyData?.activity_score || 0} / 256 points</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-4 sm:h-6 overflow-hidden border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 through-purple-600 to-red-600 transition-all duration-500"
                    style={{ width: `${flipProgress}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                {flipProgress < 33 && '🟦 Still Blue'}
                {flipProgress >= 33 && flipProgress < 66 && '🟪 Contested'}
                {flipProgress >= 66 && '🟥 Turning Red'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Missions */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl sm:text-3xl font-black">Today's Missions</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {missions.map((mission) => (
              <Card key={mission.id} className="bg-slate-900/40 border-slate-700 hover:border-red-600/50 hover:bg-slate-900/60 transition cursor-pointer group">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{mission.emoji}</span>
                        <h3 className="text-base sm:text-lg font-black group-hover:text-red-400 transition">{mission.title}</h3>
                      </div>
                      <p className="text-2xl sm:text-3xl font-black text-red-500">+{mission.points} pts</p>
                    </div>
                    <Button className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 text-sm">
                      Complete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-black mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            County Stats
          </h2>
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              { label: 'Active Players', value: '24', emoji: '👥' },
              { label: 'Your Rank', value: '#3', emoji: '🏅' },
              { label: 'Points This Week', value: '127', emoji: '⭐' },
            ].map((stat, i) => (
              <Card key={i} className="bg-slate-900/40 border-slate-700">
                <CardContent className="p-6">
                  <div className="text-3xl mb-2">{stat.emoji}</div>
                  <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl sm:text-4xl font-black">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Intel Section - Collapsible */}
        <div className="mb-8 sm:mb-12">
          <button
            onClick={() => setExpandedSections(prev => ({ ...prev, intel: !prev.intel }))}
            className="w-full bg-slate-900/40 border border-slate-700 hover:border-slate-600 rounded-xl p-4 sm:p-6 flex items-center justify-between transition mb-4"
          >
            <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
              📊 Intel Hub
            </h2>
            <ChevronDown className={`w-6 h-6 transition-transform ${expandedSections.intel ? 'rotate-180' : ''}`} />
          </button>

          {expandedSections.intel && (
            <div className="space-y-4 sm:space-y-6">
              {/* Election Results */}
              <Card className="bg-slate-900/40 border-slate-700">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-lg sm:text-xl">Election Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="text-slate-400 text-sm mb-1">Republican</p>
                      <p className="text-3xl font-black text-red-500">54.2%</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="text-slate-400 text-sm mb-1">Democrat</p>
                      <p className="text-3xl font-black text-blue-500">45.8%</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400">📍 <strong>Votes needed to flip state:</strong> 247,300</p>
                </CardContent>
              </Card>

              {/* Demographics */}
              <Card className="bg-slate-900/40 border-slate-700">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-lg sm:text-xl">Demographics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { label: 'Age 18-29', value: '18%' },
                      { label: 'Age 30-44', value: '26%' },
                      { label: 'Age 45-64', value: '35%' },
                      { label: 'Age 65+', value: '21%' },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">{item.label}</span>
                        <span className="font-bold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-4">📅 Refreshed quarterly</p>
                </CardContent>
              </Card>

              {/* Talking Points */}
              <Card className="bg-slate-900/40 border-slate-700">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-lg sm:text-xl">Today's Talking Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="text-sm"><strong>Election Integrity:</strong> "Secure elections protect democracy"</li>
                    <li className="text-sm"><strong>Economy:</strong> "Lower taxes, more jobs for Georgia families"</li>
                    <li className="text-sm"><strong>Border:</strong> "Strong borders mean safe communities"</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Footer Action */}
      <footer className="border-t border-slate-800 bg-slate-950/50 backdrop-blur px-4 sm:px-6 lg:px-8 py-4 sm:py-6 mt-12 sm:mt-16">
        <div className="max-w-7xl mx-auto flex justify-center">
          <Button
            onClick={() => router.push('/dashboard')}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            ← Back to Georgia Map
          </Button>
        </div>
      </footer>
    </div>
  )
}
