-- Seed Republican Party Leadership Data for Georgia
-- State, Regional, and County Levels

-- State Level Leadership
INSERT INTO party_leaders (name, title, level, contact_email, contact_phone) VALUES
  ('David Shafer', 'State GOP Chairman', 'state', 'chair@gagop.org', '(404) 555-0100'),
  ('Brad Raffensperger', 'Secretary of State', 'state', 'sos@sos.ga.gov', '(404) 656-2881'),
  ('Burt Jones', 'Lieutenant Governor', 'state', 'ltgov@ltg.ga.gov', '(404) 656-5030'),
  ('Brian Kemp', 'Governor', 'state', 'governor@gov.ga.gov', '(404) 656-1776');

-- Regional Leadership - Congressional Districts (Sample)
INSERT INTO party_leaders (name, title, level, district, contact_email) VALUES
  ('District 1 Director', 'Congressional District Director', 'regional', 'District 1', 'district1@gagop.org'),
  ('District 3 Director', 'Congressional District Director', 'regional', 'District 3', 'district3@gagop.org'),
  ('District 6 Director', 'Congressional District Director', 'regional', 'District 6', 'district6@gagop.org'),
  ('District 13 Director', 'Congressional District Director', 'regional', 'District 13', 'district13@gagop.org');

-- County Level Leadership (Sample - Add all 159 counties as needed)
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
  ('Christopher Jackson', 'Muscogee County GOP Chairman', 'county', 'Muscogee', 'chair@muscogee gop.org', '(706) 555-0113');

-- Add more counties as needed...
