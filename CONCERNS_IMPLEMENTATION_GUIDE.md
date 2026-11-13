# 🎛️ Multi-Level Concerns System - Implementation Guide

## Quick Overview

The **Multi-Level Concerns System** tracks voter concerns at three levels:
- **🏘️ Local** (County-specific)
- **🏛️ State** (Georgia-wide)
- **🇺🇸 National** (U.S.-wide)

With an **Admin Panel** for managing and automating concern tracking.

---

## 3-Step Implementation

### Step 1: Run Database Schema ✅

Run this SQL in your Supabase SQL Editor:

**File to run:** `CONCERNS_SCHEMA.sql`

```sql
-- Copy the entire contents of CONCERNS_SCHEMA.sql
-- Paste into Supabase SQL Editor
-- Click "Run"
```

**What gets created:**
- ✅ `voter_concerns` table (all 3 levels)
- ✅ `concern_submissions` table (volunteer input)
- ✅ `concern_data_sources` table (automation setup)
- ✅ `concern_metrics` table (trending data)
- ✅ Sample data: 8 national + 8 state + 12 local concerns
- ✅ RLS policies (security)
- ✅ Indexes (performance)
- ✅ Triggers (auto-trending detection)
- ✅ Notifications table

**Verification:**
```sql
-- Run these to verify:
SELECT COUNT(*) FROM voter_concerns;           -- Should be 28
SELECT DISTINCT level FROM voter_concerns;    -- Should show: local, state, national
SELECT COUNT(*) FROM concern_submissions;     -- Should be 0 (for now)
```

---

### Step 2: Create Admin Routes 🛣️

Create the following files in your project:

#### File 1: Main Dashboard Component
**Location:** `src/components/admin/ConcernsAdminDashboard.tsx`

Use the file: `ConcernsAdminDashboard.tsx` from this session.

This provides:
- 📊 Overview dashboard with stats
- 🔥 Trending concerns display
- 📋 Local/state/national tabs
- ✅ Submissions reviewer
- 🎯 Quick action buttons

#### File 2: API Routes
**Location:** `src/app/api/admin/concerns/route.ts`

Use the file: `route.ts` from this session.

This provides:
- `GET /api/admin/concerns` - Fetch concerns
- `POST /api/admin/concerns` - Create concern
- Filtering by level, county, trending
- Full-text search support

#### File 3: Submissions API
**Location:** `src/app/api/admin/concerns/submissions/route.ts`

Use the file: `submissions/route.ts` from this session.

This provides:
- `GET /api/admin/concerns/submissions` - List submissions
- Status filtering (pending, approved, rejected)

---

### Step 3: Add Routes & Navigation 🧭

Add admin page to your app:

#### Create Admin Page
**Location:** `src/app/admin/concerns/page.tsx`

```typescript
import ConcernsAdminDashboard from '@/components/admin/ConcernsAdminDashboard';
import { requireAdmin } from '@/lib/auth';

export default async function AdminConcernsPage() {
  await requireAdmin();
  
  return <ConcernsAdminDashboard />;
}
```

#### Add Navigation Link

In your main navigation/sidebar, add:

```typescript
{/* In navigation menu */}
{userRole === 'Admin' && (
  <NavLink href="/admin/concerns">
    🎛️ Manage Concerns
  </NavLink>
)}
```

#### Protect Route with Middleware

Update `src/middleware.ts`:

```typescript
const adminRoutes = ['/admin/concerns'];

if (adminRoutes.some(route => pathname.startsWith(route))) {
  const profile = await getProfile();
  
  if (profile?.role !== 'Admin') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }
}
```

---

## Features by Component

### 1. Admin Dashboard Overview

**Stats displayed:**
- Total concerns (all levels)
- Local concerns count
- State concerns count
- National concerns count
- 🔥 Trending concerns count
- 📋 Pending submissions count

**Trending concerns:**
- Shows top 10 trending concerns
- Displays level (local/state/national)
- Shows mention count and % change
- Color-coded by importance

