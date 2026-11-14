'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronRight, MapPin, TrendingUp, Users, BookOpen, ArrowRight } from 'lucide-react'
import { GeorgiaMapVisual } from '@/components/GeorgiaMapVisual'

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 sticky top-0 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-blue-400 rounded-lg flex items-center justify-center font-black text-white">
              GA
            </div>
            <div>
              <div className="font-black text-lg">GA Issues</div>
              <div className="text-xs text-red-400 font-bold">The issues are real. The game isn't.</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#map" className="text-slate-300 hover:text-white transition font-medium">See the Map</a>
            <a href="#how-it-works" className="text-slate-300 hover:text-white transition font-medium">How It Works</a>
          </nav>
          <Button
            onClick={() => router.push('/auth/login')}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded-lg transition"
          >
            Join Now
          </Button>
        </div>
      </header>

      {/* HERO + MAP LAYOUT: Desktop side-by-side, Mobile stacked */}
      <section className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-16 sm:py-24">
          {/* Mobile-first: Map at top, then hero (responsive grid) */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* LEFT: Hero Text (shown below on mobile, left on desktop) */}
            <div className="order-2 lg:order-1">
              <div className="mb-6 inline-block">
                <span className="px-4 py-2 rounded-full bg-red-600/20 border border-red-500/30 text-red-300 text-sm font-semibold">
                  📊 Real Data, Real Impact
                </span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl font-black mb-6 leading-tight tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-blue-400">
                  The Issues
                </span>
                <br />
                Are Real.
                <br />
                <span className="text-slate-300">The Game Isn't.</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed max-w-xl">
                Georgia is changing. Watch election trends from 2012 to 2026. Understand what drives political shifts in your county. Track local issues and engage with your community.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button
                  onClick={() => router.push('/auth/login')}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 text-lg rounded-lg flex items-center justify-center gap-2 transition transform hover:scale-105"
                >
                  Explore Now <ArrowRight className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  className="border-slate-600 text-white hover:bg-slate-800 font-bold px-8 py-4 text-lg rounded-lg"
                  onClick={() => document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View Map
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-800">
                {[
                  { label: '159 Counties', value: 'All of Georgia' },
                  { label: '5 Elections', value: '2012 to 2026' },
                  { label: 'Real Data', value: 'Live Updates' },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-2xl sm:text-3xl font-black text-blue-400">{stat.label}</div>
                    <div className="text-xs sm:text-sm text-slate-400">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Interactive Map (shown first on mobile via order, right on desktop) */}
            <div className="order-1 lg:order-2" id="map">
              <GeorgiaMapVisual />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black mb-4">Get Involved</h2>
          <p className="text-xl text-slate-300">Simple steps to understand what's happening in Georgia</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              num: '01',
              title: 'Sign In',
              desc: 'Just your social account (Google, Apple, Facebook) or email. No complex forms needed.',
              icon: '🔐',
            },
            {
              num: '02',
              title: 'View the Map',
              desc: 'See how Georgia has changed from 2012 to 2026. Watch the blue rising.',
              icon: '📊',
            },
            {
              num: '03',
              title: 'Choose Your County',
              desc: 'Focus on the county that matters to you. Track local data and issues.',
              icon: '📍',
            },
          ].map((step, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700 hover:border-red-500/50 rounded-xl p-8 transition group"
            >
              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl">{step.icon}</span>
                <span className="text-3xl font-black text-red-400">{step.num}</span>
              </div>
              <h3 className="text-xl font-black mb-3 group-hover:text-red-400 transition">{step.title}</h3>
              <p className="text-slate-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Georgia Matters */}
      <section id="why" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-black mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-blue-400">
                Georgia Is Changing
              </span>
            </h2>
            <p className="text-xl text-slate-300 mb-6 leading-relaxed">
              From 2012 to 2026, Georgia shifted 27 points toward Democratic voting. That's not politics—it's demographics. It's generation change. It's people moving, getting older, or changing their minds.
            </p>
            <p className="text-lg text-slate-300 mb-6 leading-relaxed">
              Understanding these patterns helps you understand what's actually happening in your county.
            </p>
            <ul className="space-y-4">
              {[
                'See real election data from 2012-2026',
                'Understand demographic shifts',
                'Track what matters in your county',
                'Engage based on facts, not politics',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <ChevronRight className="w-5 h-5 text-red-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '📊', label: 'Election Data', desc: '5 elections tracked' },
              { icon: '📈', label: 'Trends', desc: 'What\'s changing' },
              { icon: '👥', label: 'Demographics', desc: 'Who lives here' },
              { icon: '🎯', label: 'Insights', desc: 'What it means' },
            ].map((item, i) => (
              <div key={i} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-lg p-6 text-center hover:border-red-500/50 transition">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h4 className="font-black mb-1">{item.label}</h4>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black mb-4">Powerful Features</h2>
          <p className="text-xl text-slate-300">Everything you need to stay informed and engaged</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: '🗺️', title: '159 Counties', desc: 'Full coverage of Georgia' },
            { icon: '📈', title: 'Live Data', desc: 'Election results & trends' },
            { icon: '👤', title: 'Your Profile', desc: 'Public engagement stats' },
            { icon: '🏆', title: 'Recognition', desc: 'Badges & achievements' },
            { icon: '📚', title: 'Resources', desc: 'Civic learning materials' },
            { icon: '💬', title: 'Community', desc: 'Connect with others' },
          ].map((feature, i) => (
            <div key={i} className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700 rounded-lg p-6 hover:border-blue-500/50 transition">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="font-black mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">Ready to Get Involved?</h2>
          <p className="text-lg text-slate-300 mb-8">
            Start tracking local issues, connecting with your community, and making an impact today.
          </p>
          <Button
            onClick={() => router.push('/auth/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 text-lg rounded-lg transition transform hover:scale-105"
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 mt-20 pt-12 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-black mb-4">GA Issues</h3>
              <p className="text-slate-400 text-sm">Community engagement platform for Georgia counties.</p>
            </div>
            <div>
              <h4 className="font-black mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#how-it-works" className="hover:text-white transition">How It Works</a></li>
                <li><a href="#why" className="hover:text-white transition">Why It Matters</a></li>
                <li><a href="#" className="hover:text-white transition">Features</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="/education" className="hover:text-white transition">Learning</a></li>
                <li><a href="/talking-points" className="hover:text-white transition">Resources</a></li>
                <li><a href="#" className="hover:text-white transition">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
            <p>© 2026 GA Issues. Community engagement platform. Politically neutral. For all Georgians.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
