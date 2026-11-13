# GA Voter Action - Full Implementation Guide

## Project Status
- **Phase**: Core infrastructure in place, components in progress
- **Stack**: Next.js 16+ (App Router), Vercel, Supabase, TypeScript, Tailwind CSS

## Completed
- ✅ Project setup with Next.js, Tailwind, TypeScript
- ✅ Supabase client configuration
- ✅ Database schema SQL (ready for execution)
- ✅ Authentication middleware
- ✅ Database types
- ✅ UI Component base (Button, Card, Input)
- ✅ Homepage with county grid placeholder
- ✅ Login page with OAuth and email options
- ✅ Auth callback handler

## In Progress / To Do

### 1. Database Setup (CRITICAL - Must complete first)
- [ ] Run SUPABASE_SCHEMA.sql in Supabase SQL Editor
- [ ] Verify all tables created with RLS enabled
- [ ] Set environment variables in .env.local and Vercel:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY

### 2. Onboarding Flow
Create `/src/app/onboarding/page.tsx`:
- Form to set username (check uniqueness against profiles table)
- Form to select county (dropdown of all 159 Georgia counties)
- Create profile record in profiles table
- Redirect to dashboard after completion

### 3. County Dashboard
Create `/src/app/dashboard/[county]/page.tsx`:
- Display county name with activity score
- **Election Results Card**:
  - Show county 2026 results (R vs D votes)
  - Show state totals
  - Calculate "votes needed to flip state"
- **Exit Polls Card**:
  - Display all questions from exit_polls table
  - Show response percentages
  - Show party splits (R/D breakdown)
- **Demographics Card**:
  - Age breakdown: 18-29, 30-44, 45-64, 65+
  - Race/ethnicity: White, Black, Hispanic, Asian/Other
  - "Refreshed quarterly" label
- **Suggested Activities**:
  - Pull from suggested_activities table filtered by cadence
  - Show daily/weekly/monthly targets
  - Include point values
- **Activity Logger**:
  - Dropdown of activity types (from suggested_activities)
  - Photo upload to Supabase Storage (activity-photos bucket)
  - Notes text field
  - Submit button that:
    - Creates activity record
    - Awards points to user (update profiles.points)
    - Increases county activity_score
    - Triggers color shift calculation

### 4. County Map
Create `/src/app/components/CountyMap.tsx`:
- Display 159 Georgia counties
- Starts blue (2026 Democratic baseline)
- Color shifts from blue → red based on activity_score
- On login: set favorite county
- On activity: update county color intensity
- Color calculation: `rgb(intensity, 0, 255-intensity)` where intensity is based on activity_score
- Alternative MVP: Simple button grid instead of SVG map

### 5. Data Seeding
Create `/src/lib/seed-data.ts` with functions to populate:
- **Counties**: All 159 Georgia counties (with FIPS codes)
- **Election Results**: 2026 statewide + major counties (R vs D votes and percentages)
- **Exit Polls**: Full exit poll questions with party splits
- **Demographics**: Age/race breakdown for major GA counties
- **Suggested Activities**: 
  - Canvassing (50 points, daily)
  - Phone banking (30 points, daily)
  - Social media posts (20 points, daily)
  - Letters to voters (40 points, weekly)
  - Community outreach (60 points, weekly)
  - Attend rally/event (50 points, monthly)
  - Donate (100 points, monthly)
  - Recruit volunteer (150 points, monthly)
- **Talking Points**: Sample talking points with sources
- **Education Topics**: 
  - Election Integrity
  - School Choice
  - Border Security
  - Parental Rights
  - Fiscal Responsibility
  - Constitutional Rights
  - etc.

### 6. Additional Pages
- `/src/app/dashboard/page.tsx`: Main dashboard with personal stats and county selector
- `/src/app/talking-points/page.tsx`: Display all talking points (paginated)
- `/src/app/education/page.tsx`: Education topics by category
- `/src/app/directory/page.tsx`: Public directory with opt-in profiles
- `/src/app/badges/page.tsx`: View badges, leaderboard
- `/src/app/profile/page.tsx`: User profile settings (show real name toggle, county change, etc.)

### 7. Components to Create
- `CountyMap`: Interactive map or button grid
- `ElectionResultsCard`: Display election data
- `ExitPollsCard`: Display exit polls with party splits
- `DemographicsCard`: Display demographics
- `ActivityLogger`: Form to log activities
- `SuggestedActivitiesList`: List of activities with points
- `TalkingPointsList`: Display talking points
- `PublicDirectory`: List of public profiles
- `BadgesDisplay`: Show user badges and leaderboard
- `PointsIndicator`: Show user current points
- `CountySelector`: Dropdown/modal to select/change county

