-- Complete seed data for GA Issues application
-- Run this in Supabase SQL Editor

-- EDUCATION TOPICS (required for Education Center)
INSERT INTO education_topics (title, content, category) VALUES
('Election Integrity', 'Explore the importance of secure elections, voter verification, and election administration best practices. Learn about ballot security measures and how Georgia protects election integrity.', 'Politics'),
('School Choice', 'Understand educational freedom and school choice options available to Georgia families. Learn about charter schools, private school scholarships, and education savings accounts.', 'Education'),
('Parental Rights', 'Parents have fundamental rights in their children''s education and upbringing. Discover how to advocate for parental involvement in schools and curriculum decisions.', 'Rights'),
('Border Security', 'Learn about immigration policy, border security challenges, and how secure borders protect American communities. Understand Georgia''s role in national security.', 'Security'),
('Fiscal Responsibility', 'Conservative fiscal principles include lower taxes, reduced spending, and balanced budgets. Explore how fiscal conservatism strengthens families and businesses.', 'Economics'),
('Energy Independence', 'America''s energy independence relies on domestic production including natural gas, nuclear, and renewables. Understand Georgia''s energy future and job creation.', 'Energy'),
('Second Amendment', 'The Second Amendment protects Americans'' right to bear arms for self-defense and liberty. Learn about gun rights, responsible ownership, and constitutional protection.', 'Rights'),
('Free Speech', 'Free speech is fundamental to American freedom. Explore how open discourse, diverse viewpoints, and free expression strengthen democracy.', 'Rights'),
('Crime & Public Safety', 'Safe communities require effective law enforcement, accountability, and prevention. Understand conservative approaches to criminal justice and community safety.', 'Safety'),
('Governmental Accountability', 'Transparency in government and accountability for public officials are essential. Learn how to hold elected representatives accountable for their actions.', 'Government');

-- TALKING POINTS (daily/weekly updates)
INSERT INTO talking_points (title, content, source, date) VALUES
('Georgia''s Economic Growth', 'Georgia has experienced consistent economic growth with strong job creation across diverse industries. Businesses choose Georgia for our pro-growth policies and skilled workforce.', 'GA Economic Development', NOW()),
('Education Excellence', 'Georgia is committed to excellent public schools, increased teacher pay, and education freedom. Every child deserves access to quality education options.', 'GA Department of Education', NOW()),
('Conservative Leadership', 'Conservative principles of limited government, personal responsibility, and free enterprise have built strong communities across Georgia.', 'Conservative News', NOW()),
('Election Security', 'Georgia''s election system is secure with voter verification, ballot security, and consistent audits to ensure election integrity.', 'GA Elections Division', NOW()),
('Law & Order', 'Georgia''s law enforcement officers work tirelessly to keep our communities safe. We support our police and back the blue.', 'GA Law Enforcement', NOW());

-- SUGGESTED ACTIVITIES (game missions)
INSERT INTO suggested_activities (title, description, points, cadence, category) VALUES
('Canvas 5 Doors', 'Talk to voters face-to-face at their homes about issues that matter.', 10, 'daily', 'Outreach'),
('Share 3 Social Posts', 'Share conservative talking points on Facebook, X, or Instagram.', 5, 'daily', 'Social Media'),
('Make 10 Calls', 'Phone banking: call voters to discuss campaigns and issues.', 8, 'daily', 'Phone Banking'),
('Write 5 Letters', 'Write personal letters to voters sharing your perspective.', 12, 'weekly', 'Direct Mail'),
('Post to WhatsApp Group', 'Share key messages with your WhatsApp group.', 3, 'daily', 'Messaging'),
('Attend County Event', 'Attend a county Republican event or town hall.', 15, 'weekly', 'Events'),
('Sign Up for Newsletter', 'Help recruit new newsletter subscribers in your county.', 7, 'weekly', 'Recruitment'),
('Share Election Data', 'Share county election results and trends with friends.', 6, 'weekly', 'Education'),
('Volunteer at Event', 'Help organize or volunteer at a campaign event.', 20, 'monthly', 'Events'),
('Recruit New Volunteer', 'Bring a new volunteer into the campaign.', 25, 'monthly', 'Recruitment');

-- SAMPLE ELECTION RESULTS (2026 Governor - sample counties)
INSERT INTO election_results (county, race, republican_votes, democrat_votes, republican_pct, democrat_pct, year) VALUES
('Fulton', 'Governor', 280000, 520000, 35.0, 65.0, 2026),
('DeKalb', 'Governor', 180000, 420000, 30.0, 70.0, 2026),
('Gwinnett', 'Governor', 380000, 340000, 53.0, 47.0, 2026),
('Cobb', 'Governor', 310000, 280000, 53.0, 47.0, 2026),
('Clayton', 'Governor', 120000, 240000, 33.0, 67.0, 2026),
('Henry', 'Governor', 160000, 140000, 53.0, 47.0, 2026),
('Chatham', 'Governor', 150000, 180000, 45.0, 55.0, 2026),
('Muscogee', 'Governor', 85000, 95000, 47.0, 53.0, 2026),
('Bibb', 'Governor', 75000, 105000, 42.0, 58.0, 2026),
('Richmond', 'Governor', 95000, 125000, 43.0, 57.0, 2026);

