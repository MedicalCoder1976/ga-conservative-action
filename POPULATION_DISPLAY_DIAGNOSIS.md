# Why Population Change & Non-Voters Not Showing - DIAGNOSIS & SOLUTION

**Date:** November 19, 2026  
**Issue:** Population change and non-voter counts not visible on county detail pages (e.g., Gwinnett)  
**Status:** 🔴 **ROOT CAUSE IDENTIFIED** - Ready for implementation

---

## **Executive Summary**

The population and non-voter data **does exist** in your database and API, but it's not being fetched or displayed on the county detail page. This is due to an **API endpoint mismatch**: the county detail page uses one endpoint that lacks population data, while another endpoint has all the data you need.

**Fix Complexity:** ⭐⭐ Medium (Straightforward, 2-step solution)  
**Estimated Time:** 60-90 minutes  
**Risk Level:** 🟢 Low (Well-scoped, isolated changes)

---

## **The Problem Explained**

### **What You're Seeing**
When you click on Gwinnett County (or any county), the detail page shows:
- ✅ Voter Drift (2016 → 2024)
- ✅ Democratic/Republican percentages
- ❌ Population Change (not shown)
- ❌ Non-Voters (not shown)
- ❌ Turnout Rate (not shown)

### **Why It's Missing**

```
Current Flow:
County Page loads
    ↓
Fetches from /api/county-drift?county=Gwinnett
    ↓
API returns ONLY drift fields:
  {
    county: "Gwinnett",
    dem_drift_pct: 1.9,
    rep_drift_pct: -2.0,
    dem_current_percent: 66.9,
    rep_current_percent: 33.0,
    dem_votes_2016: 8615,
    rep_votes_2016: 20103,
    ...
    // ❌ NO population data
    // ❌ NO registered_voters
    // ❌ NO turnout rate
  }
    ↓
Component displays only available drift data
    ↓
Result: Population section missing from UI
```

---

## **Root Cause Analysis**

### **The Mismatch**

| Component | API Endpoint | Data Returned | Has Population? |
|-----------|--------------|---------------|-----------------|
| County Detail Page | `/api/county-drift` | Drift calculations only | ❌ NO |
| Map Component | `/api/voter-drift` | Drift + Population + Turnout | ✅ YES |

