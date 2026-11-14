'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  uploadActivityPhoto,
  logActivity,
  updateUserPoints,
  updateCountyScore,
} from '@/lib/activity-service'
import type { SuggestedActivity } from '@/lib/types'

interface ActivityLoggerProps {
  userId: string
  county: string
  onSuccess?: () => void
}

export default function ActivityLogger({
  userId,
  county,
  onSuccess,
}: ActivityLoggerProps) {
  const [suggestedActivities, setSuggestedActivities] = useState<
    SuggestedActivity[]
  >([])
  const [selectedActivityId, setSelectedActivityId] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
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

      // Upload photo
      const photoUrl = await uploadActivityPhoto(photo, userId)

      // Log activity
      await logActivity(
        {
          userId,
          county,
          activityType: activity.title,
          points: activity.points,
          notes,
        },
        photoUrl
      )

      // Update user points
      await updateUserPoints(userId, activity.points)

      // Update county score
      await updateCountyScore(county, activity.points)

      // Reset form
      setSelectedActivityId('')
      setPhoto(null)
      setNotes('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      setSuccess(true)
      onSuccess?.()

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(
        `Failed to log activity: ${err instanceof Error ? err.message : 'Unknown error'}`
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white border-2 border-red-600 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-slate-900">Log Activity</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 border-2 border-red-600 rounded-lg text-sm font-semibold">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 border-2 border-red-600 rounded-lg text-sm font-semibold">
          Activity logged successfully! 🎉
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
            className="w-full px-4 py-3 border-2 border-red-600 bg-white text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 font-semibold"
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

        {/* Activity Description (read-only, shows when selected) */}
        {selectedActivityId && (
          <div className="p-4 bg-red-50 border-2 border-red-600 rounded-lg">
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
            className="w-full px-4 py-3 border-2 border-red-600 bg-white text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 font-semibold"
            disabled={loading}
          />
          {photo && (
            <p className="mt-2 text-sm text-red-700 font-bold">
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
            className="w-full px-4 py-3 border-2 border-red-600 bg-white text-slate-900 placeholder:text-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 font-semibold"
            rows={4}
            disabled={loading}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-lg transition-colors text-lg"
        >
          {loading ? 'Logging Activity...' : 'Log Activity'}
        </button>
      </form>
    </div>
  )
}
