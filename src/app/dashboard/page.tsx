'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

interface County {
  name: string
  fips: string
  activity_score: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [counties, setCounties] = useState<County[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCounties = async () => {
      try {
        const supabase = createClient()

        const { data, error } = await supabase
          .from('counties')
          .select('name, fips, activity_score')
          .order('name')

        if (error) {
          console.error('Error fetching counties:', error)
          setCounties(mockCounties)
        } else {
          setCounties(data || mockCounties)
        }
      } catch (err) {
        console.error('Error:', err)
        setCounties(mockCounties)
      } finally {
        setLoading(false)
      }
    }

    fetchCounties()
  }, [])

  const filteredCounties = counties.filter((county) =>
    county.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectCounty = (countyName: string) => {
    setSelectedCounty(countyName)
    router.push(`/dashboard/${encodeURIComponent(countyName)}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            County Dashboard
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Select a county to view election results, demographics, and exit polls
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <Input
            type="text"
            placeholder="Search counties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 text-base"
          />
        </div>

        {/* Counties Grid */}
        {loading ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-slate-500">Loading counties...</p>
            </CardContent>
          </Card>
        ) : filteredCounties.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-slate-500">No counties found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCounties.map((county) => (
              <Card
                key={county.name}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleSelectCounty(county.name)}
              >
                <CardHeader>
                  <CardTitle className="text-xl">{county.name}</CardTitle>
                  <CardDescription>FIPS: {county.fips}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Activity Score
                      </p>
                      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {county.activity_score}
                      </p>
                    </div>
                    <Button
                      variant="default"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelectCounty(county.name)
                      }}
                    >
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>Showing {filteredCounties.length} counties</p>
        </div>
      </div>
    </div>
  )
}

const mockCounties: County[] = [
  { name: 'Fulton', fips: '13121', activity_score: 145 },
  { name: 'DeKalb', fips: '13089', activity_score: 128 },
  { name: 'Cobb', fips: '13067', activity_score: 112 },
  { name: 'Gwinnett', fips: '13135', activity_score: 98 },
  { name: 'Clayton', fips: '13063', activity_score: 87 },
  { name: 'Henry', fips: '13151', activity_score: 76 },
]

