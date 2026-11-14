'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GeorgiaSVGMap } from '@/components/GeorgiaSVGMap'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is logged in (optional)
  }, [])

  const handlePlayClick = () => {
    router.push('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white font-sans">
      <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center font-bold text-sm sm:text-base">
              📍
            </div>
            <span className="text-lg sm:text-xl font-black">GA Issues</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <a href="#how-it-works" className="text-slate-300 hover:text-white transition font-medium">How It Works</a>
            <a href="#features" className="text-slate-300 hover:text-white transition font-medium">Features</a>
          </nav>
          <Button
            onClick={handlePlayClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 sm:px-6 py-2 text-sm sm:text-base"
          >
            Play Now
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-20 max-w-7xl mx-auto">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black mb-3 sm:mb-4 text-white leading-tight tracking-tight">
            Track Local Issues.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">Build Community.</span>
            <br />
            Make Change.
          </h1>
          <p className="text-base sm:text-lg text-slate-400 mb-6 sm:mb-8 max-w-2xl">
            Georgia county by county. Real data. Civic engagement. Connect with your community and track local issues that matter.
          </p>
          <p className="text-xs sm:text-sm text-slate-500 font-mono mb-8">
            📍 YOUR COMMUNITY. YOUR VOICE. 📍
          </p>
          <Button
            size="lg"
            onClick={handlePlayClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-black px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-lg"
          >
            PLAY NOW
          </Button>
        </div>

        {/* Map Hero */}
        <div className="mt-12 sm:mt-16 bg-gradient-to-b from-slate-900/50 to-slate-950/50 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl">
          <div className="mb-4">
            <h2 className="text-2xl sm:text-3xl font-black text-white">Georgia Map</h2>
            <p className="text-slate-400 text-sm">Click any county to join or view real-time activity</p>
          </div>
          <GeorgiaSVGMap />
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-gradient-to-b from-transparent to-slate-900/30 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 mt-12 sm:mt-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-black mb-12 sm:mb-16 text-center">How It Works</h2>
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                num: '01',
                emoji: '🔓',
                title: 'Sign In',
                desc: 'Google, Apple, Facebook, or email. Takes 30 seconds.',
              },
              {
                num: '02',
                emoji: '📍',
                title: 'Choose Your County',
                desc: 'Select the Georgia county you care about most.',
              },
              {
                num: '03',
                emoji: '📊',
                title: 'Track Issues',
                desc: 'View local issues, demographics, and data.',
              },
              {
                num: '04',
                emoji: '✍️',
                title: 'Get Involved',
                desc: 'Log civic activities and connect with your community.',
              },
              {
                num: '05',
                emoji: '🤝',
                title: 'Build Awareness',
                desc: 'County leaderboards. Badges. Public profiles.',
              },
              {
                num: '06',
                emoji: '🌟',
                title: 'Make Impact',
                desc: 'Track community progress and drive local change.',
              },
            ].map((item) => (
              <div key={item.num} className="group bg-slate-900/40 border border-slate-800 hover:border-blue-600/50 rounded-xl p-6 sm:p-8 transition-all hover:bg-slate-900/60">
                <div className="flex items-baseline gap-3 sm:gap-4 mb-4">
                  <span className="text-2xl sm:text-3xl font-black text-blue-600">{item.num}</span>
                  <span className="text-2xl sm:text-3xl">{item.emoji}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black mb-2 group-hover:text-red-400 transition">{item.title}</h3>
                <p className="text-sm sm:text-base text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-black mb-12 sm:mb-16 text-center">Game Features</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                emoji: '🗺️',
                label: '159 Counties',
                desc: 'All of Georgia tracked, monitored, and connected.',
              },
              {
                emoji: '📊',
                label: 'Real Local Data',
                desc: 'Election results, demographics, community insights.',
              },
              {
                emoji: '📋',
                label: 'Issue Tracking',
                desc: 'Track community issues and local priorities.',
              },
              {
                emoji: '⭐',
                label: 'Badges & Recognition',
                desc: 'Unlock achievements. Build your reputation.',
              },
              {
                emoji: '👥',
                label: 'Public Profiles',
                desc: 'Share your engagement. Connect with others.',
              },
              {
                emoji: '💡',
                label: 'Community Resources',
                desc: 'Educational content and civic learning.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 hover:border-blue-600/50 rounded-xl p-6 sm:p-8 transition hover:shadow-lg hover:shadow-blue-900/20">
                <div className="text-3xl sm:text-4xl mb-3">{item.emoji}</div>
                <h3 className="font-black text-base sm:text-lg mb-2 text-white">{item.label}</h3>
                <p className="text-sm sm:text-base text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-blue-600/30 rounded-2xl p-8 sm:p-12">
          <h2 className="text-2xl sm:text-4xl font-black mb-4 text-white">Ready to Get Involved?</h2>
          <p className="text-slate-400 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Join your community. Track local issues. Connect with neighbors. Make a difference in Georgia.
          </p>
          <Button
            size="lg"
            onClick={handlePlayClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-4 text-lg rounded-lg"
          >
            Start Engaging Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-3 gap-8 sm:gap-12 mb-8">
          <div>
            <h3 className="font-black mb-3">GA Issues</h3>
            <p className="text-slate-400 text-sm">Track and engage with local issues across Georgia counties.</p>
          </div>
          <div>
            <h3 className="font-black mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition">How It Works</a></li>
              <li><a href="/talking-points" className="hover:text-white transition">Resources</a></li>
              <li><a href="/education" className="hover:text-white transition">Learning</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-black mb-3">Community</h3>
            <p className="text-slate-400 text-sm">Questions? Ideas? Connect with us at support@example.com</p>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-xs">
          <p>© 2026 GA Issues. A community engagement platform for Georgia. Politically neutral. Civic-focused.</p>
        </div>
      </footer>
    </div>
  )
}
