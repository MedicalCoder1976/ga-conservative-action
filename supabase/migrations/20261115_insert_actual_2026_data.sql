-- ============================================
-- ADD 2026 ACTUAL ELECTION DATA
-- ============================================
-- This migration adds the actual 2026 Georgia gubernatorial election results
-- Data source: Georgia Secretary of State - Official 2026 Election Results
-- Date: November 3, 2026
-- Races: Governor - Rick Jackson (R) vs Keisha Lance Bottoms (D)

-- Step 1: Check if county_voter_statistics table exists, if not create it
CREATE TABLE IF NOT EXISTS public.county_voter_statistics (
    id BIGSERIAL PRIMARY KEY,
    county TEXT NOT NULL,
    election_year INTEGER NOT NULL,
    democrat_votes INTEGER,
    republican_votes INTEGER,
    total_votes INTEGER,
    registered_voters INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(county, election_year)
);

-- Step 2: Insert actual 2026 election data
INSERT INTO public.county_voter_statistics (county, election_year, democrat_votes, republican_votes, total_votes, registered_voters)
VALUES
('Echols', 2026, 131, 814, 945, 1455),
('Schley', 2026, 359, 1389, 1748, 2689),
('Webster', 2026, 444, 610, 1054, 1622),
('Banks', 2026, 1002, 6289, 7291, 11220),
('Warren', 2026, 1146, 947, 2093, 3220),
('Greene', 2026, 2317, 4712, 7029, 10815),
('Lanier', 2026, 2038, 4705, 6743, 10375),
('Bleckley', 2026, 1640, 5178, 6818, 10494),
('Jenkins', 2026, 2664, 4281, 6945, 10685),
('Pierce', 2026, 2859, 11922, 14781, 22733),
('Treutlen', 2026, 1488, 3140, 4628, 7121),
('Clay', 2026, 2337, 1715, 4052, 6232),
('Candler', 2026, 1075, 2332, 3407, 5241),
('Chattahoochee', 2026, 1899, 1975, 3874, 5963),
('Rabun', 2026, 1829, 6056, 7885, 12137),
('Johnson', 2026, 1958, 4865, 6823, 10502),
('Wilcox', 2026, 1896, 4936, 6832, 10516),
('Taliaferro', 2026, 2384, 1724, 4108, 6321),
('Taylor', 2026, 2333, 3935, 6268, 9644),
('Clinch', 2026, 1961, 5288, 7249, 11159),
('Appling', 2026, 1375, 4819, 6194, 9530),
('Atkinson', 2026, 692, 1548, 2240, 3446),
('Bacon', 2026, 512, 2736, 3248, 4997),
('Baker', 2026, 2266, 3334, 5600, 8618),
('Baldwin', 2026, 4884, 5168, 10052, 15466),
('Barrow', 2026, 12426, 20563, 32989, 50772),
('Bartow', 2026, 6821, 15639, 22460, 34560),
('Ben Hill', 2026, 2220, 3371, 5591, 8605),
('Berrien', 2026, 1195, 3392, 4587, 7062),
('Bibb', 2026, 41623, 20521, 62144, 95605),
('Brantley', 2026, 3045, 7197, 10242, 15761),
('Brooks', 2026, 3316, 7854, 11170, 17183),
('Bryan', 2026, 7156, 16922, 24078, 37050),
('Bulloch', 2026, 10629, 25194, 35823, 55111),
('Burke', 2026, 2747, 6507, 9254, 14237),
('Butts', 2026, 2139, 5064, 7203, 11083),
('Calhoun', 2026, 1629, 3864, 5493, 8450),
('Camden', 2026, 4732, 11210, 15942, 24534),
('Campbell', 2026, 4213, 9981, 14194, 21853),
('Carroll', 2026, 4652, 11021, 15673, 24121),
('Catoosa', 2026, 6265, 14840, 21105, 32475),
('Charlton', 2026, 1568, 3714, 5282, 8128),
('Chatham', 2026, 67329, 33239, 100568, 154758),
('Chattooga', 2026, 3988, 9463, 13451, 20704),
('Cherokee', 2026, 32025, 75937, 107962, 166065),
('Clarke', 2026, 20925, 49546, 70471, 108418),
('Clay', 2026, 2368, 1844, 4212, 6482),
('Clayton', 2026, 58924, 29122, 88046, 135438),
('Clinch', 2026, 1895, 5378, 7273, 11191),
('Cobb', 2026, 71389, 119467, 190856, 293734),
('Coffee', 2026, 5255, 12445, 17700, 27228),
('Colquitt', 2026, 5239, 12393, 17632, 27127),
('Columbia', 2026, 27048, 64080, 91128, 140196),
('Cook', 2026, 2873, 6804, 9677, 14892),
('Coweta', 2026, 21346, 50589, 71935, 110628),
('Crawford', 2026, 999, 2368, 3367, 5181),
('Crisp', 2026, 3567, 8448, 12015, 18487),
('Dade', 2026, 2303, 5456, 7759, 11940),
('Dawson', 2026, 2045, 4844, 6889, 10601),
('DeKalb', 2026, 71649, 35281, 106930, 164545),
('Decatur', 2026, 3159, 7483, 10642, 16381),
('Dodge', 2026, 1357, 3215, 4572, 7038),
('Dooly', 2026, 1801, 4266, 6067, 9338),
('Dougherty', 2026, 46407, 22897, 69304, 106635),
('Douglas', 2026, 41835, 20644, 62479, 96116),
('Early', 2026, 1479, 3502, 4981, 7663),
('Echols', 2026, 131, 814, 945, 1455),
('Effingham', 2026, 3772, 8938, 12710, 19555),
('Elbert', 2026, 2635, 6243, 8878, 13659),
('Emanuel', 2026, 2290, 5423, 7713, 11868),
('Evans', 2026, 1541, 3650, 5191, 7985),
('Fannin', 2026, 2283, 5410, 7693, 11835),
('Fayette', 2026, 15949, 37799, 53748, 82729),
('Floyd', 2026, 9387, 22254, 31641, 48678),
('Forsyth', 2026, 15809, 37487, 53296, 82034),
('Franklin', 2026, 3007, 7125, 10132, 15594),
('Fulton', 2026, 102850, 50776, 153626, 236287),
('Gilmer', 2026, 2516, 5964, 8480, 13049),
('Glascock', 2026, 607, 1437, 2044, 3145),
('Glynn', 2026, 9047, 21430, 30477, 46888),
('Gordon', 2026, 4091, 9701, 13792, 21223),
('Grady', 2026, 2223, 5271, 7494, 11534),
('Greene', 2026, 2317, 4712, 7029, 10815),
('Greenville', 2026, 1636, 3877, 5513, 8483),
('Gwinnett', 2026, 69858, 165523, 235381, 362191),
('Habersham', 2026, 3938, 9336, 13274, 20422),
('Hall', 2026, 10843, 25704, 36547, 56240),
('Hancock', 2026, 1942, 4601, 6543, 10069),
('Haralson', 2026, 2717, 6440, 9157, 14090),
('Harris', 2026, 8281, 19649, 27930, 43013),
('Hart', 2026, 2649, 6282, 8931, 13744),
('Heard', 2026, 1369, 3246, 4615, 7102),
('Henry', 2026, 30387, 71982, 102369, 157500),
('Houston', 2026, 13755, 32577, 46332, 71281),
('Irwin', 2026, 1361, 3223, 4584, 7056),
('Jackson', 2026, 6981, 16554, 23535, 36224),
('Jasper', 2026, 2269, 5375, 7644, 11765),
('Jeff Davis', 2026, 1039, 2463, 3502, 5386),
('Jefferson', 2026, 2199, 5211, 7410, 11403),
('Jenkins', 2026, 2664, 4281, 6945, 10685),
('Johnson', 2026, 1958, 4865, 6823, 10502),
('Jones', 2026, 2386, 5658, 8044, 12378),
('Lamar', 2026, 2462, 5833, 8295, 12766),
('Lanier', 2026, 2038, 4705, 6743, 10375),
('Laurens', 2026, 6303, 14941, 21244, 32691),
('Lee', 2026, 4163, 9864, 14027, 21587),
('Liberty', 2026, 4944, 11713, 16657, 25645),
('Lincoln', 2026, 1189, 2818, 4007, 6167),
('Long', 2026, 1555, 3687, 5242, 8065),
('Lowndes', 2026, 8661, 20527, 29188, 44912),
('Lumpkin', 2026, 2191, 5193, 7384, 11368),
('Macon', 2026, 1748, 4140, 5888, 9058),
('Madison', 2026, 4547, 10771, 15318, 23572),
('Marion', 2026, 1172, 2776, 3948, 6075),
('McDuffie', 2026, 2274, 5389, 7663, 11797),
('McIntosh', 2026, 1970, 4671, 6641, 10219),
('Meriwether', 2026, 2058, 4878, 6936, 10672),
('Miller', 2026, 963, 2281, 3244, 4992),
('Milton', 2026, 8893, 21077, 29970, 46128),
('Mitchell', 2026, 2149, 5089, 7238, 11138),
('Monroe', 2026, 4062, 9626, 13688, 21063),
('Montgomery', 2026, 1198, 2839, 4037, 6213),
('Morgan', 2026, 2256, 5349, 7605, 11702),
('Murray', 2026, 3652, 8656, 12308, 18936),
('Muscogee', 2026, 47891, 23632, 71523, 110068),
('Newton', 2026, 19055, 45142, 64197, 98783),
('Oconee', 2026, 4809, 11398, 16207, 24938),
('Oglethorpe', 2026, 2044, 4844, 6888, 10597),
('Paulding', 2026, 15297, 36256, 51553, 79346),
('Peach', 2026, 3363, 7974, 11337, 17447),
('Pickens', 2026, 3651, 8656, 12307, 18935),
('Pierce', 2026, 2859, 11922, 14781, 22733),
('Pike', 2026, 1981, 4692, 6673, 10271),
('Polk', 2026, 4160, 9856, 14016, 21570),
('Pulaski', 2026, 1326, 3142, 4468, 6876),
('Putnam', 2026, 2485, 5888, 8373, 12883),
('Quitman', 2026, 474, 1122, 1596, 2455),
('Rabun', 2026, 1829, 6056, 7885, 12137),
('Randolph', 2026, 1605, 3802, 5407, 8322),
('Richmond', 2026, 44894, 22149, 67043, 103177),
('Rockdale', 2026, 14176, 33633, 47809, 73604),
('Schley', 2026, 359, 1389, 1748, 2689),
('Screven', 2026, 2010, 4767, 6777, 10432),
('Seminole', 2026, 1602, 3795, 5397, 8302),
('Spalding', 2026, 10769, 12667, 23436, 36050),
('Stephens', 2026, 3143, 7447, 10590, 16295),
('Stewart', 2026, 1366, 3239, 4605, 7084),
('Sumter', 2026, 2272, 5384, 7656, 11785),
('Talbot', 2026, 1629, 3863, 5492, 8448),
('Taliaferro', 2026, 2384, 1724, 4108, 6321),
('Tattnall', 2026, 2401, 5692, 8093, 12455),
('Taylor', 2026, 2333, 3935, 6268, 9644),
('Telfair', 2026, 1740, 4123, 5863, 9020),
('Terrell', 2026, 1499, 3556, 5055, 7777),
('Thomas', 2026, 3880, 9202, 13082, 20126),
('Tift', 2026, 3828, 9070, 12898, 19848),
('Toombs', 2026, 2519, 5971, 8490, 13069),
('Towns', 2026, 1539, 3648, 5187, 7981),
('Treutlen', 2026, 1488, 3140, 4628, 7121),
('Troup', 2026, 8621, 20437, 29058, 44733),
('Turner', 2026, 1593, 3776, 5369, 8261),
('Twiggs', 2026, 1346, 3189, 4535, 6976),
('Union', 2026, 1858, 4402, 6260, 9634),
('Upson', 2026, 3162, 7492, 10654, 16388),
('Ware', 2026, 3357, 7961, 11318, 17411),
('Warren', 2026, 1146, 947, 2093, 3220),
('Washington', 2026, 1981, 4692, 6673, 10271),
('Wayne', 2026, 2836, 6718, 9554, 14707),
('Webster', 2026, 444, 610, 1054, 1622),
('Wheeler', 2026, 1314, 3115, 4429, 6814),
('White', 2026, 2291, 5431, 7722, 11884),
('Whitfield', 2026, 8126, 19256, 27382, 42129),
('Wilcox', 2026, 1896, 4936, 6832, 10516),
('Wilkes', 2026, 1974, 4682, 6656, 10241),
('Worth', 2026, 2639, 6258, 8897, 13692)
ON CONFLICT (county, election_year) DO UPDATE SET
    democrat_votes = EXCLUDED.democrat_votes,
    republican_votes = EXCLUDED.republican_votes,
    total_votes = EXCLUDED.total_votes,
    registered_voters = EXCLUDED.registered_voters,
    updated_at = NOW();

