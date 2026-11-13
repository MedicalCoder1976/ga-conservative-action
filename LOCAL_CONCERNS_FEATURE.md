# 🗣️ Local Concerns Section - County Dashboard Feature

## Strategic Objective

Add a **"What Locals Are Saying"** section to each county dashboard that displays:
- The top concerns residents in that specific county are talking about
- Frequency of concern mentions (how often volunteers hear it)
- Geographic specificity (what matters in THIS county)
- Demographic breakdowns (age, occupation, community)
- Volunteer conversation tracking

---

## Why This Matters

**Strategic Value:**
- Volunteers understand LOCAL priorities (not just state/national)
- Counter opposition with LOCAL facts (specific to county)
- Tailored messaging by county demographics
- Real-time feedback from voters
- Identify emerging concerns quickly
- Data-driven county strategy

**Example:**
- **State Message:** "Republicans care about the economy"
- **Local Reality in County A:** "People worried about I-85 infrastructure"
- **Local Reality in County B:** "People worried about water quality"
- **Smart Approach:** Use state message + address LOCAL concern specifically

---

## Database Schema

### New Table: `local_concerns`

```sql
CREATE TABLE local_concerns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  county TEXT NOT NULL REFERENCES counties(name),
  concern_topic TEXT NOT NULL,
  description TEXT,
  frequency INTEGER DEFAULT 1 CHECK (frequency BETWEEN 1 AND 10),
  demographic_group TEXT,
  geographic_area TEXT,
  mention_count INTEGER DEFAULT 0,
  last_updated DATE DEFAULT TODAY(),
  source_type TEXT CHECK (source_type IN ('volunteer_report', 'community_feedback', 'social_media', 'local_news', 'admin_entry')),
  is_trending BOOLEAN DEFAULT FALSE,
  resolution_suggestion TEXT,
  related_activity_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE local_concerns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read local concerns for their county" ON local_concerns
  FOR SELECT USING (true);

CREATE POLICY "Coordinators can insert local concerns" ON local_concerns
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role IN ('Coordinator', 'Leader')
    )
  );

CREATE POLICY "Coordinators can update local concerns" ON local_concerns
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role IN ('Coordinator', 'Leader')
    )
  );

-- Indexes for fast queries
CREATE INDEX idx_local_concerns_county ON local_concerns(county);
CREATE INDEX idx_local_concerns_frequency ON local_concerns(frequency DESC);
CREATE INDEX idx_local_concerns_trending ON local_concerns(is_trending);
CREATE INDEX idx_local_concerns_demographic ON local_concerns(demographic_group);
```

**Field Explanations:**
- `county`: Which county this concern is in
- `concern_topic`: Main topic (e.g., "Road Infrastructure", "Water Quality", "Property Taxes")
- `description`: Detailed explanation
- `frequency`: 1-10 scale of how often heard in conversations
- `demographic_group`: Who is mentioning this (e.g., "Seniors", "Young professionals", "Small business owners")
- `geographic_area`: Specific area in county (e.g., "North Atlanta suburbs", "Rural areas")
- `mention_count`: Cumulative count of volunteer mentions
- `source_type`: How we learned about this (volunteer report, social media, local news, etc.)
- `is_trending`: Is this concern trending up right now?
- `resolution_suggestion`: How to address this concern
- `related_activity_type`: Which volunteer activity addresses this (e.g., "Legislative Newsletter")

---

## Component Design

### Local Concerns Card (On County Dashboard)

**Visual Layout:**

