'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <header className="border-b border-slate-800 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-black">Contact Us</h1>
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2">
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <section>
            <h2 className="text-2xl font-black mb-6 text-blue-400">Get in Touch</h2>
            <p className="text-slate-300 mb-8 leading-relaxed">
              Have questions about GA Issues? We'd love to hear from you. Get in touch with our team.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-white mb-2">Email</h3>
                <p className="text-slate-400">hello@gaissues.com</p>
              </div>
              <div>
                <h3 className="font-bold text-white mb-2">Support</h3>
                <p className="text-slate-400">support@gaissues.com</p>
              </div>
              <div>
                <h3 className="font-bold text-white mb-2">Social</h3>
                <p className="text-slate-400">Follow us on social media for updates</p>
              </div>
            </div>
          </section>

          <section>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                <Input 
                  id="name"
                  type="text" 
                  placeholder="Your name" 
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="your@email.com" 
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                <textarea 
                  id="message"
                  rows={4}
                  placeholder="Your message"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 font-bold">
                Send Message
              </Button>
            </form>
          </section>
        </div>
      </main>
    </div>
  )
}
