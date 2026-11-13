'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Profile } from '@/lib/types'
import Link from 'next/link'
import { useState as useSessionState } from 'react'

const GA_COUNTIES = [
  'Appling', 'Atkinson', 'Bacon', 'Baker', 'Baldwin', 'Banks', 'Barrow', 'Bartow',
  'Bates', 'Ben Hill', 'Berrien', 'Bibb', 'Bleckley', 'Brantley', 'Brooks', 'Bryan',
  'Bulloch', 'Burke', 'Butts', 'Calhoun', 'Camden', 'Campbell', 'Candler', 'Carroll',
  'Catoosa', 'Charlton', 'Chatham', 'Chattahoochee', 'Chattooga', 'Cherokee', 'Cherry',
  'Chesapeake', 'Chester', 'Chestnut', 'Clay', 'Clayton', 'Clinch', 'Cobb', 'Coffee',
  'Colquitt', 'Columbia', 'Comanche', 'Conyers', 'Cook', 'Coweta', 'Crawford', 'Crisp',
  'Decatur', 'DeKalb', 'Dodge', 'Dooly', 'Dougherty', 'Douglas', 'Decatur', 'Early',
  'Echols', 'Effingham', 'Elbert', 'Emanuel', 'Emerald', 'Emmet', 'Evans', 'Fannin',
  'Fayette', 'Fern', 'Flint', 'Floyd', 'Forsyth', 'Fulton', 'Funston', 'Gilmer',
  'Glascock', 'Glynn', 'Gordon', 'Grady', 'Greene', 'Greensboro', 'Greenville', 'Greenwood',
  'Groveland', 'Grundy', 'Guilford', 'Gwinnett', 'Habersham', 'Hagan', 'Hagg', 'Hahira',
  'Hancock', 'Handcock', 'Haralson', 'Hardeman', 'Hardy', 'Harlem', 'Harris', 'Hart',
  'Hartwell', 'Harvest', 'Hasbrouck', 'Hauser', 'Hawkinsville', 'Hawthorn', 'Hazelhurst',
  'Hazlehurst', 'Hephzibah', 'Herod', 'Herrick', 'Hervey', 'Herwin', 'Heschel', 'Hesper',
  'Hester', 'Heston', 'Heth', 'Hethel', 'Hewett', 'Hewell', 'Hexam', 'Hickman', 'Hicks',
  'Hidalgo', 'Higgins', 'Highlands', 'Highsmith', 'Hilary', 'Hildebrand', 'Hill', 'Hillard',
  'Hillsborough', 'Hillside', 'Hilton', 'Himrod', 'Hines', 'Hinson', 'Hinton', 'Hiram',
  'Hirt', 'Hiskey', 'Hisses', 'Historian', 'Historic', 'Hitchcock', 'Hites', 'Hixon',
  'Hobart', 'Hobbs', 'Hobgood', 'Hobby', 'Hoboken', 'Hobson', 'Hochberg', 'Hocking',
  'Hodges', 'Hodgkinson', 'Hodgson', 'Hodsdon', 'Hody', 'Hoecker', 'Hoelting', 'Hoeng'
]

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  const [formData, setFormData] = useState({
    county: '',
    show_real_name: false,
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const supabase = createClient()
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          setError('Not authenticated. Please sign in.')
          setLoading(false)
          return
        }

        // Get profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) {
          setError(profileError.message)
        } else if (profileData) {
          setProfile(profileData)
          setFormData({
            county: profileData.county || '',
            show_real_name: profileData.show_real_name || false,
          })
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSave = async () => {
    if (!profile) return

    setIsSaving(true)
    setSaveMessage(null)

    try {
      const supabase = createClient()
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          county: formData.county || null,
          show_real_name: formData.show_real_name,
        })
        .eq('id', profile.id)

      if (updateError) {
        setSaveMessage({ type: 'error', text: updateError.message })
      } else {
        setSaveMessage({ type: 'success', text: 'Profile updated successfully!' })
        setProfile({
          ...profile,
          county: formData.county,
          show_real_name: formData.show_real_name,
        })
      }
    } catch (err) {
      setSaveMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to save profile',
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-slate-600">Loading profile...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
          <div className="container mx-auto px-4 py-6">
            <Link href="/">
              <Button variant="ghost" className="mb-4">← Back Home</Button>
            </Link>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-800">
                {error || 'Please sign in to view your profile.'}
              </p>
              <Link href="/auth/login">
                <Button className="mt-4 bg-red-700 hover:bg-red-800">Sign In</Button>
              </Link>
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
          <Link href="/">
            <Button variant="ghost" className="mb-4">← Back Home</Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-red-700">My Profile</h1>
          <p className="text-slate-600 mt-2">Manage your profile settings and preferences</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-800">{error}</p>
            </CardContent>
          </Card>
        )}

        {saveMessage && (
          <Card className={`mb-6 ${saveMessage.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <CardContent className="pt-6">
              <p className={saveMessage.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                {saveMessage.text}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Profile Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Username (Read-only) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={profile.username}
                disabled
                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 cursor-not-allowed"
              />
              <p className="text-xs text-slate-500 mt-1">Your username cannot be changed</p>
            </div>

            {/* Points (Read-only) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Current Points
              </label>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-blue-700">{profile.points}</span>
                <span className="text-slate-600">points</span>
              </div>
            </div>

            {/* County Selector */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                County
              </label>
              <select
                value={formData.county}
                onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select a county...</option>
                {GA_COUNTIES.map(county => (
                  <option key={county} value={county}>
                    {county}
                  </option>
                ))}
              </select>
            </div>

            {/* Show Real Name Checkbox */}
            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.show_real_name}
                  onChange={(e) => setFormData({ ...formData, show_real_name: e.target.checked })}
                  className="w-4 h-4 border border-slate-300 rounded focus:ring-2 focus:ring-red-500 cursor-pointer"
                />
                <span className="text-slate-700">
                  Make my profile public
                  {profile.full_name && ` (show as "${profile.full_name}")`}
                </span>
              </label>
              <p className="text-xs text-slate-600 mt-2 ml-7">
                When enabled, your profile will appear in the community directory
              </p>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-red-700 hover:bg-red-800 disabled:bg-slate-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </CardContent>
        </Card>

        {/* Role Info */}
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-slate-600">Role</p>
              <p className="text-lg font-semibold text-slate-900">{profile.role}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Member Since</p>
              <p className="text-lg font-semibold text-slate-900">
                {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
