# 🔧 GOOGLE OAUTH TROUBLESHOOTING

## Issue: Google Sign-In Not Working

If clicking "Continue with Google" doesn't work, follow these steps:

---

## ✅ Step 1: Check Supabase Configuration

### In Supabase Dashboard:
1. Go to **Authentication** → **Providers**
2. Find **Google** provider
3. Ensure it's **Enabled** (toggle is ON)
4. Verify you have:
   - ✅ Google Client ID
   - ✅ Google Client Secret

### Get Google OAuth Credentials:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable the **Google+ API**
4. Create **OAuth 2.0 Client ID** (Web Application)
5. Add Authorized Redirect URIs:
   ```
   https://ga-conservative-action.vercel.app/auth/callback
   http://localhost:3000/auth/callback  (for local testing)
   ```
6. Copy **Client ID** and **Client Secret**

### Add to Supabase:
1. In Supabase: **Authentication** → **Providers** → **Google**
2. Paste **Client ID** and **Client Secret**
3. Click **Save**

---

## ✅ Step 2: Check Vercel Environment Variables

### In Vercel Dashboard:
1. Go to **Settings** → **Environment Variables**
2. Verify these are set:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```
3. Redeploy if you just added/updated these

---

## ✅ Step 3: Check Callback Route

The callback route should be configured correctly:
- **File:** `src/app/auth/callback/route.ts`
- **Should redirect to:** `/dashboard` (map view)
- **Current implementation:** ✅ Working

---

## ✅ Step 4: Test Locally

If Google OAuth works locally but not on production:
1. Make sure Vercel env vars are set
2. Redeploy to Vercel:
   ```bash
   vercel deploy --prod
   ```

If Google OAuth doesn't work locally:
1. Check your `.env.local` file has Supabase credentials
2. Ensure Google Client Secret is correct
3. Check redirect URI matches exactly

---

## ✅ Alternative: Use Email Sign-In

If Google OAuth is not yet configured, users can sign in with:
- ✅ **Apple**
- ✅ **Facebook**
- ✅ **Email** (magic link)

The email option works immediately without additional setup.

---

## 📋 Checklist for Google OAuth

- [ ] Google OAuth enabled in Supabase
- [ ] Google Client ID added to Supabase
- [ ] Google Client Secret added to Supabase
- [ ] Redirect URI added to Google Cloud Console
- [ ] Redirect URI in Google: `https://ga-conservative-action.vercel.app/auth/callback`
- [ ] Vercel env vars set with Supabase credentials
- [ ] Vercel redeployed after env var changes
- [ ] Test: Click "Continue with Google" → Redirects to Google → Back to app → Lands on map

---

## 🚀 Quick Fix

If you just configured Google OAuth in Supabase:

1. **Redeploy to Vercel:**
   ```bash
   cd C:\Users\lijos\OneDrive\Desktop\GAGame\ga-conservative-action
   vercel deploy --prod
   ```

2. **Test the link:**
   - Visit https://ga-conservative-action.vercel.app/
   - Click "PLAY NOW"
   - Click "Continue with Google"
   - Follow Google's OAuth flow
   - Should land on `/dashboard` with the interactive map

---

## 💡 Debugging

Check browser console for errors:
- **Network tab:** Look for failed requests to `supabase.co`
- **Console:** Look for CORS or auth errors
- **Vercel logs:** `vercel logs` command for server-side errors

---

## ✅ Email Sign-In Works

If Google OAuth isn't working yet, email sign-in is fully functional:
1. Go to login page
2. Enter any email
3. Click "Send Magic Link"
4. Check email inbox
5. Click link to sign in
6. Lands on interactive Georgia map

This is a valid workaround while Google OAuth is being configured.

---

## Need Help?

Check these files:
- `src/app/auth/login/page.tsx` - Login page (OAuth buttons)
- `src/app/auth/callback/route.ts` - Callback handler
- `.env.local` - Local environment variables
- Vercel Settings → Environment Variables - Production variables
