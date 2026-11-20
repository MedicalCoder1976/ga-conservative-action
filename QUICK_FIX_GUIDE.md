# Quick Fix Guide - Population Display Issue

## **TL;DR - The Problem**

Your Gwinnett County page shows voter drift but NOT:
- Population change (registered voters 2016 vs 2026)
- Non-voter counts
- Turnout rates

**Why?** Two separate API endpoints. One has drift data (used by county page), the other has population data (not used by county page).

---

## **TL;DR - The Solution**

**2 Files to Update:**

### **1. Fix the API Endpoint** (src/app/api/county-drift/route.ts)
Add population data to the response:
- Fetch registered voters for 2016 and 2026
- Calculate non-voters and turnout rates
- Return with drift data

**Work:** 40 lines added, ~15 minutes

### **2. Update the Component** (src/app/dashboard/[county]/page.tsx)
Display the population data:
- Extract population metrics from API response
- Add new UI section showing population/turnout/non-voters
- Style to match existing design (slate/red theme)

**Work:** 150 lines added, ~30 minutes

---

## **Exact Changes Needed**

### **File 1: src/app/api/county-drift/route.ts**

**Current Code (Line 1-32):**
```typescript
export async function GET(request: NextRequest) {
  try {
    const county = request.nextUrl.searchParams.get('county')

    if (!county) {
      return NextResponse.json({ error: 'County parameter required' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { error: 'Missing Supabase credentials' },
        { status: 500 },
      )
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data, error } = await supabase
      .from('county_drift')
      .select('*')
      .eq('county', decodeURIComponent(county))
      .single()

    if (error) {
      console.error('Drift query error:', error)
      return NextResponse.json({ error: 'County not found' }, { status: 404 })
    }

    return NextResponse.json(data)
```

**Replace With:**
```typescript
export async function GET(request: NextRequest) {
  try {
    const county = request.nextUrl.searchParams.get('county')

    if (!county) {
      return NextResponse.json({ error: 'County parameter required' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { error: 'Missing Supabase credentials' },
        { status: 500 },
      )
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const decodedCounty = decodeURIComponent(county)

    // Get drift data
    const { data: driftData, error: driftError } = await supabase
      .from('county_drift')
      .select('*')
      .eq('county', decodedCounty)
      .single()

    if (driftError) {
      console.error('Drift query error:', driftError)
      return NextResponse.json({ error: 'County not found' }, { status: 404 })
    }

    // Get 2016 voter statistics for population
    const { data: voters2016 } = await supabase
      .from('county_voter_statistics')
      .select('registered_voters, total_votes')
      .eq('county', decodedCounty)
      .eq('election_year', 2016)
      .single()

    // Get 2026 voter statistics for population
    const { data: voters2026 } = await supabase
      .from('county_voter_statistics')
      .select('registered_voters, total_votes')
      .eq('county', decodedCounty)
      .eq('election_year', 2026)
      .single()

    // Calculate population metrics
    const reg2016 = voters2016?.registered_voters || 0
    const reg2026 = voters2026?.registered_voters || 0
    const total2016 = voters2016?.total_votes || 1
    const total2026 = voters2026?.total_votes || 1

    const popGrowth = reg2026 - reg2016
    const popGrowthPct = reg2016 > 0 ? (popGrowth / reg2016) * 100 : 0
    const nonVoters2016 = reg2016 - total2016
    const nonVoters2026 = reg2026 - total2026
    const turnout2016 = (total2016 / (reg2016 || 1)) * 100
    const turnout2026 = (total2026 / (reg2026 || 1)) * 100

    // Merge data
    return NextResponse.json({
      ...driftData,
      registered_voters_2016: reg2016,
      registered_voters_current: reg2026,
      population_growth_absolute: popGrowth,
      population_growth_pct: popGrowthPct,
      non_voters_2016: nonVoters2016,
      non_voters_current: nonVoters2026,
      turnout_rate_2016: turnout2016,
      turnout_rate_current: turnout2026,
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

**What Changed:**
- Added 2 new Supabase queries for voter statistics (2016 and 2026)
- Calculate 6 new metrics (population growth, non-voters, turnout rates)
- Merge population data with drift data before returning

---

### **File 2: src/app/dashboard/[county]/page.tsx**

**Find Line 15-21 (interface CountyData):**
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
}
```

**Replace With:**
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
  population?: {
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

---

**Find the return statement in `getCountyData()` (~line 130):**
```typescript
    return {
      county: countyRes.data || null,
      election: formattedElection,
      demographics: demographicsRes.data || null,
      polls: pollsRes.data || [],
      user: user || null,
      leaders: leadersRes.data || [],
      talkingPoints: pointsRes.data || [],
      podcasters: mockPodcasters,
      drift: driftData,
    }
```

**Replace With:**
```typescript
    // Extract population metrics from drift response
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

    return {
      county: countyRes.data || null,
      election: formattedElection,
      demographics: demographicsRes.data || null,
      polls: pollsRes.data || [],
      user: user || null,
      leaders: leadersRes.data || [],
      talkingPoints: pointsRes.data || [],
      podcasters: mockPodcasters,
      drift: driftData,
      population,
    }
```

---

**Find line ~320 (after the drift section ends):**

The drift section ends with:
```jsx
              </div>
            </div>
          ) : (
            <div className="bg-slate-700/50 rounded-lg p-6 text-center text-slate-400">
              <p>No drift data available yet. Check back after running the voter analysis setup.</p>
            </div>
          )}
        </div>
```

**Add this new section right after:**
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
                  <div className={`pt-3 border-t border-slate-600`}>
                    <span className="text-sm text-slate-400">Change: </span>
                    <span className={`font-bold ${
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
                      ({((data.population.non_voters_2016 / (data.population.registered_voters_2016 || 1)) * 100).toFixed(1)}% of voters)
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-600">
                    <p className="text-sm text-slate-400">2026 Non-Voters</p>
                    <p className="text-2xl font-bold text-slate-200">
                      {data.population.non_voters_current?.toLocaleString() || 'N/A'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      ({((data.population.non_voters_current / (data.population.registered_voters_current || 1)) * 100).toFixed(1)}% of voters)
                    </p>
                  </div>
                </div>
              </div>

              {/* Population Growth */}
              <div className="bg-slate-700/50 rounded-lg p-6 border-l-4 border-yellow-500">
                <h3 className="font-bold text-yellow-400 mb-4">Population Change</h3>
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
                      ? '⚠️ Significant decline - verify data'
                      : data.population.population_growth_pct > 20
                      ? '📈 Strong growth'
                      : data.population.population_growth_pct > 0
                      ? '📊 Modest growth'
                      : '📉 Declining'
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
```

---

## **Testing**

**Step 1: Verify API works**
```bash
curl "http://localhost:3000/api/county-drift?county=Gwinnett" | jq '.registered_voters_2016'
```

Should return a number, not null.

**Step 2: Visit county page**
Navigate to: `http://localhost:3000/dashboard/Gwinnett`

Should see new "POPULATION & TURNOUT DYNAMICS" section with 4 cards.

**Step 3: Check data**
Verify numbers are reasonable and match API response.

---

## **Files to Edit**

1. `ga-conservative-action/src/app/api/county-drift/route.ts` - Add ~40 lines
2. `ga-conservative-action/src/app/dashboard/[county]/page.tsx` - Add ~160 lines

**Total work:** ~200 lines, 45-60 minutes

---

## **Full Documentation**

For more details, see:
- `POPULATION_DISPLAY_DIAGNOSIS.md` - Full problem analysis
- `POPULATION_DISPLAY_SOLUTION_PLAN.md` - Complete implementation guide
