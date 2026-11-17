'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import GeorgiaCountyMapLeaflet from '@/components/GeorgiaCountyMapLeaflet'
import { MapPin, Search, Zap, Trophy } from 'lucide-react'

interface County {
  name: string
  fips: string
  activity_score: number
  color_intensity: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [counties, setCounties] = useState<County[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCounties = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('counties')
          .select('*')
          .order('activity_score', { ascending: false })

        if (error) throw error
        setCounties(data || [])
      } catch (err) {
        console.error('Error fetching counties:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCounties()
  }, [])

  const filteredCounties = counties.filter((county) =>
    county.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const topCounties = counties.slice(0, 5)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">Georgia Issues Map</h1>
            <p className="text-xs sm:text-sm text-slate-400">Track local engagement in every county</p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            ← Home
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Large Map */}
        <div className="mb-12 sm:mb-16 bg-gradient-to-b from-green-50 to-white rounded-2xl border-2 border-green-600 p-6 sm:p-8 shadow-2xl">
          <div className="mb-4">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Georgia Voter Drift Map (2016-2026)</h2>
            <p className="text-slate-600 text-sm">Green baseline • Red = Republican gains • Blue = Democratic gains | Click a county for details</p>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-slate-400">Loading map...</p>
              </div>
            </div>
          ) : (
            <div className="h-[700px]">
              <GeorgiaCountyMapLeaflet onCountyClick={(county) => router.push(`/dashboard/${encodeURIComponent(county)}`)} />
            </div>
          )}
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8 sm:gap-12">
          {/* Left: Search and List */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                <Input
                  type="text"
                  placeholder="Search counties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-900/40 border-slate-700 text-white placeholder:text-slate-500 focus:border-red-600"
                />
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black mb-4 flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              {searchQuery ? 'Search Results' : 'All Counties'}
            </h2>

            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {filteredCounties.map((county) => {
                const progress = Math.min((county.activity_score / 256) * 100, 100)
                const bgColor = `rgb(${county.color_intensity}, 0, ${255 - county.color_intensity})`
                return (
                  <button
                    key={county.name}
                    onClick={() => router.push(`/dashboard/${encodeURIComponent(county.name)}`)}
                    className="text-left bg-slate-900/40 border border-slate-700 hover:border-red-600/50 rounded-lg p-4 transition-all hover:bg-slate-900/60 group"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-base sm:text-lg truncate group-hover:text-red-400 transition">
                          {county.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-400">{county.activity_score} points</p>
                      </div>
                      <div
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex-shrink-0 border border-slate-700"
                        style={{ backgroundColor: bgColor }}
                      ></div>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 through-purple-600 to-red-600"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right: Leaderboard */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-black mb-4 flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              Leaderboard
            </h2>
            <Card className="bg-slate-900/40 border-slate-700">
              <CardContent className="p-0">
                <div className="space-y-0">
                  {topCounties.map((county, idx) => {
                    const bgColor = `rgb(${county.color_intensity}, 0, ${255 - county.color_intensity})`
                    return (
                      <button
                        key={county.name}
                        onClick={() => router.push(`/dashboard/${encodeURIComponent(county.name)}`)}
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 hover:bg-slate-800/50 transition border-b border-slate-800/50 last:border-b-0"
                      >
                        <div className="font-black text-lg sm:text-xl text-red-500 w-6 text-center">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-sm sm:text-base truncate">{county.name}</p>
                          <p className="text-xs text-slate-400">{county.activity_score} pts</p>
                        </div>
                        <div
                          className="w-8 h-8 rounded-lg flex-shrink-0 border border-slate-600"
                          style={{ backgroundColor: bgColor }}
                        ></div>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="bg-slate-900/40 border-slate-700 mt-6">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Total Counties</p>
                    <p className="text-4xl font-black text-red-500">159</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Average Activity</p>
                    <p className="text-3xl font-black">
                      {Math.round(counties.reduce((sum, c) => sum + c.activity_score, 0) / counties.length) || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Claimed</p>
                    <p className="text-3xl font-black text-red-400">
                      {counties.filter(c => c.activity_score > 0).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/50 backdrop-blur mt-16 sm:mt-24 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-400 text-sm mb-4">
            Ready to claim more counties? Complete missions and earn points.
          </p>
          <Button onClick={() => router.push('/')} className="bg-red-600 hover:bg-red-700 text-white font-bold">
            ← Back to Home
          </Button>
        </div>
      </footer>
    </div>
  )
}
