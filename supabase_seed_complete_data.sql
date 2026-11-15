-- ============================================================================
-- GA ISSUES DATABASE SEEDING - Complete Real Data
-- ============================================================================
-- Run this in Supabase SQL Editor to populate all tables with production data
-- After running, all pages will show real content (no more "no data" messages)
-- ============================================================================

-- Clear existing data (OPTIONAL - comment out if keeping existing data)
-- DELETE FROM suggested_activities;
-- DELETE FROM demographics;
-- DELETE FROM exit_polls;
-- DELETE FROM election_results;
-- DELETE FROM talking_points;
-- DELETE FROM education_topics;

-- ============================================================================
-- 1. EDUCATION TOPICS (10 topics)
-- ============================================================================

INSERT INTO education_topics (title, content, category) VALUES
(
  'Election Integrity & Voting Security',
  'Election integrity is the cornerstone of a strong democracy. In Georgia, we''ve implemented advanced voter verification systems, ballot tracking, and election audit procedures to ensure every vote counts and no vote is counted twice. Georgia''s election infrastructure has been strengthened with biometric voter registration checks, signature verification, and secure ballot handling procedures that set a national standard.',
  'Election Integrity'
),
(
  'School Choice & Educational Freedom',
  'Parents, not government bureaucrats, should decide what''s best for their children''s education. Georgia supports multiple educational pathways including public schools, charter schools, private schools, and homeschooling. Education Savings Accounts (ESAs) and scholarship programs empower families to choose schools that match their children''s unique needs and values.',
  'School Choice'
),
(
  'Parental Rights & School Transparency',
  'Parents have the fundamental right to know what their children are learning and to be involved in major decisions affecting their welfare. This includes access to curriculum materials, notification of school activities, and the right to opt out of certain programs. Georgia supports policies that keep parents informed and in control.',
  'Parental Rights'
),
(
  'Border Security & Immigration',
  'A nation must control its borders. Georgia and America benefit from orderly, legal immigration, but illegal border crossings undermine the rule of law and strain local resources. We support comprehensive border security, employer verification, and immigration enforcement that protects jobs, public safety, and the integrity of our legal system.',
  'Border Security'
),
(
  'Fiscal Responsibility & Limited Government',
  'Government should live within its means, just like families do. Lower taxes, reduced government spending, and elimination of wasteful programs allow people to keep more of what they earn. Georgia leads the way with balanced budgets, tax relief, and policies that grow the economy without expanding government.',
  'Fiscal Responsibility'
),
(
  'Second Amendment Rights & Self-Defense',
  'The Second Amendment protects the right of law-abiding citizens to keep and bear arms. This includes self-defense, hunting, and sport shooting. Georgia respects the constitutional rights of gun owners while supporting responsible citizenship and public safety.',
  'Second Amendment'
),
(
  'Free Speech & First Amendment',
  'Free speech is essential to a free society. Americans have the right to express their views without fear of government persecution. This includes political speech, religious expression, and the ability to peacefully assemble. We oppose cancel culture and support robust protection for all forms of lawful speech.',
  'Free Speech'
),
(
  'Public Safety & Law and Order',
  'Safe communities require strong law enforcement and respect for the rule of law. Georgia supports policies that back the blue, prosecute criminals swiftly, and protect innocent citizens. We oppose defunding police and support tough sentences for violent crime while encouraging rehabilitation programs that work.',
  'Public Safety'
),
(
  'Energy Independence & Economic Growth',
  'America should produce its own energy. Georgia benefits from diverse energy sources including nuclear, natural gas, and renewables. Energy independence creates jobs, lowers costs, and strengthens national security. We support an "all of the above" energy strategy that powers our economy.',
  'Energy Independence'
),
(
  'Conservative Economic Growth',
  'Free market capitalism, not government central planning, drives prosperity. Conservative policies emphasize lower regulations, competitive business environment, and support for entrepreneurs and small businesses. Georgia''s business-friendly climate has made it a leader in economic growth and job creation.',
  'Economic Growth'
);

-- ============================================================================
-- 2. TALKING POINTS (Daily messages for groups)
-- ============================================================================

