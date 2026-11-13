# 📊 Launch Tracker - Check Off As You Go

## 🎯 Your Launch Journey (7 Steps Total)

```
TIME: ~1-2 hours total from start to live app
CODING: 0 lines required
DIFFICULTY: Easy (copy-paste and clicks)
```

---

## STEP 1: Create Supabase Account ⏱️ 15 minutes
**Status:** ⬜ Not Started

### Your To-Do
- [ ] Go to supabase.com
- [ ] Sign up (email or Google)
- [ ] Create new project
- [ ] Wait 2-3 minutes for it to set up
- [ ] Copy these 3 keys and save in a text file:
  - [ ] PROJECT URL (looks like https://xxxxx.supabase.co)
  - [ ] ANON KEY (long text starting with "ey...")
  - [ ] SERVICE ROLE KEY (another long "ey..." key)

### Where to Find These Keys
In Supabase Dashboard:
1. Click **Settings** (left sidebar)
2. Click **API** (left sidebar under Settings)
3. Copy each key one by one

### ✅ You'll Know It's Done When:
- You have 3 keys saved in a text file
- Supabase project is "active" (green status)

### Next: Tell me "STEP 1 DONE" + share your PROJECT URL
---

## STEP 2: Load Database Schema ⏱️ 5 minutes
**Status:** ⬜ Not Started

### Your To-Do
- [ ] Open Supabase dashboard (your project)
- [ ] Click **SQL Editor** (left sidebar)
- [ ] Click **New Query**
- [ ] Open the file: `SUPABASE_SCHEMA.sql` (in your ga-conservative-action folder)
- [ ] Copy ALL the code from that file
- [ ] Paste into the SQL Editor
- [ ] Click **Run** (▶️ button, top right)
- [ ] Wait 30 seconds

### ✅ You'll Know It's Done When:
- You see "Query complete" message (green checkmark)
- No error messages appear

### 🚨 If You See an Error:
- Screenshot it
- Tell me the error message
- We'll debug it

### Next: Tell me "STEP 2 DONE" + confirm you see "Query complete"
---

## STEP 3: Add Credentials to Your App ⏱️ 5 minutes
**Status:** ⬜ Not Started

### Your To-Do
- [ ] On your computer, open: `C:\Users\lijos\OneDrive\Desktop\GAGame\ga-conservative-action`
- [ ] Find file: `.env.local` (it's there, sometimes hidden)
- [ ] Open in Notepad or VS Code
- [ ] You'll see:
  ```
  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
  SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
  ```
- [ ] Replace the placeholder text with your actual 3 keys from Step 1
- [ ] Save the file (Ctrl+S)

### Example
```
NEXT_PUBLIC_SUPABASE_URL=https://myproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...1234567890
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...9876543210
```

### ✅ You'll Know It's Done When:
- .env.local file is saved with your real keys (not the placeholder text)

### Next: Tell me "STEP 3 DONE"
---

## STEP 4: Restart Development Server ⏱️ 2 minutes
**Status:** ⬜ Not Started

### Your To-Do
- [ ] Look at your terminal/command window (where the app is running)
- [ ] Press **Ctrl+C** (hold Control, press C) to stop it
- [ ] Type this command:
  ```bash
  npm run dev
  ```
- [ ] Press Enter
- [ ] Wait 10-15 seconds
- [ ] Look for message: "ready - started server on 0.0.0.0:3000"

### ✅ You'll Know It's Done When:
- Terminal shows "ready - started server on 0.0.0.0:3000"
- No red error messages
- App is running with your database connected

### Next: Tell me "STEP 4 DONE" + confirm you see the "ready" message
---

## STEP 5: Load Test Data ⏱️ 2 minutes
**Status:** ⬜ Not Started

### Your To-Do
- [ ] Open a **NEW terminal window** (File → New Terminal, or Ctrl+Shift+`)
- [ ] Navigate to your app folder:
  ```bash
  cd "C:\Users\lijos\OneDrive\Desktop\GAGame\ga-conservative-action"
  ```
- [ ] Paste this command:
  ```bash
  curl -X POST http://localhost:3000/api/seed -H "Authorization: Bearer dev-seed-key-change-in-production" -H "Content-Type: application/json"
  ```
- [ ] Press Enter
- [ ] Wait 10-20 seconds

### If "curl" doesn't work (Windows PowerShell)
Use this instead:
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/seed" -Method POST -Headers @{"Authorization"="Bearer dev-seed-key-change-in-production"; "Content-Type"="application/json"}
```

### ✅ You'll Know It's Done When:
- You see a response (text output)
- It says something like "seed complete" or shows data loaded
- No major errors

### Next: Tell me "STEP 5 DONE" + show me the response from the command
---

## STEP 6: Test Your App ⏱️ 30 min - 1 hour
**Status:** ⬜ Not Started

### Your To-Do
- [ ] Open browser, go to: `http://localhost:3000`
- [ ] Test each item below and check it off

### Quick Tests (5-10 minutes)
- [ ] Home page loads (see a map or county buttons)
- [ ] "Sign In to Participate" button is clickable
- [ ] Click Sign In → login page appears
- [ ] Try email login (create test account with dummy email like test@example.com)
- [ ] After login, see onboarding (pick a county)
- [ ] After picking county, see dashboard with county data
- [ ] See election results card
- [ ] See demographics card

### Activity Tests (5-10 minutes)
- [ ] See "Log Activity" section
- [ ] Click to log an activity
- [ ] Select an activity type
- [ ] Try uploading a photo (or skip)
- [ ] Add notes
- [ ] Submit activity
- [ ] See points awarded in profile

### Data Tests (5-10 minutes)
- [ ] Log out and log back in
- [ ] Check that your data is still there (data persists)
- [ ] Go to Public Directory (if available)
- [ ] See your profile listed

### Mobile Tests (5 minutes)
- [ ] Open browser DevTools (F12)
- [ ] Click responsive design mode (or Ctrl+Shift+M)
- [ ] Set to mobile (iPhone size)
- [ ] Click around - does it work on phone?
- [ ] Bottom navigation visible?

### ✅ You'll Know It's Done When:
- At least 70% of these tests pass
- No major crashes or error messages
- Basic flow works: Login → Pick County → Log Activity → See Points

### 🚨 If Something Doesn't Work:
- Screenshot the issue
- Tell me which test failed
- We'll debug it

### ⭐ OPTIONAL: Run Full Test Suite
For the complete 16-section testing checklist, see: `TESTING_GUIDE.md` (only do this if you want to be thorough)

### Next: Tell me "STEP 6 DONE" + tell me how many tests passed (or which ones failed)
---

## STEP 7: Deploy to Internet (OPTIONAL) ⏱️ 30 minutes
**Status:** ⬜ Not Started
**Prerequisites:** Steps 1-6 must be working first

### Why This Step?
- **Without Step 7:** Only you can see the app (localhost:3000)
- **With Step 7:** Anyone in the world with your URL can see it

### Your To-Do (Only Do This When Steps 1-6 Work!)

#### A) Create GitHub Repo (10 min)
- [ ] Go to github.com
- [ ] Sign up or log in
- [ ] Click **"New"** (top left)
- [ ] Name: `ga-voter-action`
- [ ] Make it **Private**
- [ ] Click **"Create repository"**

#### B) Push Code to GitHub (10 min)
In terminal in your app folder:
```bash
git config --global user.email "your_email@gmail.com"
git config --global user.name "Your Name"
git init
git add .
git commit -m "Initial commit: GA Voter Action"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ga-voter-action.git
git push -u origin main
```

Replace:
- `your_email@gmail.com` → your real email
- `Your Name` → your name
- `YOUR_USERNAME` → your GitHub username

#### C) Deploy to Vercel (10 min)
- [ ] Go to vercel.com
- [ ] Sign up or log in
- [ ] Click **"Add New"** → **"Project"**
- [ ] Select your GitHub repo
- [ ] Click **"Import"**
- [ ] Add Environment Variables:
  - Name: `NEXT_PUBLIC_SUPABASE_URL` → Value: (your URL from Step 1)
  - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Value: (your ANON key from Step 1)
  - Name: `SUPABASE_SERVICE_ROLE_KEY` → Value: (your SERVICE ROLE key from Step 1)
- [ ] Click **"Deploy"**
- [ ] Wait 3-5 minutes

### ✅ You'll Know It's Done When:
- Vercel shows a green checkmark: "Congratulations! Your site is deployed"
- You get a URL like: `https://ga-voter-action.vercel.app`
- You can visit that URL and see your app

### 🎉 Your App is Now Live on the Internet!
Anyone with your Vercel URL can visit your app.

### Next: Tell me "STEP 7 DONE" + share your Vercel URL
---

## 📊 Overall Progress

```
STEP 1 (Supabase Account)      ⬜ Not Started
STEP 2 (Database Schema)        ⬜ Not Started
STEP 3 (Add Credentials)        ⬜ Not Started
STEP 4 (Restart Dev Server)     ⬜ Not Started
STEP 5 (Seed Database)          ⬜ Not Started
STEP 6 (Test Everything)        ⬜ Not Started
STEP 7 (Deploy to Internet)     ⬜ Not Started (OPTIONAL)

═══════════════════════════════════════════════════════════
TOTAL LAUNCH TIME: 1-2 hours
CODING REQUIRED: 0 lines
YOUR STATUS: Ready to go! 🚀
═══════════════════════════════════════════════════════════
```

---

## 🎯 Decision Time

### Option A: Do This Right Now
1. Start with Step 1 (15 min)
2. Come back and tell me when done
3. We'll move to Step 2, then 3, etc.
4. I'll be here to help at each step

### Option B: Read & Understand First
1. Read LAUNCH_PLAN_NO_CODING.md (10 min)
2. Ask me any questions
3. Start Step 1 when ready

### Option C: Have Me Do It
1. Give me access to your computer
2. I can walk through it with you
3. Faster but less learning

---

## ❓ FAQ

**Q: What if I get stuck?**
A: Screenshot it, tell me what step, and send the error. I'll help debug.

**Q: Can I go back and change things?**
A: Yes! After launch, you can modify almost anything.

**Q: How long until people can use it?**
A: After Step 7, immediately! Just share the URL.

**Q: What if something breaks in production?**
A: We have backups and can roll back. No data loss.

**Q: Do I need to keep my computer on?**
A: No! After Vercel deployment (Step 7), app runs on their servers, not yours.

---

## 🚀 Ready?

**START WITH STEP 1 ABOVE ↑**

Tell me when you've completed each step, and I'll guide you to the next one.

**You've got this! 🎉**