**Quick actions:**
- Manage local concerns
- Review submissions
- Manage data sources
- View analytics

### 2. Concerns Manager (by Level)

**For each level (Local, State, National):**

**Filters:**
- 🔍 Search by topic
- 📍 Filter by county (local only)
- 🔥 Show trending only

**Displays:**
- Concern topic
- Description
- Frequency rating (1-10)
- Mention count
- Trending status
- Edit/Delete buttons

**Actions:**
- ➕ Add new concern
- ✏️ Edit existing
- 🗑️ Delete
- 🔥 Flag as trending
- 📊 View metrics

### 3. Submissions Reviewer

**Pending submissions:**
- Volunteer name and county
- Topic and date
- Full quote from voter
- Demographics (if provided)

**Coordinator actions:**
- ✅ Approve (merges into concern)
- ❌ Reject (marks as not relevant)
- 💬 Add coordinator notes
- Sort by date/county

---

## How to Use (Admin Instructions)

### First Time Setup (5 minutes)

1. **Go to dashboard**
   ```
   Navigate to /admin/concerns
   ```

2. **Review all concerns**
   - Overview tab shows trending
   - Local/State/National tabs show all concerns by level
   - Search feature finds specific topics

3. **Set up data sources** (optional)
   - Add Facebook groups to monitor
   - Add news sources
   - Add Reddit communities
   - Configure sync frequency

### Daily Workflow (10 minutes)

1. **Check trending**
   - Open Overview tab
   - See what's trending this week
   - Plan messaging around trends

2. **Review submissions**
   - Click Submissions tab
   - Approve volunteer inputs
   - Add coordinator notes if needed
   - Merge related concerns

3. **Update concerns**
   - Edit frequency ratings based on feedback
   - Add new resolution suggestions
   - Update description if trends change

### Weekly Workflow (30 minutes)

1. **Analyze trends**
   - Which concerns are rising?
   - Which are declining?
   - Which are county-specific?

2. **Create strategies**
   - Add talking points to concerns
   - Link to activities volunteers can do
   - Create counter-messaging

3. **Share insights**
   - Export analytics report
   - Share with county leaders
   - Use for messaging planning

---

## Data Entry Methods

### Method 1: Volunteer Submissions
Volunteers report concerns via activity form:

```
"What concerns did this voter mention?"
[Dropdown - auto-populated from concerns]
[Add new concern button]

This automatically creates a concern_submission
that coordinator must approve/reject.
```

### Method 2: Direct Admin Entry
Admin can manually enter:

```
Topic: [Healthcare Access]
Level: [Local/State/National]
County: [Fulton] (if local)
Description: [What is the concern?]
What voters say: [Sample quote]
Frequency: [1-10 scale]
Demographics: [Who cares most?]
Resolution: [How to address?]
```

### Method 3: Automated Detection
Automated sources continuously monitor:

- Facebook groups (keywords)
- News articles (topic extraction)
- Reddit posts (sentiment analysis)
- Polling data (concern frequency)
- Volunteer forms (auto-tagging)

When high-frequency keywords detected:
→ System suggests new concern
→ Admin approves/modifies
→ Auto-created in database

---

## Sample Data Included

### National Concerns (8)
1. ✅ Inflation & Cost of Living (Freq 9, Trending)
2. ✅ Border Security (Freq 9, Trending)
3. ✅ Crime & Safety (Freq 8, Trending)
4. ✅ Healthcare Costs (Freq 8)
5. ✅ Education - School Choice (Freq 7)
6. ✅ Job Market & Wages (Freq 7)
7. ✅ Energy & Gas Prices (Freq 7, Trending)
8. ✅ Government Overreach (Freq 6)

### State Concerns (8)
1. ✅ Education Funding (Freq 8)
2. ✅ Traffic & Transportation (Freq 8)
3. ✅ Property Taxes (Freq 7)
4. ✅ Healthcare Access (Freq 7)
5. ✅ Agriculture Support (Freq 6)
6. ✅ Voter ID & Election Integrity (Freq 6)
7. ✅ Youth Opportunity (Freq 5)
8. ✅ Broadband Access (Freq 5)