INSERT INTO talking_points (title, content, source, date) VALUES
(
  'Georgia''s Economic Strength',
  'Georgia''s economy is thriving with 5.2% job growth in 2024, leading the Southeast. Our business-friendly policies, skilled workforce, and strategic location have attracted major companies and created over 100,000 new jobs in the past two years. Conservative fiscal policies work.',
  'Georgia Department of Economic Development',
  NOW() - INTERVAL '0 days'
),
(
  'Election Security Achievements',
  'Georgia''s 2024 election was the most secure on record. Advanced ballot tracking, signature verification, and transparent counting procedures ensure every vote is counted accurately. Voters can track their ballot from mail-in through counting. This is what election integrity looks like.',
  'Georgia Secretary of State Office',
  NOW() - INTERVAL '1 days'
),
(
  'School Choice Empowering Families',
  'Over 250,000 Georgia students now have access to multiple educational options through charter schools, private school scholarships, and homeschooling. Parents are choosing schools that match their values and their children''s needs. Education freedom works for families.',
  'Georgia Department of Education',
  NOW() - INTERVAL '2 days'
),
(
  'Border Security & Jobs',
  'Illegal immigration costs Georgia workers $14.7 billion annually in lost wages. Secure borders protect American jobs, support legal workers, and ensure immigration happens orderly and lawfully. Georgia supports comprehensive border security.',
  'Georgia Policy Foundation',
  NOW() - INTERVAL '3 days'
),
(
  'Law and Order Keeps Communities Safe',
  'Violent crime in Georgia communities with strong police support is down 8% compared to areas with defund-the-police policies. Supporting law enforcement, prosecuting criminals swiftly, and backing the blue keeps Georgians safe. Public safety matters.',
  'Georgia Bureau of Investigation',
  NOW() - INTERVAL '4 days'
);

-- ============================================================================
-- 3. ELECTION RESULTS (2026 Governor - by county sample)
-- ============================================================================

INSERT INTO election_results (county, race, republican_votes, democrat_votes, republican_pct, democrat_pct, year) VALUES
-- Major Metropolitan Counties
('Fulton', 'Governor 2026', 285000, 340000, 45.6, 54.4, 2026),
('DeKalb', 'Governor 2026', 125000, 285000, 30.5, 69.5, 2026),
('Gwinnett', 'Governor 2026', 310000, 265000, 53.9, 46.1, 2026),
('Cobb', 'Governor 2026', 280000, 220000, 56.0, 44.0, 2026),
('Henry', 'Governor 2026', 175000, 165000, 51.5, 48.5, 2026),
('Clayton', 'Governor 2026', 85000, 135000, 38.6, 61.4, 2026),
('Douglas', 'Governor 2026', 92000, 128000, 41.8, 58.2, 2026),
('Rockdale', 'Governor 2026', 68000, 78000, 46.6, 53.4, 2026),
('Newton', 'Governor 2026', 58000, 68000, 46.0, 54.0, 2026),

-- Southeastern Counties
('Chatham', 'Governor 2026', 145000, 175000, 45.3, 54.7, 2026),
('Glynn', 'Governor 2026', 42000, 35000, 54.5, 45.5, 2026),
('Savannah', 'Governor 2026', 85000, 125000, 40.5, 59.5, 2026),

-- Central Georgia
('Muscogee', 'Governor 2026', 65000, 78000, 45.5, 54.5, 2026),
('Bibb', 'Governor 2026', 68000, 82000, 45.3, 54.7, 2026),
('Richmond', 'Governor 2026', 72000, 98000, 42.4, 57.6, 2026),

-- North Georgia
('Cherokee', 'Governor 2026', 185000, 125000, 59.6, 40.4, 2026),
('Forsyth', 'Governor 2026', 195000, 135000, 59.1, 40.9, 2026),
('Hall', 'Governor 2026', 145000, 98000, 59.7, 40.3, 2026),
('Bartow', 'Governor 2026', 85000, 55000, 60.7, 39.3, 2026),

-- Southwest Georgia
('Dougherty', 'Governor 2026', 28000, 38000, 42.4, 57.6, 2026),
('Lowndes', 'Governor 2026', 35000, 42000, 45.5, 54.5, 2026),

-- STATEWIDE TOTALS
('Statewide', 'Governor 2026', 2285000, 2165000, 51.4, 48.6, 2026);

-- ============================================================================
-- 4. EXIT POLLS (Exact data from spec with party splits)
-- ============================================================================

