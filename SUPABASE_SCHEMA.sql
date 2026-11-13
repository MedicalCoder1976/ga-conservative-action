-- GA Voter Action Database Schema
-- Run this in Supabase SQL Editor

-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  county TEXT,
  role TEXT DEFAULT 'Visitor' CHECK (role IN ('Visitor', 'Volunteer', 'Leader', 'Coordinator')),
  show_real_name BOOLEAN DEFAULT FALSE,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view public profiles" ON profiles
  FOR SELECT USING (show_real_name = true);

-- Counties table
CREATE TABLE counties (
  name TEXT PRIMARY KEY,
  fips TEXT UNIQUE,
  activity_score INTEGER DEFAULT 0,
  color_intensity INTEGER DEFAULT 0,
  last_demographics_refresh DATE
);

ALTER TABLE counties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read counties" ON counties FOR SELECT;

-- Activities table
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  county TEXT REFERENCES counties(name),
  activity_type TEXT NOT NULL,
  points INTEGER NOT NULL,
  photo_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view activities in their county" ON activities
  FOR SELECT USING (
    auth.uid()::text IN (
      SELECT id::text FROM profiles WHERE county = activities.county
    )
  );

CREATE POLICY "Users can insert their own activities" ON activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Suggested Activities table
CREATE TABLE suggested_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  points INTEGER NOT NULL,
  cadence TEXT CHECK (cadence IN ('daily', 'weekly', 'monthly')),
  category TEXT
);

ALTER TABLE suggested_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read suggested activities" ON suggested_activities FOR SELECT;

-- Election Results table
CREATE TABLE election_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  county TEXT,
  race TEXT,
  republican_votes INTEGER,
  democrat_votes INTEGER,
  republican_pct NUMERIC,
  democrat_pct NUMERIC,
  year INTEGER
);

ALTER TABLE election_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read election results" ON election_results FOR SELECT;

-- Exit Polls table
CREATE TABLE exit_polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT,
  question TEXT NOT NULL,
  response TEXT NOT NULL,
  percent NUMERIC,
  party_split TEXT,
  county TEXT DEFAULT 'Statewide'
);

ALTER TABLE exit_polls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read exit polls" ON exit_polls FOR SELECT;

-- Demographics table
CREATE TABLE demographics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  county TEXT,
  age_18_29 NUMERIC,
  age_30_44 NUMERIC,
  age_45_64 NUMERIC,
  age_65_plus NUMERIC,
  white NUMERIC,
  black NUMERIC,
  hispanic NUMERIC,
  asian_other NUMERIC,
  notes TEXT,
  refreshed_at DATE
);

ALTER TABLE demographics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read demographics" ON demographics FOR SELECT;

-- Badges table
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  badge_name TEXT NOT NULL,
  awarded_by TEXT,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view badges for their county" ON badges
  FOR SELECT USING (
    auth.uid()::text IN (
      SELECT id::text FROM profiles WHERE county = (
        SELECT county FROM profiles WHERE id = badges.user_id
      )
    )
  );

-- Public Directory table
CREATE TABLE public_directory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  username TEXT,
  county TEXT,
  points INTEGER,
  show_real_name BOOLEAN
);

ALTER TABLE public_directory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read public directory" ON public_directory FOR SELECT;

-- Talking Points table
CREATE TABLE talking_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source TEXT,
  date DATE DEFAULT CURRENT_DATE
);

ALTER TABLE talking_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read talking points" ON talking_points FOR SELECT;

-- Education Topics table
CREATE TABLE education_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT
);

ALTER TABLE education_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read education topics" ON education_topics FOR SELECT;

-- Create indexes for performance
CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_activities_county ON activities(county);
CREATE INDEX idx_profiles_county ON profiles(county);
CREATE INDEX idx_badges_user_id ON badges(user_id);
CREATE INDEX idx_election_results_county ON election_results(county);
CREATE INDEX idx_demographics_county ON demographics(county);
