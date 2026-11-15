# 🚀 How to Enable Party Leadership & Talking Points on County Page

The county dashboard page has been updated with 3 new sections, but **they require database setup first**.

## ❌ Current Status
You're seeing this error in Supabase SQL:
```
ERROR: 42P01: relation "party_leaders" does not exist
```

## ✅ Fix - Run These 2 Steps

### STEP 1: Copy the Setup SQL
- Open file: `SETUP_PARTY_LEADERS.sql`
- Copy all the SQL code

### STEP 2: Run in Supabase
1. Go to: https://app.supabase.com/project/YOUR-PROJECT/sql
2. Click "New Query"
3. **Paste** the entire `SETUP_PARTY_LEADERS.sql` content
4. Click **"Run"** (green button)
5. Wait for the green checkmark ✓

**That's it!** The script will:
- ✅ Create the `party_leaders` table
- ✅ Add columns to `talking_points` table
- ✅ Seed state leadership (Governor, Lt Gov, etc.)
- ✅ Seed regional directors
- ✅ Seed county leaders for 12 major counties
- ✅ Seed 5 talking points

---

## 📍 What You'll See After Setup

When you visit `/dashboard/Henry` (or any county), scroll down and click **"COUNTY INTEL"** to expand and see:

### 👥 Party & County Leadership
- State leaders with photos
- Regional representatives
- County GOP chairs
- Email/phone contacts

### 💬 Talking Points & Share Content
- Daily messaging with sources
- Copy to clipboard button
- Share to Facebook, Twitter/X, WhatsApp
- Suggested cadence (Daily/Weekly/Monthly)

### 🎙️ Georgia Podcasters & Media
- Local Georgia conservative podcasts
- Host names and descriptions
- Platform links (Apple Podcasts, Spotify, YouTube)

---

## 🔍 Verification

After running the SQL, you should see:
```
Category              | Count
State Leaders         | 4
Regional Leaders      | 4
County Leaders        | 12
Talking Points        | 5
```

---

## 🐛 Troubleshooting

**Q: Still getting "relation not found" error?**
A: Make sure you're running the **entire** `SETUP_PARTY_LEADERS.sql` file at once, not in pieces.

**Q: Seeing only some county leaders?**
A: The file includes leaders for 12 major counties. Add more by editing the file and inserting additional counties.

**Q: No data showing on the page?**
A: After running SQL:
1. Wait 2-3 minutes for Vercel to auto-redeploy
2. Hard refresh your browser (Ctrl+Shift+R)
3. Navigate to a county page you added leaders for

---

## 📝 File Reference

**Location:** `ga-conservative-action/SETUP_PARTY_LEADERS.sql`

**What it does:**
- Line 1-35: Creates `party_leaders` table & schema
- Line 37-44: Seeds 4 state leaders
- Line 46-51: Seeds 4 regional directors
- Line 53+: Seeds county leaders (Fulton, DeKalb, Cobb, Gwinnett, etc.)
- End: Verification query

---

## 🎯 Next Steps

1. ✅ Copy `SETUP_PARTY_LEADERS.sql`
2. ✅ Run in Supabase SQL Editor
3. ✅ Wait for green checkmark
4. ✅ Hard refresh browser
5. ✅ Visit county page and expand "COUNTY INTEL"

**Questions?** Check that:
- You're logged into Supabase
- You're in the right project
- You have SQL Editor access (might need admin role)

---

Generated: 2026-11-15
Version: 1.0
