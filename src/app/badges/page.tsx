'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge, Profile } from '@/lib/types'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { Award } from 'lucide-react'

interface UserBadges {
  user_id: string
  username: string
  points: number
  badges: Badge[]
}

export default function BadgesPage() {
  const [userBadges, setUserBadges] = useState<UserBadges[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      try {
        // Fetch profiles with points
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, username, points')
          .order('points', { ascending: false })

        if (profileError) {
          setError(profileError.message)
          setLoading(false)
          return
        }

        // Fetch all badges
        const { data: badges, error: badgeError } = await supabase
          .from('badges')
          .select('*')

        if (badgeError) {
          setError(badgeError.message)
          setLoading(false)
          return
        }

        // Group badges by user
        const badgesByUser = new Map<string, Badge[]>()
        badges?.forEach((badge) => {
          if (!badgesByUser.has(badge.user_id)) {
            badgesByUser.set(badge.user_id, [])
          }
          badgesByUser.get(badge.user_id)!.push(badge)
        })

        // Combine data
        const result: UserBadges[] = (profiles || [])
          .filter(p => badgesByUser.has(p.id))
          .map(p => ({
            user_id: p.id,
            username: p.username,
            points: p.points,
            badges: badgesByUser.get(p.id) || [],
          }))
          .sort((a, b) => b.points - a.points)

        setUserBadges(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch badges')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-slate-600">Loading badges...</div>
      </div>
    )
  }

  // Get week start date
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  weekStart.setHours(0, 0, 0, 0)

  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)

  const usersWithRecentBadges = userBadges.filter(u => {
    const recentBadges = u.badges.filter(b => {
      const badgeDate = new Date(b.created_at)
      return badgeDate >= weekStart
    })
    return recentBadges.length > 0
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">← Back Home</Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-red-700">Badges & Achievements</h1>
          <p className="text-slate-600 mt-2">Recognize top performers and community leaders</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-800">Error loading badges: {error}</p>
            </CardContent>
          </Card>
        )}

        {userBadges.length === 0 && !error && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-slate-600">No badges awarded yet.</p>
            </CardContent>
          </Card>
        )}

        {userBadges.length > 0 && (
          <>
            {/* Top Performers This Week */}
            {usersWithRecentBadges.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">🌟 Recent Achievements (This Week)</h2>
                <div className="space-y-4">
                  {usersWithRecentBadges.slice(0, 5).map((user) => {
                    const recentBadges = user.badges.filter(b => {
                      const badgeDate = new Date(b.created_at)
                      return badgeDate >= weekStart
                    })
                    return (
                      <Card key={user.user_id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <CardTitle className="text-lg text-slate-900">{user.username}</CardTitle>
                              <p className="text-sm text-slate-600 mt-1">{user.points} total points</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-blue-600">{recentBadges.length} badge{recentBadges.length !== 1 ? 's' : ''}</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0 border-t border-slate-200">
                          <div className="flex flex-wrap gap-2 mt-3">
                            {recentBadges.map((badge) => (
                              <div
                                key={badge.id}
                                className="inline-flex items-center gap-1 bg-yellow-50 border border-yellow-200 rounded-full px-3 py-1 text-sm"
                              >
                                <Award className="w-4 h-4 text-yellow-600" />
                                <span className="font-medium text-yellow-900">{badge.badge_name}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </section>
            )}

            {/* All Ranked Users */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">🏆 Leaderboard</h2>
              <div className="grid gap-4 md:gap-3">
                {userBadges.map((user, index) => (
                  <Card key={user.user_id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full text-white font-bold text-lg">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-slate-900 truncate">
                              {user.username}
                            </h3>
                            <p className="text-sm text-slate-600">{user.badges.length} achievement{user.badges.length !== 1 ? 's' : ''}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-700">{user.points}</div>
                            <p className="text-xs text-slate-600">points</p>
                          </div>
                        </div>

                        {user.badges.length > 0 && (
                          <div className="border-t border-slate-200 pt-4">
                            <p className="text-xs font-semibold text-slate-700 mb-2 uppercase">Badges</p>
                            <div className="flex flex-wrap gap-2">
                              {user.badges.slice(0, 6).map((badge) => (
                                <div
                                  key={badge.id}
                                  className="inline-flex items-center gap-1 bg-yellow-50 border border-yellow-200 rounded-full px-2 py-1 text-xs"
                                  title={`${badge.badge_name} - Awarded by ${badge.awarded_by}`}
                                >
                                  <Award className="w-3 h-3 text-yellow-600" />
                                  <span className="font-medium text-yellow-900">{badge.badge_name}</span>
                                </div>
                              ))}
                              {user.badges.length > 6 && (
                                <span className="text-xs text-slate-600">
                                  +{user.badges.length - 6} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}
