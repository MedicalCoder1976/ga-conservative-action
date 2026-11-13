-- ============================================================================
-- MULTI-LEVEL VOTER CONCERNS SYSTEM - DATABASE SCHEMA
-- Local, State & National Concerns with Admin Management
-- ============================================================================

-- ============================================================================
-- 1. MAIN CONCERNS TABLE (All three levels)
-- ============================================================================

CREATE TABLE voter_concerns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL CHECK (level IN ('local', 'state', 'national')),
  county TEXT REFERENCES counties(name),
  concern_topic TEXT NOT NULL,
  description TEXT NOT NULL,
  what_they_say TEXT,
  frequency INTEGER DEFAULT 5 CHECK (frequency BETWEEN 1 AND 10),
  demographic_group TEXT,
  geographic_area TEXT,
  mention_count INTEGER DEFAULT 0,
  mentions_trend TEXT DEFAULT 'stable' CHECK (mentions_trend IN ('trending_up', 'stable', 'trending_down')),
  source_type TEXT CHECK (source_type IN ('volunteer_report', 'community_feedback', 'social_media', 'local_news', 'admin_entry', 'automated', 'polling')),
  is_trending BOOLEAN DEFAULT FALSE,
  resolution_suggestion TEXT,
  related_activity_type TEXT,
  parent_concern_id UUID REFERENCES voter_concerns(id),
  child_concerns INTEGER DEFAULT 0,
  impact_score INTEGER DEFAULT 5 CHECK (impact_score BETWEEN 1 AND 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_mention_date DATE DEFAULT CURRENT_DATE
);

ALTER TABLE voter_concerns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read voter concerns" ON voter_concerns
  FOR SELECT USING (true);

CREATE POLICY "Coordinators and admins can manage concerns" ON voter_concerns
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role IN ('Coordinator', 'Leader', 'Admin')
    )
  );

-- Indexes for performance
CREATE INDEX idx_concerns_level ON voter_concerns(level);
CREATE INDEX idx_concerns_county ON voter_concerns(county);
CREATE INDEX idx_concerns_frequency ON voter_concerns(frequency DESC);
CREATE INDEX idx_concerns_trending ON voter_concerns(is_trending);
CREATE INDEX idx_concerns_parent ON voter_concerns(parent_concern_id);
CREATE INDEX idx_concerns_topic ON voter_concerns(concern_topic);
CREATE INDEX idx_concerns_updated ON voter_concerns(updated_at DESC);

-- ============================================================================
-- 2. VOLUNTEER SUBMISSIONS TABLE
-- ============================================================================

CREATE TABLE concern_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  county TEXT NOT NULL REFERENCES counties(name),
  concern_topic TEXT NOT NULL,
  what_voter_said TEXT NOT NULL,
  voter_demographic TEXT,
  voter_area TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'merged')),
  linked_concern_id UUID REFERENCES voter_concerns(id),
  coordinator_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id)
);

ALTER TABLE concern_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can submit concerns" ON concern_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own submissions" ON concern_submissions
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('Coordinator', 'Leader', 'Admin')
  ));

CREATE POLICY "Coordinators can manage submissions" ON concern_submissions
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role IN ('Coordinator', 'Leader', 'Admin')
    )
  );

-- Indexes
CREATE INDEX idx_submissions_user ON concern_submissions(user_id);
CREATE INDEX idx_submissions_county ON concern_submissions(county);
CREATE INDEX idx_submissions_status ON concern_submissions(status);
CREATE INDEX idx_submissions_created ON concern_submissions(created_at DESC);

-- ============================================================================
-- 3. AUTOMATED DATA SOURCES TABLE
-- ============================================================================

CREATE TABLE concern_data_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_name TEXT NOT NULL UNIQUE,
  source_type TEXT CHECK (source_type IN ('social_media', 'news_api', 'polling', 'reddit', 'facebook_groups', 'manual', 'volunteer_form')),
  api_endpoint TEXT,
  api_key TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_sync TIMESTAMP WITH TIME ZONE,
  sync_frequency_minutes INTEGER DEFAULT 60,
  keywords_to_track TEXT[],
  geographic_focus TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE concern_data_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can manage data sources" ON concern_data_sources
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'Admin'
    )
  );

CREATE POLICY "Anyone can view active data sources" ON concern_data_sources
  FOR SELECT USING (is_active = true);