```
┌─────────────────────────────────────────────────────────────────┐
│ 🗣️ WHAT LOCALS ARE SAYING                                      │
│    (Top Concerns in [County Name])                              │
└─────────────────────────────────────────────────────────────────┘

FILTER TABS:
[ALL] [🔥 TRENDING] [SENIORS] [FAMILIES] [BUSINESS OWNERS]

SORT BY:
[Frequency] [Latest] [Topic]

┌─────────────────────────────────────────────────────────────────┐
│ 🔥 ROAD INFRASTRUCTURE & MAINTENANCE (TRENDING ↑)              │
│                                                                  │
│ Frequency: ⭐⭐⭐⭐⭐ (9/10 - Heard constantly)                   │
│ Primary Group: Commuters, Young professionals                  │
│ Geographic: North county I-85 corridor                         │
│                                                                  │
│ What They're Saying:                                           │
│ "I-85 is falling apart. Traffic is a nightmare. Potholes      │
│  everywhere. We need better infrastructure investment."        │
│                                                                  │
│ Mentions This Week: 47 (↑ from 32 last week)                   │
│ Trending: YES ⬆️ (rapidly increasing)                           │
│                                                                  │
│ How To Address:                                                │
│ • Share facts on Georgia road funding vs. other states        │
│ • Highlight Governor's infrastructure initiatives              │
│ • Local business activity: "Community Infrastructure Tour"    │
│                                                                  │
│ [Learn More] [Create Activity] [Share Facts]                   │
├─────────────────────────────────────────────────────────────────┤
│ 💰 PROPERTY TAXES & TAX BURDEN                                  │
│                                                                  │
│ Frequency: ⭐⭐⭐⭐ (8/10 - Very common)                          │
│ Primary Group: Seniors, Homeowners                             │
│ Geographic: All areas                                          │
│                                                                  │
│ What They're Saying:                                           │
│ "Property taxes keep going up. I'm on a fixed income and      │
│  afraid I'll have to leave my home. Something needs to change."│
│                                                                  │
│ Mentions This Week: 34                                         │
│ Trending: STABLE (consistent concern)                          │
│                                                                  │
│ How To Address:                                                │
│ • Share Georgia's tax relief programs for seniors              │
│ • Local activity: "Property Tax Information Sessions"         │
│                                                                  │
│ [Learn More] [Create Activity] [Share Facts]                   │
├─────────────────────────────────────────────────────────────────┤
│ 🏫 SCHOOL QUALITY & PARENT CHOICE                               │
│                                                                  │
│ Frequency: ⭐⭐⭐⭐ (7/10 - Common)                               │
│ Primary Group: Families with school-age children              │
│ Geographic: Suburban areas                                     │
│                                                                  │
│ What They're Saying:                                           │
│ "I want my kids in good schools. I'd love more school choice │
│  options beyond just the assigned public school."             │
│                                                                  │
│ Mentions This Week: 28                                         │
│ Trending: STABLE                                               │
│                                                                  │
│ How To Address:                                                │
│ • Highlight Georgia school choice programs (charter, etc)      │
│ • Share parent success stories                                 │
│ • Local activity: "School Choice Information Fair"            │
│                                                                  │
│ [Learn More] [Create Activity] [Share Facts]                   │
└─────────────────────────────────────────────────────────────────┘

INSIGHTS:
📊 Total Concerns Tracked: 12
📈 Trending Up: 3 concerns
📉 Trending Down: 1 concern
📊 Stability: 8 concerns
```

---

## Component Code Structure

### React Component