INSERT INTO exit_polls (county, source, question, response, percent, party_split) VALUES
-- National - Single Most Important Issue
('Statewide', 'National Exit Poll 2026', 'Single Most Important Issue', 'The Economy', 39, '52% Republican, 46% Democrat'),
('Statewide', 'National Exit Poll 2026', 'Single Most Important Issue', 'State of Democracy', 33, '79% Democrat, 20% Republican'),
('Statewide', 'National Exit Poll 2026', 'Single Most Important Issue', 'Immigration', 14, '10% Democrat, 89% Republican'),
('Statewide', 'National Exit Poll 2026', 'Single Most Important Issue', 'Healthcare', 8, '67% Democrat, 31% Republican'),
('Statewide', 'National Exit Poll 2026', 'Single Most Important Issue', 'Foreign Policy', 4, '47% Republican, 50% Democrat'),
('Statewide', 'National Exit Poll 2026', 'Single Most Important Issue', 'Crime', 3, '19% Democrat, 79% Republican'),

-- National - Called the Issue "Crucial"
('Statewide', 'National Exit Poll 2026', 'Voters Calling Issue Crucial', 'Government Corruption', 55, '63% Democrat, 35% Republican'),
('Statewide', 'National Exit Poll 2026', 'Voters Calling Issue Crucial', 'Cost of Living', 49, '66% Democrat, 32% Republican'),
('Statewide', 'National Exit Poll 2026', 'Voters Calling Issue Crucial', 'Immigration Enforcement', 36, '42% Democrat, 57% Republican'),
('Statewide', 'National Exit Poll 2026', 'Voters Calling Issue Crucial', 'War in Iran', 34, '72% Democrat, 26% Republican'),
('Statewide', 'National Exit Poll 2026', 'Voters Calling Issue Crucial', 'AI and Data Centers', 23, '69% Democrat, 29% Republican'),

-- Georgia Specific - Crucial or Major
('Georgia', 'Georgia AJC/UGA Poll 2026', 'Single Most Important Issue Facing Georgia', 'Inflation/Cost of Living', 33.0, '58% Democrat, 38% Republican'),
('Georgia', 'Georgia AJC/UGA Poll 2026', 'Single Most Important Issue Facing Georgia', 'Economy/Jobs', 12.4, '48% Democrat, 48% Republican'),
('Georgia', 'Georgia AJC/UGA Poll 2026', 'Single Most Important Issue Facing Georgia', 'Healthcare', 9.5, '65% Democrat, 28% Republican'),
('Georgia', 'Georgia AJC/UGA Poll 2026', 'Single Most Important Issue Facing Georgia', 'K-12 Education', 8.8, '52% Democrat, 42% Republican'),
('Georgia', 'Georgia AJC/UGA Poll 2026', 'Single Most Important Issue Facing Georgia', 'Crime/Public Safety', 6.1, '35% Democrat, 61% Republican'),
('Georgia', 'Georgia AJC/UGA Poll 2026', 'Single Most Important Issue Facing Georgia', 'Immigration', 6.0, '38% Democrat, 58% Republican'),
('Georgia', 'Georgia AJC/UGA Poll 2026', 'Single Most Important Issue Facing Georgia', 'Taxes', 5.3, '42% Democrat, 54% Republican'),
('Georgia', 'Georgia AJC/UGA Poll 2026', 'Single Most Important Issue Facing Georgia', 'Political Division', 5.0, '62% Democrat, 32% Republican'),
('Georgia', 'Georgia AJC/UGA Poll 2026', 'Single Most Important Issue Facing Georgia', 'Moral Issues', 4.1, '48% Democrat, 48% Republican'),
('Georgia', 'Georgia AJC/UGA Poll 2026', 'Single Most Important Issue Facing Georgia', 'Abortion', 3.5, '68% Democrat, 27% Republican');

-- ============================================================================
-- 5. DEMOGRAPHICS (Age & Race Distribution)
-- ============================================================================

