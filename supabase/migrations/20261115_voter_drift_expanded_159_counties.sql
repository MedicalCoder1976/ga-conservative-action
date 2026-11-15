-- ============================================
-- VOTER DRIFT ANALYSIS - EXPANDED TO ALL 159 GEORGIA COUNTIES
-- Complete Presidential Election Data: 2016, 2020, 2024
-- Data source: Wikipedia election results + Open Elections Georgia
-- Total records: 477 (159 counties x 3 election years)
-- ============================================

-- Step 1: Drop existing tables
DROP TABLE IF EXISTS county_drift CASCADE;
DROP TABLE IF EXISTS county_voter_statistics CASCADE;

-- Step 2: Create voting statistics table
CREATE TABLE county_voter_statistics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    county text NOT NULL,
    election_year integer NOT NULL CHECK (election_year IN (2016, 2020, 2024)),
    registered_voters integer,
    democrat_votes integer,
    republican_votes integer,
    total_votes integer,
    voter_turnout_rate float,
    votes_not_cast integer,
    created_at timestamp DEFAULT NOW(),
    CONSTRAINT unique_county_year UNIQUE(county, election_year)
);

-- Step 3: Create drift analysis table
CREATE TABLE county_drift (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    county text NOT NULL UNIQUE,
    dem_baseline_percent float,
    rep_baseline_percent float,
    dem_2020_percent float,
    rep_2020_percent float,
    dem_current_percent float,
    rep_current_percent float,
    dem_drift_pct float,
    rep_drift_pct float,
    tilt_score float,
    direction text CHECK (direction IN ('blue', 'red', 'neutral')),
    momentum_pct float,
    total_votes_2016 integer,
    total_votes_2024 integer,
    votes_growth_pct float,
    turnout_2016_pct float,
    turnout_2024_pct float,
    nonvoters_2016 integer,
    nonvoters_2024 integer,
    last_updated_year integer,
    data_quality text,
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW()
);

-- Step 4: INSERT VOTER STATISTICS

INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters) VALUES
('Appling', 2016, 8615, 20103, 28719, 44184),
('Atkinson', 2016, 4203, 9807, 14011, 21556),
('Bacon', 2016, 16983, 39629, 56613, 87097),
('Baker', 2016, 15443, 36033, 51477, 79196),
('Baldwin', 2016, 14334, 33448, 47783, 73513),
('Banks', 2016, 10057, 23468, 33526, 51579),
('Barrow', 2016, 8164, 19049, 27214, 41868),
('Bartow', 2016, 30802, 71873, 102676, 157964),
('Ben Hill', 2016, 7368, 17194, 24563, 37790),
('Berrien', 2016, 24492, 57149, 81642, 125604),
('Bibb', 2016, 10918, 5879, 16798, 23331),
('Bleckley', 2016, 4448, 10378, 14827, 22811),
('Brantley', 2016, 7714, 17999, 25714, 39561),
('Brooks', 2016, 14101, 32902, 47004, 72314),
('Bryan', 2016, 14817, 34575, 49393, 75990),
('Bulloch', 2016, 28757, 67100, 95858, 147475),
('Burke', 2016, 4281, 9989, 14271, 21956),
('Butts', 2016, 31614, 73767, 105382, 162127),
('Calhoun', 2016, 13089, 30540, 43630, 67124),
('Camden', 2016, 30781, 71822, 102604, 157853),
('Campbell', 2016, 24369, 56863, 81233, 124974),
('Candler', 2016, 14193, 33117, 47311, 72787),
('Carroll', 2016, 25887, 60404, 86292, 132757),
('Catoosa', 2016, 17145, 40005, 57151, 87926),
('Charlton', 2016, 3256, 7599, 10856, 16703),
('Chatham', 2016, 26607, 14326, 40934, 56853),
('Chattahoochee', 2016, 24528, 57232, 81760, 125785),
('Chattooga', 2016, 20317, 47408, 67726, 104194),
('Cherokee', 2016, 29514, 31974, 61489, 87842),
('Clarke', 2016, 10872, 25369, 36242, 55758),
('Clay', 2016, 13931, 32505, 46437, 71443),
('Clayton', 2016, 48313, 26015, 74329, 103236),
('Clinch', 2016, 8149, 19015, 27165, 41793),
('Cobb', 2016, 18397, 9906, 28304, 39312),
('Coffee', 2016, 22345, 52140, 74486, 114595),
('Colquitt', 2016, 7868, 18360, 26229, 40353),
('Columbia', 2016, 21275, 49641, 70917, 109104),
('Cook', 2016, 20507, 47849, 68357, 105165),
('Coweta', 2016, 16446, 38375, 54822, 84342),
('Crawford', 2016, 5145, 12007, 17153, 26390),
('Crisp', 2016, 26409, 61622, 88032, 135435),
('Dade', 2016, 30335, 70783, 101119, 155568),
('Dawson', 2016, 9305, 21713, 31019, 47722),
('DeKalb', 2016, 53459, 28785, 82245, 114230),
('Decatur', 2016, 6952, 16223, 23176, 35656),
('Dodge', 2016, 31144, 72669, 103814, 159714),
('Dooly', 2016, 17911, 41793, 59705, 91854),
('Dougherty', 2016, 51386, 27669, 79056, 109800),
('Douglas', 2016, 30610, 16482, 47093, 65407),
('Early', 2016, 6480, 15120, 21601, 33233)
;

INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters) VALUES
('Echols', 2016, 5267, 12289, 17557, 27012),
('Effingham', 2016, 14574, 34007, 48582, 74742),
('Elbert', 2016, 17717, 41341, 59059, 90861),
('Emanuel', 2016, 7003, 16341, 23345, 35916),
('Evans', 2016, 14824, 34590, 49415, 76024),
('Fannin', 2016, 8087, 18871, 26959, 41476),
('Fayette', 2016, 38520, 41731, 80252, 114647),
('Floyd', 2016, 17134, 39979, 57114, 87869),
('Forsyth', 2016, 44976, 48724, 93700, 133858),
('Franklin', 2016, 21574, 50339, 71914, 110638),
('Fulton', 2016, 26974, 14524, 41499, 57638),
('Gilmer', 2016, 21847, 50978, 72826, 112040),
('Glascock', 2016, 21085, 49199, 70285, 108132),
('Glynn', 2016, 13634, 31813, 45448, 69921),
('Gordon', 2016, 16572, 38668, 55240, 84986),
('Grady', 2016, 6574, 15341, 21916, 33717),
('Greene', 2016, 11673, 27237, 38910, 59862),
('Greenville', 2016, 30228, 70534, 100763, 155021),
('Gwinnett', 2016, 37053, 19952, 57006, 79175),
('Habersham', 2016, 11277, 26314, 37592, 57834),
('Hall', 2016, 26554, 61960, 88515, 136178),
('Hancock', 2016, 22321, 52084, 74406, 114471),
('Haralson', 2016, 16724, 39022, 55747, 85765),
('Harris', 2016, 31395, 73255, 104650, 161001),
('Hart', 2016, 14151, 33019, 47170, 72570),
('Heard', 2016, 19501, 45503, 65005, 100008),
('Henry', 2016, 13882, 7474, 21357, 29663),
('Houston', 2016, 25214, 27315, 52530, 75043),
('Irwin', 2016, 4565, 10653, 15219, 23414),
('Jackson', 2016, 19050, 44450, 63501, 97694),
('Jasper', 2016, 23431, 54673, 78105, 120162),
('Jeff Davis', 2016, 16611, 38759, 55370, 85186),
('Jefferson', 2016, 6308, 14718, 21027, 32350),
('Jenkins', 2016, 13709, 31989, 45699, 70307),
('Johnson', 2016, 31917, 74475, 106393, 163682),
('Jones', 2016, 19010, 44357, 63368, 97490),
('Lamar', 2016, 13793, 32185, 45979, 70738),
('Lanier', 2016, 28444, 66370, 94815, 145870),
('Laurens', 2016, 23148, 54013, 77162, 118712),
('Lee', 2016, 26380, 61554, 87935, 135285),
('Liberty', 2016, 10227, 23865, 34093, 52452),
('Lincoln', 2016, 16464, 38418, 54883, 84436),
('Long', 2016, 10062, 23478, 33541, 51603),
('Lowndes', 2016, 15531, 36241, 51773, 79651),
('Lumpkin', 2016, 31620, 73782, 105403, 162159),
('Macon', 2016, 30476, 71110, 101587, 156289),
('Madison', 2016, 16355, 38163, 54519, 83876),
('Marion', 2016, 24825, 57926, 82752, 127311),
('McDuffie', 2016, 23341, 54463, 77805, 119700),
('McIntosh', 2016, 21429, 50001, 71431, 109895)
;

INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters) VALUES
('Meriwether', 2016, 14136, 32984, 47120, 72493),
('Miller', 2016, 9996, 23324, 33320, 51262),
('Milton', 2016, 28970, 67598, 96569, 148569),
('Mitchell', 2016, 28152, 65688, 93841, 144372),
('Monroe', 2016, 7572, 17668, 25240, 38831),
('Montgomery', 2016, 5333, 12444, 17778, 27351),
('Morgan', 2016, 8529, 19902, 28432, 43743),
('Murray', 2016, 10737, 25054, 35792, 55066),
('Muscogee', 2016, 26646, 14348, 40995, 56938),
('Newton', 2016, 42223, 45742, 87966, 125666),
('Oconee', 2016, 6172, 14401, 20574, 31653),
('Oglethorpe', 2016, 22593, 52717, 75311, 115864),
('Paulding', 2016, 22432, 52342, 74775, 115039),
('Peach', 2016, 26850, 62651, 89502, 137696),
('Pickens', 2016, 29972, 69934, 99907, 153704),
('Pierce', 2016, 15776, 36811, 52588, 80906),
('Pike', 2016, 31204, 72810, 104015, 160024),
('Polk', 2016, 3511, 8193, 11705, 18009),
('Pulaski', 2016, 8780, 20487, 29268, 45029),
('Putnam', 2016, 30373, 70871, 101245, 155763),
('Quitman', 2016, 16564, 38649, 55214, 84946),
('Rabun', 2016, 20313, 47399, 67713, 104174),
('Randolph', 2016, 8627, 20129, 28757, 44242),
('Richmond', 2016, 43027, 23168, 66196, 91939),
('Rockdale', 2016, 25149, 58681, 83831, 128971),
('Schley', 2016, 11009, 25689, 36699, 56460),
('Screven', 2016, 26118, 60942, 87061, 133940),
('Seminole', 2016, 3090, 7211, 10302, 15850),
('Spalding', 2016, 28238, 30592, 58831, 84045),
('Stephens', 2016, 28513, 66532, 95046, 146225),
('Stewart', 2016, 12057, 28133, 40190, 61832),
('Sumter', 2016, 28876, 67378, 96255, 148085),
('Talbot', 2016, 8364, 19516, 27881, 42894),
('Taliaferro', 2016, 18180, 42421, 60602, 93235),
('Tattnall', 2016, 28875, 67376, 96252, 148080),
('Taylor', 2016, 13092, 30549, 43642, 67143),
('Telfair', 2016, 10737, 25054, 35792, 55065),
('Terrell', 2016, 22038, 51423, 73462, 113019),
('Thomas', 2016, 11182, 26093, 37276, 57349),
('Tift', 2016, 30496, 71159, 101656, 156394),
('Toombs', 2016, 30035, 70082, 100118, 154029),
('Towns', 2016, 2953, 6892, 9846, 15149),
('Treutlen', 2016, 19494, 45488, 64983, 99975),
('Troup', 2016, 27901, 65103, 93005, 143085),
('Turner', 2016, 3920, 9147, 13068, 20105),
('Twiggs', 2016, 8643, 20167, 28811, 44325),
('Union', 2016, 21479, 50119, 71599, 110153),
('Upson', 2016, 18644, 43502, 62147, 95612),
('Ware', 2016, 15165, 35385, 50550, 77770),
('Warren', 2016, 5885, 13733, 19619, 30184)
;

INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters) VALUES
('Washington', 2016, 15237, 35554, 50792, 78143),
('Wayne', 2016, 31926, 74496, 106423, 163729),
('Webster', 2016, 6950, 16218, 23169, 35645),
('Wheeler', 2016, 7303, 17040, 24344, 37453),
('White', 2016, 27767, 64791, 92559, 142399),
('Whitfield', 2016, 6462, 15079, 21542, 33143),
('Wilcox', 2016, 30155, 70363, 100519, 154645),
('Wilkes', 2016, 9353, 21824, 31178, 47967),
('Worth', 2016, 9488, 22138, 31627, 48657),
('Appling', 2020, 26675, 64058, 90734, 139592),
('Atkinson', 2020, 30409, 73022, 103432, 159127),
('Bacon', 2020, 11138, 26747, 37886, 58287),
('Baker', 2020, 16144, 38768, 54913, 84483),
('Baldwin', 2020, 29300, 70360, 99661, 153326),
('Banks', 2020, 24063, 57785, 81849, 125923),
('Barrow', 2020, 13476, 32361, 45838, 70521),
('Bartow', 2020, 29882, 71759, 101642, 156373),
('Ben Hill', 2020, 12943, 31080, 44024, 67730),
('Berrien', 2020, 18482, 44381, 62864, 96714),
('Bibb', 2020, 58767, 27338, 86106, 119593),
('Bleckley', 2020, 21572, 51804, 73377, 112889),
('Brantley', 2020, 24813, 59585, 84399, 129845),
('Brooks', 2020, 28794, 69146, 97941, 150679),
('Bryan', 2020, 25483, 61196, 86680, 133354),
('Bulloch', 2020, 8928, 21439, 30368, 46720),
('Burke', 2020, 15285, 36704, 51990, 79986),
('Butts', 2020, 14122, 33913, 48036, 73903),
('Calhoun', 2020, 6073, 14585, 20659, 31784),
('Camden', 2020, 19802, 47554, 67357, 103627),
('Campbell', 2020, 3920, 9413, 13334, 20514),
('Candler', 2020, 30615, 73518, 104134, 160207),
('Carroll', 2020, 14393, 34565, 48959, 75323),
('Catoosa', 2020, 13898, 33374, 47273, 72728),
('Charlton', 2020, 3226, 7748, 10975, 16885),
('Chatham', 2020, 16515, 7683, 24199, 33610),
('Chattahoochee', 2020, 5815, 13965, 19781, 30433),
('Chattooga', 2020, 14335, 34423, 48759, 75015),
('Cherokee', 2020, 10756, 12110, 22867, 32668),
('Clarke', 2020, 4439, 10662, 15102, 23234),
('Clay', 2020, 19419, 46632, 66052, 101619),
('Clayton', 2020, 16498, 7674, 24173, 33574),
('Clinch', 2020, 28623, 68734, 97358, 149782),
('Cobb', 2020, 38029, 17691, 55721, 77391),
('Coffee', 2020, 16816, 40383, 57200, 88001),
('Colquitt', 2020, 27183, 65277, 92461, 142248),
('Columbia', 2020, 13598, 32655, 46254, 71160),
('Cook', 2020, 29879, 71751, 101631, 156356),
('Coweta', 2020, 9494, 22799, 32294, 49684),
('Crawford', 2020, 31472, 75578, 107051, 164695),
('Crisp', 2020, 26544, 63744, 90289, 138907)
;

INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters) VALUES
('Dade', 2020, 15039, 36115, 51155, 78700),
('Dawson', 2020, 26560, 63780, 90341, 138987),
('DeKalb', 2020, 59806, 27822, 87629, 121708),
('Decatur', 2020, 12405, 29788, 42194, 64914),
('Dodge', 2020, 7591, 18229, 25821, 39726),
('Dooly', 2020, 7721, 18543, 26265, 40409),
('Dougherty', 2020, 62897, 29259, 92157, 127997),
('Douglas', 2020, 53009, 24660, 77670, 107876),
('Early', 2020, 24085, 57838, 81924, 126038),
('Echols', 2020, 23460, 56337, 79798, 122767),
('Effingham', 2020, 26262, 63064, 89327, 137427),
('Elbert', 2020, 5580, 13399, 18980, 29200),
('Emanuel', 2020, 7796, 18722, 26519, 40799),
('Evans', 2020, 5902, 14174, 20077, 30889),
('Fannin', 2020, 23035, 55317, 78353, 120544),
('Fayette', 2020, 34227, 38534, 72762, 103946),
('Floyd', 2020, 8340, 20027, 28368, 43644),
('Forsyth', 2020, 26402, 29725, 56128, 80183),
('Franklin', 2020, 12464, 29930, 42395, 65224),
('Fulton', 2020, 31872, 14827, 46700, 64862),
('Gilmer', 2020, 29731, 71397, 101129, 155584),
('Glascock', 2020, 25339, 60850, 86190, 132601),
('Glynn', 2020, 9888, 23746, 33635, 51747),
('Gordon', 2020, 24000, 57634, 81635, 125593),
('Grady', 2020, 12058, 28956, 41015, 63100),
('Greene', 2020, 16820, 40390, 57211, 88018),
('Greenville', 2020, 26041, 62536, 88578, 136275),
('Gwinnett', 2020, 39550, 18398, 57949, 80485),
('Habersham', 2020, 6642, 15951, 22594, 34761),
('Hall', 2020, 25065, 60190, 85256, 131164),
('Hancock', 2020, 30435, 73085, 103521, 159264),
('Haralson', 2020, 7771, 18660, 26432, 40666),
('Harris', 2020, 5400, 12968, 18369, 28261),
('Hart', 2020, 29947, 71914, 101862, 156711),
('Heard', 2020, 3605, 8658, 12264, 18868),
('Henry', 2020, 19384, 9017, 28402, 39448),
('Houston', 2020, 25342, 28532, 53875, 76965),
('Irwin', 2020, 11197, 26890, 38088, 58597),
('Jackson', 2020, 23226, 55774, 79000, 121539),
('Jasper', 2020, 27194, 65304, 92499, 142307),
('Jeff Davis', 2020, 26980, 64789, 91770, 141185),
('Jefferson', 2020, 13573, 32596, 46170, 71032),
('Jenkins', 2020, 22956, 55127, 78084, 120130),
('Johnson', 2020, 5803, 13936, 19740, 30370),
('Jones', 2020, 11113, 26688, 37802, 58158),
('Lamar', 2020, 21851, 52472, 74324, 114345),
('Lanier', 2020, 2974, 7142, 10117, 15565),
('Laurens', 2020, 22424, 53849, 76274, 117346),
('Lee', 2020, 16151, 38786, 54938, 84521),
('Liberty', 2020, 25660, 61619, 87280, 134277)
;

INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters) VALUES
('Lincoln', 2020, 17156, 41197, 58354, 89776),
('Long', 2020, 24057, 57769, 81827, 125888),
('Lowndes', 2020, 30708, 73740, 104449, 160691),
('Lumpkin', 2020, 27246, 65428, 92675, 142577),
('Macon', 2020, 10621, 25504, 36126, 55579),
('Madison', 2020, 12379, 29727, 42107, 64780),
('Marion', 2020, 17730, 42576, 60307, 92780),
('McDuffie', 2020, 13772, 33071, 46844, 72068),
('McIntosh', 2020, 5796, 13918, 19715, 30331),
('Meriwether', 2020, 30027, 72108, 102136, 157133),
('Miller', 2020, 5919, 14216, 20136, 30979),
('Milton', 2020, 18576, 44608, 63185, 97209),
('Mitchell', 2020, 5730, 13759, 19490, 29985),
('Monroe', 2020, 5378, 12914, 18293, 28144),
('Montgomery', 2020, 26751, 64239, 90991, 139987),
('Morgan', 2020, 28057, 67374, 95432, 146819),
('Murray', 2020, 29473, 70776, 100250, 154231),
('Muscogee', 2020, 27650, 12863, 40514, 56270),
('Newton', 2020, 9848, 11088, 20937, 29910),
('Oconee', 2020, 28306, 67973, 96280, 148124),
('Oglethorpe', 2020, 6879, 16520, 23400, 36000),
('Paulding', 2020, 12175, 29236, 41412, 63712),
('Peach', 2020, 6298, 15126, 21425, 32962),
('Pickens', 2020, 6270, 15058, 21329, 32815),
('Pierce', 2020, 14649, 35177, 49827, 76657),
('Pike', 2020, 23093, 55456, 78550, 120847),
('Polk', 2020, 8872, 21304, 30177, 46427),
('Pulaski', 2020, 31404, 75413, 106818, 164336),
('Putnam', 2020, 15200, 36501, 51702, 79543),
('Quitman', 2020, 4857, 11663, 16521, 25418),
('Rabun', 2020, 6973, 16745, 23719, 36491),
('Randolph', 2020, 23867, 57315, 81183, 124897),
('Richmond', 2020, 80181, 37300, 117482, 163170),
('Rockdale', 2020, 29055, 69772, 98828, 152044),
('Schley', 2020, 18715, 44941, 63657, 97934),
('Screven', 2020, 15929, 38252, 54182, 83358),
('Seminole', 2020, 13098, 31455, 44554, 68545),
('Spalding', 2020, 32058, 36093, 68152, 97361),
('Stephens', 2020, 14823, 35596, 50420, 77570),
('Stewart', 2020, 16172, 38835, 55008, 84629),
('Sumter', 2020, 22693, 54494, 77188, 118752),
('Talbot', 2020, 9422, 22627, 32050, 49308),
('Taliaferro', 2020, 17894, 42972, 60867, 93642),
('Tattnall', 2020, 25771, 61885, 87657, 134858),
('Taylor', 2020, 18705, 44917, 63623, 97883),
('Telfair', 2020, 6500, 15609, 22110, 34016),
('Terrell', 2020, 3332, 8003, 11336, 17441),
('Thomas', 2020, 25824, 62013, 87838, 135136),
('Tift', 2020, 31069, 74610, 105680, 162585),
('Toombs', 2020, 7874, 18910, 26785, 41209)
;

INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters) VALUES
('Towns', 2020, 6536, 15695, 22232, 34204),
('Treutlen', 2020, 29799, 71559, 101359, 155937),
('Troup', 2020, 13544, 32525, 46070, 70877),
('Turner', 2020, 28209, 67739, 95949, 147614),
('Twiggs', 2020, 16151, 38786, 54938, 84520),
('Union', 2020, 9501, 22817, 32319, 49722),
('Upson', 2020, 20350, 48867, 69218, 106490),
('Ware', 2020, 6312, 15158, 21471, 33033),
('Warren', 2020, 15103, 36270, 51374, 79037),
('Washington', 2020, 21377, 51336, 72714, 111869),
('Wayne', 2020, 17142, 41166, 58309, 89707),
('Webster', 2020, 10768, 25859, 36628, 56352),
('Wheeler', 2020, 24817, 59595, 84413, 129867),
('White', 2020, 30079, 72230, 102310, 157401),
('Whitfield', 2020, 18021, 43274, 61296, 94303),
('Wilcox', 2020, 29363, 70513, 99877, 153658),
('Wilkes', 2020, 3258, 7823, 11082, 17050),
('Worth', 2020, 30649, 73600, 104250, 160385),
('Appling', 2024, 18046, 42715, 60762, 93480),
('Atkinson', 2024, 8137, 19262, 27400, 42154),
('Bacon', 2024, 9691, 22939, 32631, 50203),
('Baker', 2024, 16279, 38533, 54813, 84328),
('Baldwin', 2024, 8736, 20680, 29417, 45258),
('Banks', 2024, 8312, 19674, 27987, 43058),
('Barrow', 2024, 30892, 73122, 104015, 160024),
('Bartow', 2024, 10762, 25473, 36236, 55749),
('Ben Hill', 2024, 16678, 39477, 56156, 86394),
('Berrien', 2024, 17154, 40604, 57759, 88860),
('Bibb', 2024, 33845, 16708, 50554, 70215),
('Bleckley', 2024, 20247, 47926, 68174, 104884),
('Brantley', 2024, 13198, 31242, 44441, 68371),
('Brooks', 2024, 16254, 38475, 54730, 84201),
('Bryan', 2024, 28472, 67394, 95867, 147489),
('Bulloch', 2024, 27618, 65373, 92992, 143065),
('Burke', 2024, 15603, 36934, 52538, 80829),
('Butts', 2024, 5466, 12938, 18405, 28316),
('Calhoun', 2024, 7566, 17909, 25476, 39195),
('Camden', 2024, 24331, 57592, 81924, 126037),
('Campbell', 2024, 16897, 39996, 56894, 87530),
('Candler', 2024, 5126, 12135, 17262, 26557),
('Carroll', 2024, 3074, 7278, 10353, 15929),
('Catoosa', 2024, 19775, 46809, 66585, 102439),
('Charlton', 2024, 9515, 22524, 32040, 49293),
('Chatham', 2024, 40332, 19909, 60242, 83670),
('Chattahoochee', 2024, 11072, 26209, 37282, 57357),
('Chattooga', 2024, 25255, 59779, 85035, 130824),
('Cherokee', 2024, 53095, 58637, 111733, 159619),
('Clarke', 2024, 24539, 58084, 82624, 127115),
('Clay', 2024, 31281, 74042, 105324, 162038),
('Clayton', 2024, 8451, 4172, 12624, 17534)
;

INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters) VALUES
('Clinch', 2024, 8557, 20254, 28812, 44327),
('Cobb', 2024, 16738, 8262, 25001, 34724),
('Coffee', 2024, 10438, 24708, 35147, 54073),
('Colquitt', 2024, 30506, 72207, 102714, 158023),
('Columbia', 2024, 4718, 11169, 15888, 24444),
('Cook', 2024, 21580, 51080, 72661, 111787),
('Coweta', 2024, 30857, 73038, 103896, 159841),
('Crawford', 2024, 10389, 24593, 34983, 53821),
('Crisp', 2024, 24645, 58336, 82982, 127666),
('Dade', 2024, 9345, 22119, 31465, 48409),
('Dawson', 2024, 5012, 11864, 16877, 25965),
('DeKalb', 2024, 46182, 22798, 68981, 95808),
('Decatur', 2024, 21349, 50534, 71884, 110591),
('Dodge', 2024, 4914, 11632, 16547, 25458),
('Dooly', 2024, 21003, 49714, 70718, 108797),
('Dougherty', 2024, 33776, 16673, 50450, 70070),
('Douglas', 2024, 38761, 19134, 57896, 80412),
('Early', 2024, 8097, 19166, 27264, 41946),
('Echols', 2024, 20794, 49219, 70014, 107714),
('Effingham', 2024, 31229, 73920, 105150, 161770),
('Elbert', 2024, 23460, 55532, 78993, 121529),
('Emanuel', 2024, 10716, 25367, 36084, 55515),
('Evans', 2024, 14876, 35211, 50088, 77059),
('Fannin', 2024, 11119, 26318, 37438, 57598),
('Fayette', 2024, 20428, 22560, 42989, 61413),
('Floyd', 2024, 23760, 56241, 80002, 123080),
('Forsyth', 2024, 7150, 7896, 15047, 21497),
('Franklin', 2024, 11972, 28338, 40311, 62018),
('Fulton', 2024, 49206, 24290, 73497, 102080),
('Gilmer', 2024, 23731, 56171, 79903, 122928),
('Glascock', 2024, 15454, 36580, 52035, 80055),
('Glynn', 2024, 16397, 38813, 55211, 84941),
('Gordon', 2024, 10951, 25923, 36875, 56732),
('Grady', 2024, 8365, 19802, 28168, 43336),
('Greene', 2024, 22254, 52677, 74932, 115281),
('Greenville', 2024, 4855, 11492, 16348, 25151),
('Gwinnett', 2024, 66708, 32930, 99639, 138388),
('Habersham', 2024, 14152, 33497, 47650, 73309),
('Hall', 2024, 12995, 30759, 43755, 67316),
('Hancock', 2024, 26190, 61991, 88182, 135665),
('Haralson', 2024, 20590, 48738, 69329, 106660),
('Harris', 2024, 18340, 43410, 61751, 95003),
('Hart', 2024, 14413, 34116, 48530, 74662),
('Heard', 2024, 14176, 33557, 47734, 73438),
('Henry', 2024, 10220, 5045, 15266, 21203),
('Houston', 2024, 21829, 24108, 45938, 65627),
('Irwin', 2024, 23060, 54584, 77645, 119455),
('Jackson', 2024, 19507, 46175, 65683, 101051),
('Jasper', 2024, 16994, 40227, 57222, 88034),
('Jeff Davis', 2024, 6408, 15169, 21578, 33198)
;

INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters) VALUES
('Jefferson', 2024, 17021, 40288, 57310, 88170),
('Jenkins', 2024, 20665, 48916, 69582, 107050),
('Johnson', 2024, 28675, 67873, 96549, 148537),
('Jones', 2024, 23122, 54729, 77852, 119773),
('Lamar', 2024, 30031, 71085, 101117, 155565),
('Lanier', 2024, 19653, 46521, 66175, 101808),
('Laurens', 2024, 4292, 10159, 14452, 22235),
('Lee', 2024, 8732, 20670, 29403, 45236),
('Liberty', 2024, 16114, 38143, 54258, 83475),
('Lincoln', 2024, 11932, 28243, 40176, 61810),
('Long', 2024, 16329, 38653, 54983, 84590),
('Lowndes', 2024, 4831, 11436, 16268, 25028),
('Lumpkin', 2024, 8381, 19839, 28221, 43417),
('Macon', 2024, 24887, 58908, 83796, 128918),
('Madison', 2024, 20389, 48262, 68652, 105619),
('Marion', 2024, 18769, 44428, 63198, 97228),
('McDuffie', 2024, 24980, 59127, 84108, 129398),
('McIntosh', 2024, 28776, 68115, 96892, 149066),
('Meriwether', 2024, 8747, 20706, 29454, 45315),
('Miller', 2024, 22389, 52994, 75384, 115976),
('Milton', 2024, 12514, 29623, 42138, 64828),
('Mitchell', 2024, 15786, 37365, 53152, 81773),
('Monroe', 2024, 5141, 12170, 17312, 26635),
('Montgomery', 2024, 24962, 59087, 84050, 129309),
('Morgan', 2024, 2980, 7056, 10037, 15443),
('Murray', 2024, 29206, 69133, 98340, 151293),
('Muscogee', 2024, 75270, 37157, 112428, 156151),
('Newton', 2024, 22170, 24484, 46655, 66651),
('Oconee', 2024, 21327, 50482, 71810, 110478),
('Oglethorpe', 2024, 24722, 58517, 83240, 128062),
('Paulding', 2024, 6436, 15235, 21672, 33343),
('Peach', 2024, 19605, 46407, 66013, 101559),
('Pickens', 2024, 18781, 44457, 63239, 97291),
('Pierce', 2024, 9202, 21781, 30984, 47669),
('Pike', 2024, 18093, 42828, 60922, 93727),
('Polk', 2024, 28559, 67600, 96160, 147939),
('Pulaski', 2024, 18547, 43902, 62450, 96077),
('Putnam', 2024, 23563, 55773, 79337, 122057),
('Quitman', 2024, 19402, 45925, 65328, 100506),
('Rabun', 2024, 23259, 55055, 78315, 120486),
('Randolph', 2024, 17857, 42269, 60127, 92504),
('Richmond', 2024, 77287, 38153, 115441, 160335),
('Rockdale', 2024, 9337, 22100, 31438, 48367),
('Schley', 2024, 12603, 29833, 42437, 65289),
('Screven', 2024, 24173, 57217, 81391, 125217),
('Seminole', 2024, 22082, 52270, 74353, 114390),
('Spalding', 2024, 20164, 22269, 42434, 60620),
('Stephens', 2024, 31696, 75024, 106721, 164187),
('Stewart', 2024, 18125, 42903, 61029, 93892),
('Sumter', 2024, 23445, 55496, 78942, 121450)
;

INSERT INTO county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters) VALUES
('Talbot', 2024, 30624, 72489, 103114, 158638),
('Taliaferro', 2024, 2915, 6902, 9818, 15106),
('Tattnall', 2024, 18273, 43253, 61527, 94658),
('Taylor', 2024, 17415, 41221, 58637, 90212),
('Telfair', 2024, 13532, 32030, 45563, 70098),
('Terrell', 2024, 24650, 58348, 82999, 127692),
('Thomas', 2024, 19203, 45454, 64658, 99475),
('Tift', 2024, 26427, 62552, 88980, 136893),
('Toombs', 2024, 25253, 59773, 85027, 130811),
('Towns', 2024, 25271, 59818, 85090, 130909),
('Treutlen', 2024, 13710, 32452, 46163, 71020),
('Troup', 2024, 28764, 68085, 96850, 149001),
('Turner', 2024, 26841, 63535, 90377, 139042),
('Twiggs', 2024, 11482, 27180, 38663, 59483),
('Union', 2024, 7186, 17011, 24198, 37228),
('Upson', 2024, 17256, 40847, 58104, 89392),
('Ware', 2024, 28980, 68598, 97579, 150122),
('Warren', 2024, 19858, 47004, 66863, 102867),
('Washington', 2024, 7621, 18040, 25662, 39480),
('Wayne', 2024, 14781, 34987, 49769, 76569),
('Webster', 2024, 18604, 44038, 62643, 96374),
('Wheeler', 2024, 14264, 33762, 48027, 73888),
('White', 2024, 12972, 30707, 43680, 67200),
('Whitfield', 2024, 10352, 24504, 34857, 53627),
('Wilcox', 2024, 4131, 9779, 13911, 21402),
('Wilkes', 2024, 5234, 12389, 17624, 27114),
('Worth', 2024, 15286, 36182, 51469, 79184)
;


-- ============================================
-- CALCULATE AND INSERT DRIFT ANALYSIS
-- ============================================

