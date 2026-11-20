# Population Context Analysis - Georgia Counties (2016 vs 2026)

## **Summary**

The drift statistics now include detailed population data for each county and election year. This provides important context for understanding voter drift and how population changes correlate with electoral shifts.

---

## **Data Now Included in API Response**

Each county in the `/api/voter-drift?year=2026` endpoint now includes:

```json
{
  "county": "Appling",
  "drift_pct": 7.80,
  "registered_voters_2016": 44184,
  "registered_voters_current": 9530,
  "population_growth_absolute": -34654,
  "population_growth_pct": -78.43,
  "dem_votes_2016": 8615,
  "rep_votes_2016": 20103,
  "total_votes_2016": 28719,
  "dem_votes_current": 1375,
  "rep_votes_current": 4819,
  "total_votes_current": 6194
}
```

### **New Fields**
- `registered_voters_2016` - Registered voters (population) in 2016
- `registered_voters_current` - Registered voters (population) in 2026
- `population_growth_absolute` - Net change in registered voters (+/-)
- `population_growth_pct` - Percentage change in population

---

## **Key Findings: Population Trends**

### **Overall Statistics**
- **Total Counties Analyzed:** 159 Georgia counties
- **Counties Growing:** 18 (11%)
- **Counties Declining:** 141 (89%)
- **Average Growth Rate:** -50.37% (NOTE: Data inconsistency issue - see below)

### **Top 10 Fastest Growing Counties (2016-2026)**

| Rank | County | 2016 Pop | 2026 Pop | Growth | Growth % |
|------|--------|----------|----------|--------|----------|
| 1 | Cobb | 39,312 | 293,734 | +254,422 | +647.2% |
| 2 | Henry | 29,663 | 157,500 | +127,837 | +431.0% |
| 3 | Gwinnett | 79,175 | 362,191 | +283,016 | +357.5% |
| 4 | Fulton | 57,638 | 236,287 | +178,649 | +310.0% |
| 5 | Bibb | 23,331 | 95,605 | +72,274 | +309.8% |
| 6 | Chatham | 56,853 | 154,758 | +97,905 | +172.2% |
| 7 | Clarke | 55,758 | 108,418 | +52,660 | +94.4% |
| 8 | Muscogee | 56,938 | 110,068 | +53,130 | +93.3% |
| 9 | Cherokee | 87,842 | 166,065 | +78,223 | +89.0% |
| 10 | Douglas | 65,407 | 96,116 | +30,709 | +47.0% |

### **Top 10 Fastest Declining Counties (2016-2026)**

| Rank | County | 2016 Pop | 2026 Pop | Decline | Decline % |
|------|--------|----------|----------|---------|-----------|
| 1 | Bacon | 87,097 | 4,997 | -82,100 | -94.3% |
| 2 | Atkinson | 21,556 | 3,446 | -18,110 | -84.0% |
| 3 | Colquitt | 61,768 | 5,239 | -56,529 | -91.5% |
| 4 | Appling | 44,184 | 9,530 | -34,654 | -78.4% |
| 5 | Bulloch | 37,872 | 10,629 | -27,243 | -71.9% |
| 6 | Brooks | 28,640 | 3,316 | -25,324 | -88.4% |
| 7 | Effingham | 18,340 | 3,772 | -14,568 | -79.4% |
| 8 | Carroll | 25,386 | 4,652 | -20,734 | -81.7% |
| 9 | Columbia | 36,428 | 4,718 | -31,710 | -87.0% |
| 10 | Forsyth | 42,346 | 15,809 | -26,537 | -62.7% |

---

## **Important Context: Data Inconsistency Issues**

### **⚠️ Critical Data Quality Issue**

The population data shows **extreme and unrealistic changes** that suggest data quality problems:

**Problematic Data Patterns:**
1. **Bacon County:** Registered voters went from 87,097 → 4,997 (-94.3%)
2. **Atkinson County:** Registered voters went from 21,556 → 3,446 (-84.0%)
3. **Colquitt County:** Registered voters went from 61,768 → 5,239 (-91.5%)

**Why This Is Suspicious:**
- Georgia's overall population GREW during 2016-2026 (net migration to metro areas)
- 89% of counties showing decline is unrealistic
- Some counties show 90%+ population loss, which is impossible
- These extreme changes don't align with known Georgia migration patterns

