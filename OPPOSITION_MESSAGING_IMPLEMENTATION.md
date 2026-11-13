# 🎯 Opposition Messaging - Quick Implementation Guide

## What This Feature Does

Adds a **"What They're Saying"** section to every county dashboard that shows:
- What Democrats are claiming (nationally and at the Georgia state level)
- Where they're saying it (source attribution)
- How often it's being pushed (frequency rating)
- Your recommended counter-talking point

---

## Files You Need

1. **OPPOSITION_MESSAGING_FEATURE.md** - Full design spec (read first)
2. **OPPOSITION_MESSAGING_SCHEMA.sql** - Database schema + sample data

---

## 3-Step Implementation

### STEP 1: Add Database Table (5 minutes)

1. Open your Supabase dashboard
2. Go to SQL Editor
3. Copy all code from: `OPPOSITION_MESSAGING_SCHEMA.sql`
4. Paste into SQL Editor
5. Click "Run"
6. Wait for "Query complete" ✓

**What this does:**
- Creates `opposition_messages` table
- Loads 18 sample messages (national + state level)
- Sets up indexes for fast queries
- Enables RLS security policies

---

### STEP 2: Add React Component (10 minutes)

Create new file: `src/components/OppositionMessaging.tsx`

Copy this code:

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface OppositionMessage {
  id: string;
  topic: string;
  level: 'national' | 'state';
  message: string;
  source: string;
  date_published: string;
  context: string;
  counter_talking_point: string;
  importance: number;
}

export function OppositionMessaging() {
  const [messages, setMessages] = useState<OppositionMessage[]>([]);
  const [filter, setFilter] = useState<'all' | 'national' | 'state'>('all');
  const [sortBy, setSortBy] = useState<'frequency' | 'date' | 'topic'>('frequency');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/opposition-messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching opposition messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter(msg =>
    filter === 'all' ? true : msg.level === filter
  );

  const sortedMessages = [...filteredMessages].sort((a, b) => {
    if (sortBy === 'frequency') return b.importance - a.importance;
    if (sortBy === 'date') {
      const dateA = new Date(a.date_published).getTime();
      const dateB = new Date(b.date_published).getTime();
      return dateB - dateA;
    }
    return a.topic.localeCompare(b.topic);
  });

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Loading...</div>;
  }

  return (
    <Card className="p-6 border-l-4 border-blue-500 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🎯</span>
        <h2 className="text-xl font-bold">What They're Saying</h2>
        <span className="text-xs text-gray-500 ml-auto">(Opposition Messaging)</span>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="national">National</TabsTrigger>
            <TabsTrigger value="state">Georgia</TabsTrigger>
          </TabsList>
        </Tabs>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="text-sm border rounded px-3 py-2 bg-white"
        >
          <option value="frequency">Sort by Frequency</option>
          <option value="date">Sort by Date</option>
          <option value="topic">Sort by Topic</option>
        </select>
      </div>

      <div className="space-y-4">
        {sortedMessages.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No messages found</p>
        ) : (
          sortedMessages.map((msg) => (
            <OppositionMessageCard key={msg.id} message={msg} />
          ))
        )}
      </div>
    </Card>
  );
}

