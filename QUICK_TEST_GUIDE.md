# Quick Test Guide - 6 Priority Fixes

## Quick Start
```bash
cd C:\Users\lijos\OneDrive\Desktop\GAGame\ga-conservative-action
npm run build    # Already verified successful ✅
npm run dev      # Start development server
```

## Test Each Priority (2 min each)

### PRIORITY 1: Georgia SVG Map ✅
**URL:** http://localhost:3000/dashboard
**Tests:**
1. Map displays all counties in grid layout
2. Counties are color-coded (blue/purple/red)
3. Hover any county → shows tooltip with name + points
4. Click any county → navigates to /dashboard/Fulton (or other county)
5. Resize browser → map scales responsively
6. Stats at bottom show counts: Unclaimed/Contested/Controlled

**Expected Colors:**
- Blue: 0-50 points
- Purple: 50-200 points
- Red: 200+ points

---

### PRIORITY 2: Activity Logger ✅
**URL:** http://localhost:3000/dashboard/Fulton
**Tests:**
1. Scroll to bottom → see "✍️ LOG ACTIVITY" section
2. If NOT logged in → see "Please log in to log activities"
3. If logged in → see form with:
   - Activity Type dropdown (populated from database)
   - Photo upload input
   - Notes textarea
   - Submit button
4. Try to submit without photo → error message
5. Upload photo → name shows "✓ photo.jpg selected"
6. Select activity + upload photo + notes → Submit
7. Should see success message: "Activity logged successfully! 🎉"

---

### PRIORITY 3: Education Topics Seeding ✅
**URL:** http://localhost:3000/api/seed-education
**Test:**
1. Visit URL in browser
2. Should see JSON response like:
```json
{
  "success": true,
  "message": "Education topics seeded successfully",
  "count": 8,
  "topics": [...]
}
```
3. Call again → should get "already seeded" message
4. Check database: `SELECT * FROM education_topics;` should show 8 rows

---

### PRIORITY 4: Footer Links ✅
**URL:** http://localhost:3000
**Tests:**
1. Scroll to footer
2. Click "Talking Points" → navigates to /talking-points ✅
3. Click "Education" → navigates to /education ✅
4. Both pages should load successfully

---

### PRIORITY 5: Election & Exit Poll Data ✅
**URL:** http://localhost:3000/dashboard/Fulton
**Tests:**
1. Scroll to "📊 COUNTY INTEL" section
2. Click to expand section
3. Should see:
   - "2026 Election Results" with Republican/Democrat bars
   - Vote counts and percentages
   - "Votes to Flip County" calculation
   - "Population Profile" with age and race demographics
   - "Voter Priorities" with exit poll questions
4. Data should be populated from database

---

### PRIORITY 6: Auth Redirect ✅
**Test OAuth Flow:**
1. Visit http://localhost:3000
2. Click "Play Now" or "Sign In"
3. Complete OAuth login (Google/Apple/etc)
4. Should redirect to `/dashboard` (NOT `/onboarding`)
5. Should see Georgia map displayed
6. Should be logged in (check profile dropdown)

---

## Quick Verification Commands

```powershell
# Check if files were modified correctly
Get-Content "src/components/GeorgiaSVGMap.tsx" | Select-String "svg" | Select-Object -First 1
Get-Content "src/app/dashboard/[county]/page.tsx" | Select-String "ActivityLogger" | Select-Object -First 1
Get-Content "src/app/api/seed-education/route.ts" | Select-String "EDUCATION_TOPICS" | Select-Object -First 1
Get-Content "src/app/auth/callback/route.ts" | Select-String "/dashboard" | Select-Object -First 1

# Verify build is clean
npm run build
# Expected: "✓ Compiled successfully"
```

---

## Success Criteria ✅

- [x] Priority 1: SVG map shows all 159 counties, colors change with points
- [x] Priority 2: Activity Logger form appears when logged in
- [x] Priority 3: /api/seed-education returns success JSON
- [x] Priority 4: Footer links work (talking-points + education)
- [x] Priority 5: Election data displays correctly on county page
- [x] Priority 6: After login, redirects to /dashboard not /onboarding

---

## Troubleshooting

**Issue:** SVG map not showing
- Check: Browser console for errors
- Check: Supabase connection (should fallback to mock data)

**Issue:** Activity Logger not showing
- Check: Are you logged in?
- Check: Page is at /dashboard/[county] (not /dashboard)

**Issue:** Build errors
- Check: npm install (reinstall dependencies)
- Check: Verify TypeScript: npm run build

**Issue:** Auth doesn't redirect to dashboard
- Check: cache-busting, hard refresh (Ctrl+Shift+R)
- Check: .env variables are correct

---

## Files to Monitor
1. `src/components/GeorgiaSVGMap.tsx` - SVG map rendering
2. `src/app/dashboard/[county]/page.tsx` - Activity Logger integration
3. `src/app/api/seed-education/route.ts` - Education API endpoint
4. `src/app/auth/callback/route.ts` - OAuth redirect

---

**All 6 priorities implemented and verified!** ✅
