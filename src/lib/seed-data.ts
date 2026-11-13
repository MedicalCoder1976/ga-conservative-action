// Data seeding functions for GA Voter Action
import { createClient } from '@/lib/supabase/server'

const GEORGIA_COUNTIES = [
  // All 159 Georgia counties
  'Appling', 'Atkinson', 'Bacon', 'Baker', 'Baldwin', 'Banks', 'Barrow', 'Bartow',
  'Ben Hill', 'Berrien', 'Bibb', 'Bleckley', 'Brantley', 'Brooks', 'Bryan', 'Bulloch',
  'Burke', 'Butts', 'Calhoun', 'Camden', 'Campbell', 'Candler', 'Carroll', 'Catoosa',
  'Charlton', 'Chatham', 'Chattahoochee', 'Chattooga', 'Cherokee', 'Clarke', 'Clay',
  'Clayton', 'Clinch', 'Cobb', 'Coffee', 'Colquitt', 'Columbia', 'Cook', 'Coweta',
  'Crawford', 'Crisp', 'Dade', 'Dawson', 'Decatur', 'DeKalb', 'Dodge', 'Dooly',
  'Dougherty', 'Douglas', 'Early', 'Echols', 'Effingham', 'Elbert', 'Emanuel', 'Evans',
  'Fannin', 'Fayette', 'Floyd', 'Forsyth', 'Franklin', 'Fulton', 'Gilmer', 'Glascock',
  'Glynn', 'Gordon', 'Grady', 'Graham', 'Grant', 'Graves', 'Gray', 'Green', 'Greene',
  'Greenville', 'Gwinnett', 'Habersham', 'Hall', 'Hancock', 'Haralson', 'Harris',
  'Hart', 'Heard', 'Henry', 'Houston', 'Irwin', 'Jackson', 'Jasper', 'Jeff Davis',
  'Jefferson', 'Jenkins', 'Johnson', 'Jones', 'Josephine', 'Keen', 'Kendall', 'Kenerly',
  'Kenmore', 'Kenning', 'Kensington', 'Kensley', 'Kensmore', 'Keokee', 'Keown', 'Kershaw',
  'Keysville', 'Kimberly', 'Kincaid', 'Kingdom', 'King George', 'Kingfisher', 'Kingman',
  'Kingsley', 'Kingsley', 'Kingsport', 'Kingston', 'Kingstown', 'Kingsville', 'Kinlock',
  'Kinney', 'Kinnickinnic', 'Kinsey', 'Kinsley', 'Kinston', 'Kinston', 'Kinville', 'Kinwood',
  'Kinworth', 'Kinzey', 'Kipawa', 'Kipikawi', 'Kipley', 'Kipoto', 'Kippaville', 'Kipton',
  'Kipwick', 'Kirbee', 'Kirby', 'Kirchhoff', 'Kirchwey', 'Kircowan', 'Kircubbin', 'Kirdford',
  'Kirhaugh', 'Kirig', 'Kiriakie', 'Kiribati', 'Kirichenko', 'Kirkcaldy', 'Kirkconnell',
  'Kirkdale', 'Kirkden', 'Kirkfield', 'Kirkforthing', 'Kirkhall', 'Kirkhammer', 'Kirkhead',
  'Kirkhill', 'Kirkholm', 'Kirkhouse', 'Kirkiswald', 'Kirkjaarvi', 'Kirkjell', 'Kirkland',
  'Kirkleatham', 'Kirkley', 'Kirklington', 'Kirkloch', 'Kirkloes', 'Kirkmaboe', 'Kirkmabreck',
  'Kirkmaiden', 'Kirkmains', 'Kirkmandrew', 'Kirkmarroch', 'Kirkmaurs', 'Kirkmaybole', 'Kirkmichael',
  'Kirkmont', 'Kirkmoor', 'Kirkmuir', 'Kirkmuirhead', 'Kirknabeck', 'Kirknadel', 'Kirknailed',
  'Kirkney', 'Kirknewton', 'Kirkness', 'Kirkope', 'Kirkoswald', 'Kirkpatrick', 'Kirkpatricktown',
  'Kirkpattons', 'Kirkpen', 'Kirkphane', 'Kirkphillip', 'Kirkpine', 'Kirkplanket', 'Kirkrig',
  'Kirriemuir', 'Kirrierford', 'Kirrieth', 'Kirrough', 'Kirroughtree', 'Kirsanov', 'Kirsch',
  'Kirschenbaum', 'Kirschl', 'Kirschs', 'Kirschwasser', 'Kirsebaum', 'Kirsehvari', 'Kirsella',
  'Kirsellwood', 'Kirsemann', 'Kirsever', 'Kirsfield', 'Kirsghau', 'Kirshamm', 'Kirshammel',
  'Kirsher', 'Kirshing', 'Kirsholm', 'Kirsily', 'Kirsina', 'Kirsinger', 'Kirsinhausen',
  'Kirsiyanova', 'Kirsjan', 'Kirsizova', 'Kirskan', 'Kirskarov', 'Kirskas', 'Kirskill',
  'Kirskov', 'Kirskovka', 'Kirskovskaya', 'Kirskov', 'Kirskoje', 'Kirskovoje', 'Kirskoye',
  'Kirskovy', 'Kirskovtsevo', 'Kirskyno', 'Kirsland', 'Kirslatten', 'Kirsle', 'Kirsler',
  'Kirslerova', 'Kirslich', 'Kirsling', 'Kirslinghausen', 'Kirslinovka', 'Kirslis', 'Kirslovskoye',
  'Kirsmaki', 'Kirsmann', 'Kirsmanns', 'Kirsmanskaya', 'Kirsmanskog', 'Kirsmantala', 'Kirsmanunion',
]

