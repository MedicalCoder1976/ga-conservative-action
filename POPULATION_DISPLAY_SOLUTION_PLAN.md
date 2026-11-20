# Plan: Display Population Change & Non-Voters on County Detail Page

## **Problem Diagnosis**

### Current State
✗ **Population data exists** in the API (`/api/voter-drift` endpoint returns):
  - `registered_voters_2016` 
  - `registered_voters_current` 
  - `population_growth_absolute`
  - `population_growth_pct`

✗ **Non-voter counts can be calculated**:
  - Non-voters 2016 = `registered_voters_2016 - total_votes_2016`
  - Non-voters 2026 = `registered_voters_current - total_votes_current`
  - Non-voter percentage = `(non_voters / registered_voters) * 100`

✗ **BUT** The county detail page uses a DIFFERENT API endpoint:
  - County detail page uses: `/api/county-drift` ← **Does NOT return population data**
  - This endpoint only returns drift fields, missing population metrics

✗ **Why It's Not Showing**:
1. The county detail component (`[county]/page.tsx`) fetches drift data from `/api/county-drift`
2. That endpoint only selects drift calculation fields
3. Population data was added to `/api/voter-drift` but not to `/api/county-drift`
4. The component has no population or non-voter fields to display in its UI

---

## **Root Cause Analysis**

| Component | Current Data | Issue |
|-----------|--------------|-------|
| `/api/county-drift` | Only drift fields | ❌ No population data |
| `/api/voter-drift` | Includes population ✓ | ✓ Has data but different endpoint |
| `[county]/page.tsx` | Fetches from county-drift | ❌ No access to population |
| UI Section | "COUNTY INTEL" | ❌ No population display fields |

**The Mismatch:** Population data exists in one endpoint but the county detail page doesn't use it.

---

## **Solution: 3-Step Implementation**

### **Step 1: Enhance `/api/county-drift` Endpoint**

**File:** `src/app/api/county-drift/route.ts`

**Changes:**
1. Import population data from `county_voter_statistics` table
2. Add population fields to query:
   - `registered_voters` for 2016 and current year
   - Calculate non-voters and turnout rate
3. Return enhanced response with population metrics

**Data to Add:**
```json
{
  "registered_voters_2016": 44184,
  "registered_voters_current": 9530,
  "population_growth_absolute": -34654,
  "population_growth_pct": -78.43,
  "non_voters_2016": 15469,      // registered_voters - total_votes
  "non_voters_current": 2335,
  "turnout_rate_2016": 65.0,     // (total_votes / registered_voters) * 100
  "turnout_rate_current": 75.5,
  "non_voter_rate_2016": 35.0,   // 100 - turnout_rate
  "non_voter_rate_current": 24.5
}
```

---

### **Step 2: Update County Detail Component UI**

**File:** `src/app/dashboard/[county]/page.tsx`

**Changes:**

A. **Add new interface fields:**
   ```typescript
   interface CountyData {
     // ... existing fields ...
     population?: {
       registered_voters_2016: number;
       registered_voters_current: number;
       population_growth_absolute: number;
       population_growth_pct: number;
       non_voters_2016: number;
       non_voters_current: number;
       turnout_rate_2016: number;
       turnout_rate_current: number;
     }
   }
   ```

B. **Extract population data from drift response in `getCountyData()`:**
   ```typescript
   // After fetching driftRes, extract population metrics:
   const populationMetrics = {
     registered_voters_2016: driftRes?.registered_voters_2016,
     registered_voters_current: driftRes?.registered_voters_current,
     population_growth_absolute: driftRes?.population_growth_absolute,
     population_growth_pct: driftRes?.population_growth_pct,
     non_voters_2016: driftRes?.non_voters_2016,
     non_voters_current: driftRes?.non_voters_current,
     turnout_rate_2016: driftRes?.turnout_rate_2016,
     turnout_rate_current: driftRes?.turnout_rate_current,
   }
   ```

C. **Add new UI section in component** - Add this after the drift section:
   
   Location: After the "What This Means" interpretation box (~line 320)
   
   New Section: "📊 POPULATION & TURNOUT DYNAMICS"
   
   Display:
   - **Registered Voters:** 2016 vs 2026 (with % change)
   - **Population Growth:** Absolute and percentage
   - **Turnout Rates:** 2016 vs 2026 comparison
   - **Non-Voters:** 2016 vs 2026 (absolute and %)
   - **Visual Indicators:** Color-coded for growth/decline

---

### **Step 3: Create Reusable UI Components**

**File:** `src/components/PopulationStats.tsx` (NEW)

**Purpose:** Encapsulate population display logic for reusability

**Components to Build:**
1. `PopulationChangeCard` - Shows registered voters and growth
2. `TurnoutRateCard` - Shows turnout vs non-voter rates
3. `PopulationComparison` - Side-by-side 2016 vs 2026 comparison
4. `PopulationTrend` - Visual bar chart of trends

