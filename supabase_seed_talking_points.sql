-- Seed Talking Points with Daily, Weekly, and Monthly Cadence

-- DAILY TALKING POINTS (Updated frequently)
INSERT INTO talking_points (title, content, source, date, cadence, active) VALUES
  ('Election Integrity Protection', 'Secure elections are the foundation of a strong democracy. Georgia continues to lead with voter ID verification and election security measures.', 'Georgia GOP', '2026-01-15', 'daily', true),
  ('Economic Growth Focus', 'Georgia''s economy continues to grow with low unemployment and record job creation. Conservative policies create opportunity.', 'State Economic Report', '2026-01-15', 'daily', true),
  ('Education Freedom', 'Parents should have choice in their children''s education. School choice and educational freedom empower families.', 'Education Policy Office', '2026-01-15', 'daily', true),
  ('Public Safety Initiative', 'Strong communities require safe neighborhoods. Support our law enforcement and public safety professionals.', 'Public Safety Bureau', '2026-01-15', 'daily', true),
  ('Border Security Statement', 'Strong borders protect Georgia families. We support comprehensive border security and immigration reform.', 'Policy Department', '2026-01-15', 'daily', true);

-- WEEKLY TALKING POINTS (Focus areas for the week)
INSERT INTO talking_points (title, content, source, date, cadence, active) VALUES
  ('Fiscal Responsibility Week', 'This week we focus on government efficiency. Georgia taxpayers deserve a government that spends responsibly and delivers results. Every tax dollar must be accounted for and spent wisely.', 'Budget Office', '2026-01-13', 'weekly', true),
  ('Small Business Support', 'Small businesses are the backbone of Georgia''s economy. This week, highlight policies that support entrepreneurship, reduce red tape, and create opportunity for job creators.', 'Economic Development', '2026-01-13', 'weekly', true),
  ('Healthcare Access', 'Quality healthcare begins with choice and competition. Support market-based solutions that expand access and lower costs for Georgia families.', 'Healthcare Policy', '2026-01-13', 'weekly', true),
  ('Infrastructure Investment', 'Georgia''s infrastructure supports commerce and quality of life. Advocate for smart infrastructure spending that benefits communities and attracts business.', 'Transportation Bureau', '2026-01-13', 'weekly', true),
  ('Community Development', 'Strong communities thrive when local leaders have resources and freedom to innovate. Support policies that empower county and city governments.', 'Local Government Affairs', '2026-01-13', 'weekly', true);

-- MONTHLY TALKING POINTS (Major themes)
INSERT INTO talking_points (title, content, source, date, cadence, active) VALUES
  ('January: Vision for 2026', 'January is a time for reflection and forward thinking. Share your vision for Georgia''s future: stronger economy, safer communities, quality education, and fiscal responsibility. How will we build on 2025 successes?', 'Party Leadership', '2026-01-01', 'monthly', true),
  ('Community Engagement Focus', 'This month, emphasize the importance of community involvement. Encourage neighbors to attend local meetings, volunteer, and stay informed. Engaged communities make better decisions.', 'Community Outreach', '2026-01-01', 'monthly', true),
  ('Celebrating Republican Values', 'January celebrates principles that have built Georgia: individual liberty, personal responsibility, limited government, and rule of law. These values have stood the test of time.', 'Party Messaging', '2026-01-01', 'monthly', true),
  ('New Year, New Opportunity', 'Use January to encourage optimism and action. Republicans are the party of opportunity. Share stories of Georgia success and invite people to participate in building our future.', 'Communications', '2026-01-01', 'monthly', true);

-- COUNTY-SPECIFIC TALKING POINTS (Example - Fulton County)
INSERT INTO talking_points (title, content, source, date, cadence, active, county) VALUES
  ('Fulton County Growth Strategy', 'Fulton County continues to be Georgia''s economic engine. Focus on maintaining business-friendly policies, supporting diverse industries, and ensuring quality services for residents.', 'Fulton GOP', '2026-01-15', 'weekly', true, 'Fulton'),
  ('DeKalb Transportation Solutions', 'DeKalb residents deserve efficient transportation. Support smart infrastructure solutions that reduce congestion and connect communities.', 'DeKalb GOP', '2026-01-15', 'weekly', true, 'DeKalb'),
  ('Cobb Community Safety', 'Cobb County values safe neighborhoods and strong schools. Emphasize support for law enforcement and educational excellence.', 'Cobb GOP', '2026-01-15', 'weekly', true, 'Cobb'),
  ('Gwinnett Economic Opportunity', 'Gwinnett''s diverse economy is a model for growth. Support policies that attract businesses, create jobs, and improve quality of life for all residents.', 'Gwinnett GOP', '2026-01-15', 'weekly', true, 'Gwinnett');

-- STATEWIDE MESSAGES (No specific county)
INSERT INTO talking_points (title, content, source, date, cadence, active, county) VALUES
  ('Republican Platform Overview', 'Georgia Republicans stand for: strong economy, quality education, safe communities, lower taxes, and constitutional rights. We''re committed to building a stronger Georgia.', 'State GOP Platform', '2026-01-15', 'weekly', true, NULL),
  ('Democracy Participation', 'Democracy works when Georgians participate. Vote, volunteer, attend community meetings. Your voice matters. Get involved in your county Republican Party.', 'Civic Engagement', '2026-01-15', 'weekly', true, NULL),
  ('Economic Opportunity Message', 'Georgia''s strong economy creates opportunity for all. We believe in free markets, entrepreneurship, and policies that help hardworking Georgians build better lives.', 'Economic Messaging', '2026-01-15', 'monthly', true, NULL);

-- Commit data
SELECT COUNT(*) as total_talking_points FROM talking_points;
SELECT COUNT(*) as total_by_cadence, cadence FROM talking_points GROUP BY cadence;
