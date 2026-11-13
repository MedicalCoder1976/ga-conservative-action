'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CountyMap } from '@/components/CountyMap'
import Link from 'next/link'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-red-700">GA Voter Action</h1>
          <div className="flex gap-2">
            <Link href="/admin/concerns">
              <Button variant="outline">Admin Concerns</Button>
            </Link>
            {user ? (
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <Link href="/auth/login">
                <Button>Sign In to Participate</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Talking Points Bar */}
      <div className="bg-blue-50 border-b border-blue-200 py-4">
        <div className="container mx-auto px-4">
          <h3 className="font-semibold text-slate-900 mb-2">Today's Talking Points</h3>
          <p className="text-sm text-slate-600">Voter action drives results. Join volunteers making a difference.</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Map Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-2">Georgia County Activity Map</h2>
          <p className="text-sm text-slate-600 mb-6">Click any county to view activity details or log new activities. Color intensity shows activity level.</p>
          <Card>
            <CardContent className="p-6 md:p-8">
              <CountyMap />
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="bg-red-50 border-2 border-red-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-red-900 mb-4">Ready to Make a Difference?</h2>
          <p className="text-red-800 mb-6">Sign in with your Google, Apple, or Facebook account to start logging activities and earning points.</p>
          <Link href="/auth/login">
            <Button size="lg" className="bg-red-700 hover:bg-red-800">
              Sign In Now
            </Button>
          </Link>
        </section>
      </main>
    </div>
  )
}