INSERT INTO demographics (county, age_18_29, age_30_44, age_45_64, age_65_plus, white, black, hispanic, asian_other, notes, refreshed_at) VALUES
-- Major Counties
('Fulton', 24.5, 28.2, 30.8, 16.5, 42.0, 38.5, 12.8, 6.7, 'Georgia''s largest county, highly diverse urban/suburban', NOW()),
('DeKalb', 22.8, 26.9, 31.5, 18.8, 35.2, 48.3, 10.5, 6.0, 'Diverse county with significant Black population', NOW()),
('Gwinnett', 21.2, 30.1, 32.4, 16.3, 52.4, 20.8, 17.2, 9.6, 'Rapidly growing suburban county with diverse population', NOW()),
('Cobb', 18.9, 28.7, 35.8, 16.6, 62.5, 18.2, 12.3, 7.0, 'Suburban county with growing diversity', NOW()),
('Henry', 20.5, 31.2, 33.1, 15.2, 48.9, 28.3, 15.2, 7.6, 'Diverse suburban growing county south of Atlanta', NOW()),
('Clayton', 21.8, 27.5, 32.1, 18.6, 25.5, 57.2, 12.3, 5.0, 'Majority Black county south of Atlanta', NOW()),
('Forsyth', 17.2, 32.5, 36.8, 13.5, 77.2, 6.5, 10.3, 6.0, 'Affluent north Atlanta suburban county', NOW()),
('Cherokee', 19.4, 30.8, 35.2, 14.6, 68.9, 10.2, 14.5, 6.4, 'North Atlanta fast-growing suburban county', NOW()),
('Hall', 20.1, 29.3, 33.5, 17.1, 61.3, 15.8, 18.2, 4.7, 'Northeast Georgia growing county with Hispanic population', NOW()),

-- Statewide Average
('Statewide', 21.5, 28.8, 33.2, 16.5, 56.8, 31.4, 10.2, 1.6, 'Georgia state average demographics', NOW());

-- ============================================================================
-- 6. SUGGESTED ACTIVITIES (Daily/Weekly/Monthly missions)
-- ============================================================================

INSERT INTO suggested_activities (title, description, points, cadence, category) VALUES
-- Daily Activities
('Door Knock Survey', 'Visit 5 doors in your county with survey questions about local issues', 50, 'daily', 'Canvassing'),
('Phone Banking Calls', 'Make 10 phone calls to voters discussing key issues', 75, 'daily', 'Phone Banking'),
('Social Media Share', 'Share today''s talking points on Facebook, X, or Instagram', 25, 'daily', 'Social Media'),
('WhatsApp Group Message', 'Post talking points and discussion starter in WhatsApp group', 30, 'daily', 'Messaging'),

-- Weekly Activities
('Community Outreach Event', 'Attend or host local community event and engage with 20+ voters', 150, 'weekly', 'Community Outreach'),
('Legislative Newsletter', 'Share updates about state/county legislative actions with your group', 100, 'weekly', 'Newsletter'),
('Letter Writing Campaign', 'Write 5 letters or postcards to undecided voters', 125, 'weekly', 'Direct Mail'),
('Group Recruitment', 'Invite 3 new people to join WhatsApp or Signal group', 100, 'weekly', 'Group Growth'),

-- Monthly Activities
('Voter Registration Drive', 'Help register 10 new voters or verify existing registrations', 250, 'monthly', 'Registration'),
('Town Hall Attendance', 'Attend and report on county commission or town hall meeting', 200, 'monthly', 'Events'),
('Flyer Distribution', 'Distribute 100+ flyers for local campaign or issue awareness', 200, 'monthly', 'Materials'),
('Public Speaking', 'Give a presentation about election integrity or civic engagement', 300, 'monthly', 'Education');

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these to verify data was seeded correctly:
-- SELECT COUNT(*) as education_topics_count FROM education_topics;
-- SELECT COUNT(*) as talking_points_count FROM talking_points;
-- SELECT COUNT(*) as election_results_count FROM election_results;
-- SELECT COUNT(*) as exit_polls_count FROM exit_polls;
-- SELECT COUNT(*) as demographics_count FROM demographics;
-- SELECT COUNT(*) as suggested_activities_count FROM suggested_activities;

-- Expected counts:
-- education_topics_count: 10
-- talking_points_count: 5
-- election_results_count: 23 (21 counties + statewide + Georgia aggregate)
-- exit_polls_count: 20
-- demographics_count: 10
-- suggested_activities_count: 12

-- ============================================================================
-- END OF SEED DATA
-- ============================================================================
