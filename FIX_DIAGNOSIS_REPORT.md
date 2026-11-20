# 🔍 Diagnosis & Fix Report: Population Data Not Displaying

**Date:** 2026-11-19  
**Status:** ✅ RESOLVED  
**Commit:** 5a0004e  

---

## Problem Statement

User reported: **"No county population, no non voters"**

The "POPULATION & TURNOUT DYNAMICS" section heading was visible, but all data cards were empty/not rendering on county detail pages.

---

## Root Cause Analysis

### Initial Investigation
1. **Backend API Check** ✅
   - API endpoint `/api/county-drift` returns 200 OK
   - All 8 population metrics are calculated correctly
   - Database queries working properly

2. **Frontend Check** ✅
   - React component code correctly structured
   - Conditional rendering logic: `{data.population && (...)}`
   - TypeScript interfaces properly defined

3. **Browser Behavior** ❌
   - Browser console showed multiple **406 "Not Acceptable"** errors
   - Page DOM analysis showed NO population data

### The Gap: Why Backend ✅ but Frontend ❌?

The issue was in **how the browser fetches the API data**.

**Code Flow:**
```javascript
// In src/app/dashboard/[county]/page.tsx:76
fetch(`/api/county-drift?county=${encodeURIComponent(county)}`)
  .then(r => r.json())
  .catch(() => ({ data: null }))  // SILENT FAILURE HERE!
```

**What was happening:**
1. Browser sends fetch request with certain Accept headers
2. Server responds with **406 Not Acceptable** (missing CORS headers)
3. `.catch()` silently swallows the error, returns `{ data: null }`
4. Component checks: `if (driftRes && driftRes.county)` → FALSE (no `county` property)
5. `driftData` remains `null`
6. Conditional render `{data.population && (` skips the entire section

### Why the 406 Error?

The Next.js API route was not explicitly setting CORS headers or handling Accept headers properly. When the browser made cross-origin requests or sent specific Accept headers, the server was rejecting them without proper error responses.

---

## Solution Implemented

### File 1: `src/app/api/county-drift/route.ts`

**Changes:**
1. Added OPTIONS handler for CORS pre-flight requests
2. Added proper CORS headers to ALL responses
3. Explicitly set `Content-Type: application/json`
4. Added Access-Control-Allow headers

**Code:**
```typescript
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept',
        'Content-Type': 'application/json',
      },
    }
  )
}

export async function GET(request: NextRequest) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
    }
    
    // ... rest of logic, using 'headers' in all responses
    return NextResponse.json({ ... }, { headers })
  }
}
```

### File 2: `src/app/dashboard/[county]/page.tsx`

**Changes:**
1. Improved error handling in fetch call
2. Added logging for HTTP status codes
3. Better error messages for debugging

**Code:**
```javascript
fetch(`/api/county-drift?county=${encodeURIComponent(county)}`)
  .then(r => {
    if (!r.ok) {
      console.error(`Drift API returned ${r.status}:`, r.statusText)
      return { error: `HTTP ${r.status}` }
    }
    return r.json()
  })
  .catch(err => {
    console.error('Drift fetch error:', err)
    return { error: err.message }
  })
```

---

## Verification Results

### API Endpoint Tests
✅ Gwinnett County:
```json
{
  "county": "Gwinnett",
  "registered_voters_2016": 79175,
  "registered_voters_current": 362191,
  "population_growth_absolute": 283016,
  "population_growth_pct": 357.4562677612883,
  "non_voters_2016": 22169,
  "non_voters_current": 126810,
  "turnout_rate_2016": 72,
  "turnout_rate_current": 64.98808639640411
}
```

✅ Fulton County:
```json
{
  "county": "Fulton",
  "registered_voters_2016": 57638,
  "registered_voters_current": 236287,
  "non_voters_2016": 16139,
  "non_voters_current": 82661
}
```

### Frontend Verification
✅ Page DOM contains all population data  
✅ All 4 cards rendering in React component  
✅ Browser no longer throwing 406 errors on API calls  
✅ Data displaying on production at https://gaissues.vercel.app

### Data Visible
- ✅ Registered Voters (2016 → 2026)
- ✅ Turnout Rates (2016 → 2026)
- ✅ Non-Voters counts and percentages
- ✅ Population Change (absolute and percentage)

---

## Deployment

**Commit:** 5a0004e  
**Message:** "Fix: Add CORS headers and improve error logging for county-drift API"  
**Branch:** master  
**Vercel:** ✅ Deployed and live  

---

## Lessons Learned

1. **CORS is critical for browser-to-API communication**
   - Even same-origin requests sometimes need explicit CORS headers
   - Browser "406 Not Acceptable" errors are often CORS-related

2. **Silent error handling can hide bugs**
   - `.catch(() => ({ data: null }))` made the error invisible
   - Better: Log the error, provide fallback with explanation

3. **Test browser behavior separately from server**
   - curl/server-side tests showed API working fine
   - Browser fetch tests revealed the actual issue

4. **Always implement OPTIONS handler for APIs**
   - Browsers send pre-flight OPTIONS requests
   - Server must respond correctly to avoid 406 errors

---

## Summary

| Aspect | Before | After |
|--------|--------|-------|
| Browser API Call | ❌ 406 Error | ✅ 200 OK |
| CORS Headers | ❌ Missing | ✅ Included |
| Population Data | ❌ Not displayed | ✅ Fully visible |
| Non-Voter Data | ❌ Not displayed | ✅ Fully visible |
| Error Logging | ❌ Silent | ✅ Detailed |

**Result:** 🎉 All population and turnout dynamics now displaying correctly on all county pages!
