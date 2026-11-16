-- ============================================
-- STEP 1: Create Party Leaders Table & Schema
-- ============================================
-- Run this first in Supabase SQL Editor to create the table

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

-- Enhance talking_points table with new columns
ALTER TABLE talking_points 
ADD COLUMN IF NOT EXISTS cadence text DEFAULT 'weekly' CHECK (cadence IN ('daily', 'weekly', 'monthly')),
ADD COLUMN IF NOT EXISTS county text,
ADD COLUMN IF NOT EXISTS active boolean DEFAULT true;

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_party_leaders_county ON party_leaders(county);
CREATE INDEX IF NOT EXISTS idx_party_leaders_level ON party_leaders(level);
CREATE INDEX IF NOT EXISTS idx_talking_points_county ON talking_points(county);
CREATE INDEX IF NOT EXISTS idx_talking_points_cadence ON talking_points(cadence);

-- Enable RLS
ALTER TABLE party_leaders ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Everyone can read party leaders
CREATE POLICY "Public can read party leaders" 
  ON party_leaders FOR SELECT 
  USING (true);

-- ============================================
-- STEP 2: Seed State Level Leadership
-- ============================================

INSERT INTO party_leaders (name, title, level, contact_email, contact_phone) VALUES
  ('Brian Kemp', 'Governor', 'state', 'governor@gov.ga.gov', '(404) 656-1776'),
  ('Burt Jones', 'Lieutenant Governor', 'state', 'ltgov@ltg.ga.gov', '(404) 656-5030'),
  ('Brad Raffensperger', 'Secretary of State', 'state', 'sos@sos.ga.gov', '(404) 656-2881'),
  ('David Shafer', 'State GOP Chairman', 'state', 'chair@gagop.org', '(404) 555-0100');

-- ============================================
-- STEP 3: Seed Regional Leadership (Sample)
-- ============================================

INSERT INTO party_leaders (name, title, level, district, contact_email) VALUES
  ('John Mitchell', 'Congressional District Director', 'regional', 'District 1', 'district1@gagop.org'),
  ('Sarah Chen', 'Congressional District Director', 'regional', 'District 3', 'district3@gagop.org'),
  ('Michael Torres', 'Congressional District Director', 'regional', 'District 6', 'district6@gagop.org'),
  ('Jennifer Williams', 'Congressional District Director', 'regional', 'District 13', 'district13@gagop.org');

-- ============================================
-- STEP 4: Seed County Level Leadership
-- ============================================

-- Fulton County
INSERT INTO party_leaders (name, title, level, county, contact_email, contact_phone) VALUES
  ('John Smith', 'Fulton County GOP Chairman', 'county', 'Fulton', 'chair@fultongop.org', '(404) 555-0101');

-- DeKalb County
INSERT INTO party_leaders (name, title, level, county, contact_email, contact_phone) VALUES
  ('Mary Johnson', 'DeKalb County GOP Chairwoman', 'county', 'DeKalb', 'chair@dekalbgop.org', '(404) 555-0102');

-- Cobb County
INSERT INTO party_leaders (name, title, level, county, contact_email, contact_phone) VALUES
  ('Robert Wilson', 'Cobb County GOP Chairman', 'county', 'Cobb', 'chair@cobbgop.org', '(770) 555-0103');

-- Gwinnett County
INSERT INTO party_leaders (name, title, level, county, contact_email, contact_phone) VALUES
  ('Jennifer Davis', 'Gwinnett County GOP Chairwoman', 'county', 'Gwinnett', 'chair@gwinnettgop.org', '(770) 555-0104');

-- Clayton County
INSERT INTO party_leaders (name, title, level, county, contact_email, contact_phone) VALUES
  ('Michael Brown', 'Clayton County GOP Chairman', 'county', 'Clayton', 'chair@claytonGOP.org', '(770) 555-0105');

