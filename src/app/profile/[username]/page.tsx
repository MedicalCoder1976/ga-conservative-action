'use client'

import { useEffect, useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge, Profile } from '@/lib/types'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Share2, Award, ArrowLeft } from 'lucide-react'
import { useParams } from 'next/navigation'

export default function UserProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-slate-500">Loading profile...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      }
    >
      <UserProfileContent />
    </Suspense>
  )
}

function UserProfileContent() {
  const params = useParams()
  const username = params.username as string

  const [profile, setProfile] = useState<Profile | null>(null)
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showShareMenu, setShowShareMenu] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const supabase = createClient()

        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single()

        if (profileError) {
          if (profileError.code === 'PGRST116') {
            setError('User not found')
          } else {
            setError(profileError.message)
          }
        } else if (profileData) {
          // Check if profile is public
          if (!profileData.show_real_name) {
            setError('This profile is private. User has not opted in to be publicly visible.')
          } else {
            setProfile(profileData)

            // Fetch badges for this user
            const { data: badgesData, error: badgesError } = await supabase
              .from('badges')
              .select('*')
              .eq('user_id', profileData.id)
              .order('created_at', { ascending: false })

            if (!badgesError) {
              setBadges(badgesData || [])
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    if (username) {
      fetchProfile()
    }
  }, [username])

  const handleShare = () => {
    const url = `${window.location.origin}/profile/${username}`
    if (navigator.share) {
      navigator.share({
        title: `${profile?.full_name || profile?.username}'s Profile`,
        url: url,
      })
    } else {
      navigator.clipboard.writeText(url)
      alert('Profile URL copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-slate-600">Loading profile...</div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <header className="border-b border-slate-200 bg-white">
          <div className="container mx-auto px-4 py-6">
            <Link href="/directory">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Directory
              </Button>
            </Link>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-800">{error || 'Profile not found'}</p>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <Link href="/directory">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to Directory
            </Button>
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-red-700">
                {profile.full_name || profile.username}
              </h1>
              <p className="text-slate-600 mt-2">@{profile.username}</p>
            </div>
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="gap-2"
              >
                <Share2 className="w-4 h-4" />
              </Button>
              {showShareMenu && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                  <button
                    onClick={handleShare}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 text-sm text-slate-700 font-medium"
                  >
                    Share Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Profile Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-slate-600 mb-2">Total Points</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-blue-700">{profile.points}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-slate-600 mb-2">County</p>
              <div className="text-2xl font-semibold text-slate-900">
                {profile.county || 'Not specified'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-slate-600">Username</p>
              <p className="text-lg text-slate-900 font-medium">@{profile.username}</p>
            </div>

            {profile.full_name && (
              <div>
                <p className="text-sm text-slate-600">Full Name</p>
                <p className="text-lg text-slate-900 font-medium">{profile.full_name}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-slate-600">Role</p>
              <p className="text-lg text-slate-900 font-medium">{profile.role}</p>
            </div>

            <div>
              <p className="text-sm text-slate-600">Member Since</p>
              <p className="text-lg text-slate-900 font-medium">
                {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        {badges.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" />
                Achievements ({badges.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-900">{badge.badge_name}</p>
                        {badge.note && (
                          <p className="text-sm text-slate-600 mt-1">{badge.note}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-sm text-slate-600 md:whitespace-nowrap">
                      <p>Awarded by {badge.awarded_by}</p>
                      <p className="text-xs">
                        {new Date(badge.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {badges.length === 0 && (
          <Card className="text-center py-8">
            <CardContent>
              <p className="text-slate-600">No badges earned yet.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
