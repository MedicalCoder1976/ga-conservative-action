import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const EDUCATION_TOPICS = [
  {
    title: 'Election Integrity',
    category: 'Government',
    content: 'Election integrity encompasses fair voting processes, ballot security, voter authentication, and preventing fraud. It\'s crucial for maintaining democratic principles and public trust in elections. Key topics include verification procedures, chain of custody for ballots, and transparent vote counting processes.',
  },
  {
    title: 'School Choice',
    category: 'Education',
    content: 'School choice policies enable families to select educational environments that best fit their children\'s needs. Options include traditional public schools, charter schools, homeschooling, and education savings accounts. These approaches aim to improve educational outcomes and increase accountability.',
  },
  {
    title: 'Border Security',
    category: 'Immigration',
    content: 'Border security involves protecting national boundaries while facilitating lawful movement of people and commerce. Key elements include technology, personnel, physical barriers, and intelligence operations. Effective border security balances security concerns with immigration policy.',
  },
  {
    title: 'Parental Rights',
    category: 'Family Policy',
    content: 'Parental rights protect the fundamental authority of parents to direct their children\'s upbringing, education, and medical care. These include school choice, healthcare decisions, curriculum input, and discipline authority. Strong parental rights frameworks support family autonomy.',
  },
  {
    title: 'Fiscal Responsibility',
    category: 'Economics',
    content: 'Fiscal responsibility involves managing government spending and revenue wisely, reducing debt, and ensuring long-term economic sustainability. Key principles include balanced budgets, controlled spending, efficient tax collection, and transparency in financial operations.',
  },
  {
    title: 'Second Amendment Rights',
    category: 'Constitutional Rights',
    content: 'The Second Amendment protects the right to bear arms. Constitutional interpretations focus on individual rights while discussing regulation, public safety, and responsible gun ownership. Historical context and legal frameworks inform this ongoing national conversation.',
  },
  {
    title: 'Free Speech & Expression',
    category: 'Constitutional Rights',
    content: 'Free speech rights protect expression, the press, and peaceful assembly. These fundamental freedoms enable informed citizenry and political participation. Discussions include balancing free expression with other concerns while maintaining robust public discourse.',
  },
  {
    title: 'Economic Growth',
    category: 'Economics',
    content: 'Economic growth drives prosperity, job creation, and improved living standards. Strategies include business-friendly policies, workforce development, infrastructure investment, and tax structures that encourage entrepreneurship and investment.',
  },
  {
    title: 'Healthcare Access',
    category: 'Healthcare',
    content: 'Healthcare access involves ensuring quality, affordable medical care for all citizens. Policy approaches focus on market innovation, reducing regulatory barriers, expanding treatment options, and improving healthcare provider capacity and efficiency.',
  },
  {
    title: 'Community Development',
    category: 'Local Issues',
    content: 'Community development strengthens neighborhoods through infrastructure, small business growth, public safety, and quality-of-life improvements. Local engagement and private-public partnerships drive sustainable growth from the ground up.',
  },
  {
    title: 'Environmental Stewardship',
    category: 'Environment',
    content: 'Environmental stewardship balances conservation with economic development. Approaches include market-based solutions, private land stewardship incentives, innovative technology, and property rights-based conservation strategies.',
  },
  {
    title: 'Government Accountability',
    category: 'Government',
    content: 'Government accountability ensures officials and agencies act transparently and responsibly. Mechanisms include public records access, performance audits, oversight committees, and regular elections that hold representatives answerable to constituents.',
  },
]

export async function GET() {
  try {
    const supabase = await createClient()

    // Check if topics already exist
    const { count } = await supabase
      .from('education_topics')
      .select('*', { count: 'exact', head: true })

    if (count && count > 0) {
      return NextResponse.json(
        { message: 'Education topics already seeded', count },
        { status: 200 }
      )
    }

    // Seed topics
    const { error } = await supabase
      .from('education_topics')
      .insert(EDUCATION_TOPICS.map(topic => ({
        title: topic.title,
        category: topic.category,
        content: topic.content,
      })))

    if (error) {
      throw error
    }

    return NextResponse.json(
      { message: 'Education topics seeded successfully', count: EDUCATION_TOPICS.length },
      { status: 200 }
    )
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to seed topics' },
      { status: 500 }
    )
  }
}