-- Henry County
INSERT INTO party_leaders (name, title, level, county, contact_email, contact_phone) VALUES
  ('Patricia Lee', 'Henry County GOP Chairwoman', 'county', 'Henry', 'chair@henrygop.org', '(770) 555-0106');

-- Forsyth County
INSERT INTO party_leaders (name, title, level, county, contact_email, contact_phone) VALUES
  ('David Martinez', 'Forsyth County GOP Chairman', 'county', 'Forsyth', 'chair@forsythgop.org', '(770) 555-0107');

-- Cherokee County
INSERT INTO party_leaders (name, title, level, county, contact_email, contact_phone) VALUES
  ('Susan Anderson', 'Cherokee County GOP Chairwoman', 'county', 'Cherokee', 'chair@cherokeegop.org', '(770) 555-0108');

-- Hall County
INSERT INTO party_leaders (name, title, level, county, contact_email, contact_phone) VALUES
  ('James Taylor', 'Hall County GOP Chairman', 'county', 'Hall', 'chair@hallgop.org', '(770) 555-0109');

-- Bibb County
INSERT INTO party_leaders (name, title, level, county, contact_email, contact_phone) VALUES
  ('Catherine White', 'Bibb County GOP Chairwoman', 'county', 'Bibb', 'chair@bibbgop.org', '(478) 555-0110');

-- Chatham County (Savannah)
INSERT INTO party_leaders (name, title, level, county, contact_email, contact_phone) VALUES
  ('Richard Thomas', 'Chatham County GOP Chairman', 'county', 'Chatham', 'chair@chathamgop.org', '(912) 555-0111');

-- Richmond County (Augusta)
INSERT INTO party_leaders (name, title, level, county, contact_email, contact_phone) VALUES
  ('Elizabeth Moore', 'Richmond County GOP Chairwoman', 'county', 'Richmond', 'chair@richmondgop.org', '(706) 555-0112');

-- Muscogee County (Columbus)
INSERT INTO party_leaders (name, title, level, county, contact_email, contact_phone) VALUES
  ('Christopher Jackson', 'Muscogee County GOP Chairman', 'county', 'Muscogee', 'chair@muscogeegop.org', '(706) 555-0113');

-- ============================================
-- STEP 5: Seed Talking Points
-- ============================================

INSERT INTO talking_points (title, content, source, date, cadence, active) VALUES
  ('Georgia Economy Growing', 'Georgia''s unemployment rate is at a 5-year low. Small businesses are thriving. Vote conservative to keep it that way.', 'Georgia Chamber of Commerce', NOW(), 'daily', true),
  ('Secure Elections Matter', 'Georgia has made election security a priority with voter ID verification and ballot audits. Protecting election integrity protects democracy.', 'Secretary of State Office', NOW(), 'weekly', true),
  ('Support Law Enforcement', 'Our police officers risk their lives every day to keep us safe. We must support them with funding and respect.', 'Georgia Peace Officers Association', NOW(), 'daily', true),
  ('Education Excellence', 'Georgia schools rank in the top 10 nationally. Conservative education policies focus on student achievement and school choice.', 'Georgia School Board Association', NOW(), 'weekly', true),
  ('Constitutional Rights', 'Your Second Amendment rights matter. Georgia protects gun owner rights. Vote for leaders who defend the Constitution.', 'Georgia Gun Owners', NOW(), 'weekly', true);

-- ============================================
-- VERIFICATION QUERY
-- ============================================
-- Run this to verify data was loaded:

SELECT 'State Leaders' as category, COUNT(*) as count FROM party_leaders WHERE level = 'state'
UNION ALL
SELECT 'Regional Leaders' as category, COUNT(*) FROM party_leaders WHERE level = 'regional'
UNION ALL
SELECT 'County Leaders' as category, COUNT(*) FROM party_leaders WHERE level = 'county'
UNION ALL
SELECT 'Talking Points' as category, COUNT(*) FROM talking_points WHERE active = true;
