'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TalkingPoint } from '@/lib/types'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'

export default function TalkingPointsPage() {
  const [talkingPoints, setTalkingPoints] = useState<TalkingPoint[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      try {
        const { data, error: fetchError } = await supabase
          .from('talking_points')
          .select('*')
          .order('date', { ascending: false })

        if (fetchError) {
          setError(fetchError.message)
        } else {
          setTalkingPoints(data || [])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch talking points')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-slate-600">Loading talking points...</div>
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
          <h1 className="text-3xl md:text-4xl font-bold text-red-700">Today's Talking Points</h1>
          <p className="text-slate-600 mt-2">Key messages and facts for conservative action</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-800">Error loading talking points: {error}</p>
            </CardContent>
          </Card>
        )}

        {talkingPoints.length === 0 && !error && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-slate-600">No talking points available yet.</p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:gap-4">
          {talkingPoints.map((point) => (
            <Card key={point.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <CardTitle className="text-lg md:text-xl text-slate-900">{point.title}</CardTitle>
                  <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                    {format(new Date(point.date), 'MMM d, yyyy')}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-700 leading-relaxed">{point.content}</p>
                {point.source && (
                  <div className="pt-2 border-t border-slate-200">
                    <p className="text-sm text-slate-600">
                      <span className="font-semibold">Source:</span> {point.source}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {talkingPoints.length > 10 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600">
              Showing {talkingPoints.length} talking points
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
