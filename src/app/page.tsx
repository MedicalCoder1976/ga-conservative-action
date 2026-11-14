'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronRight, MapPin, TrendingUp, Users, BookOpen, ArrowRight } from 'lucide-react'
import { GeorgiaSVGMap } from '@/components/GeorgiaSVGMap'

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
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center font-black">
              GA
            </div>
            <div>
              <div className="font-black text-lg">GA Issues</div>
              <div className="text-xs text-blue-400">Community Engagement</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-slate-300 hover:text-white transition font-medium">How It Works</a>
            <a href="#why" className="text-slate-300 hover:text-white transition font-medium">Why It Matters</a>
          </nav>
          <Button
            onClick={() => router.push('/auth/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg transition"
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 sm:py-32">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="mb-6 inline-block">
            <span className="px-4 py-2 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-sm font-semibold">
              ✨ Community Engagement Platform
            </span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-black mb-6 leading-tight tracking-tight">
            Track Local Issues.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500">
              Build Community.
            </span>
            <br />
            Make Impact.
          </h1>
          
          <p className="text-xl sm:text-2xl text-slate-300 mb-12 leading-relaxed max-w-2xl mx-auto">
            Connect with your Georgia community. Track local issues. Engage with neighbors. Drive real change in your county.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={() => router.push('/auth/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 text-lg rounded-lg flex items-center justify-center gap-2 transition transform hover:scale-105"
            >
              Start Engaging <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-800 font-bold px-8 py-4 text-lg rounded-lg"
            >
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-16 pt-16 border-t border-slate-800">
            {[
              { label: '159 Counties', value: 'All of Georgia' },
              { label: 'Real Data', value: 'Election & Demographics' },
              { label: 'Community', value: 'Civic Engagement' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-blue-400 mb-1">{stat.label}</div>
                <div className="text-sm text-slate-400">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Preview Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-b from-slate-900/50 to-slate-950/50 border border-slate-800 rounded-2xl p-8 sm:p-12 overflow-hidden">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-black mb-2">Interactive Georgia Map</h2>
            <p className="text-slate-400">Click any county to view local data, track issues, and engage with your community</p>
          </div>
          
          {/* Interactive Georgia Map */}
          <div className="bg-slate-800/40 rounded-xl overflow-hidden">
            <GeorgiaSVGMap />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black mb-4">How It Works</h2>
          <p className="text-xl text-slate-300">Simple steps to engage with your community</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              num: '01',
              title: 'Sign In',
              desc: 'Create your account with Google, Apple, Facebook, or Email. Takes 30 seconds.',
              icon: '🔐',
            },
            {
              num: '02',
              title: 'Choose Your County',
              desc: 'Select the Georgia county you care about most to see local data and issues.',
              icon: '📍',
            },
            {
              num: '03',
              title: 'Explore & Engage',
              desc: 'Track issues, learn about local topics, log your civic activities, and build connections.',
              icon: '✨',
            },
          ].map((step, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700 hover:border-blue-500/50 rounded-xl p-8 transition group"
            >
              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl">{step.icon}</span>
                <span className="text-3xl font-black text-blue-400">{step.num}</span>
              </div>
              <h3 className="text-xl font-black mb-3 group-hover:text-blue-400 transition">{step.title}</h3>
              <p className="text-slate-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why It Matters */}
      <section id="why" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-black mb-6">Why Local Engagement Matters</h2>
            <p className="text-xl text-slate-300 mb-6 leading-relaxed">
              Real change starts at the community level. By tracking local issues and engaging with your neighbors, you can influence policy, build awareness, and create meaningful impact in your county.
            </p>
            <ul className="space-y-4">
              {[
                'Track real election data and demographics',
                'Learn about local civic issues',
                'Connect with community members',
                'Share your voice and insights',
                'Build a stronger, more informed community',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <ChevronRight className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '📊', label: 'Real Data', desc: 'Election results & demographics' },
              { icon: '👥', label: 'Community', desc: 'Connect with neighbors' },
              { icon: '💡', label: 'Learning', desc: 'Civic education resources' },
              { icon: '🌟', label: 'Impact', desc: 'Drive local change' },
            ].map((item, i) => (
              <div key={i} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-lg p-6 text-center hover:border-blue-500/50 transition">
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
