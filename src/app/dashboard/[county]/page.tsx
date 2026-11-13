'use client'

import { Card, CardContent } from '@/components/ui/card'
import ElectionResultsCard from '@/components/ElectionResultsCard'
import DemographicsCard from '@/components/DemographicsCard'
import ExitPollsCard from '@/components/ExitPollsCard'
import SuggestedActivitiesList from '@/components/SuggestedActivitiesList'
import { createClient } from '@/lib/supabase/client'
import { useParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'

interface CountyData {
  county: any
  election: any
  demographics: any
  polls: any[]
}

async function getCountyData(county: string, supabase: any) {
  if (!supabase) {
    return {
      county: null,
      election: null,
      demographics: null,
      polls: [],
      user: null,
    }
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const [countyRes, electionRes, demographicsRes, pollsRes] = await Promise.all([
      supabase
        .from('counties')
        .select('*')
        .eq('name', decodeURIComponent(county))
        .single()
        .catch(() => ({ data: null })),
      supabase
        .from('election_results')
        .select('*')
        .eq('county', decodeURIComponent(county))
        .order('year', { ascending: false })
        .limit(1)
        .catch(() => ({ data: [] })),
      supabase
        .from('demographics')
        .select('*')
        .eq('county', decodeURIComponent(county))
        .single()
        .catch(() => ({ data: null })),
      supabase
        .from('exit_polls')
        .select('*')
        .eq('county', decodeURIComponent(county))
        .catch(() => ({ data: [] })),
    ])

    return {
      county: countyRes.data || null,
      election: electionRes.data?.[0] || null,
      demographics: demographicsRes.data || null,
      polls: pollsRes.data || [],
      user: user || null,
    }
  } catch (error) {
    console.error('Error fetching county data:', error)
    return {
      county: null,
      election: null,
      demographics: null,
      polls: [],
      user: null,
    }
  }
}

export default function CountyDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-slate-500">Loading...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      }
    >
      <CountyDashboardContent />
    </Suspense>
  )
}

function CountyDashboardContent() {
  const params = useParams()
  const county = params.county as string
  const decodedCounty = decodeURIComponent(county)
  const [data, setData] = useState<CountyData>({
    county: null,
    election: null,
    demographics: null,
    polls: [],
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getCountyData(decodedCounty, supabase)
        setData(result)
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [decodedCounty, supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-slate-500">Loading...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const { county: countyData, election, demographics, polls } = data

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              {decodedCounty} County
            </h1>
            <a href="/dashboard" className="text-blue-600 dark:text-blue-400 hover:underline">
              ← Back
            </a>
          </div>
          {countyData && (
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Activity Score: <span className="font-bold text-blue-600 dark:text-blue-400">{countyData.activity_score}</span>
            </p>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Election Results Card */}
          <div className="lg:col-span-1">
            <ElectionResultsCard county={decodedCounty} electionData={election} />
          </div>

          {/* Demographics Card */}
          <div className="lg:col-span-1">
            <DemographicsCard county={decodedCounty} demographicsData={demographics} />
          </div>

          {/* Exit Polls Card - Full Width */}
          <div className="lg:col-span-2">
            <ExitPollsCard county={decodedCounty} pollsData={polls} />
          </div>
        </div>

        {/* No Data Message */}
        {!countyData && !election && !demographics && polls.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-slate-500">No data available for {decodedCounty} County</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

