## GA ISSUES - COMPLETE IMPLEMENTATION GUIDE

This document outlines the exact steps to complete all 18 feature categories.

### IMMEDIATE ACTION - DATABASE SEEDING

**File:** `supabase_seed_complete_data.sql`
**Location:** `ga-conservative-action/supabase_seed_complete_data.sql`

Run this SQL in your Supabase SQL Editor (https://app.supabase.com/project/[YOUR-PROJECT]/sql):

1. Open Supabase → SQL Editor
2. Click "New Query"
3. Copy entire contents of `supabase_seed_complete_data.sql`
4. Paste into the editor
5. Click "Run"

This will populate:
- ✅ 10 Education Topics
- ✅ 5 Talking Points with sources
- ✅ 10+ Suggested Activities
- ✅ Election Results (2026 Governor)
- ✅ Exit Polls (National + AJC/UGA)
- ✅ Demographics (10 major counties)

### TIER 1 TASKS (Critical - Blocks UI)

**Task 1.1: Verify Database Seeding**
- [ ] Check `education_topics` table has 10 rows
- [ ] Check `talking_points` table has 5+ rows
- [ ] Check `election_results` table has 100+ rows
- [ ] Check `exit_polls` table has 20+ rows
- [ ] Check `demographics` table has 10+ rows

**Task 1.2: Update Education Page Component**
```
File: src/app/education/page.tsx
Needs: Fetch from education_topics table, display with content
```

**Task 1.3: Update Talking Points Page Component**
```
File: src/app/talking-points/page.tsx
Needs: Fetch from talking_points table, display daily updates
```

**Task 1.4: Add County Dashboard Data Displays**
```
File: src/app/dashboard/[county]/page.tsx
Needs to add 4 new sections:
  1. Election Results (county vs statewide)
  2. Exit Polls (all 6 national + GA crucial factors)
  3. Demographics (age/race with quarterly label)
  4. Talking Points (suggested messages per county)
```

### TIER 2 TASKS (Display & UX)

**Task 2.1: Replace Map Component**
- [ ] Replace GeorgiaCountyMapSVG.tsx with GeorgiaCountyMapNew.tsx
- [ ] Update imports in page.tsx
- [ ] Test map colors change (gray→blue→red)
- [ ] Test click navigation to counties

**Task 2.2: Implement Election Results Display**
- Shows: County name, Republican %, Democrat %, total votes
- Shows: Statewide comparison
- Calculates: "Need X more votes to flip state"

**Task 2.3: Implement Exit Polls Display**
- Shows: All 6 national issues with % and party split
- Shows: AJC/UGA poll results
- Shows: Georgia-specific crucial/major factors
- Format: Clean table or cards with percentages

**Task 2.4: Implement Demographics Display**
- Shows: Age distribution (18-29, 30-44, 45-64, 65+)
- Shows: Race/ethnicity breakdown
- Label: "Refreshed quarterly – Last refresh: Q4 2026"

### TIER 3 TASKS (Advanced Features)

**Task 3.1: Photo Upload for Activities**
- Add file input to activity logger
- Upload to Supabase Storage bucket `activity-photos`
- Store photo_url in activities table
- Show photo preview in activity history

**Task 3.2: Implement Points System**
- Blue-area multiplier: Apply 1.5x points for blue counties (Fulton, DeKalb, etc)
- Cadence bonuses: Daily bonus if logged activity, Weekly bonus, Monthly bonus
- Update county activity_score when activity logged
- Update user points in profiles table

**Task 3.3: Implement Badges System**
- Weekly winners page: Top 5 users this week
- Monthly winners page: Top 5 users this month
- Badge awarding: Users can award recognition badges
- Auto-badges: Award at thresholds (100 pts, 500 pts, 1000 pts)

**Task 3.4: Implement WhatsApp/Signal Sharing**
- Add "Copy to WhatsApp" button on talking points
- Add "Copy to Signal" button on missions
- Generate pre-formatted messages for group chats

### TIER 4 TASKS (Authentication)

**Task 4.1: Implement Social Login**
- Enable Google OAuth in Supabase Auth
- Enable Apple OAuth in Supabase Auth
- Enable Facebook OAuth in Supabase Auth
- Update auth/login page to show all options (remove "Coming Soon")

**Task 4.2: Test Username Workflow**
- After social login, redirect to username selection
- Verify username is public
- Verify real name stays private unless opted in
- Test privacy controls in profile settings

### TIER 5 TASKS (Admin & Data)

**Task 5.1: Create Admin Panel**
- Route: /admin/content
- Manage talking points (create, edit, delete, publish)
- Manage education topics
- Manage suggested activities
- Require admin role to access

**Task 5.2: Seed Public Directory**
- Create 5-10 test user profiles
- Set show_real_name = true for some
- Add various points/badges
- Make publicly discoverable

### TIER 6 TASKS (Testing & Launch)

**Task 6.1: Comprehensive Testing**
- [ ] Social login works
- [ ] Username vs real name separation
- [ ] Map colors change correctly
- [ ] County dashboard loads all data
- [ ] Activity logger works + awards points
- [ ] Photos upload successfully
- [ ] Badges display and can be awarded
- [ ] Public profiles are discoverable
- [ ] WhatsApp/Signal sharing works
- [ ] Mobile layout is responsive

**Task 6.2: Remove Placeholder Text**
- [ ] Audit every page for "Coming Soon"
- [ ] Audit for "No data available"
- [ ] Audit for "Placeholder"
- [ ] All core features show real content

---

## IMPLEMENTATION ORDER

1. **Right Now:** Run the seed SQL in Supabase
2. **Next:** Update Education & Talking Points pages
3. **Then:** Update County Dashboard with data displays
4. **Then:** Replace map component
5. **Then:** Implement activity photo upload
6. **Then:** Implement points system
7. **Continue:** Badges, sharing, social login
8. **Finally:** Admin panel, testing, polish

---

## FILES TO CREATE/UPDATE

**New Components:**
- `GeorgiaCountyMapNew.tsx` (✅ already created)
- Components for election results display
- Components for exit polls display
- Components for demographics display
- Components for badges display

**Updated Pages:**
- `app/education/page.tsx` (show real topics)
- `app/talking-points/page.tsx` (show real talking points)
- `app/dashboard/[county]/page.tsx` (add 4 new sections)
- `app/page.tsx` (replace map component)
- `app/badges/page.tsx` (winners + badges)
- `app/directory/page.tsx` (seed + show users)

**New Routes:**
- `app/admin/content/page.tsx` (admin panel)

---

## SQL FILES TO RUN

1. `supabase_seed_complete_data.sql` - Seed all content
2. Optional: Migration to add `quarterly_refresh` columns if needed

---

## TESTING CHECKLIST

After each tier:
- [ ] No console errors
- [ ] All data loads
- [ ] Mobile looks good
- [ ] No placeholder text
- [ ] All buttons work
- [ ] Navigation works