```typescript
// components/LocalConcerns.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LocalConcern {
  id: string;
  county: string;
  concern_topic: string;
  description: string;
  frequency: number;
  demographic_group: string;
  geographic_area: string;
  mention_count: number;
  source_type: string;
  is_trending: boolean;
  resolution_suggestion: string;
  related_activity_type: string;
  updated_at: string;
}

export function LocalConcerns({ county }: { county: string }) {
  const [concerns, setConcerns] = React.useState<LocalConcern[]>([]);
  const [filter, setFilter] = React.useState<'all' | 'trending' | string>('all');
  const [sortBy, setSortBy] = React.useState<'frequency' | 'latest' | 'topic'>('frequency');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchConcerns();
  }, [county]);

  const fetchConcerns = async () => {
    try {
      const response = await fetch(`/api/local-concerns?county=${county}`);
      if (response.ok) {
        const data = await response.json();
        setConcerns(data);
      }
    } catch (error) {
      console.error('Error fetching local concerns:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConcerns = concerns.filter(concern => {
    if (filter === 'all') return true;
    if (filter === 'trending') return concern.is_trending;
    return concern.demographic_group?.includes(filter);
  });

  const sortedConcerns = [...filteredConcerns].sort((a, b) => {
    if (sortBy === 'frequency') return b.frequency - a.frequency;
    if (sortBy === 'latest') {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    }
    return a.concern_topic.localeCompare(b.concern_topic);
  });

  const trendingCount = concerns.filter(c => c.is_trending).length;

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Loading...</div>;
  }

  return (
    <Card className="p-6 border-l-4 border-green-500 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🗣️</span>
        <h2 className="text-xl font-bold">What Locals Are Saying</h2>
        <span className="text-xs text-gray-500 ml-auto">
          ({sortedConcerns.length} concerns tracked)
        </span>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="trending">
              🔥 Trending ({trendingCount})
            </TabsTrigger>
            <TabsTrigger value="Seniors">👴 Seniors</TabsTrigger>
            <TabsTrigger value="Families">👨‍👩‍👧‍👦 Families</TabsTrigger>
            <TabsTrigger value="Business">💼 Business</TabsTrigger>
          </TabsList>
        </Tabs>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="text-sm border rounded px-3 py-2 bg-white"
        >
          <option value="frequency">Sort by Frequency</option>
          <option value="latest">Sort by Latest</option>
          <option value="topic">Sort by Topic</option>
        </select>
      </div>

      <div className="space-y-4">
        {sortedConcerns.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            No concerns found for this filter
          </p>
        ) : (
          sortedConcerns.map((concern) => (
            <LocalConcernCard key={concern.id} concern={concern} />
          ))
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-gray-600">Total Concerns</p>
          <p className="text-2xl font-bold">{concerns.length}</p>
        </div>
        <div>
          <p className="text-gray-600">Trending Up</p>
          <p className="text-2xl font-bold text-red-600">{trendingCount}</p>
        </div>
        <div>
          <p className="text-gray-600">Most Frequent</p>
          <p className="text-2xl font-bold">
            {concerns.length > 0 ? Math.max(...concerns.map(c => c.frequency)) : 0}/10
          </p>
        </div>
        <div>
          <p className="text-gray-600">This Week</p>
          <p className="text-2xl font-bold">
            {concerns.reduce((sum, c) => sum + c.mention_count, 0)}
          </p>
        </div>
      </div>
    </Card>
  );
}

// Individual concern card
function LocalConcernCard({ concern }: { concern: LocalConcern }) {
  const [expanded, setExpanded] = useState(false);
  const frequencyStars = Math.ceil(concern.frequency / 2);

  return (
    <div className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex gap-2 mb-2 flex-wrap">
            {concern.is_trending && (
              <Badge className="bg-red-600">🔥 TRENDING ↑</Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {concern.demographic_group || 'General'}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {concern.geographic_area || 'Countywide'}
            </Badge>
          </div>
          <h3 className="font-bold text-lg">
            {concern.concern_topic}
          </h3>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {expanded ? '▼' : '▶'}
        </button>
      </div>

      {/* Frequency */}
      <div className="mb-3">
        <span className="text-sm font-semibold">Frequency: </span>
        <div className="flex items-center gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-lg">
              {i < frequencyStars ? '⭐' : '☆'}
            </span>
          ))}
          <span className="text-xs text-gray-600 ml-2">
            ({concern.frequency}/10)
          </span>
        </div>
      </div>

      {/* What they're saying */}
      <div className="bg-green-50 border-l-4 border-green-500 p-3 mb-3 rounded">
        <p className="font-semibold text-sm mb-2">💬 What They're Saying:</p>
        <p className="text-sm text-gray-800">
          {concern.description}
        </p>
      </div>

      {/* Mentions count */}
      <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
        <div className="text-center">
          <p className="text-gray-600">This Week</p>
          <p className="font-bold text-lg">{concern.mention_count}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-600">Source</p>
          <p className="font-bold text-xs">{concern.source_type}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-600">Last Updated</p>
          <p className="font-bold text-xs">
            {new Date(concern.updated_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="bg-gray-100 p-3 rounded mt-3 border-t space-y-3">
          {concern.resolution_suggestion && (
            <div>
              <p className="font-semibold text-sm mb-1">📋 How To Address:</p>
              <p className="text-sm text-gray-700">
                {concern.resolution_suggestion}
              </p>
            </div>
          )}

          {concern.related_activity_type && (
            <div>
              <p className="font-semibold text-sm mb-1">📌 Related Activity:</p>
              <p className="text-sm text-blue-600">
                {concern.related_activity_type}
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-3 border-t">
            <button className="text-xs px-2 py-1 bg-white border rounded hover:bg-green-50 transition-colors">
              📌 Save
            </button>
            <button className="text-xs px-2 py-1 bg-white border rounded hover:bg-green-50 transition-colors">
              ➕ Create Activity
            </button>
            <button className="text-xs px-2 py-1 bg-white border rounded hover:bg-green-50 transition-colors ml-auto">
              ✏️ Report Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Sample Local Concerns by County

### Fulton County (Atlanta area)
```
1. Road Infrastructure/I-85 (Frequency: 9, Trending ↑)
   Demographics: Young professionals, commuters
   Concern: "I-85 infrastructure is falling apart"
   Activity: Infrastructure town halls

