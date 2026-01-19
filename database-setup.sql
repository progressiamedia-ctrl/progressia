-- ============================================================================
-- Progressia Database Setup
-- Run this SQL in Supabase SQL Editor to initialize database schema
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- Create User Profile Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  auth_provider TEXT NOT NULL CHECK (auth_provider IN ('google', 'apple', 'email')),
  country_code TEXT,
  language TEXT NOT NULL DEFAULT 'es',
  timezone TEXT NOT NULL DEFAULT 'America/Mexico_City',
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  preferred_track TEXT CHECK (preferred_track IN ('trading', 'finanzas', 'ambos')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- Create Daily Streak Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.daily_streak (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.user(id) ON DELETE CASCADE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  streak_freeze_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- Create Ranking Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.ranking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.user(id) ON DELETE CASCADE,
  total_xp INTEGER NOT NULL DEFAULT 0,
  global_rank INTEGER,
  country_rank INTEGER,
  lessons_completed INTEGER NOT NULL DEFAULT 0,
  last_calculated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- Function to initialize user data on signup
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert into user profile
  INSERT INTO public.user (id, email, auth_provider, language, timezone, subscription_tier)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_app_meta_data->>'provider', 'email'),
    'es',
    'America/Mexico_City',
    'free'
  );

  -- Insert initial streak record
  INSERT INTO public.daily_streak (user_id, current_streak, longest_streak, last_activity_date)
  VALUES (NEW.id, 0, 0, CURRENT_DATE);

  -- Insert initial ranking record
  INSERT INTO public.ranking (user_id, total_xp, lessons_completed, last_calculated)
  VALUES (NEW.id, 0, 0, NOW());

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Create Trigger for new user initialization
-- ============================================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- Enable Row Level Security
-- ============================================================================
ALTER TABLE public.user ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_streak ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ranking ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS Policies: User Profile
-- ============================================================================
DROP POLICY IF EXISTS "Users can view own profile" ON public.user;
CREATE POLICY "Users can view own profile"
  ON public.user FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.user;
CREATE POLICY "Users can update own profile"
  ON public.user FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================================
-- RLS Policies: Daily Streak
-- ============================================================================
DROP POLICY IF EXISTS "Users can view own streak" ON public.daily_streak;
CREATE POLICY "Users can view own streak"
  ON public.daily_streak FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own streak" ON public.daily_streak;
CREATE POLICY "Users can update own streak"
  ON public.daily_streak FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- RLS Policies: Ranking (public for leaderboard)
-- ============================================================================
DROP POLICY IF EXISTS "Users can view own ranking" ON public.ranking;
CREATE POLICY "Users can view own ranking"
  ON public.ranking FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view all rankings" ON public.ranking;
CREATE POLICY "Users can view all rankings (for leaderboard)"
  ON public.ranking FOR SELECT
  USING (true);

-- ============================================================================
-- Create Indexes for Performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_user_email ON public.user(email);
CREATE INDEX IF NOT EXISTS idx_user_preferred_track ON public.user(preferred_track);
CREATE INDEX IF NOT EXISTS idx_daily_streak_user_id ON public.daily_streak(user_id);
CREATE INDEX IF NOT EXISTS idx_ranking_user_id ON public.ranking(user_id);
CREATE INDEX IF NOT EXISTS idx_ranking_total_xp ON public.ranking(total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_ranking_country ON public.ranking(user_id) WHERE country_rank IS NOT NULL;

-- ============================================================================
-- Database setup complete!
-- ============================================================================
-- Next steps:
-- 1. Go to Authentication > Providers in Supabase dashboard
-- 2. Enable "Email" provider
-- 3. Enable "Google" provider (get credentials from Google Cloud Console)
-- 4. (Optional) Enable "Apple" provider
-- 5. Add redirect URL: http://localhost:3000/auth/callback
-- ============================================================================