CREATE INDEX idx_sources_active ON concern_data_sources(is_active);
CREATE INDEX idx_sources_type ON concern_data_sources(source_type);

-- ============================================================================
-- 4. CONCERN METRICS / TRENDING TABLE
-- ============================================================================

CREATE TABLE concern_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concern_id UUID NOT NULL REFERENCES voter_concerns(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  mention_count INTEGER DEFAULT 0,
  frequency_score INTEGER,
  trending_direction TEXT CHECK (trending_direction IN ('trending_up', 'stable', 'trending_down')),
  data_sources TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(concern_id, date)
);

ALTER TABLE concern_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read concern metrics" ON concern_metrics FOR SELECT;

CREATE INDEX idx_metrics_concern ON concern_metrics(concern_id);
CREATE INDEX idx_metrics_date ON concern_metrics(date DESC);

-- ============================================================================
-- 5. SEEDING - NATIONAL CONCERNS
-- ============================================================================

INSERT INTO voter_concerns (level, concern_topic, description, what_they_say, frequency, demographic_group, geographic_area, source_type, impact_score, resolution_suggestion, is_trending)
VALUES
  ('national', 'Inflation & Cost of Living', 'Americans concerned about rising prices and affordability', 'Everything costs too much. Food, gas, rent - it''s all gone up.', 9, 'All groups', 'Nationwide', 'polling', 9, 'Share GOP economic policies, discuss inflation causes, highlight cost reduction initiatives', true),
  ('national', 'Border Security', 'National concern about immigration and border control', 'We need to secure our borders and control who comes in.', 9, 'All groups', 'Nationwide', 'polling', 9, 'Highlight GOP border security positions, discuss enforcement actions, share success stories', true),
  ('national', 'Crime & Safety', 'Americans concerned about crime rates and public safety', 'Crime is out of control. I don''t feel safe anymore.', 8, 'Urban residents, families', 'Major cities', 'polling', 9, 'Discuss law and order policies, highlight crime statistics, support law enforcement', true),
  ('national', 'Healthcare Costs', 'Rising healthcare costs and insurance affordability', 'Healthcare is unaffordable. Premiums keep going up.', 8, 'Families, seniors', 'Nationwide', 'polling', 8, 'Discuss healthcare reform proposals, share cost comparison data', false),
  ('national', 'Education - School Choice', 'Parents want more control over children''s education', 'Parents should have choice in where their kids go to school.', 7, 'Families with children', 'Nationwide', 'polling', 8, 'Promote school choice initiatives, highlight education freedom policies', false),
  ('national', 'Job Market & Wages', 'Concerns about job availability and wage stagnation', 'Jobs don''t pay enough to live on anymore.', 7, 'Working class, young professionals', 'Nationwide', 'polling', 7, 'Highlight job creation records, discuss wage growth statistics', false),
  ('national', 'Energy & Gas Prices', 'Concerns about energy costs and independence', 'Gas prices are killing my budget. We need energy independence.', 7, 'All groups', 'Nationwide', 'polling', 8, 'Discuss energy policy, highlight energy production, share cost comparison', true),
  ('national', 'Government Overreach', 'Concerns about government size and regulatory burden', 'Government is too big. They regulate everything.', 6, 'Business owners, conservatives', 'Nationwide', 'polling', 7, 'Discuss deregulation efforts, highlight government efficiency proposals', false);

-- ============================================================================
-- 6. SEEDING - GEORGIA STATE CONCERNS
-- ============================================================================