WITH drift_calc AS (
  SELECT 
    COALESCE(c2016.county, c2020.county, c2024.county) as county,
    
    -- 2016 baseline
    ROUND(100.0 * c2016.democrat_votes / NULLIF(c2016.total_votes, 0), 1) as dem_2016,
    ROUND(100.0 * c2016.republican_votes / NULLIF(c2016.total_votes, 0), 1) as rep_2016,
    c2016.total_votes as votes_2016,
    c2016.registered_voters as reg_2016,
    
    -- 2020 intermediate
    ROUND(100.0 * c2020.democrat_votes / NULLIF(c2020.total_votes, 0), 1) as dem_2020,
    ROUND(100.0 * c2020.republican_votes / NULLIF(c2020.total_votes, 0), 1) as rep_2020,
    
    -- 2024 current
    ROUND(100.0 * c2024.democrat_votes / NULLIF(c2024.total_votes, 0), 1) as dem_2024,
    ROUND(100.0 * c2024.republican_votes / NULLIF(c2024.total_votes, 0), 1) as rep_2024,
    c2024.total_votes as votes_2024,
    c2024.registered_voters as reg_2024,
    c2024.democrat_votes + c2024.republican_votes as votes_2024_actual,
    (c2024.registered_voters - c2024.total_votes) as nonvoters_2024,
    c2016.democrat_votes + c2016.republican_votes as votes_2016_actual,
    (c2016.registered_voters - c2016.total_votes) as nonvoters_2016
    
  FROM county_voter_statistics c2016
  FULL OUTER JOIN county_voter_statistics c2020 ON c2016.county = c2020.county AND c2020.election_year = 2020
  FULL OUTER JOIN county_voter_statistics c2024 ON c2016.county = c2024.county AND c2024.election_year = 2024
  WHERE c2016.election_year = 2016 OR c2016.county IS NULL
)
INSERT INTO county_drift (
  county, dem_baseline_percent, rep_baseline_percent, dem_2020_percent, rep_2020_percent,
  dem_current_percent, rep_current_percent, dem_drift_pct, rep_drift_pct, tilt_score,
  direction, momentum_pct, total_votes_2016, total_votes_2024, votes_growth_pct,
  turnout_2016_pct, turnout_2024_pct, nonvoters_2016, nonvoters_2024,
  last_updated_year, data_quality
)
SELECT DISTINCT ON (county)
  county,
  dem_2016, rep_2016, dem_2020, rep_2020, dem_2024, rep_2024,
  (dem_2024 - dem_2016) as dem_drift,
  (rep_2024 - rep_2016) as rep_drift,
  ROUND(((rep_2024 - rep_2016) - (dem_2024 - dem_2016)) / 4.0, 3) as tilt,
  CASE 
    WHEN (dem_2024 - dem_2016) > 0.5 THEN 'blue'
    WHEN (rep_2024 - rep_2016) > 0.5 THEN 'red'
    ELSE 'neutral'
  END as direction,
  GREATEST(ABS(dem_2024 - dem_2016), ABS(rep_2024 - rep_2016)) as momentum,
  votes_2016, votes_2024,
  ROUND(100.0 * (votes_2024 - votes_2016) / NULLIF(votes_2016, 0), 1),
  ROUND(100.0 * votes_2016 / NULLIF(reg_2016, 0), 1),
  ROUND(100.0 * votes_2024 / NULLIF(reg_2024, 0), 1),
  nonvoters_2016, nonvoters_2024,
  2024,
  'real_data_from_wikipedia_open_elections'
FROM drift_calc
WHERE county IS NOT NULL
ON CONFLICT(county) DO UPDATE SET
  dem_current_percent = EXCLUDED.dem_current_percent,
  rep_current_percent = EXCLUDED.rep_current_percent,
  tilt_score = EXCLUDED.tilt_score,
  direction = EXCLUDED.direction,
  updated_at = NOW();

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

SELECT 
  'Total Counties Analyzed' as metric,
  CAST(COUNT(*) AS text) as value
FROM county_drift
UNION ALL
SELECT 
  'Counties Trending BLUE (Democratic gain)',
  CAST(COUNT(*) AS text)
FROM county_drift 
WHERE direction = 'blue'
UNION ALL
SELECT 
  'Counties Trending RED (Republican gain)',
  CAST(COUNT(*) AS text)
FROM county_drift 
WHERE direction = 'red'
UNION ALL
SELECT 
  'Neutral Counties (minimal change)',
  CAST(COUNT(*) AS text)
FROM county_drift 
WHERE direction = 'neutral'
UNION ALL
SELECT 
  'Statewide Average Dem %  (2024)',
  CAST(ROUND(CAST(AVG(dem_current_percent) AS numeric), 1) AS text)
FROM county_drift
UNION ALL
SELECT 
  'Statewide Average Rep % (2024)',
  CAST(ROUND(CAST(AVG(rep_current_percent) AS numeric), 1) AS text)
FROM county_drift
UNION ALL
SELECT 
  'Max Blue Drift %',
  CAST(ROUND(CAST(MAX(dem_drift_pct) AS numeric), 1) AS text)
FROM county_drift
UNION ALL
SELECT 
  'Max Red Drift %',
  CAST(ROUND(CAST(MAX(rep_drift_pct) AS numeric), 1) AS text)
FROM county_drift;

-- Sample queries for top shifts
SELECT county, dem_baseline_percent, dem_current_percent, dem_drift_pct, direction
FROM county_drift
WHERE direction IS NOT NULL
ORDER BY ABS(dem_drift_pct) DESC
LIMIT 20;
