-- Opposition Messaging Schema Addition
-- Add this to your Supabase database
-- Run in SQL Editor

-- ============================================
-- Opposition Messages Table
-- ============================================

CREATE TABLE opposition_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('national', 'state')),
  message TEXT NOT NULL,
  source TEXT,
  date_published DATE,
  context TEXT,
  counter_talking_point TEXT NOT NULL,
  importance INTEGER DEFAULT 5 CHECK (importance BETWEEN 1 AND 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE opposition_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read opposition messages
CREATE POLICY "Anyone can read opposition messages" ON opposition_messages
  FOR SELECT USING (true);

-- Index for faster queries
CREATE INDEX idx_opposition_level ON opposition_messages(level);
CREATE INDEX idx_opposition_topic ON opposition_messages(topic);
CREATE INDEX idx_opposition_importance ON opposition_messages(importance DESC);

-- ============================================
-- Sample Opposition Messages - National Level
-- ============================================

INSERT INTO opposition_messages (topic, level, message, source, date_published, context, counter_talking_point, importance)
VALUES
  (
    'Social Security',
    'national',
    'Republicans want to cut Social Security',
    'Democratic National Committee',
    '2026-11-01',
    'This is a recurring Democratic talking point used to scare seniors into voting Democrat.',
    'Republicans have protected Social Security every single time. We''ve never cut it. Democrats use this scare tactic every election cycle to frighten seniors, but our voting record proves we stand with them.',
    9
  ),
  (
    'Abortion/Reproductive Rights',
    'national',
    'GOP is banning abortion nationwide',
    'MSNBC, Democratic PACs',
    '2026-11-02',
    'Democrats are running ads claiming Republicans want a national abortion ban. Used heavily in battleground states.',
    'Abortion policy is determined at the state level, not federal. Georgia has compassionate policies that protect both mother and child. We respect the democratic process in each state.',
    8
  ),
  (
    'Education Funding',
    'national',
    'Republicans are cutting funding for schools',
    'Democratic National Committee, State Democratic Parties',
    '2026-10-30',
    'Democrats claim GOP candidates want to reduce education budgets.',
    'We increased education spending in Georgia every year. Our focus is on school choice and parent empowerment, not just funding amounts. More money doesn''t always mean better outcomes.',
    8
  ),
  (
    'Voting Rights',
    'national',
    'GOP is taking away voting rights',
    'CNN, MSNBC, Democratic National Committee',
    '2026-10-28',
    'Constant drumbeat of "voting restrictions" targeting minority voters.',
    'Voter ID ensures election security and integrity. Georgia has seen record turnout since our voter ID law passed. Every democracy requires voter verification - this is common sense.',
    8
  ),
  (
    'Economy/Tax Policy',
    'national',
    'Republicans only care about the rich',
    'Democratic PACs, MSNBC',
    '2026-10-25',
    'Standard attack that tax cuts disproportionately help wealthy Americans.',
    'We cut taxes for ALL Georgians - working families, small business owners, and everyone in between. When you cut taxes, everyone benefits. Small business owners saw immediate relief.',
    7
  ),
  (
    'Immigration',
    'national',
    'GOP is anti-immigration and xenophobic',
    'Democratic National Committee, Hispanic advocacy groups',
    '2026-10-20',
    'Attempts to paint Republicans as anti-immigrant rather than pro-border security.',
    'We support legal immigration AND secure borders. These aren''t contradictory - every country has borders and immigration laws. We''re pro-legal immigration, anti-illegal immigration.',
    7
  ),
  (
    'Education/Book Bans',
    'national',
    'Republicans are banning books from schools',
    'Democratic advocacy groups, Teacher unions',
    '2026-10-15',
    'Framing parent involvement in school curriculum as "censorship" and "book banning."',
    'Parents should absolutely have a say in what''s age-appropriate for their children. This is parent empowerment, not censorship. We trust parents, not distant bureaucrats.',
    6
  ),
  (
    'Environment/Climate',
    'national',
    'GOP sides with big oil over the environment',
    'Environmental groups, Democratic National Committee',
    '2026-10-10',
    'Attack linking Republicans to polluters and suggesting environmental neglect.',
    'We support energy independence and American innovation. Clean energy comes from prosperity and private sector innovation, not from forced scarcity policies that hurt working families.',
    6
  ),
  (
    'Healthcare',
    'national',
    'Republicans want to take away healthcare',
    'Democratic PACs',
    '2026-10-08',
    'Claim that GOP policies will result in fewer people having healthcare coverage.',
    'We''re expanding healthcare choice and innovation. We oppose federal overreach that limits options. More choices, more competition, and better care for Georgians.',
    5
  ),
  (
    'Gun Rights',
    'national',
    'GOP wants unrestricted gun access, no regulations',
    'Democratic groups, anti-gun PACs',
    '2026-10-05',
    'Portraying Republicans as extremists on gun policy.',
    'We support Second Amendment rights while keeping guns away from dangerous criminals. Responsible gun owners aren''t the problem - criminals are. Let''s enforce existing laws.',
    5
  );

-- ============================================
-- Sample Opposition Messages - Georgia State Level
-- ============================================

INSERT INTO opposition_messages (topic, level, message, source, date_published, context, counter_talking_point, importance)
VALUES
  (
    'Voting Rights/Voter ID',
    'state',
    'Georgia voter ID law targets Black voters',
    'Georgia Democratic Party',
    '2026-11-01',
    'Georgia Democrats consistently claim voter ID requirements suppress minority turnout.',
    'Voter ID is normal, fair, and effective. Georgia has seen RECORD turnout since this law passed, including increased participation from all demographic groups. Every democracy uses voter verification.',
    9
  ),
  (
    'Redistricting',
    'state',
    'Georgia GOP gerrymandered districts to suppress Democratic votes',
    'Georgia Democratic Party, voting rights groups',
    '2026-10-20',
    'Claims that redistricting was partisan and anti-competitive.',
    'Georgia''s redistricting process was transparent and court-approved. Our districts are competitive. We won''t apologize for winning.',
    7
  ),
  (
    'Jobs/Economy',
    'state',
    'Kemp and Georgia GOP don''t care about working families',
    'Georgia Democratic Party',
    '2026-10-15',
    'Attack on Gov. Kemp''s economic policies claiming they hurt workers.',
    'Georgia''s economy is booming under Republican leadership. Unemployment is at record lows. Wages are growing. Small businesses are thriving. Working families are experiencing real prosperity.',
    7
  ),
  (
    'Education Funding',
    'state',
    'Georgia schools are chronically underfunded',
    'Teacher unions, Georgia Democratic Party',
    '2026-10-10',
    'Claim that Georgia education spending lags national averages.',
    'Georgia has increased education funding every single year we''ve been in charge. We''ve also expanded choice - charter schools, private school scholarships, and homeschooling freedom. Choice matters.',
    6
  ),
  (
    'Education - HOPE Scholarship',
    'state',
    'GOP is cutting HOPE Scholarship funding',
    'Georgia Democratic Party',
    '2026-09-30',
    'Claims Republicans are eliminating or reducing the HOPE Scholarship program.',
    'HOPE is fully funded and thriving. We''re expanding dual enrollment and technical certifications to create more pathways to success without massive student debt.',
    6
  ),
  (
    'Healthcare Access',
    'state',
    'Georgia GOP restricts healthcare and Medicaid access',
    'Georgia Democratic Party, healthcare advocacy groups',
    '2026-09-25',
    'Criticism of not expanding Medicaid and healthcare policy decisions.',
    'We''re expanding rural healthcare access and telemedicine services. We oppose federal overreach in healthcare. Georgians deserve choice and innovation in healthcare, not government control.',
    5
  ),
  (
    'Environment',
    'state',
    'Georgia Republicans allow corporations to pollute',
    'Environmental groups',
    '2026-09-20',
    'Claim that GOP policies prioritize business over environment.',
    'We balance economic growth with environmental stewardship. Georgia''s environment has improved. We don''t need job-killing regulations - we need innovation and smart business practices.',
    4
  ),
  (
    'Pay/Wages',
    'state',
    'Republican policies have stagnated Georgia wages',
    'Georgia Democratic Party, Labor unions',
    '2026-09-15',
    'Claim that worker pay has not kept pace with cost of living.',
    'Georgia wages have grown consistently under Republican leadership. Our strong economy creates competitive pressure for wages. Employers compete for talent - that''s how wages rise.',
    4
  );

-- ============================================
-- Verify the data was inserted
-- ============================================

SELECT COUNT(*) as total_messages, level, COUNT(*) as count_by_level 
FROM opposition_messages 
GROUP BY level;

-- Show all messages ordered by importance
SELECT topic, level, importance, message, source 
FROM opposition_messages 
ORDER BY level DESC, importance DESC;
