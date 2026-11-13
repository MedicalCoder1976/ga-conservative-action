# County Brand Hub - Component Design & UI Mockup

## Overview
The County Brand Hub adds a powerful new section to `/dashboard/[county]` that celebrates local leadership, community impact, and volunteer success stories.

---

## UI Layout Structure

### Dashboard Layout (Enhanced)

```
┌─────────────────────────────────────────────────────────────┐
│ GA Voter Action - [County Name] Dashboard                  │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┬──────────────────┬──────────────────┐
│  Election        │  Demographics    │  Exit Polls      │
│  Results         │  Card            │  Card            │
└──────────────────┴──────────────────┴──────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Activity Logger - Log Volunteer Hours                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ COUNTY BRAND HUB ⭐ (NEW SECTION)                          │
│                                                             │
│ [Leadership] [Stories] [Impact] [Assets] [Leaderboard]   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Component 1: LeadershipGallery

### Visual Design
```
┌────────────────────────────────────────────────────────────┐
│ County Heroes - Meet Our Leaders                          │
│                                                            │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│ │ [Photo]  │  │ [Photo]  │  │ [Photo]  │  │ [Photo]  │  │
│ │          │  │          │  │          │  │          │  │
│ │ John Doe │  │Jane Smith│  │Bob Jones │  │ Sue Lee  │  │
│ │ County   │  │ School   │  │ Sheriff  │  │ Mayor    │  │
│ │ Comm.    │  │ Board    │  │          │  │          │  │
│ │          │  │          │  │          │  │          │  │
│ │ ⬇ More   │  │ ⬇ More   │  │ ⬇ More   │  │ ⬇ More   │  │
│ └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                            │
│ [← Previous] [1 2 3 4 5 ...] [Next →]                   │
└────────────────────────────────────────────────────────────┘
```

### Expanded Leader Card
```
┌──────────────────────────────────────────────┐
│ John Doe - County Commissioner District 2    │
│ [Large Photo]                                │
│                                              │
│ BIO:                                        │
│ Serving [County] since 2018 with focus      │
│ on fiscal responsibility and growth         │
│                                              │
│ KEY ACCOMPLISHMENTS:                        │
│ ✅ Reduced budget by 8% while keeping      │
│    services level                           │
│ ✅ Attracted 2 new businesses (120 jobs)    │
│ ✅ Rebuilt county roads (45 miles)         │
│                                              │
│ CONTACT:                                    │
│ 📧 john@county.gov | 📱 404-555-1234      │
│ 🐦 @johndoe | 📘 facebook.com/johndoe    │
│                                              │
│ [Share] [Visit Website] [See Stories]      │
└──────────────────────────────────────────────┘
```

### Code Structure
```typescript
interface CountyLeader {
  id: string;
  name: string;
  title: string;
  photo_url: string;
  bio: string;
  accomplishments: string[];
  socialLinks: {
    twitter?: string;
    facebook?: string;
    email?: string;
    phone?: string;
  };
  stories: Story[];
}

// Component: LeadershipGallery.tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {leaders.map(leader => (
    <LeaderCard 
      key={leader.id}
      leader={leader}
      onSelect={() => setSelectedLeader(leader)}
    />
  ))}
</div>

// Component: LeaderDetailModal.tsx
<Modal isOpen={selectedLeader}>
  <LeaderProfile leader={selectedLeader} />
  <LeaderAccomplishments accomplishments={selectedLeader.accomplishments} />
  <LeaderContactCard leader={selectedLeader} />
  <LeaderStories stories={selectedLeader.stories} />
