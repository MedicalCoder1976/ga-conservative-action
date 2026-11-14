import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const EDUCATION_TOPICS = [
  {
    title: 'Election Integrity',
    category: 'Elections',
    content: 'Learn about election security and voting processes to protect democracy.',
  },
  {
    title: 'School Choice',
    category: 'Education',
    content: 'Understanding educational options and opportunities for Georgia families.',
  },
  {
    title: 'Parental Rights',
    category: 'Education',
    content: 'Know your rights as a parent in education decisions and school policies.',
  },
  {
    title: 'Fiscal Responsibility',
    category: 'Economy',
    content: 'Managing budgets and government spending wisely for taxpayers.',
  },
  {
    title: 'Border Security',
    category: 'Security',
    content: 'Understanding border protection policies and national security.',
  },
  {
    title: 'Free Market Principles',
    category: 'Economy',
    content: 'How free markets drive economic growth and opportunity.',
  },
  {
    title: 'Second Amendment Rights',
    category: 'Liberty',
    content: 'Constitutional rights and protections under the Second Amendment.',
  },
  {
    title: 'Limited Government',
    category: 'Government',
    content: 'Principles of smaller, more efficient government that serves the people.',
  },
]

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Missing Supabase configuration' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check if topics already exist
    const { data: existingTopics } = await supabase
      .from('education_topics')
      .select('id')
      .limit(1)

    if (existingTopics && existingTopics.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Education topics already seeded',
        count: existingTopics.length,
      })
    }

    // Seed topics
    const { data, error } = await supabase
      .from('education_topics')
      .insert(EDUCATION_TOPICS)
      .select()

    if (error) {
      console.error('Error seeding education topics:', error)
      return NextResponse.json(
        { error: `Failed to seed topics: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Education topics seeded successfully',
      count: data?.length || EDUCATION_TOPICS.length,
    })
  } catch (error) {
    console.error('Unexpected error in seed-education:', error)
    return NextResponse.json(
      {
        error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 }
    )
  }
}


