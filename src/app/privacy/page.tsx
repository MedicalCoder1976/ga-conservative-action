'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

export default function PrivacyPage() {
  const [year, setYear] = useState<number>(2026)

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <header className="border-b border-slate-800 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-black">Privacy Policy</h1>
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
            <h2 className="text-2xl font-black mb-4 text-blue-400">Privacy Policy</h2>
            <p className="text-slate-300 leading-relaxed">
              GA Issues ("we" or "us" or "our") operates the website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our service.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-3 text-blue-400">Information Collection and Use</h3>
            <p className="text-slate-300 leading-relaxed">
              We collect several different types of information for various purposes to provide and improve our service.
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mt-3">
              <li>Account information (email, name)</li>
              <li>Profile data (county, username)</li>
              <li>Activity logs (engagement tracking)</li>
              <li>Usage analytics</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-3 text-blue-400">Data Protection</h3>
            <p className="text-slate-300 leading-relaxed">
              Your data security is important to us but remember that no method of transmission over the Internet is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-3 text-blue-400">Contact Us</h3>
            <p className="text-slate-300 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at privacy@gaissues.com
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
