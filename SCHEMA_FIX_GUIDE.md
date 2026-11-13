# 🔧 SUPABASE SCHEMA FIX GUIDE

## Issue Found: `TODAY()` Function Error

**Error Message:**
```
ERROR: 42883: function today() does not exist
LINE 171: date DATE DEFAULT TODAY()
```

**Root Cause:** PostgreSQL doesn't have a `TODAY()` function. The correct function is `CURRENT_DATE`.

---

## ✅ FIXES APPLIED

### Fix #1: SUPABASE_SCHEMA.sql (Line 171)

**Before:**
```sql
date DATE DEFAULT TODAY()
```

**After:**
```sql
date DATE DEFAULT CURRENT_DATE
```

**Status:** ✅ FIXED in your existing schema

---

## ✅ NEW SCHEMA - NO ISSUES

The new `CONCERNS_SCHEMA.sql` uses correct PostgreSQL functions:
- ✅ `NOW()` for TIMESTAMP WITH TIME ZONE
- ✅ `CURRENT_DATE` for DATE defaults
- ✅ `gen_random_uuid()` for UUID generation

---

## 🚀 NEXT STEPS

### 1. Run Updated SUPABASE_SCHEMA.sql
```
1. Open Supabase SQL Editor
2. Copy entire SUPABASE_SCHEMA.sql (NOW FIXED)
3. Paste & Click "Run"
4. Should succeed now!
```

### 2. Run New CONCERNS_SCHEMA.sql
```
1. Open Supabase SQL Editor (new window/tab)
2. Copy entire CONCERNS_SCHEMA.sql
3. Paste & Click "Run"
4. Done!
```

### 3. Verify Both Schemas

```sql
-- Check existing tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Should see:
-- - profiles
-- - counties
-- - activities
-- - talking_points
-- - education_topics
-- - AND NEW:
-- - voter_concerns
-- - concern_submissions
-- - concern_data_sources
-- - concern_metrics
-- - concern_audit_log
-- - concern_notifications
```

---

## 📝 PostgreSQL Date/Time Functions Reference

**For DATE column:**
- ✅ `CURRENT_DATE` - Today's date
- ❌ `TODAY()` - NOT VALID (this was the error)
- ❌ `DATE()` - Use CURRENT_DATE instead

**For TIMESTAMP/TIMESTAMP WITH TIME ZONE:**
- ✅ `NOW()` - Current timestamp
- ✅ `CURRENT_TIMESTAMP` - Same as NOW()
- ✅ `TIMEZONE('UTC', NOW())` - For UTC specifically

---

## ✅ ALL SCHEMAS NOW VALID

Both schemas are now ready to deploy:

1. **SUPABASE_SCHEMA.sql** ← Fixed (was: `TODAY()` → now: `CURRENT_DATE`)
2. **CONCERNS_SCHEMA.sql** ← Clean (uses correct functions)

---

**Ready to deploy!** Follow DEPLOYMENT_CHECKLIST.md next.
