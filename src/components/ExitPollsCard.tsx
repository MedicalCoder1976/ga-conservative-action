import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ExitPoll } from '@/lib/types'

interface ExitPollsCardProps {
  county: string
  pollsData?: ExitPoll[] | null
}

export default function ExitPollsCard({ county, pollsData }: ExitPollsCardProps) {
  const polls = pollsData ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exit Polls & Survey Data</CardTitle>
        <CardDescription>Voter priorities and party breakdown from recent polls</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {polls.length === 0 ? (
            <p className="text-center text-slate-500 py-8">No exit poll data available for this county</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {polls.map((poll) => (
                <div key={poll.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  {/* Question */}
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                    {poll.question}
                  </h4>

                  {/* Response */}
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    Response: <span className="font-medium">{poll.response}</span>
                  </p>

                  {/* Overall Percentage */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                        Overall
                      </span>
                      <span className="text-lg font-bold text-slate-900 dark:text-white">
                        {poll.percent.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-red-600 h-2 rounded-full"
                        style={{ width: `${poll.percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Party Split */}
                  <div className="bg-slate-50 dark:bg-slate-900 rounded p-2">
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      <span className="font-semibold">Party Split:</span> {poll.party_split}
                    </p>
                  </div>

                  {/* Source */}
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-3">
                    Source: {poll.source}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