INSERT INTO voter_concerns (level, concern_topic, description, what_they_say, frequency, demographic_group, geographic_area, source_type, impact_score, resolution_suggestion)
VALUES
  ('state', 'Education Funding', 'Georgia voters concerned about school funding levels', 'Schools need better funding to improve education quality.', 8, 'Families with children', 'Suburban Georgia', 'volunteer_report', 8, 'Highlight Georgia''s education funding increases, discuss school choice initiatives like Hope Scholarship'),
  ('state', 'Traffic & Transportation', 'Georgia highway expansion and traffic management', 'I-85 and I-75 need serious investment. Traffic is terrible.', 8, 'Commuters, young professionals', 'Metro Atlanta', 'volunteer_report', 8, 'Discuss Georgia''s road improvement plans, highlight infrastructure investment initiatives'),
  ('state', 'Property Taxes', 'Concerns about property tax burden in Georgia', 'Property taxes are too high. People are being forced out.', 7, 'Homeowners, seniors', 'All areas', 'volunteer_report', 7, 'Discuss property tax relief proposals, share exemption information'),
  ('state', 'Healthcare Access', 'Rural health care availability and hospital closures', 'Rural areas don''t have access to good healthcare. Clinics are closing.', 7, 'Rural residents, seniors', 'Rural Georgia', 'volunteer_report', 8, 'Highlight healthcare expansion initiatives, discuss rural health support programs'),
  ('state', 'Agriculture Support', 'Concerns about farming viability and support', 'Farmers are struggling. We need better support.', 6, 'Farm families, rural', 'Rural Georgia', 'volunteer_report', 7, 'Discuss agricultural support programs, share subsidy information'),
  ('state', 'Voter ID & Election Integrity', 'Election security and voter identification concerns', 'We need to make sure elections are secure and fair.', 6, 'Conservative base', 'Statewide', 'admin_entry', 6, 'Explain Georgia''s voter ID law, discuss election security measures, share verification procedures'),
  ('state', 'Youth Opportunity', 'Jobs and opportunities for Georgia young adults', 'Young people are leaving Georgia for better jobs elsewhere.', 5, 'Young professionals, parents', 'Statewide', 'volunteer_report', 6, 'Highlight Georgia job growth, discuss entrepreneurship opportunities'),
  ('state', 'Broadband Access', 'Rural broadband expansion and digital equity', 'Rural areas still don''t have reliable internet.', 5, 'Rural residents, small business', 'Rural Georgia', 'admin_entry', 6, 'Discuss broadband expansion initiatives, share infrastructure investment plans');

-- ============================================================================
-- 7. SEEDING - LOCAL CONCERNS (MAJOR COUNTIES)
-- ============================================================================

-- FULTON COUNTY (Urban)
INSERT INTO voter_concerns (level, county, concern_topic, description, what_they_say, frequency, demographic_group, geographic_area, source_type, impact_score, mention_count, is_trending)
VALUES
  ('local', 'Fulton', 'I-85 Infrastructure', 'I-85 corridor deterioration causing traffic and safety concerns', 'I-85 is falling apart. Traffic is a nightmare every day.', 9, 'Young professionals, commuters', 'North I-85 corridor', 'volunteer_report', 9, 47, true),
  ('local', 'Fulton', 'MARTA Expansion', 'Public transportation inadequacy in metro Atlanta', 'MARTA doesn''t go where we need it. Public transit is terrible.', 8, 'Urban residents, commuters', 'Atlanta metro', 'volunteer_report', 8, 34, false),
  ('local', 'Fulton', 'Affordable Housing Crisis', 'Rising housing costs pushing residents out', 'Rent is insane. Nobody can afford to live in Atlanta anymore.', 9, 'Young professionals, families', 'All Atlanta areas', 'volunteer_report', 9, 52, true),
  ('local', 'Fulton', 'School Quality in APS', 'Atlanta Public Schools performance concerns', 'APS schools need serious improvement. Academics and safety.', 7, 'Families with children', 'Atlanta', 'volunteer_report', 8, 28, false);

-- GWINNETT COUNTY (Suburban/Growing)
INSERT INTO voter_concerns (level, county, concern_topic, description, what_they_say, frequency, demographic_group, geographic_area, source_type, impact_score, mention_count, is_trending)
VALUES
  ('local', 'Gwinnett', 'Population Growth Management', 'Rapid growth straining infrastructure and schools', 'Gwinnett is growing too fast. Schools and roads can''t keep up.', 8, 'Families, commuters', 'All of Gwinnett', 'volunteer_report', 8, 41, true),
  ('local', 'Gwinnett', 'School Overcrowding', 'Elementary and middle schools at capacity', 'Schools are packed. Class sizes are too big.', 8, 'Parents', 'Gwinnett schools', 'volunteer_report', 8, 38, false),
  ('local', 'Gwinnett', 'Road Congestion', 'Major routes congested during peak hours', 'I-285 and GA-400 are parking lots during rush hour.', 8, 'Commuters', 'Major corridors', 'volunteer_report', 8, 35, false);