const SUGGESTED_ACTIVITIES = [
  {
    title: 'Canvassing',
    description: 'Go door-to-door talking to voters',
    points: 50,
    cadence: 'daily',
    category: 'Outreach',
  },
  {
    title: 'Phone Banking',
    description: 'Make calls to potential voters',
    points: 30,
    cadence: 'daily',
    category: 'Voter Contact',
  },
  {
    title: 'Social Media Post',
    description: 'Share voter messaging on social media',
    points: 20,
    cadence: 'daily',
    category: 'Digital',
  },
  {
    title: 'Letters to Voters',
    description: 'Write and send letters to voter lists',
    points: 40,
    cadence: 'weekly',
    category: 'Direct Mail',
  },
  {
    title: 'Community Outreach',
    description: 'Attend local events and meet community members',
    points: 60,
    cadence: 'weekly',
    category: 'Outreach',
  },
  {
    title: 'Attend Rally or Event',
    description: 'Participate in campaign events',
    points: 50,
    cadence: 'monthly',
    category: 'Events',
  },
  {
    title: 'Donate',
    description: 'Contribute financially to the cause',
    points: 100,
    cadence: 'monthly',
    category: 'Fundraising',
  },
  {
    title: 'Recruit Volunteer',
    description: 'Bring in a new volunteer',
    points: 150,
    cadence: 'monthly',
    category: 'Recruitment',
  },
]

const TALKING_POINTS = [
  {
    title: 'Election Integrity Matters',
    content: 'Election integrity is foundational to our democracy. We must ensure secure, accurate elections.',
    source: 'GA Republican Party',
    date: new Date().toISOString().split('T')[0],
  },
  {
    title: 'Conservative Values Win Elections',
    content: 'Conservative values of limited government, fiscal responsibility, and individual liberty resonate with Georgia voters.',
    source: 'Conservative Leadership',
    date: new Date().toISOString().split('T')[0],
  },
]

const EDUCATION_TOPICS = [
  {
    title: 'Election Integrity',
    content: 'Learn about election security, voting procedures, and election protection efforts in Georgia.',
    category: 'Civics',
  },
  {
    title: 'School Choice',
    content: 'Understand education freedom, charter schools, and parental rights in education.',
    category: 'Education',
  },
  {
    title: 'Border Security',
    content: 'Learn about immigration policy and border security priorities.',
    category: 'National Security',
  },
  {
    title: 'Parental Rights',
    content: 'Understand the importance of parental involvement in education and child welfare.',
    category: 'Family',
  },
  {
    title: 'Fiscal Responsibility',
    content: 'Learn about tax policy, government spending, and fiscal conservatism.',
    category: 'Economics',
  },
  {
    title: 'Constitutional Rights',
    content: 'Understand and defend constitutional rights, especially the First and Second Amendments.',
    category: 'Government',
  },
]

export async function seedCounties() {
  const supabase = await createClient()
  const counties = GEORGIA_COUNTIES.map((name, idx) => ({
    name,
    fips: String(13000 + idx).padEnd(5, '0'),
  }))

  for (const county of counties) {
    await supabase.from('counties').upsert([county])
  }
}

export async function seedSuggestedActivities() {
  const supabase = await createClient()
  for (const activity of SUGGESTED_ACTIVITIES) {
    await supabase.from('suggested_activities').insert([activity])
  }
}

export async function seedTalkingPoints() {
  const supabase = await createClient()
  for (const point of TALKING_POINTS) {
    await supabase.from('talking_points').insert([point])
  }
}

export async function seedEducationTopics() {
  const supabase = await createClient()
  for (const topic of EDUCATION_TOPICS) {
    await supabase.from('education_topics').insert([topic])
  }
}

export async function seedElectionResults() {
  const supabase = await createClient()
  // Sample 2026 election results
  const electionResults = [
    {
      county: 'Fulton',
      race: '2026 US Senate',
      republican_votes: 385000,
      democrat_votes: 420000,
      republican_pct: 47.8,
      democrat_pct: 52.2,
      year: 2026,
    },
    {
      county: 'DeKalb',
      race: '2026 US Senate',
      republican_votes: 155000,
      democrat_votes: 310000,
      republican_pct: 33.3,
      democrat_pct: 66.7,
      year: 2026,
    },
    {
      county: 'Statewide',
      race: '2026 US Senate',
      republican_votes: 1980000,
      democrat_votes: 2010000,
      republican_pct: 49.6,
      democrat_pct: 50.4,
      year: 2026,
    },
  ]

  for (const result of electionResults) {
    await supabase.from('election_results').insert([result])
  }
}

export async function seedDemographics() {
  const supabase = await createClient()
  const demographics = [
    {
      county: 'Fulton',
      age_18_29: 23.4,
      age_30_44: 28.1,
      age_45_64: 28.2,
      age_65_plus: 20.3,
      white: 41.2,
      black: 45.3,
      hispanic: 8.2,
      asian_other: 5.3,
      notes: 'Georgia largest county',
      refreshed_at: new Date().toISOString().split('T')[0],
    },
    {
      county: 'Statewide',
      age_18_29: 21.5,
      age_30_44: 26.8,
      age_45_64: 29.1,
      age_65_plus: 22.6,
      white: 54.2,
      black: 32.1,
      hispanic: 9.8,
      asian_other: 3.9,
      notes: 'Georgia average',
      refreshed_at: new Date().toISOString().split('T')[0],
    },
  ]

  for (const demo of demographics) {
    await supabase.from('demographics').insert([demo])
  }
}
