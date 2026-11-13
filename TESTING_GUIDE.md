# GA Voter Action - Testing Guide

## ✅ Build Status
- **Production Build:** ✓ Successful
- **Dev Server:** ✓ Running on http://localhost:3000
- **Next.js Version:** 16.4.6 (Turbopack)

## 🚀 Setup Before Testing

### 1. Configure Supabase Credentials

You need a Supabase project. Follow the SETUP.md guide to:
1. Create a Supabase project at https://supabase.com
2. Create the database schema using SUPABASE_SCHEMA.sql
3. Get your credentials:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY

Update `.env.local` with real values:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Restart the dev server: `npm run dev`

### 2. Seed the Database

Run the seed endpoint to populate reference data:
```bash
curl -X POST http://localhost:3000/api/seed \
  -H "Authorization: Bearer dev-seed-key-change-in-production" \
  -H "Content-Type: application/json"
```

This populates:
- ✓ 159 Georgia counties
- ✓ Suggested activities (daily/weekly/monthly)
- ✓ Talking points and education topics
- ✓ Election results and demographics

### 3. Configure OAuth (Optional but recommended)

For social login testing:

**Google OAuth:**
1. Go to Google Cloud Console (https://console.cloud.google.com)
2. Create a new project
3. Enable "Google+ API"
4. Create OAuth 2.0 credentials (Web application)
5. Add redirect URI: `http://localhost:3000/auth/callback`
6. Copy Client ID & Secret to Supabase Auth settings

**Similar process for Apple & Facebook** - see SETUP.md for details

## 📋 Testing Checklist

Run through these tests in order:

### Phase 1: Authentication
- [ ] Unauthenticated user sees homepage with county grid
- [ ] "Sign In to Participate" button visible
- [ ] Navigate to `/auth/login` - login page displays
- [ ] Email login form accepts input
- [ ] OAuth buttons visible (Google, Apple, Facebook)
- [ ] Can toggle between signin/signup modes
- [ ] Email validation works (rejects invalid emails)

### Phase 2: Post-Login Onboarding
- [ ] After login → redirected to `/onboarding`
- [ ] Username field shows with validation messages
- [ ] Username uniqueness checked against database
- [ ] County dropdown loads with all 159 Georgia counties
- [ ] Can select "Statewide" or specific county
- [ ] "Continue" button creates profile and redirects to dashboard

### Phase 3: Dashboard & Map
- [ ] Dashboard page loads for selected county
- [ ] County name displays at top
- [ ] Map shows all counties (currently buttons, later SVG)
- [ ] Map counties are styled appropriately:
  - On first login: should be blue
  - As activities logged: should shift toward red
- [ ] Homepage map updates reflect current login state
- [ ] Can switch counties by clicking different counties on map

### Phase 4: Election Results Card
- [ ] Election results card displays for county
- [ ] Shows local county totals and statewide totals
- [ ] "Votes needed to flip state" calculation is accurate
- [ ] Data updates correctly when switching counties
- [ ] Error handling if no data available
- [ ] Statewide election results show 2026 data

### Phase 5: Exit Polls Card
- [ ] Exit polls card displays full questions from table
- [ ] Shows response options and percentages
- [ ] Displays party split (% Republican vs Democrat)
- [ ] Can view multiple poll questions
- [ ] Card remains readable on mobile
- [ ] Sourcing information visible

### Phase 6: Demographics Card
- [ ] Demographics card shows age breakdowns:
  - 18-29, 30-44, 45-64, 65+
- [ ] Shows race/ethnicity breakdown:
  - White, Black, Hispanic, Asian/Other
- [ ] County notes display (if available)
- [ ] "Refreshed quarterly" label visible
- [ ] Updates when switching counties
- [ ] Handles missing data gracefully

### Phase 7: Activity Logger
- [ ] Activity dropdown shows all suggested activities
- [ ] Activities grouped by cadence (daily/weekly/monthly)
- [ ] Can select activity
- [ ] Photo upload input available
- [ ] Photo preview works
- [ ] Notes text area accepts input
- [ ] "Log Activity" button submits data
- [ ] Success message displays after submission
- [ ] Points awarded correctly:
  - Standard activities: base points
  - With photo: bonus points
  - Matches `suggested_activities.points` value

### Phase 8: Points & County Colors
- [ ] After logging activity, county's activity_score increases
- [ ] User's total points increase
- [ ] Map county color shifts from blue toward red based on intensity:
  - More activities = more red
  - Less activities = more blue
- [ ] Color formula: `rgb(intensity, 0, 255-intensity)`
- [ ] County remains as user's default next login
- [ ] Points are persistent across sessions

### Phase 9: Additional Pages
- [ ] Talking Points page loads
  - Shows latest talking points from database
  - Format displays title, content, source, date
- [ ] Education page loads
  - Shows pre-populated topics (Election Integrity, School Choice, etc.)
  - Can expand/collapse topics
  - Content displays clearly
- [ ] Public Directory page loads
  - Shows opt-in user profiles
  - Displays username, county, points (if show_real_name = true)
  - Can search/filter profiles
- [ ] Badges page loads
  - Shows user badges (empty initially)
  - Displays leaderboard/winners
  - Can award badges (admin function)
- [ ] Profile page loads
  - Shows current user's stats
  - Option to make full name public/private
  - Can share public profile link
  - Public profile link works and shows correct data

### Phase 10: Mobile Responsiveness
- [ ] Homepage responsive on mobile (< 640px)
- [ ] Dashboard responsive on mobile
- [ ] Activity logger works on small screens
- [ ] Photo upload works on mobile
- [ ] County map buttons stack properly on mobile
- [ ] Text readable at mobile zoom levels
- [ ] Bottom navigation visible on mobile (if implemented)
- [ ] Buttons have adequate touch targets (48px minimum)

### Phase 11: Sharing & Social
- [ ] Talking points have copy/share buttons
- [ ] "Copy message to group" generates proper share text
- [ ] WhatsApp/Signal share links are clickable
- [ ] Public profile link can be copied/shared
- [ ] Shared links work when opened in incognito/new browser

### Phase 12: Data Persistence & RLS
- [ ] After logout → login as different user
- [ ] Cannot see other user's private data
- [ ] Can only modify own profile
- [ ] Cannot modify other users' activities
- [ ] Public data (counties, elections, demographics) visible to all
- [ ] Permission denied errors handled gracefully
- [ ] Activity photos are accessible via Supabase Storage

### Phase 13: Error Handling
- [ ] Supabase connection error → graceful message
- [ ] Missing environment variables → helpful error
- [ ] Invalid session → redirect to login
- [ ] Failed photo upload → error message
- [ ] Database query failures → user-friendly messages
- [ ] Network timeouts → retry or fallback

### Phase 14: Performance
- [ ] Homepage loads < 2 seconds
- [ ] Dashboard loads < 2 seconds
- [ ] Activity submission < 1 second
- [ ] Map interaction responsive
- [ ] No console errors when loading pages
- [ ] Images/assets load properly

### Phase 15: Data Accuracy
- [ ] All 159 Georgia counties present
- [ ] County names spelled correctly
- [ ] Election results for major counties present
- [ ] Election results show 2026 data
- [ ] Demographics available for tracked counties
- [ ] Suggested activities have correct point values
- [ ] Cadence (daily/weekly/monthly) correct

### Phase 16: Deployment Ready
- [ ] GitHub repository created and linked
- [ ] Vercel deployment connected
- [ ] Environment variables set in Vercel
- [ ] Production build succeeds (`npm run build`)
- [ ] Custom domain configured (optional)
- [ ] Monitoring/error tracking configured (optional)

## 🐛 Debugging Tips

### Dev Server Issues
```bash
# Kill all node processes and restart
taskkill /F /IM node.exe
npm run dev
```

### Clear Cache & Rebuild
```bash
rm -r .next node_modules
npm install
npm run build
```

### Check Supabase Connection
```bash
# Look at browser console for auth/database errors
# Check Supabase dashboard for real-time logs
# Verify RLS policies in Supabase SQL editor
```

### Verify Database Schema
```sql
-- In Supabase SQL Editor
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

### Check API Seeding Status
```bash
# Monitor browser console (Network tab)
# Check Response tab for seed endpoint details
curl -v http://localhost:3000/api/seed
```

## 📊 Expected Test Results

After successful testing, you should have:
- ✓ 1 authenticated user profile
- ✓ 0-N logged activities
- ✓ 159 counties populated
- ✓ Updated activity_score in 1+ counties
- ✓ User with shifted points
- ✓ Map showing color transitions

## 🚀 Post-Testing Steps

1. **Fix any failing tests** - Update components as needed
2. **Verify production build** - `npm run build && npm start`
3. **Deploy to Vercel** - `git push` auto-deploys
4. **Monitor in production** - Check Vercel dashboard for errors
5. **Iterate** - Gather user feedback and improve features

## 📝 Notes

- Middleware deprecation warning is safe to ignore (Next.js 16 feature)
- Build time ~4-5 seconds with Turbopack
- Dev server supports fast refresh for rapid iteration
- All schema RLS policies are in place but verify permissions work
- Seed data can be re-run safely (uses upsert for idempotency)
