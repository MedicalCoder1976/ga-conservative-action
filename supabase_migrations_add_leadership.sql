-- Add new tables for enhanced features

-- Party Leaders table
CREATE TABLE IF NOT EXISTS party_leaders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  level text NOT NULL CHECK (level IN ('state', 'regional', 'county')),
  county text,
  contact_email text,
  contact_phone text,
  district text,
  created_at timestamp DEFAULT now(),
  FOREIGN KEY (county) REFERENCES counties(name)
);

-- Enhanced talking points with cadence
ALTER TABLE talking_points 
ADD COLUMN IF NOT EXISTS cadence text DEFAULT 'weekly' CHECK (cadence IN ('daily', 'weekly', 'monthly')),
ADD COLUMN IF NOT EXISTS county text,
ADD COLUMN IF NOT EXISTS active boolean DEFAULT true;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_party_leaders_county ON party_leaders(county);
CREATE INDEX IF NOT EXISTS idx_party_leaders_level ON party_leaders(level);
CREATE INDEX IF NOT EXISTS idx_talking_points_county ON talking_points(county);
CREATE INDEX IF NOT EXISTS idx_talking_points_cadence ON talking_points(cadence);

-- Enable RLS on party_leaders
ALTER TABLE party_leaders ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Everyone can read party leaders (public data)
CREATE POLICY "Public can read party leaders" 
  ON party_leaders FOR SELECT 
  USING (true);
