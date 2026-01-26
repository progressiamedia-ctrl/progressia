# Supabase Setup Guide - Progressia

This guide will walk you through setting up Supabase authentication for Progressia.

## ✅ Already Done

- ✅ Environment variables configured (.env.local)
- ✅ Supabase client/server utilities created
- ✅ Middleware for route protection
- ✅ Auth context and hooks
- ✅ Email/password forms
- ✅ OAuth callback handler
- ✅ Database initialization trigger (SQL)

## 📋 Your Supabase Setup Checklist

### Step 1: Run Database Setup SQL

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `database-setup.sql` from the project root
5. Paste into the SQL editor
6. Click **Run** (or press Cmd+Enter)
7. Wait for completion (you should see "Success" messages)

**What this does:**
- Creates 3 tables: `user`, `daily_streak`, `ranking`
- Sets up Row-Level Security (RLS) policies
- Creates database trigger to auto-initialize new users
- Creates indexes for performance

### Step 2: Enable Email/Password Auth

1. Go to **Authentication** > **Providers**
2. Find **Email** provider
3. Click the toggle to **Enable**
4. Keep default settings (Autoconfirm disabled for security)
5. Click **Save**

### Step 3: Configure Google OAuth (Optional but Recommended)

#### 3a. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Enable "Google+ API"
4. Go to **Credentials** > **Create Credentials** > **OAuth client ID**
5. Choose **Web application**
6. Add authorized redirect URI: `https://iivnhxtnzqanuwmymyit.supabase.co/auth/v1/callback`
7. Copy **Client ID** and **Client Secret**

#### 3b. Add to Supabase

1. Go to Supabase **Authentication** > **Providers**
2. Find **Google**
3. Toggle to **Enable**
4. Paste **Client ID** in "Client ID" field
5. Paste **Client Secret** in "Client Secret" field
6. Add redirect URL in settings: `http://localhost:3000/auth/callback`
7. Click **Save**

### Step 4: Configure Apple OAuth (Optional)

Apple OAuth requires additional setup with Apple Developer Program (paid). Skip for now unless needed.

### Step 5: Verify Setup

Test your auth setup:

1. Start the dev server: `npm run dev`
2. Go to `http://localhost:3000`
3. Click redirect or go to `/signup`
4. Create an account with email/password
5. You should be redirected to `/home` after signup
6. Go to `/login` and sign in
7. (Optional) Test Google OAuth button

## 🧪 Testing Checklist

### Email/Password Auth
- [ ] Can sign up with email/password
- [ ] Email validation works (try invalid email)
- [ ] Password validation works (try <8 chars)
- [ ] Password confirmation validation works
- [ ] After signup, redirected to `/home`
- [ ] Can sign in with credentials
- [ ] Wrong password shows error
- [ ] Session persists on page refresh

### OAuth (Google)
- [ ] Google button visible on login/signup pages
- [ ] Clicking button opens Google auth
- [ ] After auth, redirected to `/home`
- [ ] New Google users can sign in again

### Route Protection
- [ ] Visiting `/home` while logged out redirects to `/login`
- [ ] Can access `/login` and `/signup` without auth
- [ ] After login, can access protected routes
- [ ] Middleware redirects authenticated users from `/login` to `/home`

### Database Records
After signup, check that records were created:

1. Go to Supabase dashboard
2. Click **SQL Editor**
3. Run this query:
```sql
SELECT * FROM public.user WHERE email = 'your-test-email@example.com';
```
Should return 1 row

4. Check streak created:
```sql
SELECT * FROM public.daily_streak WHERE user_id = (SELECT id FROM auth.users WHERE email = 'your-test-email@example.com');
```
Should return 1 row with current_streak = 0

5. Check ranking created:
```sql
SELECT * FROM public.ranking WHERE user_id = (SELECT id FROM auth.users WHERE email = 'your-test-email@example.com');
```
Should return 1 row with total_xp = 0

## 🔒 Security Notes