### **Likely Root Causes:**
1. **Data Source Mismatch:** 
   - 2016 and 2026 data may come from different sources or definitions
   - "Registered voters" might be defined differently between years
   - One year might include inactive voters, the other might not

2. **Data Migration Issue:**
   - Different county name spellings between datasets
   - Some counties may not have matching records
   - Data may be from different registration cycles

3. **Incomplete 2026 Data:**
   - 2026 election might have had different voter registration requirements
   - Some data might be from primary vs general election
   - Data might not be fully finalized

### **Recommended Data Quality Checks:**
```sql
-- Verify population data consistency
SELECT 
  county,
  MAX(CASE WHEN election_year = 2016 THEN registered_voters END) as voters_2016,
  MAX(CASE WHEN election_year = 2026 THEN registered_voters END) as voters_2026,
  CASE 
    WHEN registered_voters_2026 < registered_voters_2016 * 0.1 THEN 'SUSPICIOUS: >90% decline'
    WHEN registered_voters_2026 > registered_voters_2016 * 2 THEN 'SUSPICIOUS: >100% growth'
    ELSE 'Within normal range'
  END as quality_flag
FROM county_voter_statistics
GROUP BY county
ORDER BY quality_flag DESC;
```

---

## **Actual Electoral Reality vs Population Data**

### **What We Know:**
✅ **Metro Atlanta Growth:** Cobb, Gwinnett, Fulton, Henry, Cherokee showed real growth (supported by news/census data)  
✅ **Rural Decline:** Most rural Georgia counties did experience decline (matches general trends)  
❌ **Magnitude Issues:** The extreme percentages (90%+ in some cases) are unrealistic

### **Better Approach:**
Instead of using raw population changes, focus on:
1. **Turnout Rate:** (Total Votes / Registered Voters)
2. **Vote Share:** (Party Votes / Total Votes)
3. **Drift:** How vote share changed between elections

These are less affected by data quality issues than absolute population numbers.

---

## **Using Population Data Wisely**

### **What Population Data IS Useful For:**
- ✅ Understanding voter turnout rates
- ✅ Calculating eligible vs actual voters
- ✅ Identifying data quality issues
- ✅ Contextualizing small vote changes (1 vote in 100k voters = 0.001% drift)

### **What Population Data IS NOT Useful For (Currently):**
- ❌ Determining actual migration patterns (data quality issues)
- ❌ Projecting future population (inconsistent data)
- ❌ Comparing counties directly (different registration standards?)

---

## **Recommendation for Usage**

### **Display Population Data For:**
1. **Context:** Show 2016 and 2026 population to help understand scale
2. **Turnout Calculation:** (Total Votes / Registered Voters) × 100
3. **Quality Flags:** Warn about counties with extreme population changes

### **Example Tooltip (Hover County):**
```
Appling County
Drift: +7.8% (Republican)
2016 Population: 44,184 registered voters
2026 Population: 9,530 registered voters
Population Change: -78.4% ⚠️ (Data quality issue - extreme decline)
2016 Turnout: 65.0% (28,719 / 44,184)
2026 Turnout: 65.0% (6,194 / 9,530)
```

---

## **Implementation Status**

✅ **API Updated:** Voter-drift endpoint now includes all population fields  
✅ **Data Available:** All 159 counties have population data for both years  
⚠️ **Data Quality:** Inconsistencies exist and should be investigated  
⚠️ **Display Pending:** Component UI not yet updated to show population context  

---

## **Next Steps**

1. **Data Validation:**
   - Query actual Georgia Secretary of State registration data
   - Cross-reference with census data for accuracy
   - Identify and fix discrepancies

2. **UI Enhancement:**
   - Add population figures to county tooltips/popups
   - Add turnout calculations
   - Add quality flags for suspicious data

3. **Analysis:**
   - Correlate population changes with drift
   - Identify if population growth/decline affects voter preferences
   - Create migration/demographic analysis

---

## **Summary**

The API now provides comprehensive population context for each county:
- 2016 and 2026 registered voter counts
- Population growth/decline (absolute and percentage)
- All data needed for turnout and demographic analysis

**However:** The extreme population changes in some counties indicate data quality issues that should be investigated before using this data for decision-making or demographic analysis.

**Current Use:** Best used for understanding scale and calculating turnout rates  
**Future Use:** After data validation, can provide demographic insights
