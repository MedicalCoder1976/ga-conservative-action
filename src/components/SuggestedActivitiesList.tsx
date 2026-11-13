'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import ActivityLogger from '@/components/ActivityLogger'
import type { SuggestedActivity } from '@/lib/types'

interface SuggestedActivitiesListProps {
  county: string
  userId: string
}

export default function SuggestedActivitiesList({
  county,
  userId,
}: SuggestedActivitiesListProps) {
  const [activities, setActivities] = useState<SuggestedActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const supabase = createClient()
        
        const { data, error: fetchError } = await supabase
          .from('suggested_activities')
          .select('*')
          .order('cadence', { ascending: true })
          .order('points', { ascending: false })

        if (fetchError) throw fetchError

        setActivities(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load activities')
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  // Group activities by cadence
  const grouped = activities.reduce(
    (acc, activity) => {
      const cadence = activity.cadence
      if (!acc[cadence]) {
        acc[cadence] = []
      }
      acc[cadence].push(activity)
      return acc
    },
    {} as Record<string, SuggestedActivity[]>
  )

  const cadenceOrder = ['daily', 'weekly', 'monthly']
  const sortedCadences = Object.keys(grouped).sort(
    (a, b) => cadenceOrder.indexOf(a) - cadenceOrder.indexOf(b)
  )

  if (loading) {
    return (
      <div className="w-full">
        <h2 className="text-3xl font-bold mb-6">Suggested Activities</h2>
        <p className="text-gray-500">Loading activities...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-600 p-4">
        <p>Error loading activities: {error}</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold mb-6">Suggested Activities</h2>

      {Object.keys(grouped).length === 0 ? (
        <p className="text-gray-500">
          No suggested activities available for your county.
        </p>
      ) : (
        <>
          {sortedCadences.map((cadence) => (
            <div key={cadence} className="mb-8">
              <h3 className="text-xl font-semibold mb-4 capitalize">
                {cadence} Activities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {grouped[cadence].map((activity: SuggestedActivity) => (
                  <div
                    key={activity.id}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-semibold">
                        {activity.title}
                      </h4>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
                        {activity.points} pts
                      </span>
                    </div>
                    {activity.description && (
                      <p className="text-gray-600 mb-3">
                        {activity.description}
                      </p>
                    )}
                    {activity.category && (
                      <p className="text-sm text-gray-500 mb-3">
                        Category: {activity.category}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Activity Logger */}
          <div className="mt-8 border-t pt-8">
            <ActivityLogger
              userId={userId}
              county={county}
              onSuccess={() => {
                console.log('Activity logged successfully')
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}