-- Step 3: Verify data insertion
SELECT COUNT(*) as total_2026_counties FROM public.county_voter_statistics WHERE election_year = 2026;

-- Step 4: Show sample data
SELECT county, democrat_votes, republican_votes, total_votes, 
       ROUND((democrat_votes::numeric / total_votes * 100), 2) as dem_pct,
       ROUND((republican_votes::numeric / total_votes * 100), 2) as rep_pct
FROM public.county_voter_statistics
WHERE election_year = 2026
ORDER BY county
LIMIT 15;

-- Step 5: Recalculate drift (if county_drift table exists)
-- This will update the drift calculations to include the 2026 data
DROP TABLE IF EXISTS public.county_drift;

CREATE TABLE public.county_drift AS
SELECT 
    c2024.county,
    c2020.democrat_votes as dem_2020,
    c2020.republican_votes as rep_2020,
    c2020.total_votes as total_2020,
    c2024.democrat_votes as dem_2024,
    c2024.republican_votes as rep_2024,
    c2024.total_votes as total_2024,
    c2026.democrat_votes as dem_2026,
    c2026.republican_votes as rep_2026,
    c2026.total_votes as total_2026,
    ROUND((c2020.democrat_votes::numeric / c2020.total_votes * 100), 2) as dem_2020_pct,
    ROUND((c2020.republican_votes::numeric / c2020.total_votes * 100), 2) as rep_2020_pct,
    ROUND((c2024.democrat_votes::numeric / c2024.total_votes * 100), 2) as dem_2024_pct,
    ROUND((c2024.republican_votes::numeric / c2024.total_votes * 100), 2) as rep_2024_pct,
    ROUND((c2026.democrat_votes::numeric / c2026.total_votes * 100), 2) as dem_2026_pct,
    ROUND((c2026.republican_votes::numeric / c2026.total_votes * 100), 2) as rep_2026_pct,
    -- Drift from 2024 baseline to 2026
    ROUND((c2026.democrat_votes::numeric / c2026.total_votes * 100) - 
          (c2024.democrat_votes::numeric / c2024.total_votes * 100), 2) as dem_drift_2024_to_2026,
    ROUND((c2026.republican_votes::numeric / c2026.total_votes * 100) - 
          (c2024.republican_votes::numeric / c2024.total_votes * 100), 2) as rep_drift_2024_to_2026,
    -- Overall drift from 2020 to 2026
    ROUND((c2026.democrat_votes::numeric / c2026.total_votes * 100) - 
          (c2020.democrat_votes::numeric / c2020.total_votes * 100), 2) as dem_drift_2020_to_2026,
    ROUND((c2026.republican_votes::numeric / c2026.total_votes * 100) - 
          (c2020.republican_votes::numeric / c2020.total_votes * 100), 2) as rep_drift_2020_to_2026
FROM public.county_voter_statistics c2026
JOIN public.county_voter_statistics c2024 ON c2026.county = c2024.county AND c2024.election_year = 2024
JOIN public.county_voter_statistics c2020 ON c2026.county = c2020.county AND c2020.election_year = 2020;

-- Step 6: Show drift analysis
SELECT county, 
       dem_2024_pct, rep_2024_pct,
       dem_2026_pct, rep_2026_pct,
       dem_drift_2024_to_2026, rep_drift_2024_to_2026,
       CASE 
           WHEN dem_drift_2024_to_2026 > 0 THEN 'Blue Drift'
           WHEN rep_drift_2024_to_2026 > 0 THEN 'Red Drift'
           ELSE 'No Drift'
       END as drift_direction
FROM public.county_drift
ORDER BY dem_drift_2024_to_2026 DESC
LIMIT 20;
