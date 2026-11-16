'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SuggestedActivity } from '@/lib/types'

interface GuestActivityLoggerProps {
  county: string
  onActivityLogged?: () => void
}

export default function GuestActivityLogger({
  county,
  onActivityLogged,
}: GuestActivityLoggerProps) {
  const [suggestedActivities, setSuggestedActivities] = useState<
    SuggestedActivity[]
  >([])
  const [selectedActivityId, setSelectedActivityId] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showSignupPrompt, setShowSignupPrompt] = useState(false)
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchSuggestedActivities()
  }, [county])

  const fetchSuggestedActivities = async () => {
    try {
      const supabase = createClient()
      if (!supabase) {
        throw new Error('Failed to initialize Supabase client')
      }
      const { data, error } = await supabase
        .from('suggested_activities')
        .select('*')
        .order('cadence', { ascending: true })
        .order('points', { ascending: false })

      if (error) throw error
      setSuggestedActivities(data || [])
    } catch (err) {
      setError(
        `Failed to load activities: ${err instanceof Error ? err.message : 'Unknown error'}`
      )
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError('Image size must be less than 5MB')
        return
      }
      setPhoto(file)
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!selectedActivityId) {
      setError('Please select an activity type')
      return
    }

    if (!photo) {
      setError('Please upload a photo')
      return
    }

    setLoading(true)

    try {
      const activity = suggestedActivities.find(
        (a) => a.id === selectedActivityId
      )
      if (!activity) {
        throw new Error('Selected activity not found')
      }

      // Convert photo to base64 for local storage
      const reader = new FileReader()
      reader.onload = async () => {
        const photoData = reader.result as string

        // Store guest activity locally
        const guestActivities = JSON.parse(
          localStorage.getItem('guestActivities') || '[]'
        )
        guestActivities.push({
          id: `guest-${Date.now()}`,
          county,
          activityType: activity.title,
          points: activity.points,
          notes,
          photo: photoData,
          timestamp: new Date().toISOString(),
        })
        localStorage.setItem('guestActivities', JSON.stringify(guestActivities))

        // Reset form
        setSelectedActivityId('')
        setPhoto(null)
        setNotes('')
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }

        setSuccess(true)
        setLoading(false)
        onActivityLogged?.()

        // Show signup prompt after successful logging
        setTimeout(() => {
          setShowSignupPrompt(true)
          setSuccess(false)
        }, 2000)
      }
      reader.readAsDataURL(photo)
    } catch (err) {
      setError(
        `Failed to log activity: ${err instanceof Error ? err.message : 'Unknown error'}`
      )
      setLoading(false)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    try {
      // Save email to local storage for later account creation
      localStorage.setItem('guestEmail', email)
      
      // Optionally, send email to your backend to add to mailing list
      const response = await fetch('/api/subscribe-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, county }),
      })

      if (!response.ok) {
        throw new Error('Failed to subscribe email')
      }

      setEmailSubmitted(true)
      setEmail('')
      
      // Show signup link after email submitted
      setTimeout(() => {
        setShowSignupPrompt(false)
      }, 3000)
    } catch (err) {
      setError(
        `Failed to subscribe: ${err instanceof Error ? err.message : 'Unknown error'}`
      )
    }
  }

  if (showSignupPrompt) {
    if (emailSubmitted) {
      return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-600 rounded-lg shadow-md text-center">
          <div className="mb-4">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-2xl font-black text-green-900 mb-3">
              Great! You're on the list
            </h3>
            <p className="text-green-800 font-semibold text-lg mb-4">
              We'll keep you updated on new opportunities and activities in {county} county.
            </p>
            <p className="text-green-700 text-sm">
              Check your email for updates about upcoming campaigns and volunteer activities.
            </p>
          </div>
          <button
            onClick={() => setShowSignupPrompt(false)}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition"
          >
            Continue
          </button>
        </div>
      )
    }

    return (
      <div className="w-full max-w-2xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-600 rounded-lg shadow-md">
        <div className="mb-6 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="text-2xl font-black text-blue-900 mb-3">
            Awesome! Activity Logged
          </h3>
          <p className="text-blue-800 font-semibold text-lg mb-4">
            Create an account to save your progress and track your impact over time.
          </p>
        </div>

        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-bold mb-2 text-blue-900">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border-2 border-blue-600 bg-white text-slate-900 placeholder:text-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
              required
            />
            <p className="text-sm text-blue-700 mt-2 font-semibold">
              We'll send you updates about activities and opportunities in your area.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-100 text-red-700 border-2 border-red-600 rounded-lg text-sm font-semibold">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-lg"
          >
            Save Email & Create Account
          </button>

          <a
            href="/auth/login"
            className="block w-full px-6 py-3 text-center bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold rounded-lg transition-colors"
          >
            Sign In Instead
          </a>

          <button
            type="button"
            onClick={() => setShowSignupPrompt(false)}
            className="w-full px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold border-2 border-slate-300 rounded-lg transition-colors"
          >
            Maybe Later
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white border-2 border-green-600 rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-slate-900">Log Activity as Guest</h2>
        <p className="text-sm text-slate-600 font-semibold">
          Log your activities now without signing in. Your activities will be saved locally and synced when you create an account.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 border-2 border-red-600 rounded-lg text-sm font-semibold">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 border-2 border-green-600 rounded-lg text-sm font-semibold">
          Activity logged successfully! 🎉 We'll ask you to create an account so you don't lose your progress.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Activity Type Dropdown */}
        <div>
          <label htmlFor="activity-type" className="block text-sm font-bold mb-2 text-slate-900">
            Activity Type
          </label>
          <select
            id="activity-type"
            value={selectedActivityId}
            onChange={(e) => setSelectedActivityId(e.target.value)}
            className="w-full px-4 py-3 border-2 border-green-600 bg-white text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 font-semibold"
            disabled={loading}
          >
            <option value="">Select an activity...</option>
            {suggestedActivities.map((activity) => (
              <option key={activity.id} value={activity.id}>
                {activity.title} ({activity.points} pts) - {activity.cadence}
              </option>
            ))}
          </select>
        </div>

        {/* Activity Description */}
        {selectedActivityId && (
          <div className="p-4 bg-green-50 border-2 border-green-600 rounded-lg">
            <p className="text-sm text-slate-900 font-semibold">
              {suggestedActivities.find((a) => a.id === selectedActivityId)
                ?.description}
            </p>
          </div>
        )}

        {/* Photo Upload */}
        <div>
          <label htmlFor="photo" className="block text-sm font-bold mb-2 text-slate-900">
            Upload Photo
          </label>
          <input
            ref={fileInputRef}
            id="photo"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="w-full px-4 py-3 border-2 border-green-600 bg-white text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 font-semibold"
            disabled={loading}
          />
          {photo && (
            <p className="mt-2 text-sm text-green-700 font-bold">
              ✓ {photo.name} selected
            </p>
          )}
        </div>

        {/* Notes Textarea */}
        <div>
          <label htmlFor="notes" className="block text-sm font-bold mb-2 text-slate-900">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional details about this activity..."
            className="w-full px-4 py-3 border-2 border-green-600 bg-white text-slate-900 placeholder:text-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 font-semibold"
            rows={4}
            disabled={loading}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold rounded-lg transition-colors text-lg"
        >
          {loading ? 'Logging Activity...' : 'Log Activity'}
        </button>

        {/* Sign In Link */}
        <div className="text-center pt-4 border-t border-slate-300">
          <p className="text-slate-600 font-semibold mb-3">
            Already have an account?
          </p>
          <a
            href="/auth/login"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
          >
            Sign In to Save Progress
          </a>
        </div>
      </form>
    </div>
  )
}