---

## **Implementation Steps (In Order)**

### **Phase 1: Backend - Fix API (Step 1)**
```
1a. Open src/app/api/county-drift/route.ts
1b. Add population data joins to query
1c. Calculate non-voters and turnout rates
1d. Add fields to response
1e. Test API response with curl/Postman
```

### **Phase 2: Frontend - Update Component (Step 2)**
```
2a. Update CountyData interface in [county]/page.tsx
2b. Extract population metrics from drift response
2c. Add UI section to display population data
2d. Style to match existing design (slate/red theme)
2e. Test in browser
```

### **Phase 3: Refactor - Create Components (Step 3)**
```
3a. Create PopulationStats.tsx component
3b. Extract display logic into sub-components
3c. Import in [county]/page.tsx
3d. Replace inline UI with component imports
3e. Verify styling and display
```

---

## **Expected UI Layout (After Implementation)**

```
┌─────────────────────────────────────────────────────────┐
│ 📊 PROGRESS                                             │
│ ├─ Voter Drift: 2016 → 2024                           │
│ ├─ Democratic/Republican bars                          │
│ └─ Drift interpretation                                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 📊 POPULATION & TURNOUT DYNAMICS                        │
│ ├─ Registered Voters                                   │
│ │  ├─ 2016: 44,184 voters                             │
│ │  ├─ 2026: 9,530 voters                              │
│ │  └─ Change: -34,654 (-78.4%)  [RED - declining]     │
│ │                                                       │
│ ├─ Turnout Rates                                       │
│ │  ├─ 2016 Turnout: 65.0% (28,719 / 44,184)          │
│ │  ├─ 2026 Turnout: 75.5% (6,194 / 9,530)            │
│ │  └─ Turnout Increased: +10.5%  [GREEN]              │
│ │                                                       │
│ └─ Non-Voter Analysis                                  │
│    ├─ 2016 Non-Voters: 15,465 (35.0% of registered)  │
│    ├─ 2026 Non-Voters: 2,336 (24.5% of registered)   │
│    └─ Non-Voter Rate Decreased: -10.5%  [GREEN]       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 📊 COUNTY INTEL                                         │
│ ├─ 2026 Election Results                              │
│ ├─ Demographic Data                                   │
│ └─ Polling                                            │
└─────────────────────────────────────────────────────────┘
```

---

## **Code Changes Summary**

| File | Change | Lines | Priority |
|------|--------|-------|----------|
| `src/app/api/county-drift/route.ts` | Add population query & calculations | +40 | 🔴 P1 |
| `src/app/dashboard/[county]/page.tsx` | Add population UI section | +80 | 🔴 P1 |
| `src/components/PopulationStats.tsx` | Create new component | +150 | 🟡 P2 |

---

## **Testing Checklist**

**Backend Testing:**
- [ ] `curl "http://localhost:3000/api/county-drift?county=Gwinnett"` returns population fields
- [ ] All 159 counties have population data
- [ ] Non-voter calculations are correct
- [ ] Turnout rates match expected values (0-100%)

**Frontend Testing:**
- [ ] County detail page loads without errors
- [ ] Population section displays correctly
- [ ] Numbers match API response
- [ ] All counties show data (no missing values)
- [ ] Styling matches existing design
- [ ] Responsive on mobile
- [ ] Color-coding works (red for decline, green for growth)

**Data Quality Testing:**
- [ ] Population decline flags unrealistic values
- [ ] Handle counties with zero turnout
- [ ] Handle missing/null data gracefully
- [ ] Calculations match manual verification

---

## **Estimated Effort**

| Phase | Task | Effort |
|-------|------|--------|
| 1 | Fix API endpoint | 15 min |
| 2 | Update component & UI | 30 min |
| 3 | Create components | 20 min |
| Testing | Full verification | 20 min |
| **Total** | | **~85 min** |

---

## **Success Criteria**

✅ County detail page shows:
  - Registered voter counts (2016 vs 2026)
  - Population growth (absolute and %)
  - Turnout rates (2016 vs 2026)
  - Non-voter counts and percentages
  - Visual indicators (color-coded)

✅ All 159 counties display complete data

✅ Data matches API response exactly

✅ UI matches existing design (slate/red theme)

✅ No console errors or warnings

✅ Responsive and mobile-friendly

---

## **Next Steps**

**Ready to implement?**

**Step-by-step execution:**
1. ✅ Approve this plan
2. 🔧 Phase 1: Enhance `/api/county-drift` endpoint
3. 🎨 Phase 2: Update county detail component
4. ♻️ Phase 3: Create reusable components
5. ✔️ Testing & Verification

**Start with Phase 1 to fix the API, then Phase 2 to display the data.**
