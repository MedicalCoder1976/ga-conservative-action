export type Profile = {
  id: string
  username: string
  full_name: string | null
  county: string | null
  role: 'Visitor' | 'Volunteer' | 'Leader' | 'Coordinator'
  show_real_name: boolean
  points: number
  created_at: string
}

export type County = {
  name: string
  fips: string
  activity_score: number
  color_intensity: number
  last_demographics_refresh: string | null
}

export type Activity = {
  id: string
  user_id: string
  county: string
  activity_type: string
  points: number
  photo_url: string | null
  notes: string | null
  created_at: string
}

export type SuggestedActivity = {
  id: string
  title: string
  description: string
  points: number
  cadence: 'daily' | 'weekly' | 'monthly'
  category: string
}

export type ElectionResult = {
  county: string
  race: string
  republican_votes: number
  democrat_votes: number
  republican_pct: number
  democrat_pct: number
  year: number
}

export type ExitPoll = {
  id: string
  source: string
  question: string
  response: string
  percent: number
  party_split: string
  county: string
}

export type Demographics = {
  county: string
  age_18_29: number
  age_30_44: number
  age_45_64: number
  age_65_plus: number
  white: number
  black: number
  hispanic: number
  asian_other: number
  notes: string | null
  refreshed_at: string
}

export type Badge = {
  id: string
  user_id: string
  badge_name: string
  awarded_by: string
  note: string | null
  created_at: string
}

export type PublicDirectory = {
  user_id: string
  username: string
  county: string
  points: number
  show_real_name: boolean
}

export type TalkingPoint = {
  id: string
  title: string
  content: string
  source: string
  date: string
}

export type EducationTopic = {
  id: string
  title: string
  content: string
  category: string
}
