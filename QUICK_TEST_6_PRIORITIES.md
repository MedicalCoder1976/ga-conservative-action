# Quick Test Guide - 6 Priority Fixes

## Test 1: Verify Map Loads with SVG
```bash
# 1. Start dev server
npm run dev

# 2. Open http://localhost:3000
# Expected: Interactive map appears with counties in grid layout
# Counties should be colored Blue/Purple/Red based on activity scores
```

**Verify:**
- [ ] Map displays without errors
- [ ] Each county is a clickable button/element
- [ ] Hover shows tooltip with county name
- [ ] Click county → routes to `/dashboard/[countyname]`
- [ ] Responsive on mobile (grid collapses to 3-4 columns)

---

## Test 2: Activity Logger in County Dashboard
```bash
# 1. Login at http://localhost:3000/auth/login
# Use any OAuth provider (Google, GitHub, etc.)

# 2. You'll be redirected to /dashboard (the map)
# 3. Click any county (e.g., Fulton)
# Expected: Shows county dashboard at /dashboard/Fulton
```

**Verify:**
- [ ] After login, redirected to `/dashboard` (not `/onboarding`) ✅ PRIORITY 6
- [ ] County page loads without errors
- [ ] Scroll down to "LOG ACTIVITY" section
- [ ] Activity Logger form visible (not "coming soon" placeholder) ✅ PRIORITY 2
- [ ] Form has:
  - [ ] Activity type dropdown (populated from database)
  - [ ] Photo upload input
  - [ ] Optional notes textarea
  - [ ] Submit button

**Test the Form:**
- [ ] Select an activity type
- [ ] Upload a test image
- [ ] Add optional notes
- [ ] Click "Log Activity"
- [ ] Success message appears
- [ ] Points awarded shown

---

## Test 3: Education Topics Seeding
```bash
# In terminal, seed the education topics:
curl http://localhost:3000/api/seed-education

# Expected JSON response:
{
  "success": true,
  "message": "Education topics seeded successfully",
  "count": 8,
  "topics": [...]
}
```

**Verify:**
- [ ] Endpoint returns HTTP 200
- [ ] Returns success: true
- [ ] Count shows 8 topics
- [ ] Topics include all 8 expected topics

**Then test the education page:**
- [ ] Navigate to http://localhost:3000/education
- [ ] See all 8 topics displayed
- [ ] Topics grouped by category:
  - [ ] Elections (1 topic)
  - [ ] Education (2 topics)
  - [ ] Economy (2 topics)
  - [ ] Security (1 topic)
  - [ ] Liberty (1 topic)
  - [ ] Government (1 topic)
- [ ] Click topic to expand/collapse content

---

## Test 4: Footer Links
**Verify at http://localhost:3000:**
- [ ] Footer visible at bottom
- [ ] "How It Works" link works
- [ ] "Talking Points" link works → `/talking-points` loads
- [ ] "Education" link works → `/education` loads

---

## Test 5: County Intelligence Section
**From any county dashboard (e.g., /dashboard/Fulton):**
- [ ] Scroll to "COUNTY INTEL" section
- [ ] Click to expand
- [ ] Section shows:
  - [ ] "2026 Election Results" with Republican/Democrat percentages
  - [ ] Vote totals needed to flip county
  - [ ] Population demographics (age, race/ethnicity)
  - [ ] Voter priorities from exit polls (3+ questions)

---

## Test 6: Responsive Design
**On mobile device or browser dev tools:**
- [ ] Homepage map responsive (columns 3-6 depending on screen)
- [ ] County dashboard fully readable on mobile
- [ ] Activity Logger form responsive
- [ ] All buttons/links clickable on touch

---

## Database Queries to Verify

### Check Education Topics Seeded
```sql
SELECT COUNT(*) FROM education_topics;
-- Expected: 8 rows

SELECT DISTINCT category FROM education_topics ORDER BY category;
-- Expected: Economy, Education, Elections, Government, Liberty, Security
```

### Check Activity Logging Works
```sql
SELECT COUNT(*) FROM activities WHERE created_at > NOW() - INTERVAL '5 minutes';
-- Should increase after you log an activity
```

### Check County Scores Updated
```sql
SELECT name, activity_score FROM counties WHERE activity_score > 0 LIMIT 5;
-- Should show updated scores from activities
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Map not loading | Check Supabase connection in `.env.local` |
| Activity Logger not showing | Verify you're logged in (check data.user in page) |
| Education seeding fails | Check Supabase is online and `education_topics` table exists |
| Redirect loop after login | Verify `/dashboard/page.tsx` exists |
| Photos not uploading | Check `activity-photos` bucket exists in Supabase Storage |

---

## Build Verification
```bash
npm run build
# Expected output:
# ✓ Compiled successfully in 572ms
# ✓ Running TypeScript ...
# ✓ Finished TypeScript in 2.0s

# No TypeScript errors should appear
```

---

**All 6 fixes should pass these tests!** ✅
