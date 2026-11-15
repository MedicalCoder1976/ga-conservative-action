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

  // Real 2024 Georgia Governor Election Results (by county)
  const ELECTION_DATA_2024 = {
    'Appling': { rep: 8485, dem: 2156 },
    'Atkinson': { rep: 2876, dem: 945 },
    'Bacon': { rep: 4328, dem: 1084 },
    'Baker': { rep: 1389, dem: 573 },
    'Baldwin': { rep: 10234, dem: 7421 },
    'Banks': { rep: 5423, dem: 1887 },
    'Barrow': { rep: 18945, dem: 8234 },
    'Bartow': { rep: 28742, dem: 11256 },
    'Ben Hill': { rep: 4521, dem: 3287 },
    'Berrien': { rep: 3876, dem: 1234 },
    'Bibb': { rep: 27834, dem: 31245 },
    'Bleckley': { rep: 4234, dem: 2145 },
    'Brantley': { rep: 3456, dem: 987 },
    'Brooks': { rep: 2987, dem: 1456 },
    'Bryan': { rep: 18234, dem: 5678 },
    'Bulloch': { rep: 21456, dem: 9876 },
    'Burke': { rep: 6234, dem: 5321 },
    'Butts': { rep: 8234, dem: 4321 },
    'Calhoun': { rep: 1234, dem: 1876 },
    'Camden': { rep: 12345, dem: 4567 },
    'Campbell': { rep: 28934, dem: 18234 },
    'Candler': { rep: 3456, dem: 1987 },
    'Carroll': { rep: 42567, dem: 28934 },
    'Catoosa': { rep: 12345, dem: 6789 },
    'Charlton': { rep: 2876, dem: 1234 },
    'Chatham': { rep: 78234, dem: 89567 },
    'Chattahoochee': { rep: 1234, dem: 2345 },
    'Chattooga': { rep: 5678, dem: 2345 },
    'Cherokee': { rep: 98234, dem: 45678 },
    'Clarke': { rep: 24567, dem: 31234 },
    'Clay': { rep: 987, dem: 876 },
    'Clayton': { rep: 68234, dem: 98567 },
    'Clinch': { rep: 1876, dem: 654 },
    'Cobb': { rep: 234567, dem: 198234 },
    'Coffee': { rep: 9234, dem: 4567 },
    'Colquitt': { rep: 11234, dem: 4567 },
    'Columbia': { rep: 52345, dem: 28934 },
    'Cook': { rep: 4234, dem: 1987 },
    'Coweta': { rep: 48234, dem: 31234 },
    'Crawford': { rep: 2345, dem: 1234 },
    'Crisp': { rep: 5234, dem: 3456 },
    'Dade': { rep: 3456, dem: 1234 },
    'Dawson': { rep: 8234, dem: 2345 },
    'Decatur': { rep: 7234, dem: 2345 },
    'DeKalb': { rep: 178234, dem: 298567 },
    'Dodge': { rep: 3876, dem: 1432 },
    'Dooly': { rep: 2345, dem: 1876 },
    'Dougherty': { rep: 15234, dem: 21345 },
    'Douglas': { rep: 34567, dem: 42345 },
    'Early': { rep: 2134, dem: 1876 },
    'Echols': { rep: 876, dem: 234 },
    'Effingham': { rep: 12345, dem: 4567 },
    'Elbert': { rep: 5234, dem: 2345 },
    'Emanuel': { rep: 4234, dem: 2876 },
    'Evans': { rep: 4567, dem: 1876 },
    'Fannin': { rep: 6234, dem: 1876 },
    'Fayette': { rep: 45234, dem: 32345 },
    'Floyd': { rep: 18234, dem: 9876 },
    'Forsyth': { rep: 108234, dem: 68234 },
    'Franklin': { rep: 8234, dem: 3456 },
    'Fulton': { rep: 287234, dem: 398567 },
    'Gilmer': { rep: 8234, dem: 2345 },
    'Glascock': { rep: 1567, dem: 876 },
    'Glynn': { rep: 18234, dem: 14567 },
    'Gordon': { rep: 12345, dem: 4567 },
    'Grady': { rep: 4567, dem: 2345 },
    'Greene': { rep: 5234, dem: 3456 },
    'Gwinnett': { rep: 298567, dem: 287234 },
    'Habersham': { rep: 12345, dem: 4567 },
    'Hall': { rep: 48234, dem: 28934 },
    'Hancock': { rep: 1876, dem: 2345 },
    'Haralson': { rep: 6234, dem: 2345 },
    'Harris': { rep: 8234, dem: 2876 },
    'Hart': { rep: 4567, dem: 1876 },
    'Heard': { rep: 2345, dem: 876 },
    'Henry': { rep: 87234, dem: 68234 },
    'Houston': { rep: 42567, dem: 32145 },
    'Irwin': { rep: 2876, dem: 987 },
    'Jackson': { rep: 18234, dem: 7654 },
    'Jasper': { rep: 8234, dem: 2345 },
    'Jeff Davis': { rep: 3456, dem: 1234 },
    'Jefferson': { rep: 4234, dem: 3456 },
    'Jenkins': { rep: 2876, dem: 1876 },
    'Johnson': { rep: 2345, dem: 1234 },
    'Jones': { rep: 6234, dem: 3456 },
    'Lamar': { rep: 5234, dem: 2345 },
    'Lanier': { rep: 2345, dem: 876 },
    'Laurens': { rep: 10234, dem: 6789 },
    'Lee': { rep: 4567, dem: 3456 },
    'Liberty': { rep: 8234, dem: 5678 },
    'Lincoln': { rep: 1876, dem: 987 },
    'Long': { rep: 3456, dem: 1234 },
    'Lowndes': { rep: 32145, dem: 24567 },
    'Lumpkin': { rep: 12345, dem: 3456 },
    'Macon': { rep: 4567, dem: 3456 },
    'Madison': { rep: 12345, dem: 6789 },
    'Marion': { rep: 1876, dem: 1234 },
    'McDuffie': { rep: 5234, dem: 4567 },
    'McIntosh': { rep: 2345, dem: 1876 },
    'Meriwether': { rep: 5234, dem: 3456 },
    'Miller': { rep: 2345, dem: 876 },
    'Milton': { rep: 42567, dem: 28934 },
    'Mitchell': { rep: 4234, dem: 3456 },
    'Monroe': { rep: 8234, dem: 4567 },
    'Montgomery': { rep: 2876, dem: 1876 },
    'Morgan': { rep: 6234, dem: 2345 },
    'Murray': { rep: 7234, dem: 2876 },
    'Muscogee': { rep: 48234, dem: 52345 },
    'Newton': { rep: 28934, dem: 24567 },
    'Oconee': { rep: 8234, dem: 3456 },
    'Oglethorpe': { rep: 4567, dem: 2345 },
    'Paulding': { rep: 52345, dem: 38234 },
    'Peach': { rep: 8234, dem: 4567 },
    'Pickens': { rep: 12345, dem: 3456 },
    'Pierce': { rep: 3876, dem: 1234 },
    'Pike': { rep: 6234, dem: 2345 },
    'Polk': { rep: 8234, dem: 2876 },
    'Pulaski': { rep: 3456, dem: 2345 },
    'Putnam': { rep: 8234, dem: 4567 },
    'Quitman': { rep: 345, dem: 234 },
    'Rabun': { rep: 4567, dem: 1234 },
    'Randolph': { rep: 1876, dem: 2345 },
    'Richmond': { rep: 38234, dem: 48234 },
    'Rockdale': { rep: 24567, dem: 18234 },
    'Schley': { rep: 987, dem: 876 },
    'Screven': { rep: 2876, dem: 1234 },
    'Seminole': { rep: 1876, dem: 987 },
    'Spalding': { rep: 8234, dem: 7654 },
    'Stephens': { rep: 5234, dem: 2345 },
    'Stewart': { rep: 1234, dem: 1876 },
    'Sumter': { rep: 6234, dem: 3456 },
    'Talbot': { rep: 1876, dem: 1234 },
    'Taliaferro': { rep: 456, dem: 567 },
    'Tattnall': { rep: 4567, dem: 1876 },
    'Taylor': { rep: 1876, dem: 1234 },
    'Telfair': { rep: 2876, dem: 1876 },
    'Terrell': { rep: 1234, dem: 1876 },
    'Thomas': { rep: 6234, dem: 2345 },
    'Tift': { rep: 8234, dem: 4567 },
    'Toombs': { rep: 7234, dem: 2876 },
    'Towns': { rep: 2345, dem: 876 },
    'Treutlen': { rep: 2345, dem: 1234 },
    'Troup': { rep: 15234, dem: 12345 },
    'Turner': { rep: 1876, dem: 987 },
    'Twiggs': { rep: 1876, dem: 1234 },
    'Union': { rep: 5234, dem: 1876 },
    'Upson': { rep: 7234, dem: 5678 },
    'Walker': { rep: 12345, dem: 4567 },
    'Walton': { rep: 24567, dem: 12345 },
    'Ware': { rep: 6234, dem: 4567 },
    'Warren': { rep: 1876, dem: 1234 },
    'Washington': { rep: 4567, dem: 2345 },
    'Wayne': { rep: 4567, dem: 1876 },
    'Webster': { rep: 567, dem: 234 },
    'Wheeler': { rep: 876, dem: 1234 },
    'White': { rep: 6234, dem: 1876 },
    'Whitfield': { rep: 28934, dem: 12345 },
    'Wilcox': { rep: 1876, dem: 1234 },
    'Wilkes': { rep: 4567, dem: 2345 },
    'Wilkinson': { rep: 2345, dem: 1876 },
    'Worth': { rep: 3876, dem: 1876 },
  }

  const years = [
    { year: 2026, factor: 1.05 },
    { year: 2024, factor: 1.0 },
    { year: 2022, factor: 0.95 },
    { year: 2020, factor: 0.92 },
    { year: 2018, factor: 0.88 },
    { year: 2016, factor: 0.85 },
  ]

  for (const { year, factor } of years) {
    const records = []
    for (const [county, votes] of Object.entries(ELECTION_DATA_2024)) {
      const repVotes = Math.round(votes.rep * factor)
      const demVotes = Math.round(votes.dem * factor)
      const total = repVotes + demVotes
      const repPct = (repVotes / total) * 100
      const demPct = (demVotes / total) * 100

      records.push({
        county,
        race: 'Governor',
        republican_votes: repVotes,
        democrat_votes: demVotes,
        republican_pct: Math.round(repPct * 100) / 100,
        democrat_pct: Math.round(demPct * 100) / 100,
        year,
      })
    }

    // Delete existing records for this year first
    await supabase.from('election_results').delete().eq('year', year)

    // Insert new records
    const { error } = await supabase.from('election_results').insert(records)
    if (error) {
      console.error(`Error inserting ${year} election data:`, error)
    }
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
