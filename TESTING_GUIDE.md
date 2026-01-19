# Authentication Testing Guide

The Supabase authentication system is fully integrated and ready to test. This guide covers all authentication flows and security features.

## Quick Start

```bash
npm run dev
# Open http://localhost:3000
```

---

## Testing Flows

### 1. Email/Password Signup ✅

**Route:** http://localhost:3000/signup

**Test Cases:**

| Scenario | Input | Expected Result |
|----------|-------|-----------------|
| Valid signup | Email: `test@example.com`, Password: `Password123`, Confirm: `Password123`, Display Name: `John` | ✅ Account created, redirects to `/login` |
| Short password | `Pass1` | ❌ Error: "Password must be at least 8 characters" |
| Password mismatch | Password: `Password123`, Confirm: `Different123` | ❌ Error: "Passwords do not match" |
| Invalid email | `notanemail` | ❌ Error: "Please enter a valid email address" |
| Duplicate email | Email already registered | ❌ Error: "Email is already registered. Please sign in instead." |
| Invalid display name | `J` (1 char) | ❌ Error: "Display name must be at least 2 characters" |
| Invalid display name | `John@#$` (special chars) | ❌ Error: "Display name can only contain letters, numbers, and spaces" |

**Database Checks After Signup:**

```sql
-- In Supabase SQL Editor, replace USER_EMAIL with your test email

-- Check user profile created
SELECT id, email, display_name, subscription_tier, is_active
FROM public.user
WHERE email = 'USER_EMAIL';
-- Should return 1 row with display_name populated

-- Check streak initialized
SELECT * FROM public.daily_streak
WHERE user_id = (SELECT id FROM public.user WHERE email = 'USER_EMAIL');
-- Should return 1 row with current_streak = 0, longest_streak = 0

-- Check ranking initialized
SELECT * FROM public.ranking
WHERE user_id = (SELECT id FROM public.user WHERE email = 'USER_EMAIL');
-- Should return 1 row with total_xp = 0
```

---

### 2. Email/Password Login ✅

**Route:** http://localhost:3000/login

**Test Cases:**

| Scenario | Input | Expected Result |
|----------|-------|-----------------|
| Valid login | Email: test@example.com, Password: correct password | ✅ Session created, redirects to `/home` |
| Wrong password | Correct email, wrong password | ❌ Error: "Invalid email or password. Please try again." |
| Non-existent email | random@example.com | ❌ Error: "Invalid email or password. Please try again." |
| Empty email | Leave blank, enter password | ❌ Error: "Email is required" |
| Empty password | Enter email, leave blank | ❌ Error: "Password is required" |

**Session Verification:**

After successful login:
- Check browser DevTools > Application > Cookies
- You should see `sb-*` cookies (Supabase session tokens)
- Refresh page - you should stay logged in (session persists)

---

### 3. Google OAuth (if configured) ✅

**Route:** http://localhost:3000/login or /signup

**Prerequisites:**

1. Get Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/)
2. Add redirect URL: `http://localhost:3000/auth/callback`
3. Add Client ID & Secret in Supabase > Authentication > Providers > Google

**Test Cases:**

| Scenario | Expected Result |
|----------|-----------------|
| Click "Continue with Google" | Opens Google login popup |
| Sign in with Google account | Redirects to `/home` with session |
| Same Google account again | Logs in immediately, redirects to `/home` |
| Different Google account | Creates new Progressia account, redirects to `/home` |

**Session Verification:**

After OAuth login:
- Check `sb-*` cookies in browser
- Session tokens should be set correctly
- Refresh page - session should persist
- Check `/home` is accessible

---

### 4. Password Reset (Forgot Password) ✅

**Route:** http://localhost:3000/forgot-password

**Test Cases:**