### 8. Features to Implement
- **Points System**:
  - User logs activity → points awarded
  - profiles.points incremented
  - county activity_score incremented
  - Calculate color_intensity from activity_score
- **Photo Upload**:
  - Use Supabase Storage bucket: activity-photos
  - Upload on activity creation
  - Store photo_url in activities table
- **Public Profile**:
  - `/profile/[username]` route
  - Display username, county, points (if show_real_name=true, also show full_name)
  - Share profile link
- **Badges System**:
  - Award badges manually or automatically
  - Display on profile and public directory
  - Weekly/monthly top performers
- **WhatsApp/Signal Integration**:
  - Generate share message for groups
  - Pre-fill with user stats and talking points
- **Upward Points Flow** (Optional - store in separate table):
  - When volunteer logs points, fraction flows to county leader, etc.
  - Implement via stored procedures or application logic

### 9. Mobile Responsiveness
- All pages must be mobile-first
- Bottom navigation on mobile:
  - Dashboard
  - Map
  - Talking Points
  - Education
  - Profile
- Ensure county map usable on small screens

### 10. Environment Setup
Ensure these are in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Also add to Vercel project settings for production.

### 11. GitHub & Vercel Setup
- [ ] Initialize git repo
- [ ] Create GitHub repository
- [ ] Connect to Vercel
- [ ] Add environment variables to Vercel project
- [ ] Enable automatic deployments on push to main

## Testing Checklist (All must pass before launch)
- [ ] Social login works (Google, Apple, Facebook)
- [ ] Email login works
- [ ] Username creation works and is unique
- [ ] Username is public, full_name is private unless show_real_name=true
- [ ] Map loads on homepage
- [ ] Map loads and is blue after login
- [ ] Can click county and see attach prompt
- [ ] Attach to county → dashboard loads
- [ ] Can log activity with photo
- [ ] Points awarded after activity log
- [ ] County color shifts toward red after activity
- [ ] Election results display correctly
- [ ] Full exit poll questions visible with party splits
- [ ] Demographics card shows by county
- [ ] Suggested daily/weekly/monthly activities appear
- [ ] Public profile opt-in works
- [ ] Can share profile link
- [ ] Badges can be awarded and displayed
- [ ] WhatsApp/Signal share works
- [ ] Talking points and Education load
- [ ] Mobile layout works on all pages
- [ ] RLS policies prevent unauthorized access
- [ ] Can deploy to Vercel without errors

## File Structure
```
src/
  app/
    page.tsx (homepage)
    auth/
      login/page.tsx
      callback/route.ts
    onboarding/page.tsx
    dashboard/
      page.tsx (main dashboard)
      [county]/page.tsx (county dashboard)
    talking-points/page.tsx
    education/page.tsx
    directory/page.tsx
    badges/page.tsx
    profile/
      page.tsx (settings)
      [username]/page.tsx (public profile)
    api/
      seed/route.ts (data seeding endpoint)
  components/
    ui/ (shadcn components)
    CountyMap.tsx
    ElectionResultsCard.tsx
    ExitPollsCard.tsx
    DemographicsCard.tsx
    ActivityLogger.tsx
    ...
  lib/
    supabase/
      client.ts
      server.ts
    types.ts
    seed-data.ts
  middleware.ts
```

## Key Implementation Notes
1. **Server Components**: Use for data fetching, RLS enforcement
2. **Client Components**: Use only for interactivity (forms, modals, updates)
3. **RLS Policies**: All queries must respect RLS (Supabase handles this)
4. **Photo Storage**: Use Supabase Storage for uploads
5. **County Reference**: All activities tied to county for activity aggregation
6. **Color Calculation**: Maps activity_score to blue→red gradient
7. **Data Seeding**: Can be run via API endpoint for one-time setup

## Deployment Checklist
1. Database schema executed in Supabase
2. Environment variables set in .env.local and Vercel
3. GitHub repo created and connected to Vercel
4. Data seeded (counties, elections, demographics, activities, etc.)
5. All pages tested and working
6. RLS policies verified
7. Storage bucket created (activity-photos)
8. OAuth providers configured in Supabase Auth settings
9. Custom domain added to Vercel (if desired)
10. DNS configured (if custom domain)
