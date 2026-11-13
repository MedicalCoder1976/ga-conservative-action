'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { PublicDirectory } from '@/lib/types'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export default function DirectoryPage() {
  const [profiles, setProfiles] = useState<PublicDirectory[]>([])
  const [filteredProfiles, setFilteredProfiles] = useState<PublicDirectory[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const supabase = createClient()
        // First get all public profiles
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, username, county, points, show_real_name')
          .eq('show_real_name', true)
          .order('points', { ascending: false })

        if (profileError) {
          setError(profileError.message)
        } else {
          const publicProfiles: PublicDirectory[] = (profileData || []).map(p => ({
            user_id: p.id,
            username: p.username,
            county: p.county || 'Unknown',
            points: p.points,
            show_real_name: p.show_real_name,
          }))
          setProfiles(publicProfiles)
          setFilteredProfiles(publicProfiles)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch directory')
      } finally {
        setLoading(false)
      }
    }

    fetchProfiles()
  }, [])

  useEffect(() => {
    let results = profiles

    // Filter by search query
    if (searchQuery) {
      results = results.filter(p =>
        p.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by county
    if (selectedCounty) {
      results = results.filter(p => p.county === selectedCounty)
    }

    setFilteredProfiles(results)
  }, [searchQuery, selectedCounty, profiles])

  const counties = Array.from(new Set(profiles.map(p => p.county))).sort()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-slate-600">Loading directory...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">← Back Home</Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-red-700">Community Directory</h1>
          <p className="text-slate-600 mt-2">Connect with conservative activists across Georgia</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-800">Error loading directory: {error}</p>
            </CardContent>
          </Card>
        )}

        {profiles.length === 0 && !error && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-slate-600">No public profiles available yet.</p>
            </CardContent>
          </Card>
        )}

        {profiles.length > 0 && (
          <>
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* County Filter */}
            {counties.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Filter by County</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCounty === null ? "default" : "outline"}
                    onClick={() => setSelectedCounty(null)}
                    size="sm"
                  >
                    All Counties
                  </Button>
                  {counties.map(county => (
                    <Button
                      key={county}
                      variant={selectedCounty === county ? "default" : "outline"}
                      onClick={() => setSelectedCounty(county)}
                      size="sm"
                    >
                      {county}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Results Count */}
            <div className="mb-4">
              <p className="text-sm text-slate-600">
                Showing <span className="font-semibold">{filteredProfiles.length}</span> profile{filteredProfiles.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Profiles Grid */}
            {filteredProfiles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProfiles.map((profile) => (
                  <Link key={profile.user_id} href={`/profile/${profile.username}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900 truncate">
                              {profile.username}
                            </h3>
                            <p className="text-sm text-slate-600">{profile.county}</p>
                          </div>

                          <div className="bg-blue-50 rounded-lg p-3">
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-bold text-blue-700">{profile.points}</span>
                              <span className="text-sm text-slate-600">points</span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-200">
                            <p className="text-xs text-slate-500">Click to view full profile</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-slate-600">No profiles match your search criteria.</p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  )
}