2. Property Taxes (Frequency: 8)
   Demographics: Seniors, homeowners
   Concern: "Taxes keep rising on fixed income"
   Activity: Tax relief information sessions

3. Cost of Living (Frequency: 8, Trending ↑)
   Demographics: Young families, renters
   Concern: "Housing and rent is too expensive"
   Activity: Economic opportunity showcase

4. School Quality & Choice (Frequency: 7)
   Demographics: Families with kids
   Concern: "Want more school options for our kids"
   Activity: School choice fair
```

### Rural County (Example)
```
1. Rural Healthcare Access (Frequency: 9)
   Demographics: Seniors, rural residents
   Concern: "Nearest hospital is 45 minutes away"
   Activity: Healthcare access advocacy

2. Agricultural Policy (Frequency: 8)
   Demographics: Farmers, agriculture workers
   Concern: "Need support for farm operations"
   Activity: Agricultural summit

3. Broadband Internet (Frequency: 8, Trending ↑)
   Demographics: All groups
   Concern: "No reliable internet for work/school"
   Activity: Rural broadband town hall

4. Local Business Support (Frequency: 7)
   Demographics: Small business owners
   Concern: "Small businesses need help competing"
   Activity: Business growth workshop
```

### Suburban County (Example)
```
1. School Funding & Quality (Frequency: 9)
   Demographics: Families
   Concern: "Schools need better funding"
   Activity: Education funding forum

2. Traffic & Commute Times (Frequency: 8)
   Demographics: Young professionals
   Concern: "Traffic getting worse every year"
   Activity: Transportation solutions town hall

3. Affordable Housing (Frequency: 7)
   Demographics: Young families
   Concern: "Can't afford homes in this area"
   Activity: Housing opportunity fair

4. Property Tax Relief (Frequency: 6)
   Demographics: Seniors
   Concern: "Senior tax relief needed"
   Activity: Tax assistance sessions
```

---

## Integration Into County Dashboard

### Where It Appears

The Local Concerns section appears on the county dashboard **below the Opposition Messaging section**:

**Layout Order:**
1. County Name + Blue-Area Multiplier
2. Election Results
3. Demographics
4. Exit Polls / "What Mattered in 2026"
5. Opposition Messaging ← New
6. ⭐ **Local Concerns** ← NEW (this section)
7. Suggested Activities
8. Activity Logger

---

## Data Management

### Who Updates Local Concerns?

**Option A: Volunteer Submission (Recommended)**
- Any volunteer can submit a concern they hear
- County coordinator reviews/approves
- Auto-added to local concerns list
- Real-time, ground-truth data

**Option B: Coordinator Entry**
- County leaders manually add concerns
- Based on community feedback
- Can customize descriptions

**Option C: Social Media Monitoring**
- Automated extraction from local social media
- County-specific Facebook groups, NextDoor, etc.
- Flagged for human review

**Option D: Hybrid (Best)**
- Start with admin entry of major concerns
- Volunteer submissions add to it
- Social media flags trending topics
- Coordinator approves all

**Recommended for Launch:** Option B (County coordinators manage, with volunteer submissions in Phase 2)

---

## Data Collection Workflow

### How Volunteers Report Concerns:

```
Volunteer in Conversation with Voter:
  "What's your biggest concern right now?"
  
Voter: "The roads are terrible. I-85 is falling apart."

Volunteer can:
  ✅ Option 1: Note it in the app immediately
  ✅ Option 2: Report it at end of week
  ✅ Option 3: County leader compiles from notes