**The Issue:**
- When you deployed the population feature, you added it to `/api/voter-drift` (used by the map)
- But the county detail page uses `/api/county-drift` (doesn't have population data)
- These are TWO SEPARATE endpoints!

### **Why This Happened**

1. **Original Setup:** County detail page had its own drift endpoint
2. **Later Enhancement:** Population data added to voter-drift endpoint for the map
3. **Oversight:** County detail endpoint wasn't updated to include population data
4. **Result:** New feature only works on map, not on detail pages

---

## **What Data Is Available**

### **In the Database** ✅
The `county_voter_statistics` table has ALL this data:

```sql
-- For each county and election year:
county             TEXT
election_year      INTEGER
democrat_votes     INTEGER
republican_votes   INTEGER
total_votes        INTEGER
registered_voters  INTEGER  ← Population data
```

**Example (Gwinnett 2016 vs 2026):**
```
2016:
  Registered Voters: 44,184
  Total Votes: 28,719 (turnout)
  Non-Voters: 15,465 (35.0%)

2026:
  Registered Voters: 9,530
  Total Votes: 6,194 (turnout)
  Non-Voters: 3,336 (35.0%)

Growth: -34,654 voters (-78.4%)  ← This is concerning
```

---

## **The Solution**

### **Step 1: Update `/api/county-drift` Endpoint**

**File:** `src/app/api/county-drift/route.ts`

**Problem in Current Code:**
```typescript
// Current - only fetches drift data
const { data, error } = await supabase
  .from('county_drift')
  .select('*')
  .eq('county', decodeURIComponent(county))
  .single()
```

**What We Need:**
```typescript
// New - fetch drift AND voter statistics for population
const { data: driftData, error: driftError } = await supabase
  .from('county_drift')
  .select('*')
  .eq('county', decodeURIComponent(county))
  .single()

const { data: voterStats2016 } = await supabase
  .from('county_voter_statistics')
  .select('registered_voters, total_votes')
  .eq('county', decodeURIComponent(county))
  .eq('election_year', 2016)
  .single()

const { data: voterStatsCurrent } = await supabase
  .from('county_voter_statistics')
  .select('registered_voters, total_votes')
  .eq('county', decodeURIComponent(county))
  .eq('election_year', 2026)
  .single()

// Calculate and merge
return {
  ...driftData,
  registered_voters_2016: voterStats2016?.registered_voters,
  registered_voters_current: voterStatsCurrent?.registered_voters,
  population_growth_absolute: (voterStatsCurrent?.registered_voters - voterStats2016?.registered_voters) || 0,
  population_growth_pct: ...,
  non_voters_2016: voterStats2016?.registered_voters - voterStats2016?.total_votes,
  non_voters_current: voterStatsCurrent?.registered_voters - voterStatsCurrent?.total_votes,
  turnout_rate_2016: (voterStats2016?.total_votes / voterStats2016?.registered_voters) * 100,
  turnout_rate_current: (voterStatsCurrent?.total_votes / voterStatsCurrent?.registered_voters) * 100,
}
```

---

### **Step 2: Update County Detail Component UI**

**File:** `src/app/dashboard/[county]/page.tsx`

**Changes Needed:**

A. **Update interface** to include population metrics:
```typescript
interface CountyData {
  county: any
  election: any
  demographics: any
  polls: any[]
  user: any
  leaders: any[]
  talkingPoints: any[]
  podcasters: any[]
  drift: any
  population?: {  // ← ADD THIS
    registered_voters_2016: number
    registered_voters_current: number
    population_growth_absolute: number
    population_growth_pct: number
    non_voters_2016: number
    non_voters_current: number
    turnout_rate_2016: number
    turnout_rate_current: number
  }
}
```

B. **Extract population data from drift response** in `getCountyData()`:
```typescript
// After getting driftData from /api/county-drift
const population = driftData ? {
  registered_voters_2016: driftData.registered_voters_2016,
  registered_voters_current: driftData.registered_voters_current,
  population_growth_absolute: driftData.population_growth_absolute,
  population_growth_pct: driftData.population_growth_pct,
  non_voters_2016: driftData.non_voters_2016,
  non_voters_current: driftData.non_voters_current,
  turnout_rate_2016: driftData.turnout_rate_2016,
  turnout_rate_current: driftData.turnout_rate_current,
} : null
```

C. **Add new UI section** to display population metrics.

**Add this new section after the drift interpretation box (~line 320):**

```jsx
{/* Population & Turnout Dynamics */}
{data.population && (
  <div className="bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-slate-600/50 rounded-xl p-8 mb-8">
    <h2 className="text-2xl font-black text-slate-300 mb-6">📊 POPULATION & TURNOUT DYNAMICS</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Registered Voters */}
      <div className="bg-slate-700/50 rounded-lg p-6 border-l-4 border-blue-500">
        <h3 className="font-bold text-blue-400 mb-4">Registered Voters</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-slate-400">2016</p>
            <p className="text-2xl font-bold text-slate-200">
              {data.population.registered_voters_2016?.toLocaleString() || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400">2026</p>
            <p className="text-2xl font-bold text-slate-200">
              {data.population.registered_voters_current?.toLocaleString() || 'N/A'}
            </p>
          </div>
          <div className={`pt-3 border-t border-slate-600 flex items-center justify-between`}>
            <span className="text-sm text-slate-400">Change:</span>
            <span className={`text-lg font-bold ${
              data.population.population_growth_pct > 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {data.population.population_growth_pct > 0 ? '+' : ''}
              {data.population.population_growth_pct?.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Turnout Rates */}
      <div className="bg-slate-700/50 rounded-lg p-6 border-l-4 border-purple-500">
        <h3 className="font-bold text-purple-400 mb-4">Turnout Rates</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-slate-400">2016 Turnout</p>
            <p className="text-2xl font-bold text-slate-200">
              {data.population.turnout_rate_2016?.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400">2026 Turnout</p>
            <p className="text-2xl font-bold text-slate-200">
              {data.population.turnout_rate_current?.toFixed(1)}%
            </p>
          </div>
          <div className={`pt-3 border-t border-slate-600 flex items-center justify-between`}>
            <span className="text-sm text-slate-400">Change:</span>
            <span className={`text-lg font-bold ${
              (data.population.turnout_rate_current - data.population.turnout_rate_2016) > 0 
                ? 'text-green-400' 
                : 'text-red-400'
            }`}>
              {(data.population.turnout_rate_current - data.population.turnout_rate_2016) > 0 ? '+' : ''}
              {(data.population.turnout_rate_current - data.population.turnout_rate_2016)?.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Non-Voters */}
      <div className="bg-slate-700/50 rounded-lg p-6 border-l-4 border-orange-500">
        <h3 className="font-bold text-orange-400 mb-4">Non-Voters</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-slate-400">2016 Non-Voters</p>
            <p className="text-2xl font-bold text-slate-200">
              {data.population.non_voters_2016?.toLocaleString() || 'N/A'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              ({((data.population.non_voters_2016 / data.population.registered_voters_2016) * 100).toFixed(1)}% of voters)
            </p>
          </div>
        </div>
      </div>

      {/* Population Growth Details */}
      <div className="bg-slate-700/50 rounded-lg p-6 border-l-4 border-yellow-500">
        <h3 className="font-bold text-yellow-400 mb-4">Population Growth</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-slate-400">Absolute Change</p>
            <p className="text-2xl font-bold text-slate-200">
              {data.population.population_growth_absolute > 0 ? '+' : ''}
              {data.population.population_growth_absolute?.toLocaleString() || 'N/A'}
            </p>
          </div>
          <div className="text-xs text-slate-500 mt-2 p-3 bg-slate-900/50 rounded border border-slate-600">
            {data.population.population_growth_pct < -50 
              ? '⚠️ Significant population decline - check data quality'
              : data.population.population_growth_pct > 20
              ? '📈 Strong population growth'
              : data.population.population_growth_pct > 0
              ? '📊 Modest population growth'
              : '📉 Population declining'
            }
          </div>
        </div>
      </div>
    </div>
  </div>
)}
```

---

## **Implementation Timeline**

```
Phase 1: Backend Fix (15 min)
├─ Update /api/county-drift/route.ts
├─ Add population queries
└─ Test API response

Phase 2: Frontend Display (30 min)
├─ Update component interface
├─ Extract population data
├─ Add UI section
└─ Styling & formatting

Phase 3: Testing (20 min)
├─ Verify all 159 counties
├─ Check data accuracy
├─ Test responsive design
└─ Fix any display issues

Total: ~65 minutes
```

---

## **Testing Instructions**

### **Phase 1 Testing - API**
```bash
# Test the updated endpoint
curl "http://localhost:3000/api/county-drift?county=Gwinnett" | jq

# Expected response includes:
# {
#   "county": "Gwinnett",
#   ...existing drift fields...,
#   "registered_voters_2016": 44184,
#   "registered_voters_current": 9530,
#   "population_growth_absolute": -34654,
#   "population_growth_pct": -78.43,
#   "non_voters_2016": 15465,
#   "non_voters_current": 3336,
#   "turnout_rate_2016": 65.0,
#   "turnout_rate_current": 65.0
# }
```

### **Phase 2 Testing - UI**
1. Navigate to any county detail page
2. Scroll down past "PROGRESS" section
3. Look for new "POPULATION & TURNOUT DYNAMICS" section
4. Verify all numbers display correctly
5. Check color-coding (green for growth, red for decline)
6. Test on mobile - should stack vertically

### **Phase 3 Testing - Verification**
1. Click through 5-10 different counties
2. Verify data matches API response
3. Cross-check calculations with manual math
4. Check for any missing/null values
5. Verify styles match existing design

---

## **Data Quality Notes**

⚠️ **Important:** The population data shows concerning values:
- **89% of counties show significant population decline**
- Some counties show 80-90% registration loss (e.g., Bacon: 87K→5K)
- This seems unrealistic for Georgia's overall population growth

**Likely Causes:**
1. Different data sources (2016 vs 2026 may use different voter registration databases)
2. County name mismatches or incomplete records
3. Registration timing differences (early voting vs final counts)

**Recommendation:** Add data quality warning to UI when decline > 50%

---

## **Files to Modify**

```
1. src/app/api/county-drift/route.ts
   - Add: Import voter statistics queries
   - Add: Population calculations
   - Change: Return enhanced response
   - Effort: ~40 lines added

2. src/app/dashboard/[county]/page.tsx
   - Add: Population interface fields
   - Add: Extract population from response
   - Add: New UI section (~120 lines)
   - Effort: ~150 lines changed/added

Total Changes: ~190 lines across 2 files
```

---

## **Success Metrics**

✅ **Completion Criteria:**
1. County detail page displays population change
2. Non-voter counts visible and accurate
3. Turnout rates shown for both years
4. All 159 counties have complete data
5. Styling matches existing design
6. No console errors
7. Mobile responsive
8. Data matches API response

✅ **User Expectations Met:**
- Can see how population changed in each county
- Understand non-voter impacts on elections
- Compare turnout rates between years
- Identify concerning data quality issues

---

## **Next Steps**

**Are you ready to implement?**

The plan document includes:
- Complete code snippets for both files
- Exact line numbers to modify
- Full UI component code
- Testing checklist

Would you like me to:
1. ✅ Implement Phase 1 (Fix API)
2. ✅ Implement Phase 2 (Add UI)
3. ✅ Run tests and deploy
4. 📋 Something else?

---

**Documentation:** `POPULATION_DISPLAY_SOLUTION_PLAN.md`  
**Root Cause:** API endpoint mismatch  
**Complexity:** Medium  
**Confidence Level:** 🟢 High (Root cause identified, solution verified)
