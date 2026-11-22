import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ElectionResult } from '@/lib/types'

interface ElectionResultsCardProps {
  county: string
  electionData?: ElectionResult | null
}

export default function ElectionResultsCard({ county, electionData }: ElectionResultsCardProps) {
  if (!electionData) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Election Results</CardTitle>
          <CardDescription>Verified county data unavailable</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            No 2024 presidential results are loaded for {county}.
          </p>
        </CardContent>
      </Card>
    )
  }

  const data = electionData
  const totalVotes = data.republican_votes + data.democrat_votes
  const votesNeededToFlip = Math.ceil((totalVotes / 2 - data.democrat_votes) + 1)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Election Results</CardTitle>
        <CardDescription>{data.year} General Election</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Results Summary */}
        <div className="space-y-4">
          {/* Republican */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-red-600 dark:text-red-400">Republican</span>
              <span className="text-lg font-bold text-red-600 dark:text-red-400">{data.republican_pct.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full"
                style={{ width: `${data.republican_pct}%` }}
              />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {data.republican_votes.toLocaleString()} votes
            </p>
          </div>

          {/* Democrat */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-blue-600 dark:text-blue-400">Democrat</span>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{data.democrat_pct.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${data.democrat_pct}%` }}
              />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {data.democrat_votes.toLocaleString()} votes
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 dark:border-slate-700" />

        {/* Vote Summary */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            Total Votes Cast
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {totalVotes.toLocaleString()}
          </p>
        </div>

        {/* Votes Needed to Flip */}
        <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
            Votes Needed to Flip State
          </p>
          <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
            {votesNeededToFlip.toLocaleString()}
          </p>
          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
            {data.democrat_votes.toLocaleString()} current Democratic votes + {votesNeededToFlip.toLocaleString()} more needed
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
