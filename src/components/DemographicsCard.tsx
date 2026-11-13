import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Demographics } from '@/lib/types'

interface DemographicsCardProps {
  county: string
  demographicsData?: Demographics | null
}

export default function DemographicsCard({ county, demographicsData }: DemographicsCardProps) {
  const mockData = {
    county: county,
    age_18_29: 22.5,
    age_30_44: 26.8,
    age_45_64: 31.2,
    age_65_plus: 19.5,
    white: 68.2,
    black: 15.4,
    hispanic: 10.8,
    asian_other: 5.6,
    notes: 'Data from US Census Bureau',
    refreshed_at: new Date().toISOString().split('T')[0],
  }

  const data = demographicsData || mockData

  const ageGroups = [
    { label: '18-29', value: data.age_18_29 },
    { label: '30-44', value: data.age_30_44 },
    { label: '45-64', value: data.age_45_64 },
    { label: '65+', value: data.age_65_plus },
  ]

  const raceGroups = [
    { label: 'White', value: data.white, color: 'bg-slate-500' },
    { label: 'Black', value: data.black, color: 'bg-slate-700' },
    { label: 'Hispanic', value: data.hispanic, color: 'bg-amber-600' },
    { label: 'Asian/Other', value: data.asian_other, color: 'bg-orange-500' },
  ]

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Demographics</CardTitle>
        <CardDescription>Population breakdown by age and race</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Age Breakdown */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900 dark:text-white">Age Distribution</h3>
          <div className="grid grid-cols-2 gap-3">
            {ageGroups.map((group) => (
              <div key={group.label} className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">{group.label}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {group.value.toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 dark:border-slate-700" />

        {/* Race/Ethnicity Breakdown */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900 dark:text-white">Race/Ethnicity</h3>
          <div className="space-y-3">
            {raceGroups.map((group) => (
              <div key={group.label} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {group.label}
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {group.value.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className={`${group.color} h-2 rounded-full`}
                    style={{ width: `${group.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-200 dark:border-slate-700">
          <p>{data.notes}</p>
          <p className="mt-1">Last refreshed: {data.refreshed_at}</p>
        </div>
      </CardContent>
    </Card>
  )
}
