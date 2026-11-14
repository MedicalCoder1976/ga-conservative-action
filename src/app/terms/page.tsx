'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

export default function TermsPage() {
  const [year, setYear] = useState<number>(2026)

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <header className="border-b border-slate-800 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-black">Terms of Service</h1>
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
            <h2 className="text-2xl font-black mb-4 text-blue-400">Terms of Service</h2>
            <p className="text-slate-300 leading-relaxed">
              Welcome to GA Issues. These Terms of Service govern your use of our website and service. By accessing and using this site, you accept and agree to be bound by and comply with these terms and conditions.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-3 text-blue-400">License to Use Website</h3>
            <p className="text-slate-300 leading-relaxed">
              Unless otherwise stated, GA Issues owns the intellectual property rights for all material on this website. All intellectual property rights are reserved. You may view and print pages from the website for personal use, subject to restrictions set in these terms and conditions.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-3 text-blue-400">User Responsibilities</h3>
            <p className="text-slate-300 leading-relaxed mb-3">You are responsible for:</p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Maintaining the confidentiality of account credentials</li>
              <li>Providing accurate information during registration</li>
              <li>Using the platform lawfully and respectfully</li>
              <li>Not posting misleading or harmful content</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-3 text-blue-400">Limitations of Liability</h3>
            <p className="text-slate-300 leading-relaxed">
              The information on this website is provided on an "as is" basis without any representations or warranties, express or implied. We make no representations or warranties in relation to this website or the information and materials provided.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-3 text-blue-400">Governing Law</h3>
            <p className="text-slate-300 leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws of the State of Georgia, and you irrevocably submit to the exclusive jurisdiction of the courts located in that location.
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