### Local Concerns by County (12)
**Fulton** (4):
- I-85 Infrastructure (Freq 9, Trending, 47 mentions)
- MARTA Expansion (Freq 8)
- Affordable Housing Crisis (Freq 9, Trending)
- School Quality in APS (Freq 7)

**Gwinnett** (3):
- Population Growth Management (Freq 8, Trending)
- School Overcrowding (Freq 8)
- Road Congestion (Freq 8)

**Cobb** (2):
- Property Taxes & Millage (Freq 7)
- School Curriculum (Freq 6)

**DeKalb** (2):
- Public Safety & Police (Freq 8, Trending)
- Homeless Crisis (Freq 7)

**Clayton** (2):
- Job Opportunities (Freq 7)
- School Safety (Freq 7)

**Others** (Rural):
- Broadband Access
- Agricultural Support
- Rural Healthcare

---

## API Reference

### Endpoints Created

```
GET    /api/admin/concerns?level=local&county=Fulton
       Fetch concerns with filters

POST   /api/admin/concerns
       Create new concern

GET    /api/admin/concerns/submissions?status=pending
       Get pending submissions for review

POST   /api/admin/concerns/submissions/:id/approve
       Approve and merge volunteer submission

POST   /api/admin/concerns/submissions/:id/reject
       Reject volunteer submission

GET    /api/admin/concerns/stats
       Get overview statistics

GET    /api/admin/concerns/trending
       Get top 10 trending concerns
```

---

## Customization

### Add Your Counties
Replace sample counties with your target counties:

```sql
UPDATE voter_concerns 
SET county = 'YourCounty'
WHERE county = 'Fulton'
```

### Add Concern Topics
Edit the sample concerns to match your priorities:

```sql
UPDATE voter_concerns
SET concern_topic = 'Your Issue',
    description = 'Your description',
    what_they_say = 'Sample quote'
WHERE concern_topic = 'Road Infrastructure'
```

### Configure Data Sources
In `/admin/concerns`, click "🤖 Data Sources" to:
- Enable/disable monitoring
- Add keywords to track
- Set sync frequency
- Add geographic focus

---

## Troubleshooting

**Problem:** Admin page shows no concerns

**Solution:**
1. Verify schema was run: `SELECT COUNT(*) FROM voter_concerns;`
2. Check API route exists and is readable
3. Verify user has 'Admin' role
4. Check browser console for API errors

**Problem:** Submissions not appearing

**Solution:**
1. Verify `concern_submissions` table exists
2. Check that volunteers have correct county set
3. Verify API endpoint is working
4. Check RLS policies allow read

**Problem:** Data not syncing from automated sources

**Solution:**
1. Verify `concern_data_sources` table has active entries
2. Check API keys are valid
3. Review source-specific configuration
4. Check sync logs in Supabase

---

## Performance Tips

**For large datasets (10,000+ concerns):**

1. Use indexes (already created)
2. Paginate results:
   ```
   LIMIT 50 OFFSET 0
   ```

3. Filter before search:
   ```
   WHERE level = 'local' AND county = 'Fulton'
   AND description ILIKE '%keyword%'
   ```

4. Archive old concerns
5. Batch process submissions

---

## Next Steps

**Phase 1 (Complete):**
- ✅ Database schema
- ✅ Admin dashboard
- ✅ Sample data
- ✅ Manual entry workflow
- ✅ Volunteer submissions

**Phase 2 (Next):**
- ⏳ Social media automation
- ⏳ News API integration
- ⏳ Trending alerts
- ⏳ Advanced analytics
- ⏳ Natural language processing

**Phase 3 (Future):**
- ⏳ Predictive trending
- ⏳ Sentiment analysis
- ⏳ County comparison
- ⏳ Response effectiveness tracking
- ⏳ Mobile app notifications

---

**Your concerns dashboard is ready to deploy!** 🎯

Questions? Check the MULTI_LEVEL_CONCERNS_SYSTEM.md for complete details.