App Records:
  - Concern topic: "Road Infrastructure"
  - What they said: "I-85 is falling apart"
  - Demographic: Young professional
  - Area: North county
  - Timestamp: Recorded as this week's mention
  - County coordinator sees 47 mentions of same concern
  - System flags as "Trending" (↑ from 32 last week)
```

---

## API Endpoints

```typescript
// GET local concerns for a county
GET /api/local-concerns?county=Fulton
// Response: Array of LocalConcern objects

// GET with filters
GET /api/local-concerns?county=Fulton&demographic=Seniors
GET /api/local-concerns?county=Fulton&is_trending=true

// POST new concern (volunteer or coordinator)
POST /api/local-concerns
Body: {
  county: string,
  concern_topic: string,
  description: string,
  demographic_group?: string,
  geographic_area?: string,
  source_type: 'volunteer_report' | 'community_feedback' | 'social_media' | 'local_news'
}

// PUT update concern mention count (when reported again)
PUT /api/local-concerns/:id/report
Body: {
  mention_count_increment: 1
}

// PUT mark as trending
PUT /api/local-concerns/:id/trending
Body: {
  is_trending: true
}
```

---

## Success Metrics

**How We Know This Works:**

- ✅ County leaders say "This matches what we're hearing"
- ✅ Volunteers use insights to tailor conversations
- ✅ Activities created directly address local concerns
- ✅ Trending topics identified within days
- ✅ Better county-specific messaging
- ✅ Community feels "heard" and understood

---

## Implementation Roadmap

### Phase 1: Launch (Week 1)
- ✅ Add local_concerns table
- ✅ Create LocalConcerns React component
- ✅ Build API endpoints
- ✅ Seed initial concerns per county
- ✅ Add to county dashboard layout
- ✅ Deploy and test

### Phase 2: Enhancement (Week 2-3)
- ⏳ Volunteer submission system
- ⏳ County coordinator approval workflow
- ⏳ Trending alerts (email when concern spikes)
- ⏳ Analytics dashboard for county leaders
- ⏳ Social media monitoring integration

### Phase 3: Advanced (Week 4+)
- ⏳ AI analysis of concern sentiment
- ⏳ Predictive trending (anticipate concerns)
- ⏳ Cross-county comparison (see unique issues)
- ⏳ Automated response suggestions
- ⏳ County reports for leadership

---

## Why This Matters Strategically

**This converts the platform into a listening device for leadership:**

1. **Ground Truth** - Real concerns from real voters
2. **Data-Driven** - Strategy based on actual local issues, not assumptions
3. **Responsiveness** - Address concerns before opposition does
4. **Effectiveness** - Activities targeted at what voters care about
5. **Community** - Voters feel heard and understood
6. **Competitive Edge** - Your team knows what matters locally

**This is the intelligence network for the movement:**
- What are people actually worried about in THIS county?
- Is it different from what state/national strategy assumes?
- Which concerns are trending up (emerging issues)?
- Who should we target with what message?
- What activities will be most effective?

---

## Combined Sections on County Dashboard

Now each county dashboard has THREE powerful sections:

### 1. 🎯 **Opposition Messaging** ("What They're Saying")
   - What Democrats claim
   - Counter talking points
   - State + National level

### 2. 🗣️ **Local Concerns** ("What Locals Are Saying") ← NEW
   - Real voter concerns
   - Frequency + trending
   - By demographic/geography

### 3. 📊 **Our Response** (What We Do About It)
   - Suggested activities
   - Activity logger
   - Points/progress

**Together:** The complete picture of voter needs, concerns, and how to address them.

---

## Next Steps

1. **Approve Design** - Does this layout work for you?
2. **Review Sample Concerns** - Do these match reality in Georgia?
3. **Add to Development Sprint** - Include in Phase 1 launch
4. **Create API Routes** - Build endpoints for fetching concerns
5. **Seed Database** - Load initial concerns per county
6. **Test on County Dashboard** - Verify placement and display
7. **Deploy to Staging** - Review with test volunteers

---

**This is how you build a learning organization: Listen to voters, understand their concerns, and address them better than any opponent.** 🗣️