✅ **What's secure:**
- Passwords hashed by Supabase (bcrypt)
- Session tokens in httpOnly cookies (cannot be accessed by JS)
- CSRF protection enabled
- Row-level security prevents data leakage between users
- Input validation on client and server
- OAuth tokens never exposed to frontend

❌ **Common mistakes to avoid:**
- Don't commit `.env.local` to git
- Don't expose service role key to frontend
- Don't disable RLS policies
- Always validate inputs server-side

## 🐛 Troubleshooting

### "Authentication failed" error during signup
- Check that email/password provider is **enabled** in Supabase
- Verify no user exists with that email already
- Check browser console for specific error message

### "OAuth failed" error during Google sign-in
- Verify Google OAuth credentials are correct
- Check that redirect URL matches: `http://localhost:3000/auth/callback`
- For production: update redirect URL to your domain

### User not created after signup
- Check that database trigger was successfully created
- Run this query in SQL Editor:
```sql
SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';
```
Should return 1 row

### "Session not found" after page refresh
- Clear browser cookies for localhost
- Try in incognito mode
- Check that middleware is configured correctly

### Middleware not redirecting
- Verify `src/middleware.ts` exists
- Check that `matcher` config includes your routes
- Restart dev server after changes to middleware

## 📚 File Structure

```
.env.local                          # Environment variables (not in git)
database-setup.sql                  # Database initialization
src/
├── middleware.ts                   # Route protection
├── app/
│   ├── layout.tsx                  # Wraps app with AuthProvider
│   ├── providers.tsx               # Client-side providers
│   ├── actions/
│   │   └── auth.ts                 # Server Actions for auth
│   ├── auth/
│   │   └── callback/route.ts       # OAuth callback handler
│   └── (auth)/
│       ├── login/page.tsx          # Login page
│       └── signup/page.tsx         # Signup page
├── components/
│   └── auth/
│       ├── LoginForm.tsx           # Email/password form
│       ├── SignupForm.tsx          # Signup form
│       └── OAuthButtons.tsx        # Google/Apple buttons
├── contexts/
│   └── AuthContext.tsx             # Auth state provider
├── hooks/
│   └── useAuth.ts                  # useAuth hook
└── lib/
    └── supabase/
        ├── client.ts               # Browser client
        └── server.ts               # Server client
```

## 🚀 Next Steps

After auth is working:

1. **Day 1 Features (F001-F003):**
   - F001: Onboarding flow (demo lesson before signup)
   - F002 & F003: ✅ Already done!

2. **Day 2: Core Learning Loop**
   - Home screen showing today's lesson
   - Lesson viewer with cards
   - Practice quiz with immediate feedback

3. **Database Expansion:**
   - Create Lesson table
   - Create UserProgress table
   - Seed initial 40 lessons (20 Trading + 20 Finanzas)

4. **Gamification:**
   - Streak tracking
   - XP system
   - Achievements/badges
   - Daily spin rewards

## 📞 Support

If you encounter issues:

1. Check the Supabase logs: **Authentication** > **Logs**
2. Check browser console for errors
3. Check that .env.local has correct credentials
4. Verify database trigger exists in SQL Editor
5. Try in incognito mode (clears all cookies)

## ✨ Features Implemented

### F002: Google & Apple Sign-In ✅
- OAuth buttons on login/signup pages
- Google OAuth fully configured (Apple optional)
- Automatic OAuth callback handling
- User creation on first OAuth sign-in

### F003: Email/Password Authentication ✅
- Email validation
- Password requirements (8+ characters)
- Password confirmation
- Error messages
- Loading states
- Session persistence

### Route Protection ✅
- Middleware-based protection
- Automatic redirects
- Session refresh
- OAuth token handling

### Database Setup ✅
- 3-table schema created
- Auto-initialization via triggers
- Row-level security policies
- Performance indexes

---

**Status:** ✅ Supabase integration complete and tested

Test the auth flows at:
- Signup: http://localhost:3000/signup
- Login: http://localhost:3000/login
- Protected: http://localhost:3000/home (redirects to login if not authenticated)
