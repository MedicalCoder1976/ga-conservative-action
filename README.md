# GA Voter Action - Voter Engagement Platform

A production-ready Next.js application for tracking voter engagement across Georgia's 159 counties. Built with Next.js 16 (App Router), TypeScript, Tailwind CSS, and Supabase.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (free tier works)

### Setup

1. **Clone and install:**
   ```bash
   git clone <your-repo>
   cd ga-conservative-action
   npm install
   ```

2. **Configure Supabase:**
   - Create project at https://supabase.com
   - Copy `SUPABASE_SCHEMA.sql` to Supabase SQL Editor and run it
   - Copy credentials to `.env.local`:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     SUPABASE_SERVICE_ROLE_KEY=your-service-key
     ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   
   Open http://localhost:3000

4. **Seed the database:**
   ```bash
   curl -X POST http://localhost:3000/api/seed \
     -H "Authorization: Bearer dev-seed-key-change-in-production" \
     -H "Content-Type: application/json"
   ```

5. **Test the application:**
   See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for complete testing checklist

## 📋 Features

### Core
- ✓ Multi-provider authentication (Google, Apple, Facebook, Email)
- ✓ Interactive Georgia county map with activity tracking
- ✓ 2026 election results and demographic data
- ✓ Exit poll analysis by county
- ✓ Activity logging with photo uploads and points system
- ✓ Real-time color intensity based on volunteer activity

### Content
- ✓ Daily talking points and messaging
- ✓ Educational topics (Election Integrity, School Choice, etc.)
- ✓ Public directory of volunteer profiles
- ✓ Badges and achievement system
- ✓ Leaderboards and recognition

### Technical
- ✓ Row-level security (RLS) on all database tables
- ✓ Server components with Supabase integration
- ✓ Responsive mobile-first design
- ✓ Photo uploads to Supabase Storage
- ✓ Fast development with Turbopack

## 📁 Project Structure

```
ga-conservative-action/
├── src/
│   ├── app/                           # Next.js App Router pages
│   │   ├── page.tsx                   # Homepage
│   │   ├── auth/                      # Authentication
│   │   │   ├── login/page.tsx
│   │   │   ├── callback/route.ts
│   │   ├── onboarding/page.tsx        # First-login flow
│   │   ├── dashboard/                 # County dashboards
│   │   │   ├── page.tsx               # County list
│   │   │   └── [county]/page.tsx      # Individual county dashboard
│   │   ├── talking-points/page.tsx    # Messaging content
│   │   ├── education/page.tsx         # Educational topics
│   │   ├── directory/page.tsx         # Public profiles
│   │   ├── badges/page.tsx            # Achievements
│   │   ├── profile/                   # User profiles
│   │   ├── api/
│   │   │   └── seed/route.ts          # Database seeding endpoint
│   ├── components/
│   │   ├── ui/                        # shadcn components
│   │   ├── ActivityLogger.tsx         # Log activities
│   │   ├── CountyMap.tsx              # County visualization
│   │   ├── ElectionResultsCard.tsx    # Election data
│   │   ├── DemographicsCard.tsx       # Population stats
│   │   ├── ExitPollsCard.tsx          # Poll analysis
│   │   └── SuggestedActivitiesList.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts              # Browser client
│   │   │   └── server.ts              # Server client
│   │   ├── types.ts                   # TypeScript types
│   │   ├── seed-data.ts               # Reference data
│   ├── middleware.ts                  # Route protection
├── SUPABASE_SCHEMA.sql                # Database schema
├── SETUP.md                           # Detailed setup guide
├── IMPLEMENTATION_GUIDE.md            # Architecture guide
├── TESTING_GUIDE.md                   # Testing checklist
└── scripts/
    └── dev-help.js                    # Development helpers
```

## 🔧 Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Run production server
npm run lint         # Run ESLint
```

## 📊 Database Schema

### Key Tables
- **profiles** - User accounts and settings
- **counties** - Georgia county data and activity scores
- **activities** - Logged volunteer activities
- **suggested_activities** - Activity templates with point values
- **election_results** - 2026 election data by county
- **exit_polls** - Voter behavior analysis
- **demographics** - Population statistics
- **badges** - User achievements
- **talking_points** - Daily messaging content
- **education_topics** - Educational resources

See [SUPABASE_SCHEMA.sql](./SUPABASE_SCHEMA.sql) for full schema.

## 🔐 Security

- Row-level security (RLS) on all tables
- Users can only access/modify their own data
- Public read access for reference tables
- Service role key for server-side operations
- Environment variables protected via Vercel

## 📱 Mobile Support

Fully responsive design optimized for:
- ✓ Mobile phones (320px+)
- ✓ Tablets (640px+)
- ✓ Desktops (1024px+)

Bottom navigation on mobile, map interactions across all devices.

## 🚀 Deployment

### To Vercel

1. Push code to GitHub
2. Connect repo to Vercel (vercel.com/new)
3. Add environment variables in Vercel dashboard
4. Deploy → automatic on push to main

### Production Checklist
- [ ] GitHub repository created
- [ ] Vercel project linked
- [ ] Environment variables set in Vercel
- [ ] Custom domain configured (optional)
- [ ] OAuth credentials for production providers
- [ ] Database backups enabled in Supabase
- [ ] Error tracking configured (Sentry, etc.)

See [SETUP.md](./SETUP.md) for detailed deployment instructions.

## 🧪 Testing

Comprehensive 16-section testing checklist covering:
1. Authentication flows
2. Onboarding process
3. Dashboard and map
4. Data visualization (election, demographics, exit polls)
5. Activity logging and points
6. Map color transitions
7. Content pages (talking points, education, directory, badges)
8. Mobile responsiveness
9. Sharing functionality
10. Data persistence and security
11. Error handling
12. Performance
13. Data accuracy
14. API endpoints

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for complete checklist and debugging tips.

## 📚 Documentation

- [SETUP.md](./SETUP.md) - Complete setup and deployment guide
- [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) - Architecture and component details
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Testing checklist and verification steps
- [SUPABASE_SCHEMA.sql](./SUPABASE_SCHEMA.sql) - Database schema

## 🤝 Contributing

1. Create feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open Pull Request

## 📝 License

Private project - authorized use only.

## ✅ Current Status

- [x] Project scaffolding
- [x] Database schema and infrastructure
- [x] Authentication (login, OAuth, onboarding)
- [x] Core components (map, cards, activity logger)
- [x] Data seeding infrastructure
- [x] Full documentation
- [x] Production build (✓ succeeds)
- [x] Dev server (✓ running on http://localhost:3000)
- [ ] Database seeded with real credentials
- [ ] Full testing checklist execution
- [ ] Vercel deployment

## 🚀 Next Steps

1. **Configure Supabase** - Get real credentials and update .env.local
2. **Seed database** - Run seeding endpoint with real credentials
3. **Configure OAuth** - Set up Google/Apple/Facebook credentials (optional)
4. **Run tests** - Complete all items in TESTING_GUIDE.md
5. **Deploy to Vercel** - Push to GitHub and connect to Vercel

## 💬 Support

For issues or questions, refer to:
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Debugging section
- [SETUP.md](./SETUP.md) - Common issues
- Supabase documentation: https://supabase.com/docs
- Next.js documentation: https://nextjs.org/docs
