'use client'

import { useState } from 'react'
import { ChevronRight, MapPin, TrendingUp, Users, BookOpen, ArrowRight } from 'lucide-react'
import { GeorgiaRealMap } from '@/components/GeorgiaRealMap'
import Link from 'next/link'

export default function HomePage() {
  const handleViewMap = () => {
    const mapElement = document.getElementById('map')
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-red-50 to-white text-slate-900 overflow-hidden">
      {/* Header */}
      <header className="relative z-50 sticky top-0 bg-white/95 backdrop-blur-md border-b-2 border-red-600 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center font-black text-white text-lg">
              GA
            </div>
            <div>
              <div className="font-black text-xl text-slate-900">GA Issues</div>
              <div className="text-xs text-red-600 font-bold">Community Engagement Platform</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#map" className="text-slate-700 hover:text-red-600 transition font-semibold">View Map</a>
            <a href="#features" className="text-slate-700 hover:text-red-600 transition font-semibold">Features</a>
          </nav>
          <Link
            href="/auth/login"
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 text-lg rounded-lg transition inline-block"
          >
            Join Now
          </Link>
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
                <span className="px-4 py-2 rounded-full bg-red-100 border-2 border-red-600 text-red-700 text-sm font-bold">
                  📊 Real Data, Real Impact
                </span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl font-black mb-6 leading-tight tracking-tight text-slate-900">
                <span className="text-red-600">
                  The Issues
                </span>
                <br />
                Are Real.
                <br />
                <span className="text-slate-700">The Game Isn't.</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-700 mb-8 leading-relaxed max-w-xl font-semibold">
                Georgia is changing. Watch election trends from 2012 to 2026. Understand what drives political shifts in your county. Track local issues and engage with your community.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  href="/auth/login"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 text-lg rounded-lg flex items-center justify-center gap-2 transition transform hover:scale-105"
                >
                  Explore Now <ArrowRight className="w-5 h-5" />
                </Link>
                <button
                  className="border-2 border-red-600 text-red-600 hover:bg-red-50 font-bold px-8 py-4 text-lg rounded-lg transition"
                  onClick={handleViewMap}
                >
                  View Map
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t-2 border-red-600">
                {[
                  { label: '159 Counties', value: 'All of Georgia' },
                  { label: '5 Elections', value: '2012 to 2026' },
                  { label: 'Real Data', value: 'Live Updates' },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-2xl sm:text-3xl font-black text-red-600">{stat.label}</div>
                    <div className="text-xs sm:text-sm text-slate-600 font-semibold">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Interactive Map (shown first on mobile via order, right on desktop) */}
            <div className="order-1 lg:order-2" id="map">
              <GeorgiaRealMap />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black mb-4 text-slate-900">Get Involved</h2>
          <p className="text-xl text-slate-700 font-semibold">Simple steps to understand what's happening in Georgia</p>
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
              className="bg-white border-2 border-red-600 hover:shadow-lg rounded-xl p-8 transition group"
            >
              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl">{step.icon}</span>
                <span className="text-3xl font-black text-red-600">{step.num}</span>
              </div>
              <h3 className="text-xl font-black mb-3 text-slate-900 group-hover:text-red-600 transition">{step.title}</h3>
              <p className="text-slate-700 font-semibold">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Georgia Matters */}
      <section id="why" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-black mb-6 text-red-600">
              Georgia Is Changing
            </h2>
            <p className="text-xl text-slate-700 mb-6 leading-relaxed font-semibold">
              From 2012 to 2026, Georgia shifted 27 points toward Democratic voting. That's not politics—it's demographics. It's generation change. It's people moving, getting older, or changing their minds.
            </p>
            <p className="text-lg text-slate-700 mb-6 leading-relaxed font-semibold">
              Understanding these patterns helps you understand what's actually happening in your county.
            </p>
            <ul className="space-y-4">
              {[
                'See real election data from 2012-2026',
                'Understand demographic shifts',
                'Track what matters in your county',
                'Engage based on facts, not politics',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 font-semibold">
                  <ChevronRight className="w-5 h-5 text-red-600 flex-shrink-0" />
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
              <div key={i} className="bg-white border-2 border-red-600 rounded-lg p-6 text-center hover:shadow-lg transition">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h4 className="font-black mb-1 text-slate-900">{item.label}</h4>
                <p className="text-sm text-slate-700 font-semibold">{item.desc}</p>
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
        <div className="bg-gradient-to-r from-red-100 to-red-50 border-2 border-red-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-4 text-slate-900">Ready to Get Involved?</h2>
          <p className="text-lg text-slate-700 mb-8 font-semibold">
            Start tracking local issues, connecting with your community, and making an impact today.
          </p>
          <Link
            href="/auth/login"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 text-lg rounded-lg transition transform hover:scale-105"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t-2 border-red-600 mt-20 pt-12 pb-8 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-black mb-4 text-slate-900">GA Issues</h3>
              <p className="text-slate-700 text-sm font-semibold">Community engagement platform for Georgia counties.</p>
            </div>
            <div>
              <h4 className="font-black mb-3 text-slate-900">Product</h4>
              <ul className="space-y-2 text-sm text-slate-700">
                <li><a href="#how-it-works" className="hover:text-red-600 transition font-semibold">How It Works</a></li>
                <li><a href="#why" className="hover:text-red-600 transition font-semibold">Why It Matters</a></li>
                <li><a href="#" className="hover:text-red-600 transition font-semibold">Features</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-3 text-slate-900">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-700">
                <li><a href="/education" className="hover:text-red-600 transition font-semibold">Learning</a></li>
                <li><a href="/talking-points" className="hover:text-red-600 transition font-semibold">Resources</a></li>
                <li><a href="#" className="hover:text-red-600 transition font-semibold">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-3 text-slate-900">Company</h4>
              <ul className="space-y-2 text-sm text-slate-700">
                <li><a href="/about" className="hover:text-red-600 transition font-semibold">About</a></li>
                <li><a href="/contact" className="hover:text-red-600 transition font-semibold">Contact</a></li>
                <li><a href="/privacy" className="hover:text-red-600 transition font-semibold">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t-2 border-red-600 pt-8 text-center text-slate-700 text-sm font-semibold">
            <p>© 2026 GA Issues. Community engagement platform. Politically neutral. For all Georgians.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
