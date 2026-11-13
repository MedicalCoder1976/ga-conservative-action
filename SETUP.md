# GA Voter Action - Setup Instructions

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/log in
2. Create a new project with:
   - Project name: `ga-voter-action`
   - Region: `US East (N. Virginia)` (or nearest to you)
   - Password: Save securely

3. Wait for project to initialize (2-3 minutes)

4. Get your credentials from Settings → API:
   - Copy: `Project URL` → goes in `.env.local` as `NEXT_PUBLIC_SUPABASE_URL`
   - Copy: `anon public` key → goes in `.env.local` as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy: `service_role secret` key → goes in `.env.local` as `SUPABASE_SERVICE_ROLE_KEY`

## Step 2: Setup Database Schema

1. In Supabase dashboard, go to SQL Editor
2. Create new query
3. Copy contents of `SUPABASE_SCHEMA.sql` from the project root
4. Paste entire SQL into the editor
5. Click "Run"
6. Wait for completion (should see 13 tables created)

## Step 3: Configure OAuth Providers (Authentication)

In Supabase dashboard, go to Authentication → Providers:

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Desktop app)
5. Add redirect URI: `https://your-project.supabase.co/auth/v1/callback`
6. Copy Client ID and Client Secret
7. In Supabase, enable Google provider
8. Paste Client ID and Client Secret
9. Save

### Apple OAuth
1. Go to [Apple Developer](https://developer.apple.com)
2. Create Sign In with Apple credentials
3. Configure redirect URI: `https://your-project.supabase.co/auth/v1/callback`
4. Get Service ID, Team ID, Key ID, Private Key
5. In Supabase, enable Apple provider
6. Fill in all credentials
7. Save

### Facebook OAuth
1. Go to [Facebook Developers](https://developers.facebook.com)
2. Create or select existing app
3. Add Facebook Login product
4. Configure redirect URI: `https://your-project.supabase.co/auth/v1/callback`
5. Get App ID and App Secret
6. In Supabase, enable Facebook provider
7. Paste App ID and App Secret
8. Save

## Step 4: Create Storage Bucket

In Supabase dashboard, go to Storage:

1. Create new bucket named: `activity-photos`
2. Make it PUBLIC (check "Public bucket")
3. Click "Create bucket"

## Step 5: Setup Environment Variables

1. In project root, open/create `.env.local`
2. Add these with values from Supabase:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
   SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
   SEED_SECRET_KEY=dev-seed-key-change-in-production
   ```

3. Save file

## Step 6: Seed Initial Data

1. Run development server:
   ```bash
   npm run dev
   ```

2. In another terminal, seed data:
   ```bash
   curl -X POST http://localhost:3000/api/seed \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer dev-seed-key-change-in-production" \
     -d '{"type":"all"}'
   ```

   Or POST to individual endpoints:
   - `{"type":"counties"}` - Seed all 159 GA counties
   - `{"type":"activities"}` - Seed suggested activities
   - `{"type":"talking-points"}` - Seed talking points
   - `{"type":"education"}` - Seed education topics
   - `{"type":"elections"}` - Seed 2026 election results
   - `{"type":"demographics"}` - Seed demographic data

3. Verify in Supabase dashboard that tables are now populated

## Step 7: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Create repository:
   - Name: `ga-conservative-action`
   - Description: "Conservative action tracking and voter engagement platform for Georgia"
   - Make it PUBLIC (so Vercel can deploy)
   - DO NOT initialize with README (we have one)
   - Click "Create repository"

3. In project root, run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: GA Conservative Action app scaffold"
   git branch -M main
   git remote add origin https://github.com/[your-username]/ga-conservative-action.git
   git push -u origin main
   ```

## Step 8: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Select the `ga-conservative-action` repository
4. Configure project:
   - Framework: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=[from Step 5]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[from Step 5]
   SUPABASE_SERVICE_ROLE_KEY=[from Step 5]
   SEED_SECRET_KEY=[change to secure random string]
   ```
6. Click "Deploy"
7. Wait for deployment to complete
8. Your app is now live at: `https://[project-name].vercel.app`

## Step 9: Verify Everything Works

### Test Authentication
1. Visit your app homepage
2. Click "Sign In to Participate"
3. Try signing in with Google, Apple, Facebook, or email
4. Complete onboarding (username + county selection)
5. Should redirect to county dashboard

### Test Activity Logging
1. From dashboard, click "Log Activity"
2. Select an activity type from dropdown
3. Upload a photo
4. Add notes
5. Submit
6. Verify points awarded and county color shifts toward red

### Test Map
1. Return to homepage
2. Counties should now show color based on activity

### Test Other Sections
1. Visit `/talking-points` - should see talking points
2. Visit `/education` - should see education topics
3. Visit `/directory` - should see public profiles
4. Visit `/badges` - should see leaderboards
5. Visit `/profile` - should see your profile settings

## Troubleshooting

### "Database Error" when signing in
- Check that SUPABASE_SCHEMA.sql was fully executed
- Verify all 13 tables exist in Supabase
- Check RLS policies are enabled

### OAuth not working
- Verify redirect URIs match exactly: `https://your-project.supabase.co/auth/v1/callback`
- Check Client ID/Secret are correct
- Check provider is enabled in Supabase Auth settings

### Photos not uploading
- Verify `activity-photos` bucket exists and is PUBLIC
- Check Storage permissions in Supabase

### Data not seeding
- Verify SEED_SECRET_KEY matches in .env.local
- Check API endpoint returns 200 status
- Check Supabase tables in dashboard

### Build errors on Vercel
- Run `npm run build` locally to test
- Check all environment variables are set
- Check for TypeScript errors: `npm run type-check`

## Production Checklist Before Launch

- [ ] All OAuth providers tested and working
- [ ] Database schema verified in Supabase
- [ ] Storage bucket created and working
- [ ] Environment variables set in Vercel
- [ ] Data seeded (counties, elections, demographics, activities)
- [ ] RLS policies verified for security
- [ ] All pages tested and working
- [ ] Mobile responsiveness verified on phone/tablet
- [ ] Error handling tested
- [ ] SEED_SECRET_KEY changed from dev value
- [ ] Custom domain added to Vercel (optional)
- [ ] DNS configured (if custom domain)
- [ ] Monitoring/logging configured
- [ ] Backup of Supabase configured
- [ ] Security audit completed

## Next Steps

1. Test the full end-to-end flow
2. Customize branding/colors if desired
3. Add more counties to demographics if needed
4. Customize talking points and education content
5. Launch marketing to get first volunteers
6. Monitor activity and engagement
7. Iterate on features based on feedback

Good luck with your conservative action platform! 🇺🇸
