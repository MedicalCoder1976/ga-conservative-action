import Link from 'next/link'
import { ConcernsAdminDashboard } from '@/components/ConcernsAdminDashboard'

export default function AdminConcernsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">Admin Concerns Panel</h1>
          <Link href="/" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold">
            ← Back to Map
          </Link>
        </div>
      </header>
      <ConcernsAdminDashboard />
    </div>
  )
}