-- EXIT POLLS - National
INSERT INTO exit_polls (source, question, response, percent, party_split, county) VALUES
('National Exit Poll', 'Single most important issue', 'The economy', 39, '52-46 Dem', 'Statewide'),
('National Exit Poll', 'Single most important issue', 'The state of democracy', 33, '79-20 Dem', 'Statewide'),
('National Exit Poll', 'Single most important issue', 'Immigration', 14, '10-89 Rep', 'Statewide'),
('National Exit Poll', 'Single most important issue', 'Healthcare', 8, '67-31 Dem', 'Statewide'),
('National Exit Poll', 'Single most important issue', 'Foreign policy', 4, '47-50', 'Statewide'),
('National Exit Poll', 'Single most important issue', 'Crime', 3, '19-79 Rep', 'Statewide'),
('National Exit Poll', 'Issue called crucial', 'Government corruption', 55, '63-35 Dem', 'Statewide'),
('National Exit Poll', 'Issue called crucial', 'Cost of living', 49, '66-32 Dem', 'Statewide'),
('National Exit Poll', 'Issue called crucial', 'Immigration enforcement policies', 36, '42-57 Rep', 'Statewide'),
('National Exit Poll', 'Issue called crucial', 'War in Iran', 34, '72-26 Dem', 'Statewide'),
('National Exit Poll', 'Issue called crucial', 'AI and data centers', 23, '69-29 Dem', 'Statewide'),
('AJC/UGA Poll', 'Single most important issue facing Georgia', 'Inflation/Cost of Living', 33.0, '58-42 Dem', 'Statewide'),
('AJC/UGA Poll', 'Single most important issue facing Georgia', 'Economy/Jobs', 12.4, '45-55 Rep', 'Statewide'),
('AJC/UGA Poll', 'Single most important issue facing Georgia', 'Healthcare', 9.5, '65-35 Dem', 'Statewide'),
('AJC/UGA Poll', 'Single most important issue facing Georgia', 'K-12 Education', 8.8, '50-50', 'Statewide'),
('AJC/UGA Poll', 'Single most important issue facing Georgia', 'Crime/Public Safety', 6.1, '35-65 Rep', 'Statewide'),
('AJC/UGA Poll', 'Single most important issue facing Georgia', 'Immigration', 6.0, '25-75 Rep', 'Statewide'),
('AJC/UGA Poll', 'Single most important issue facing Georgia', 'Taxes', 5.3, '40-60 Rep', 'Statewide'),
('AJC/UGA Poll', 'Single most important issue facing Georgia', 'Political Division', 5.0, '60-40 Dem', 'Statewide'),
('AJC/UGA Poll', 'Single most important issue facing Georgia', 'Moral Issues', 4.1, '30-70 Rep', 'Statewide'),
('AJC/UGA Poll', 'Single most important issue facing Georgia', 'Abortion', 3.5, '35-65 Rep', 'Statewide');

-- DEMOGRAPHICS (sample for major counties)
INSERT INTO demographics (county, age_18_29, age_30_44, age_45_64, age_65_plus, white, black, hispanic, asian_other, notes, refreshed_at) VALUES
('Fulton', 22.5, 28.0, 28.5, 21.0, 45.0, 35.0, 12.0, 8.0, 'Major urban center with diverse population. Includes Atlanta.', '2026-10-01'),
('DeKalb', 20.5, 27.0, 29.0, 23.5, 35.0, 50.0, 10.0, 5.0, 'Diverse suburban county with strong African American community.', '2026-10-01'),
('Gwinnett', 19.0, 29.5, 30.5, 21.0, 55.0, 20.0, 18.0, 7.0, 'Fast-growing suburbs with young families and immigrant communities.', '2026-10-01'),
('Cobb', 18.5, 27.5, 31.0, 23.0, 65.0, 18.0, 10.0, 7.0, 'Suburban county north of Atlanta with educated workforce.', '2026-10-01'),
('Clayton', 21.0, 26.5, 28.5, 24.0, 25.0, 65.0, 6.0, 4.0, 'Southern suburban county with African American majority.', '2026-10-01'),
('Henry', 20.5, 28.0, 29.0, 22.5, 48.0, 38.0, 8.0, 6.0, 'South Atlanta suburbs with mixed demographics.', '2026-10-01'),
('Chatham', 19.5, 26.5, 29.5, 24.5, 52.0, 32.0, 10.0, 6.0, 'Savannah-based county with historic and modern communities.', '2026-10-01'),
('Muscogee', 20.0, 25.5, 29.0, 25.5, 45.0, 42.0, 8.0, 5.0, 'Columbus area with strong military presence.', '2026-10-01'),
('Bibb', 20.5, 24.5, 28.5, 26.5, 40.0, 50.0, 6.0, 4.0, 'Macon-based county with manufacturing and services.', '2026-10-01'),
('Richmond', 21.0, 25.0, 28.0, 26.0, 38.0, 52.0, 6.0, 4.0, 'Augusta area with African American majority.', '2026-10-01');