| Scenario | Expected Result |
|----------|-----------------|
| Valid email | ✅ Email sent, shows "Check your inbox" message |
| Invalid email | ❌ Error: "Please enter a valid email address" |
| Non-registered email | ✅ Email sent anyway (security best practice - don't reveal if email exists) |

**Testing Password Reset Flow:**

1. **Go to forgot-password page**
   ```
   http://localhost:3000/forgot-password
   ```

2. **Enter registered email**
   - Should show: "Password reset email sent. Check your inbox."

3. **Check email** (if using Supabase's default email)
   - Supabase sends email with reset link
   - Link format: `http://localhost:3000/reset-password?code=...&type=recovery`

4. **Click reset link or manually go to reset-password page**
   ```
   http://localhost:3000/reset-password?code=RESET_CODE&type=recovery
   ```

5. **Enter new password**
   - Password: `NewPassword123`
   - Confirm: `NewPassword123`
   - Should redirect to `/login` after success

6. **Login with new password**
   - Use new password to sign in
   - Should work successfully

**Testing Invalid Tokens:**

- Remove `code` parameter: Shows "Invalid or missing reset link"
- Change `type` to something other than `recovery`: Shows "Invalid or missing reset link"
- Use invalid code: Supabase returns error from `updateUser()`

---

### 5. Route Protection (Middleware) ✅

**Protected Routes:** `/home`, `/profile`, `/lesson/*`, `/routes/*`, `/ranking/*`, `/upgrade/*`, `/spin/*`

**Test Cases:**

| Scenario | Expected Result |
|----------|-----------------|
| Visit `/home` logged out | Redirects to `/login` |
| Visit `/profile` logged out | Redirects to `/login` |
| Visit `/login` logged in | Redirects to `/home` |
| Visit `/signup` logged in | Redirects to `/home` |
| Visit `/forgot-password` logged in | Shows forgot-password (not protected) |
| Visit `/home` logged in | Shows home page ✅ |

---

## Security Testing

### 1. Display Name Validation ✅

Test at: http://localhost:3000/signup

```javascript
// In browser console, test validation:
// (This is handled server-side, but you can see client validation too)

// Invalid: Special characters
displayName = "John@#$%"  // ❌ Should reject

// Invalid: Numbers only
displayName = "12345"  // ✅ Actually allowed (alphanumeric)

// Invalid: Too short
displayName = "J"  // ❌ Should reject (< 2 chars)

// Invalid: Too long
displayName = "a".repeat(31)  // ❌ Should reject (> 30 chars)

// Valid examples:
displayName = "John Doe"  // ✅
displayName = "Juan123"  // ✅
displayName = "María"  // ❌ (non-ASCII - only ASCII allowed now)
```

### 2. RLS Policy Testing - Immutable Fields ✅

**What:** Users cannot modify email or auth_provider

**Test in Supabase SQL Editor** (as authenticated user):

```sql
-- This will FAIL (RLS prevents update)
UPDATE public.user
SET email = 'newemail@example.com'
WHERE id = auth.uid();

-- Error: "new row violates row-level security policy"

-- This will FAIL (RLS prevents update)
UPDATE public.user
SET auth_provider = 'google'
WHERE id = auth.uid();

-- Error: "new row violates row-level security policy"

-- This CAN succeed (system allows some fields to be updated)
UPDATE public.user
SET display_name = 'New Name'
WHERE id = auth.uid();

-- Success: Fields like display_name can be updated
```

### 3. RLS Policy Testing - Streak Backend-Only ✅

**What:** Users cannot directly modify their streaks

**Test in Supabase SQL Editor** (as authenticated user):

```sql
-- This will FAIL (RLS denies all updates)
UPDATE public.daily_streak
SET current_streak = 100
WHERE user_id = auth.uid();

-- Error: "new row violates row-level security policy"

-- This will FAIL (RLS denies all updates)
UPDATE public.daily_streak
SET longest_streak = 50
WHERE user_id = auth.uid();

-- Error: "new row violates row-level security policy"

-- SELECT still works (users can view their streak)
SELECT * FROM public.daily_streak
WHERE user_id = auth.uid();

-- Success: Can view but not modify
```

### 4. Subscription Tier Self-Upgrade Prevention ✅

**Test in Supabase SQL Editor** (as authenticated user):

```sql
-- This will FAIL (RLS prevents tier upgrade)
UPDATE public.user
SET subscription_tier = 'pro'
WHERE id = auth.uid();

-- Error: "new row violates row-level security policy"

-- Current tier is locked to its existing value
```

### 5. OAuth Session Persistence ✅

**Test:**

1. Sign in with Google OAuth
2. Check browser cookies - `sb-*` tokens should be present
3. Refresh page - you should stay logged in
4. Close browser tab and reopen - session should persist
5. Clear cookies and refresh - logged out (expected)

---

## Troubleshooting

### Issue: "Email provider not enabled"

**Fix:**
1. Go to Supabase dashboard > Authentication > Providers
2. Click "Email" and toggle ON
3. Keep default settings
4. Click Save

### Issue: "OAuth redirect loop"

**Cause:** Redirect URL doesn't match configuration

**Fix:**
1. In Supabase > Authentication > Providers > Google
2. Verify redirect URL is: `http://localhost:3000/auth/callback`
3. Restart dev server

### Issue: Password reset email not received

**Cause:** Email provider not configured

**Fix:**
1. Supabase free tier uses limited email service
2. For development, check Supabase dashboard > Authentication > Email Templates
3. See if test email was sent

### Issue: "Session expired" after page refresh

**Cause:** Middleware session refresh failed

**Fix:**
1. Check `.env.local` has correct Supabase credentials
2. Restart dev server
3. Try in incognito mode (clears cookies)

### Issue: Display name not saved

**Cause:** Validation rejecting display name

**Fix:**
1. Use only ASCII letters, numbers, spaces
2. Min 2 characters, max 30 characters
3. Check browser console for validation error

---

## Performance Checklist

- [ ] Signup completes in < 2 seconds
- [ ] Login completes in < 1 second
- [ ] OAuth redirect completes in < 3 seconds
- [ ] Password reset email sent in < 5 seconds
- [ ] Page refresh keeps session (immediate)

---

## Security Checklist

- [ ] Passwords never logged or exposed in console
- [ ] Session tokens in httpOnly cookies
- [ ] OAuth tokens never exposed to frontend
- [ ] Display names sanitized (ASCII-only)
- [ ] RLS prevents data leakage between users
- [ ] Immutable fields cannot be changed
- [ ] Streaks cannot be modified by users

---

## Next Steps

After authentication is working:

1. **Enable Onboarding (F001)** - Demo lesson before signup
2. **Build Home Screen** - Show today's lesson
3. **Implement Lesson Viewer** - Cards + quiz
4. **Add Gamification** - XP, streaks, achievements
5. **Implement Leaderboards** - Global rankings

---

**All tests passing? You're ready for Day 2!** 🚀
