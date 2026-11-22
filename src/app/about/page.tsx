'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft, MapPin, Users, TrendingUp, Lock } from 'lucide-react'

export default function AboutPage() {
  const [year, setYear] = useState<number>(2024)

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <header className="border-b border-slate-800 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-black">About GA Issues</h1>
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2">
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          <section>
            <h2 className="text-3xl font-black mb-4 text-blue-400">What is GA Issues?</h2>
            <p className="text-slate-300 leading-relaxed text-lg">
              GA Issues is a civic engagement platform designed to help Georgians understand and participate in the political process. Whether you're interested in learning about local election data, exploring demographic trends, or tracking civic participation, GA Issues provides the tools and information you need.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-6 text-blue-400">Our Mission</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              We believe informed citizens make better decisions. Our platform provides transparent access to:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <MapPin className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-white mb-2">County-Level Data</h4>
                  <p className="text-slate-400">Explore election results, demographics, and engagement metrics for all 159 Georgia counties.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Users className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-white mb-2">Community Connection</h4>
                  <p className="text-slate-400">Connect with other civic-minded Georgians and track your community's engagement.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <TrendingUp className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-white mb-2">Trend Analysis</h4>
                  <p className="text-slate-400">See election trends over time and understand how Georgia's political landscape is changing.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Lock className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-white mb-2">Privacy First</h4>
                  <p className="text-slate-400">Your data is private. You control what information is visible to others.</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4 text-blue-400">How It Works</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4 py-2">
                <h4 className="font-bold text-white mb-1">1. Explore the Map</h4>
                <p className="text-slate-400">Start by exploring Georgia's counties and viewing verified election data from 2016 to 2024.</p>
              </div>
              <div className="border-l-4 border-red-500 pl-4 py-2">
                <h4 className="font-bold text-white mb-1">2. Dig Deeper</h4>
                <p className="text-slate-400">Click on any county to see detailed demographics, election results, and exit poll data.</p>
              </div>
              <div className="border-l-4 border-red-500 pl-4 py-2">
                <h4 className="font-bold text-white mb-1">3. Take Action</h4>
                <p className="text-slate-400">Log your civic activities and track your impact in your community.</p>
              </div>
              <div className="border-l-4 border-red-500 pl-4 py-2">
                <h4 className="font-bold text-white mb-1">4. Connect</h4>
                <p className="text-slate-400">Join with others, share insights, and build your network of civic-minded Georgians.</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4 text-blue-400">Data Sources</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              GA Issues aggregates data from publicly available sources including:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>U.S. Census Bureau demographic data</li>
              <li>Georgia Secretary of State election results</li>
              <li>Public exit polling data</li>
              <li>Electoral history databases</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4 text-blue-400">Our Commitment</h3>
            <p className="text-slate-300 leading-relaxed">
              GA Issues is committed to providing accurate, unbiased information about Georgia politics and elections. We believe that transparency and access to data strengthens our democracy. All data presented on this platform is sourced from publicly available records and is presented as factually as possible.
            </p>
          </section>

          <section className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-xl font-bold mb-3 text-blue-400">Questions?</h3>
            <p className="text-slate-300 mb-4">
              Have questions about GA Issues? Visit our <Link href="/contact" className="text-blue-400 hover:text-blue-300 underline">contact page</Link> or check out our <Link href="/privacy" className="text-blue-400 hover:text-blue-300 underline">privacy policy</Link>.
            </p>
          </section>

          <div className="pt-8 border-t border-slate-800">
            <p className="text-slate-500 text-sm">Last updated: {year}</p>
          </div>
        </div>
      </main>
    </div>
  )
}
