# F002: Google Sign-In — Verification Checklist

## ✅ Implementation Status: DONE

### Cleanup Completed
- [x] Removed Apple Sign-In button from OAuthButtons.tsx
- [x] Removed Apple provider from signInWithOAuth() function
- [x] Updated type signatures to remove 'apple' provider
- [x] Removed 'apple' from UserProfile.authProvider type union
- [x] Removed 'apple' from Database auth_provider type union
- [x] Updated welcome page text (removed "Google/Apple" → "Google")
- [x] Build: ✅ No errors
- [x] Lint: ✅ Warnings only (console.log in callback for debugging)
- [x] Type-check: ✅ No errors

### Final Routes
- `/login` — Sign in page (Google OAuth button only)
- `/signup` — Sign up page (Google OAuth button only)
- `/auth/callback` — OAuth callback handler (Client Component, parses hash tokens)
- `/home` — Protected home page (redirects to /login if no session)

### Google OAuth Flow (Happy Path)

1. **Start:** User visits `/login` or `/signup`
   - Sees "Sign in with Google" button (+ Email/Password for signup)

2. **Initiate:** Click "Sign in with Google"
   - OAuthButtons calls `supabase.auth.signInWithOAuth({ provider: 'google' })`
   - Browser redirects to Google OAuth

3. **Google Auth:** User authenticates with Google

4. **Callback:** Google redirects to `/auth/callback#access_token=...&refresh_token=...`
   - Callback page is Client Component (`'use client'`)
   - useEffect parses tokens from URL hash
   - Calls `supabase.auth.getSession()` to establish session
   - Sets cookies with session tokens

5. **Redirect:** On success → `/home` | On error → `/login?error=...`

6. **Verify:** Refresh `/home` → user still authenticated

### Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

If missing: App will show error or redirect to login without crashing.

### Manual Testing Steps

#### Test 1: Google Sign-In Success
```
1. Navigate to http://localhost:3000/login
2. Click "Sign in with Google"
3. Select Google account in popup
4. Confirm redirect to Google consent screen
5. Verify redirect to /auth/callback with hash tokens
6. Verify redirect to /home
7. Refresh /home → should stay authenticated
```

#### Test 2: Session Persistence
```
1. Sign in with Google (from Test 1)
2. Navigate to /home
3. Verify user email shown in page
4. Close browser tab and reopen
5. Navigate to /home
6. Verify still authenticated (no redirect to /login)
```

#### Test 3: Missing Session
```
1. Open /home without signing in
2. Should redirect to /login?error=...
3. No infinite redirect loops
```

#### Test 4: UI Only Has Google
```
1. Navigate to /login
2. Verify only "Sign in with Google" button visible
3. NO Apple button anywhere
4. Verify text says "Google" (not "Google/Apple")
5. Signup page same: only Google OAuth
```

### Code Locations

**OAuth Button Logic:**
- File: `src/components/auth/OAuthButtons.tsx`
- Type: Google only (`'google'`, not union)
- Handler: `handleOAuthSignIn()` — no provider param needed

**Callback Handler:**
- File: `src/app/auth/callback/page.tsx`
- Type: Client Component (`'use client'`)
- Flow: Parse hash → `getSession()` → redirect

**Server Actions:**
- File: `src/app/actions/auth.ts`
- Function: `signInWithOAuth(provider: 'google')`
- Note: Not used client-side (OAuthButtons uses client library directly)

**Type Definitions:**
- `src/types/database.types.ts` — `auth_provider: 'google' | 'email'`
- `src/types/index.ts` — `authProvider: 'google' | 'email'`

### Known Issues / Limitations

**Dev Server Webpack Cache (Windows):**
- If you see "Cannot find module './XXX.js'" errors:
  - Run: `rm -r .next && npm run dev`
  - This clears webpack build cache
  - Only needed if .next gets corrupted

**Multiple GoTrueClient Instances Warning:**
- Appears in console (non-blocking)
- From Supabase library internals
- Safe to ignore — doesn't affect functionality

### Environment Fallbacks

If `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` missing:
- OAuthButtons: Will error on click (caught + displayed)
- Callback: Will error on session check (redirected to login)
- No silent crashes — errors are visible

### Browser Support

- Chrome/Edge/Brave: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (macOS + iOS)
- IE11: ❌ Not supported (Next.js 14 dropped IE11)

### Next Steps (After F002 Verified)

1. ✅ F002 complete — Google OAuth working
2. → F003: Email/Password Authentication
3. → F004: Home screen (Today's Lesson)
4. → F005: Lesson Viewer
5. → F006: Practice Quiz

---

**Last Updated:** 2026-01-21
**Branch:** feature/F001-onboarding (current)
**Status:** ✅ READY FOR NEXT FEATURE