</Modal>
```

---

## Component 2: SuccessStoriesFlow

### Visual Design
```
┌──────────────────────────────────────────────────────────┐
│ County Success Stories - Share Your Impact               │
│                                                          │
│ [+ NEW STORY BUTTON]                                    │
│                                                          │
│ ┌────────────────────────────────────────────────────┐  │
│ │ Sarah Johnson - "Registered 12 New Voters"        │  │
│ │ [Photo] 📸                                         │  │
│ │                                                    │  │
│ │ "Spent Saturday canvassing downtown and had      │  │
│ │ incredible conversations about voting. Helped    │  │
│ │ 12 people register to vote for 2026!"           │  │
│ │                                                    │  │
│ │ Category: Community Service                      │  │
│ │ 📅 Posted 2 days ago | ⭐ 47 likes              │  │
│ │ #Voter #Engagement #Community                   │  │
│ │                                                    │  │
│ │ [Like] [Comment] [Share]                         │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ ┌────────────────────────────────────────────────────┐  │
│ │ Marcus Lee - "School Board Advocacy"             │  │
│ │ [Photo] 📸                                        │  │
│ │                                                   │  │
│ │ "Attended school board meeting and spoke for    │  │
│ │ education funding. Great to see our leaders     │  │
│ │ listening to community concerns."               │  │
│ │                                                   │  │
│ │ Category: Education                             │  │
│ │ 📅 Posted 3 days ago | ⭐ 23 likes             │  │
│ │ #Education #Leadership #Community              │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ [Show More]                                            │
└──────────────────────────────────────────────────────────┘
```

### Story Upload Form
```
┌──────────────────────────────────────────────────────┐
│ Share Your Success Story                             │
│                                                      │
│ 📸 Upload Photo (drag & drop)                       │
│ [____________________________]                       │
│                                                      │
│ 📝 Story Title                                      │
│ [____________________________]                       │
│                                                      │
│ 📄 Story (max 500 chars)                           │
│ [____________________________]                       │
│ [____________________________]                       │
│ [____________________________]                       │
│                                                      │
│ 🏷️ Category                                        │
│ [Dropdown: Community Service ▼]                    │
│                                                      │
│ 🏷️ Tags (comma-separated)                          │
│ [#voters #engagement #community___]                │
│                                                      │
│ 👁️ Visibility                                      │
│ [✓ Public] [ ] Private                             │
│                                                      │
│ [Cancel] [Preview] [Post] (+50 pts)               │
└──────────────────────────────────────────────────────┘
```

### Code Structure
```typescript
interface SuccessStory {
  id: string;
  userId: string;
  county: string;
  title: string;
  description: string;
  category: 'Community Service' | 'Youth' | 'Safety' | 'Education' | 'Economic';
  photoUrl: string;
  tags: string[];
  isPublic: boolean;
  pointsAwarded: number;
  likes: number;
  createdAt: Date;
}

// Component: StoryCard.tsx
<Card className="mb-4">
  <CardHeader>
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={user.avatar} />
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-semibold">{user.name}</p>
        <p className="text-sm text-slate-500">{formatDate(story.createdAt)}</p>
      </div>
    </div>
  </CardHeader>
  <CardContent>
    {story.photoUrl && <img src={story.photoUrl} className="w-full rounded" />}
    <h3 className="font-bold mt-2">{story.title}</h3>
    <p className="text-sm mt-2">{story.description}</p>
    <div className="flex gap-2 mt-3 flex-wrap">
      {story.tags.map(tag => <Badge key={tag}>{tag}</Badge>)}
    </div>
  </CardContent>
  <CardFooter>
    <Button variant="ghost" size="sm">❤️ {story.likes}</Button>
    <Button variant="ghost" size="sm">💬 Comment</Button>
    <Button variant="ghost" size="sm">↗️ Share</Button>
  </CardFooter>
</Card>

// Component: StoryUploadModal.tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Share Your Success Story</DialogTitle>
    </DialogHeader>
    <form onSubmit={handleSubmit} className="space-y-4">
      <ImageUpload onSelect={setPhoto} />
      <Input placeholder="Story Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Textarea placeholder="Tell your story..." value={description} onChange={(e) => setDescription(e.target.value)} />
      <Select value={category} onValueChange={setCategory}>
        <SelectItem value="community">Community Service</SelectItem>
        <SelectItem value="youth">Youth Engagement</SelectItem>
        <SelectItem value="safety">Safety</SelectItem>
        <SelectItem value="education">Education</SelectItem>
      </Select>
      <Input placeholder="Add tags..." value={tags} onChange={(e) => setTags(e.target.value)} />
      <Checkbox checked={isPublic} onCheckedChange={setIsPublic}>
        Make story public
      </Checkbox>
      <DialogFooter>
        <Button variant="outline">Cancel</Button>
        <Button>Post Story (+50 pts)</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
```

---

## Component 3: CountyStatsBoard

### Visual Design
```
┌──────────────────────────────────────────────────────────┐
│ [County Name] Impact Dashboard                           │
│                                                          │
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│ │ 📊 ENGAGED   │  │ 🎯 ACTIVITIES│  │ 👥 ACTIVE    │   │
│ │ VOLUNTEERS   │  │ LOGGED       │  │ COMMUNITY    │   │
│ │              │  │              │  │              │   │
│ │    347 (+12%)│  │   1,284 (+8%)│  │   156 (+5%)  │   │
│ │   this month │  │  this month  │  │  volunteers  │   │
│ └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                          │
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│ │ 📈 VOLUNTEER │  │ 💬 COMMUNITY │  │ ⚡ COMMUNITY │   │
│ │ HOURS        │  │ STORIES      │  │ IMPACT SCORE │   │
│ │              │  │              │  │              │   │
│ │   2,847 hrs  │  │      47      │  │     8,420    │   │
│ │   YTD        │  │   this month │  │   cumulative │   │
│ └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                          │
│ VOLUNTEER GROWTH TREND                                  │
│ 📈 Chart showing growth over 6 months                   │
│ Jan: 145 | Feb: 167 | Mar: 189 | Apr: 201 | May: 215  │
│                                                          │
│ TOP ACTIVITIES THIS MONTH                               │
│ 1. Canvassing (456 logs)                               │
│ 2. Phone Banking (289 logs)                            │
│ 3. Community Service (198 logs)                        │
│ 4. Social Media (147 logs)                            │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Code Structure
```typescript
interface CountyStats {
  county: string;
  activeVolunteers: number;
  activitiesLogged: number;
  totalVolunteerHours: number;
  storiesPosted: number;
  communityImpactScore: number;
  monthlyVolunteerGrowth: number;
  yearToDateHours: number;
}

// Component: CountyStatsBoard.tsx
<div className="grid grid-cols-3 gap-4">
  <StatCard
    title="Active Volunteers"
    value={stats.activeVolunteers}
    change={stats.monthlyVolunteerGrowth}
    icon="👥"
  />
  <StatCard
    title="Activities Logged"
    value={stats.activitiesLogged}
    change={8}
    icon="🎯"
  />
  <StatCard
    title="Total Hours"
    value={stats.totalVolunteerHours}
    change={12}
    icon="📊"
  />
</div>

// Growth Chart
<LineChart data={monthlyGrowthData} />

// Top Activities
<div className="mt-6">
  <h3 className="font-bold mb-3">Top Activities This Month</h3>
  {topActivities.map((activity, i) => (
    <div key={activity.id} className="flex justify-between py-2">
      <span>{i + 1}. {activity.name}</span>
      <span className="font-semibold">{activity.count} logs</span>
    </div>
  ))}
</div>
```

---

## Component 4: LeaderAccomplishmentsBoard

### Visual Design
```
┌────────────────────────────────────────────────────────┐
│ Recent Leadership Wins in [County]                     │
│                                                        │
│ ⭐ BILL PASSED                                        │
│ "Education Funding Increase Signed Into Law"         │
│ Led by: Commissioner Jane Smith                      │
│ Impact: Adds $2M to county schools                   │
│ 📅 Passed Nov 15, 2026 | 👍 127 reactions          │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                        │
│ 🎯 INITIATIVE LAUNCHED                               │
│ "Summer Youth Leadership Program"                     │
│ Led by: Mayor Bob Johnson                             │
│ Impact: 50 youth participants, 8-week program         │
│ 📅 Launched Jun 1, 2026 | 👍 89 reactions            │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                        │
│ 🏆 ISSUE RESOLVED                                    │
│ "Community Safe Crossing Installed"                   │
│ Led by: Sheriff Tom Lee                              │
│ Impact: Protects 200+ kids at school crossings       │
│ 📅 Completed Oct 30, 2026 | 👍 156 reactions        │
│                                                        │
│ [View More Accomplishments]                          │
└────────────────────────────────────────────────────────┘
```

### Code Structure
```typescript
interface LeaderAccomplishment {
  id: string;
  leaderId: string;
  leaderName: string;
  title: string;
  description: string;
  impactStatement: string;
  type: 'Bill Passed' | 'Initiative Launched' | 'Award Won' | 'Issue Resolved';
  photoUrl?: string;
  dateAchieved: Date;
  reactions: number;
}

// Component: AccomplishmentCard.tsx
<Card className="mb-4 border-l-4 border-blue-600">
  <CardHeader>
    <div className="flex items-start justify-between">
      <div>
        <Badge className="mb-2">{accomplishment.type}</Badge>
        <h3 className="font-bold text-lg">{accomplishment.title}</h3>
        <p className="text-sm text-slate-600">Led by: {accomplishment.leaderName}</p>
      </div>
      <span className="text-2xl">
        {accomplishment.type === 'Bill Passed' && '⭐'}
        {accomplishment.type === 'Initiative Launched' && '🎯'}
        {accomplishment.type === 'Award Won' && '🏆'}
        {accomplishment.type === 'Issue Resolved' && '✅'}
      </span>
    </div>
  </CardHeader>
  <CardContent>
    {accomplishment.photoUrl && (
      <img src={accomplishment.photoUrl} className="w-full rounded mb-3" />
    )}
    <p className="mb-2">{accomplishment.description}</p>
    <p className="font-semibold text-blue-600 text-sm mb-3">
      💡 Impact: {accomplishment.impactStatement}
    </p>
    <p className="text-xs text-slate-500">
      📅 {formatDate(accomplishment.dateAchieved)}
    </p>
  </CardContent>
  <CardFooter>
    <Button variant="ghost" size="sm">👍 {accomplishment.reactions}</Button>
    <Button variant="ghost" size="sm">Share</Button>
  </CardFooter>
</Card>
```

---

## Component 5: BrandAssetsLibrary

### Visual Design
```
┌────────────────────────────────────────────────────────┐
│ Share County Brand Assets 📁                           │
│                                                        │
│ [Search assets...] [Filter by type ▼]                │
│                                                        │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌─────┐ │
│ │ "Character│ │ "[County]  │ │ "[County]  │ │ ...  │ │
│ │is What    │ │ Budget:    │ │ Welcomes   │ │      │ │
│ │You Do in  │ │ Jobs Up 12%"│ │ New        │ │      │ │
│ │the Dark"  │ │            │ │ Business"  │ │      │ │
│ │ - Quote   │ │- Stat Graph│ │ - Post     │ │      │ │
│ │Graphic    │ │Graphic     │ │ Template   │ │      │ │
│ │           │ │            │ │            │ │      │ │
│ │[Download] │ │[Download]  │ │[Download]  │ │      │ │
│ │[Share]    │ │[Share]     │ │[Share]     │ │[More]│ │
│ └────────────┘ └────────────┘ └────────────┘ └─────┘ │
│                                                        │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐         │
│ │ Volunteer  │ │ "Thank You  │ │ "Get       │         │
│ │Appreciation│ │to Our      │ │Involved"   │         │
│ │Template    │ │Volunteers" │ │ - Social   │         │
│ │ - Post     │ │ - Graphic  │ │ Template   │         │
│ │           │ │            │ │            │         │
│ │[Download] │ │[Download]  │ │[Download]  │         │
│ │[Share]    │ │[Share]     │ │[Share]     │         │
│ └────────────┘ └────────────┘ └────────────┘         │
└────────────────────────────────────────────────────────┘
```

### Code Structure
```typescript
interface BrandAsset {
  id: string;
  county: string;
  name: string;
  type: 'Quote Graphic' | 'Infographic' | 'Social Template' | 'Appreciation' | 'Statistics';
  fileUrl: string;
  dimensions: string;
  tags: string[];
  downloadCount: number;
  shareCount: number;
  createdAt: Date;
}

// Component: BrandAssetsLibrary.tsx
<div className="space-y-4">
  <div className="flex gap-3">
    <Input placeholder="Search assets..." value={search} onChange={(e) => setSearch(e.target.value)} />
    <Select value={filterType} onValueChange={setFilterType}>
      <SelectItem value="all">All Types</SelectItem>
      <SelectItem value="quote">Quote Graphic</SelectItem>
      <SelectItem value="infographic">Infographic</SelectItem>
      <SelectItem value="template">Template</SelectItem>
    </Select>
  </div>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {filteredAssets.map(asset => (
      <div key={asset.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
        <img src={asset.fileUrl} alt={asset.name} className="w-full h-40 object-cover" />
        <div className="p-3">
          <p className="text-sm font-semibold line-clamp-2">{asset.name}</p>
          <Badge className="mt-2 mb-2">{asset.type}</Badge>
          <div className="flex gap-2 text-xs">
            <button className="flex-1 py-1 bg-blue-50 rounded hover:bg-blue-100">
              ⬇️ Download
            </button>
            <button className="flex-1 py-1 bg-gray-50 rounded hover:bg-gray-100">
              ↗️ Share
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
```

---

## Tab Navigation Component

### Visual Design
```
┌────────────────────────────────────────────────────────┐
│ [Leadership] [Stories] [Impact] [Assets] [Leaders]   │
└────────────────────────────────────────────────────────┘
```

### Code Structure
```typescript
// Component: CountyBrandHub.tsx
const [activeTab, setActiveTab] = useState('leadership');

<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="leadership">
      👥 Leadership
    </TabsTrigger>
    <TabsTrigger value="stories">
      📖 Stories
    </TabsTrigger>
    <TabsTrigger value="impact">
      📊 Impact
    </TabsTrigger>
    <TabsTrigger value="assets">
      📁 Assets
    </TabsTrigger>
    <TabsTrigger value="wins">
      🏆 Recent Wins
    </TabsTrigger>
  </TabsList>

  <TabsContent value="leadership">
    <LeadershipGallery leaders={leaders} />
  </TabsContent>

  <TabsContent value="stories">
    <SuccessStoriesFlow stories={stories} onPost={handleStoryPost} />
  </TabsContent>

  <TabsContent value="impact">
    <CountyStatsBoard stats={stats} />
  </TabsContent>

  <TabsContent value="assets">
    <BrandAssetsLibrary assets={assets} />
  </TabsContent>

  <TabsContent value="wins">
    <LeaderAccomplishmentsBoard accomplishments={accomplishments} />
  </TabsContent>
</Tabs>
```

---

## Mobile Responsive Considerations

### Mobile Layout (< 768px)
- Single column layout for cards
- Collapsed tabs shown as buttons
- Photos scale properly
- Touch-friendly buttons (larger hit targets)
- Simplified charts/graphs

### Tablet Layout (768px - 1024px)
- 2-column grid for leader cards
- Full tabs visible
- Medium-sized photos
- Standard button sizes

### Desktop Layout (> 1024px)
- 3-4 column grid for leader cards
- Full featured experience
- Large photos and rich content
- All features visible

---

## Performance Optimization

1. **Image Optimization**
   - Lazy loading for photos
   - WebP format with fallbacks
   - Responsive image sizes

2. **Data Loading**
   - Pagination (25 items per page)
   - Infinite scroll for stories
   - Server-side filtering

3. **Caching**
   - Leader profiles (TTL: 1 hour)
   - County stats (TTL: 30 minutes)
   - Assets (TTL: 24 hours)

---

## Accessibility Features

✅ WCAG 2.1 AA Compliance
- Alt text on all images
- Keyboard navigation
- Color contrast ratios
- Form labels & ARIA attributes
- Focus indicators
- Semantic HTML

---

## Summary

This component structure creates a **comprehensive county brand hub** that:
- Shows local leadership prominently
- Celebrates volunteer impact
- Makes success visible & shareable
- Provides ready-made marketing assets
- Gamifies brand building
- Creates healthy county competition

**Result:** A complete ecosystem for building powerful local movements at the county level.