-- COBB COUNTY (Conservative/Suburban)
INSERT INTO voter_concerns (level, county, concern_topic, description, what_they_say, frequency, demographic_group, geographic_area, source_type, impact_score, mention_count, is_trending)
VALUES
  ('local', 'Cobb', 'Property Taxes & Millage', 'Property tax increases and budget concerns', 'Property taxes are going up every year. This is too much.', 7, 'Homeowners', 'All of Cobb', 'volunteer_report', 7, 29, false),
  ('local', 'Cobb', 'School Curriculum', 'Concerns about education content and standards', 'We need to be careful about what''s being taught in schools.', 6, 'Parents, conservatives', 'Cobb schools', 'volunteer_report', 7, 23, false);

-- DEKALB COUNTY (Urban/Diverse)
INSERT INTO voter_concerns (level, county, concern_topic, description, what_they_say, frequency, demographic_group, geographic_area, source_type, impact_score, mention_count, is_trending)
VALUES
  ('local', 'DeKalb', 'Public Safety & Police', 'Crime rates and police department issues', 'Crime is a real problem. We need better police presence.', 8, 'All demographics', 'DeKalb cities', 'volunteer_report', 9, 44, true),
  ('local', 'DeKalb', 'Homeless Crisis', 'Homelessness and street population growth', 'Homelessness is out of control. It affects everyone.', 7, 'All demographics', 'Urban areas', 'volunteer_report', 7, 31, false);

-- CLAYTON COUNTY (Urban/South Atlanta)
INSERT INTO voter_concerns (level, county, concern_topic, description, what_they_say, frequency, demographic_group, geographic_area, source_type, impact_score, mention_count, is_trending)
VALUES
  ('local', 'Clayton', 'Job Opportunities', 'Limited local employment options', 'There aren''t enough good jobs here. People have to leave.', 7, 'Young professionals, working class', 'Clayton', 'volunteer_report', 7, 26, false),
  ('local', 'Clayton', 'School Safety', 'School security and student safety concerns', 'Schools need better security. Student safety is a concern.', 7, 'Parents, families', 'Clayton schools', 'volunteer_report', 8, 24, false);

-- HENRY COUNTY (Southeast Metro/Growing)
INSERT INTO voter_concerns (level, county, concern_topic, description, what_they_say, frequency, demographic_group, geographic_area, source_type, impact_score, mention_count, is_trending)
VALUES
  ('local', 'Henry', 'School Expansion Needs', 'Rapid growth requiring school capacity expansion', 'Henry is growing fast. Schools need to expand.', 7, 'Families', 'Henry county', 'volunteer_report', 7, 22, false),
  ('local', 'Henry', 'I-75 Traffic', 'Interstate 75 corridor congestion', 'I-75 traffic is getting worse every year.', 6, 'Commuters', 'I-75 corridor', 'volunteer_report', 7, 18, false);

-- COBB COUNTY - Additional
INSERT INTO voter_concerns (level, county, concern_topic, description, what_they_say, frequency, demographic_group, geographic_area, source_type, impact_score, mention_count)
VALUES
  ('local', 'Cobb', 'Marietta Downtown Development', 'Downtown revitalization and economic growth', 'Marietta downtown could be so much better developed.', 5, 'Business owners, residents', 'Marietta', 'volunteer_report', 6, 14);

-- RURAL COUNTIES - Sample
INSERT INTO voter_concerns (level, county, concern_topic, description, what_they_say, frequency, demographic_group, geographic_area, source_type, impact_score, mention_count)
VALUES
  ('local', 'Camden', 'Broadband Access', 'Rural internet infrastructure', 'We need reliable internet out here. It''s 2024.', 8, 'Rural residents, small business', 'Camden County', 'volunteer_report', 7, 19),
  ('local', 'Echols', 'Agricultural Support', 'Farming community viability', 'Farmers are struggling. We need better support.', 7, 'Farm families', 'Echols County', 'volunteer_report', 7, 15),
  ('local', 'Charlton', 'Rural Healthcare', 'Limited healthcare access', 'Nearest hospital is 45 minutes away. This is a problem.', 8, 'Seniors, rural residents', 'Charlton County', 'volunteer_report', 8, 12);

-- ============================================================================
-- 8. SEEDING - DATA SOURCES
-- ============================================================================

