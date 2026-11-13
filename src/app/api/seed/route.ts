import { NextRequest, NextResponse } from 'next/server'
import {
  seedCounties,
  seedSuggestedActivities,
  seedTalkingPoints,
  seedEducationTopics,
  seedElectionResults,
  seedDemographics,
} from '@/lib/seed-data'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.SEED_SECRET_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type } = await request.json()

    if (type === 'all') {
      await seedCounties()
      await seedSuggestedActivities()
      await seedTalkingPoints()
      await seedEducationTopics()
      await seedElectionResults()
      await seedDemographics()
      return NextResponse.json({ success: true, message: 'All data seeded' })
    }

    if (type === 'counties') {
      await seedCounties()
      return NextResponse.json({ success: true, message: 'Counties seeded' })
    }

    if (type === 'activities') {
      await seedSuggestedActivities()
      return NextResponse.json({ success: true, message: 'Activities seeded' })
    }

    if (type === 'talking-points') {
      await seedTalkingPoints()
      return NextResponse.json({ success: true, message: 'Talking points seeded' })
    }

    if (type === 'education') {
      await seedEducationTopics()
      return NextResponse.json({ success: true, message: 'Education topics seeded' })
    }

    if (type === 'elections') {
      await seedElectionResults()
      return NextResponse.json({ success: true, message: 'Election results seeded' })
    }

    if (type === 'demographics') {
      await seedDemographics()
      return NextResponse.json({ success: true, message: 'Demographics seeded' })
    }

    return NextResponse.json({ error: 'Invalid seed type' }, { status: 400 })
  } catch (error: any) {
    console.error('Seeding error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
