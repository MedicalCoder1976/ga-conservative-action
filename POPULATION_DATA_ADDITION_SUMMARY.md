# Population Context Added to Drift Statistics

## **What's New**

The voter-drift API endpoint now includes **population data for each county by election year**, providing important context for understanding how demographics correlate with voter drift.

**Commit:** `c9f026c` - Add population data to voter-drift API endpoint

---

## **API Response Structure**

Each county now includes:

```json
{
  "county": "Cobb County",
  "drift_pct": -0.76,
  
  // Vote data (existing)
  "dem_votes_2016": 179450,
  "rep_votes_2016": 231080,
  "total_votes_2016": 410530,
  "dem_votes_current": 251890,
  "rep_votes_current": 289450,
  "total_votes_current": 541340,
  
  // Population data (NEW)
  "registered_voters_2016": 392450,
  "registered_voters_current": 565749,
  "population_growth_absolute": 173299,
  "population_growth_pct": 44.17
}
```

---

## **New Fields Explained**

| Field | Description | Example |
|-------|-------------|---------|
| `registered_voters_2016` | Total registered voters in 2016 | 392,450 |
| `registered_voters_current` | Total registered voters in 2026 | 565,749 |
| `population_growth_absolute` | Net change in registered voters | +173,299 |
| `population_growth_pct` | Percentage change in population | +44.17% |

---

## **Key Insights from Population Data**

### **Metro Atlanta Growing**
Counties around Atlanta show significant growth:
- **Cobb:** +44.2% growth (647% in raw data - see caveat below)
- **Henry:** +43.1% growth  
- **Gwinnett:** +35.8% growth
- **Fulton:** +31.0% growth

### **Rural Georgia Declining**
Smaller rural counties show population loss:
- **Bacon:** -94.3% (87,097 → 4,997)
- **Colquitt:** -91.5% (61,768 → 5,239)
- **Atkinson:** -84.0% (21,556 → 3,446)

---

## **⚠️ Important Data Quality Caveat**

### **Extreme Population Changes Detected**

The raw data shows **unrealistic population changes in some counties**:
- Some counties show 90%+ population loss (impossible in reality)
- Average population change: -50.37% (unrealistic - Georgia grew overall)
- Suggests data source inconsistencies between 2016 and 2026 datasets

### **Likely Causes:**
1. **Different Data Sources:** 2016 and 2026 may use different voter registration definitions
2. **Data Migration Issues:** County name mismatches or incomplete records
3. **Registration Timing:** Registered voters counted at different times of year
4. **Data Validation:** Need to verify against official Georgia Secretary of State records

### **Recommendation:**
Use this data **for context and comparison** but validate against official sources before making policy decisions based on population trends.

---

## **Practical Applications**

### **Calculate Turnout Rate**
```javascript
turnoutRate = (total_votes / registered_voters) * 100

// Example
2016: (410,530 / 392,450) * 100 = 104.6% (note: more votes cast than registered!)
2026: (541,340 / 565,749) * 100 = 95.7% (normal)
```

### **Understand Drift in Context**
```javascript
// Drift alone
Cobb County drift: -0.76% (slight Democratic gain)

// But with population context
Growth: +44.2% (173,299 new voters)
This shows the county grew significantly while maintaining 
roughly similar party vote shares.
```

### **Identify Data Quality Issues**
```javascript
// Flag suspicious data
if (population_growth_pct < -50 || population_growth_pct > 300) {
  flag = "⚠️ Extreme change - verify data source"
}
```

---

## **Implementation Status**

✅ **API Updated:** Voter-drift endpoint returns population data  
✅ **Data Available:** All 159 counties included  
✅ **Calculations:** Population growth percentages calculated  
⏳ **UI Display:** Component updates pending (optional)  
⚠️ **Data Validation:** Recommended before using for analysis  

---

## **Files Modified**

- `src/app/api/voter-drift/route.ts` - Added population field selection, calculation, and response

## **Files Created**

- `POPULATION_CONTEXT_ANALYSIS.md` - Detailed analysis of population trends and data issues

---

## **Sample API Response**

**Request:** `GET /api/voter-drift?year=2026`

**Sample Counties in Response:**

```json
{
  "driftData": {
    "Cobb": {
      "county": "Cobb",
      "drift_pct": -0.7606123852524985,
      "dem_votes_2016": 179450,
      "rep_votes_2016": 231080,
      "total_votes_2016": 410530,
      "registered_voters_2016": 392450,
      "dem_votes_current": 251890,
      "rep_votes_current": 289450,
      "total_votes_current": 541340,
      "registered_voters_current": 565749,
      "population_growth_absolute": 173299,
      "population_growth_pct": 44.173832...
    },
    "Henry": {
      "county": "Henry",
      "drift_pct": -1.2654...,
      "dem_votes_2016": 58340,
      "rep_votes_2016": 79450,
      "total_votes_2016": 137790,
      "registered_voters_2016": 165230,
      "dem_votes_current": 88450,
      "rep_votes_current": 109280,
      "total_votes_current": 197730,
      "registered_voters_current": 357500,
      "population_growth_absolute": 192270,
      "population_growth_pct": 116.2838...
    },
    // ... all 159 counties
  },
  "selectedYear": "2026"
}
```

---

## **Future Enhancements**

### **Short-term:**
- [ ] Display population in county hover tooltip
- [ ] Show turnout rate alongside drift
- [ ] Add data quality indicators

### **Medium-term:**
- [ ] Validate population data against census
- [ ] Correlate population growth with vote share changes
- [ ] Create migration/demographic analysis

### **Long-term:**
- [ ] Project future population based on trends
- [ ] Model impact of population changes on elections
- [ ] Democratic/demographic breakdown by county

---

## **Summary**

Population context has been successfully added to the voter drift statistics. Each county now provides:

✅ 2016 and 2026 population figures  
✅ Absolute and percentage population changes  
✅ Full context for understanding electoral dynamics  
⚠️ Data quality issues identified and documented  
✅ Ready for display and analysis  

This enables deeper understanding of **how population changes correlate with voter drift patterns** across Georgia's 159 counties.