INSERT INTO concern_data_sources (source_name, source_type, is_active, sync_frequency_minutes, keywords_to_track, geographic_focus)
VALUES
  ('Georgia Facebook Groups', 'facebook_groups', true, 60, ARRAY['concerned', 'worried', 'problem with', 'frustrated', 'angry about'], ARRAY['Georgia', 'Atlanta', 'Metro', 'Rural']),
  ('Georgia News API', 'news_api', true, 120, ARRAY['Georgia', 'election', 'policy', 'law', 'voter', 'legislative'], ARRAY['Georgia', 'Southeast']),
  ('Reddit r/Georgia', 'reddit', true, 45, ARRAY['Georgia', 'Atlanta', 'concerned', 'frustrated', 'problem'], ARRAY['Georgia']),
  ('National Polling Data', 'polling', true, 1440, ARRAY['concern', 'important issue', 'worried about'], ARRAY['USA', 'Georgia']),
  ('Volunteer Form Submissions', 'volunteer_form', true, 15, ARRAY['voter concern', 'voter feedback'], ARRAY['Georgia']);

-- ============================================================================
-- 9. CREATE AUDIT LOG TABLE
-- ============================================================================

CREATE TABLE concern_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concern_id UUID REFERENCES voter_concerns(id),
  action TEXT CHECK (action IN ('created', 'updated', 'deleted', 'trending_flag', 'submission_approved', 'submission_rejected')),
  performed_by UUID REFERENCES auth.users(id),
  changes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE concern_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read audit log" ON concern_audit_log
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'Admin'
    )
  );

CREATE INDEX idx_audit_concern ON concern_audit_log(concern_id);
CREATE INDEX idx_audit_created ON concern_audit_log(created_at DESC);

-- ============================================================================
-- 10. CREATE NOTIFICATIONS TABLE (for trending alerts)
-- ============================================================================

CREATE TABLE concern_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  concern_id UUID REFERENCES voter_concerns(id),
  notification_type TEXT CHECK (notification_type IN ('new_trending', 'submission_received', 'submission_approved', 'trending_change', 'threshold_reached')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE concern_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications" ON concern_notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE INDEX idx_notifications_user ON concern_notifications(user_id);
CREATE INDEX idx_notifications_read ON concern_notifications(is_read);

-- ============================================================================
-- 11. TRIGGERS & FUNCTIONS
-- ============================================================================

-- Function to update trending status
CREATE OR REPLACE FUNCTION update_trending_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if mention_count increased by 30%+ since yesterday
  IF NEW.mention_count > COALESCE(OLD.mention_count, 0) * 1.3 THEN
    NEW.is_trending = TRUE;
    NEW.mentions_trend = 'trending_up';
  ELSIF NEW.mention_count < COALESCE(OLD.mention_count, 0) * 0.7 THEN
    NEW.mentions_trend = 'trending_down';
  ELSE
    NEW.mentions_trend = 'stable';
  END IF;
  
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_trending
BEFORE UPDATE ON voter_concerns
FOR EACH ROW
EXECUTE FUNCTION update_trending_status();

-- Function to create notification on trending
CREATE OR REPLACE FUNCTION notify_on_trending()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_trending AND NOT OLD.is_trending THEN
    INSERT INTO concern_notifications (user_id, concern_id, notification_type, title, message)
    SELECT 
      p.id,
      NEW.id,
      'new_trending',
      'New Trending Concern: ' || NEW.concern_topic,
      CASE 
        WHEN NEW.level = 'local' THEN 'New concern trending in ' || NEW.county || ': ' || NEW.what_they_say
        WHEN NEW.level = 'state' THEN 'New Georgia-wide trending concern: ' || NEW.what_they_say
        ELSE 'New national trending concern: ' || NEW.what_they_say
      END
    FROM profiles p
    WHERE p.role IN ('Coordinator', 'Leader', 'Admin')
    AND (NEW.level = 'national' OR p.county = NEW.county OR p.role = 'Admin');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_trending
AFTER UPDATE ON voter_concerns
FOR EACH ROW
EXECUTE FUNCTION notify_on_trending();

-- ============================================================================
-- 12. ANALYTICS VIEW
-- ============================================================================

CREATE VIEW concern_analytics AS
SELECT 
  level,
  county,
  concern_topic,
  COUNT(*) as total_concerns,
  AVG(frequency) as avg_frequency,
  SUM(mention_count) as total_mentions,
  COUNT(CASE WHEN is_trending THEN 1 END) as trending_count,
  MAX(updated_at) as last_updated
FROM voter_concerns
GROUP BY level, county, concern_topic
ORDER BY total_mentions DESC;

-- ============================================================================
-- DONE! Schema is ready for admin panel implementation
-- ============================================================================
