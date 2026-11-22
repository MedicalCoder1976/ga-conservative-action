'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { GEORGIA_COUNTIES } from '@/lib/constants/georgia-counties'

export default function OnboardingPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [county, setCounty] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<'username' | 'county'>('username')

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()
      if (!username.trim()) throw new Error('Username is required')
      if (username.length < 3) throw new Error('Username must be at least 3 characters')

      // Check if username exists
      const { data, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username.toLowerCase())
        .single()

      if (checkError && checkError.code !== 'PGRST116') throw checkError
      if (data) throw new Error('Username already taken')

      setStep('county')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCountySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()
      if (!county) throw new Error('County is required')

      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) throw userError || new Error('No authenticated user')

      // Create profile
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          username: username.toLowerCase(),
          full_name: user.user_metadata?.full_name || null,
          county,
          role: 'Visitor',
          show_real_name: false,
          points: 0,
        })

      if (insertError) throw insertError

      router.push(`/dashboard/${county}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            {step === 'username' ? 'Choose a public username' : 'Select your county'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded text-sm mb-4">
              {error}
            </div>
          )}

          {step === 'username' ? (
            <form onSubmit={handleUsernameSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Public Username
                </label>
                <Input
                  type="text"
                  placeholder="john_voter"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  minLength={3}
                />
                <p className="text-xs text-slate-500 mt-1">
                  This will be visible to other users
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Checking...' : 'Continue'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleCountySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Select Your County
                </label>
                <select
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                >
                  <option value="">Choose a county...</option>
                  {GEORGIA_COUNTIES.slice(0, 20).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">
                  You can change this later
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setStep('username')}
                  disabled={loading}
                >
                  Back
                </Button>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Profile'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