// Individual message card
function OppositionMessageCard({ message }: { message: OppositionMessage }) {
  const [expanded, setExpanded] = useState(false);

  const frequencyStars = Math.ceil(message.importance / 2);

  return (
    <div className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
      {/* Level and topic badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs">
            {message.level === 'national' ? '🇺🇸 National' : '🏛️ Georgia'}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {message.topic}
          </Badge>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {expanded ? '▼' : '▶'}
        </button>
      </div>

      {/* Main claim */}
      <div className="mb-3">
        <h3 className="font-bold text-red-600 mb-2">
          ❌ What They're Claiming:
        </h3>
        <p className="text-sm text-gray-800 bg-red-50 p-2 rounded border-l-2 border-red-400">
          "{message.message}"
        </p>
      </div>

      {/* Source and date */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-sm text-gray-600">
        <div>
          <span className="font-semibold">Source:</span> {message.source}
        </div>
        <div>
          <span className="font-semibold">Date:</span>{' '}
          {new Date(message.date_published).toLocaleDateString()}
        </div>
      </div>

      {/* Frequency rating */}
      <div className="mb-3">
        <span className="text-sm font-semibold">How Often Used: </span>
        <div className="flex items-center gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-lg">
              {i < frequencyStars ? '⭐' : '☆'}
            </span>
          ))}
          <span className="text-xs text-gray-600 ml-2">
            ({message.importance}/10)
          </span>
        </div>
      </div>

      {/* Counter talking point */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-3 rounded">
        <p className="font-semibold text-sm mb-2">💡 Our Counter-Response:</p>
        <p className="text-sm text-gray-800">
          {message.counter_talking_point}
        </p>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="bg-gray-100 p-3 rounded mt-3 border-t">
          {message.context && (
            <div className="mb-3">
              <p className="font-semibold text-sm mb-1">📋 Context:</p>
              <p className="text-sm text-gray-700">{message.context}</p>
            </div>
          )}
          <div className="flex gap-2 pt-3 border-t">
            <button className="text-xs px-2 py-1 bg-white border rounded hover:bg-blue-50 transition-colors">
              📌 Save
            </button>
            <button className="text-xs px-2 py-1 bg-white border rounded hover:bg-blue-50 transition-colors">
              📤 Share Response
            </button>
            <button className="text-xs px-2 py-1 bg-white border rounded hover:bg-blue-50 transition-colors ml-auto">
              ✏️ Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

### STEP 3: Add Component to County Dashboard (2 minutes)

Find file: `src/app/dashboard/[county]/page.tsx`

Add this import at the top:

```typescript
import { OppositionMessaging } from '@/components/OppositionMessaging';
```

Then add this component to your page (after the "What Mattered" section):

```typescript
{/* Opposition Messaging Section */}
<OppositionMessaging />
```

**Example placement:**
```typescript
return (
  <div className="space-y-6">
    {/* ... existing sections ... */}
    
    <ElectionResults />
    <DemographicsCard />
    <ExitPollsCard />
    
    {/* NEW: Add Opposition Messaging Here */}
    <OppositionMessaging />
    
    <SuggestedActivities />
    <ActivityLogger />
  </div>
);
```

---

## 4-Step Verification

After implementation, verify it works:

### Test 1: Check Database
1. Go to Supabase SQL Editor
2. Run: `SELECT COUNT(*) FROM opposition_messages;`
3. Should return: `18` (18 sample messages)

### Test 2: Check Component
1. Open app: `http://localhost:3000/dashboard/fulton` (or any county)
2. Scroll down to "What They're Saying" section
3. Should see opposition messages with:
   - ✅ National and State tabs
   - ✅ Frequency ratings (stars)
   - ✅ Counter talking points
   - ✅ Source attribution

### Test 3: Test Filters
1. Click "National" tab - should show only national messages
2. Click "Georgia" tab - should show only state messages
3. Click "All" tab - should show all 18 messages

### Test 4: Test Sorting
1. Click "Sort by Frequency" - highest importance first
2. Click "Sort by Date" - newest first
3. Click "Sort by Topic" - alphabetical

---

## API Endpoint (Optional, for managing messages)

If you want admins to add/edit messages, create: `src/app/api/opposition-messages/route.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from('opposition_messages')
    .select('*')
    .order('importance', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { data, error } = await supabase
    .from('opposition_messages')
    .insert([body])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
```

---

## What Volunteers See

### Before (Without Opposition Messaging)
- Sees election results
- Sees demographics
- Sees activities to log
- ❌ **Doesn't know what opposition is saying**

### After (With Opposition Messaging)
- Sees opposition claims clearly
- Knows the frequency (how often being pushed)
- Has a prepared counter response
- Can share on social media
- **Feels prepared for voter conversations** ✅

---

## Sample Data Included

The schema includes 18 opposition messages:

**National Level (10 messages):**
1. Social Security cuts
2. Abortion bans
3. School funding cuts
4. Voting rights
5. Rich people tax cuts
6. Immigration
7. Book banning
8. Environment/climate
9. Healthcare
10. Gun rights

**Georgia State Level (8 messages):**
1. Voter ID targets minorities
2. Gerrymandering
3. Working families neglected
4. School underfunding
5. HOPE Scholarship cuts
6. Healthcare restrictions
7. Pollution
8. Wage stagnation

---

## Next Steps

### Immediate (Week 1)
1. ✅ Run the SQL schema
2. ✅ Add the React component
3. ✅ Add to dashboard page
4. ✅ Test all filters/sorts
5. ✅ Deploy to staging

### Short Term (Week 2)
- Add admin panel to edit/add messages
- Create email alerts for new opposition messaging
- Track which claims volunteers encounter most

### Long Term (Week 3+)
- AI-generated counter talking points
- Video responses to common claims
- Social media integration
- A/B testing effectiveness of counters

---

## Success Metrics

You'll know this works when:

✅ Volunteers report feeling more prepared (survey them)
✅ County leaders use messages in volunteer trainings
✅ Faster volunteer response time to voter questions
✅ More consistent messaging across volunteers
✅ Increased volunteer confidence in conversations

---

## Questions?

**Q: Can county leaders customize these messages?**
A: Yes, Phase 2. For now, state-level team manages all messages.

**Q: Will this update automatically?**
A: Refresh the page to see new messages. Or we can add auto-refresh in Phase 2.

**Q: Can volunteers submit messages they hear?**
A: Yes, Phase 2 feature. For now, messages are centrally managed.

**Q: What if a counter-argument is wrong?**
A: Edit it in Supabase SQL or build admin panel. Easily updatable.

---

**This is a game-changer: Volunteers walk into every conversation armed with the truth.** 🎯
