# Progressia Development Progress

**Project:** Progressia — Financial Education & Trading Learning App
**Version:** 1.0
**Created:** 2026-01-19
**Status:** Starting Development

---

## Overview

5-day sprint to build core Progressia MVP with 15 features across 5 days.
- **Total Features:** 15
- **Total Days:** 5
- **Current Day:** 1 (Not started)

---

## Day 1: Foundation & Authentication

**Focus:** Onboarding, Google/Apple Auth, Email/Password Auth
**Features:** F001, F002, F003
**Status:** Not started

### F001: User Onboarding (Demo Lesson Before Signup)
- **Status:** pending
- **Priority:** P0
- **Route:** /welcome
- **Acceptance Criteria:** 10 items
- **Test Steps:** 11 items
- **Blocker:** None
- **Notes:** First-time user flow with demo lesson before signup

### F002: Google & Apple Sign-In
- **Status:** pending
- **Priority:** P0
- **Route:** /signup, /login
- **Acceptance Criteria:** 9 items
- **Test Steps:** 10 items
- **Blocker:** Supabase Auth setup required
- **Notes:** OAuth integration via Supabase

### F003: Email/Password Authentication
- **Status:** pending
- **Priority:** P0
- **Route:** /signup, /login
- **Acceptance Criteria:** 10 items
- **Test Steps:** 11 items
- **Blocker:** Supabase Auth setup required
- **Notes:** Email/password alternative to OAuth

**Day 1 Deliverable:** Onboarding & auth flows working end-to-end

---

## Day 2: Core Learning Loop

**Focus:** Home Screen, Lesson Viewer, Practice Quiz
**Features:** F004, F005, F006
**Status:** Not started

### F004: Home Screen - Today's Lesson
- **Status:** pending
- **Priority:** P0
- **Route:** /home
- **Acceptance Criteria:** 10 items
- **Test Steps:** 11 items
- **Blocker:** Auth required
- **Notes:** Primary entry point after login, shows daily lesson

### F005: Lesson Viewer - Cards & Content
- **Status:** pending
- **Priority:** P0
- **Route:** /lesson/[slug]
- **Acceptance Criteria:** 10 items
- **Test Steps:** 10 items
- **Blocker:** Lesson content seeding required
- **Notes:** Display lesson cards with swipe/navigation

### F006: Practice Quiz with Immediate Feedback
- **Status:** pending
- **Priority:** P0
- **Route:** /lesson/[slug]/practice
- **Acceptance Criteria:** 11 items
- **Test Steps:** 12 items
- **Blocker:** Quiz questions in database required
- **Notes:** 3-10 questions per lesson, 70% passing threshold

**Day 2 Deliverable:** Lesson viewer and quiz working end-to-end

---

## Day 3: Gamification & Progress Tracking

**Focus:** Rewards, Daily Spin, User Profile
**Features:** F007, F008, F009
**Status:** Not started

### F007: Lesson Completion & Rewards
- **Status:** pending
- **Priority:** P0
- **Route:** /lesson/[slug]/complete
- **Acceptance Criteria:** 11 items
- **Test Steps:** 12 items
- **Blocker:** XP/coin system required
- **Notes:** Celebration screen with rewards and streak updates

### F008: Daily Spin / Ruleta
- **Status:** pending
- **Priority:** P1
- **Route:** /spin (or modal on /home)
- **Acceptance Criteria:** 9 items
- **Test Steps:** 10 items
- **Blocker:** Reward system seeding required
- **Notes:** 1 spin/day (FREE), 3 spins/day (PRO), random rewards

### F009: User Profile & Progress Dashboard
- **Status:** pending
- **Priority:** P1
- **Route:** /profile
- **Acceptance Criteria:** 10 items
- **Test Steps:** 9 items
- **Blocker:** None
- **Notes:** View stats, achievements, learning history

**Day 3 Deliverable:** Completion rewards, spins, and profile working

---

## Day 4: Progression & Social Features

**Focus:** Rankings, Learning Routes, Achievements
**Features:** F010, F011, F012
**Status:** Not started

### F010: Rankings - Global Top 10 & Local Top 3
- **Status:** pending
- **Priority:** P1
- **Route:** /ranking
- **Acceptance Criteria:** 10 items
- **Test Steps:** 9 items
- **Blocker:** Ranking calculation logic required
- **Notes:** Top 10 global, Top 3 by country, daily cache

### F011: Learning Routes - Trading & Finanzas Paths
- **Status:** pending
- **Priority:** P1
- **Route:** /routes
- **Acceptance Criteria:** 11 items
- **Test Steps:** 12 items
- **Blocker:** Route/level/lesson hierarchy required
- **Notes:** 2 routes × 20 levels each, progressive unlock

### F012: Achievements & Badges System
- **Status:** pending
- **Priority:** P2
- **Route:** /profile (achievements section)
- **Acceptance Criteria:** 9 items
- **Test Steps:** 8 items
- **Blocker:** Achievement criteria logic required
- **Notes:** Auto-unlock on milestones (first lesson, streaks, perfect scores)

**Day 4 Deliverable:** Rankings, routes, and achievements working

---

## Day 5: Monetization, Offline Mode, & Polish

**Focus:** Subscriptions, Offline Support, Error Handling
**Features:** F013, F014, F015
**Status:** Not started

### F013: Subscription Tiers - FREE vs PRO
- **Status:** pending
- **Priority:** P1
- **Route:** /upgrade
- **Acceptance Criteria:** 10 items
- **Test Steps:** 12 items
- **Blocker:** Payment processing (Stripe) setup required
- **Notes:** FREE: 1 lesson/day, 1 spin, ads | PRO: unlimited, 3 spins, no ads

### F014: Offline Mode - Save Progress Locally
- **Status:** pending
- **Priority:** P2
- **Route:** All routes
- **Acceptance Criteria:** 11 items
- **Test Steps:** 12 items
- **Blocker:** localStorage sync strategy required
- **Notes:** Progress saved locally, synced when reconnected

### F015: Error States & Retry Logic
- **Status:** pending
- **Priority:** P0
- **Route:** All routes
- **Acceptance Criteria:** 11 items
- **Test Steps:** 10 items
- **Blocker:** None
- **Notes:** Graceful error handling, retry buttons, network detection

**Day 5 Deliverable:** Subscriptions, offline mode, error handling, final polish

---

## Development Checklist

### Pre-Development
- [ ] Next.js 14 project created with TypeScript, Tailwind CSS
- [ ] Git repository initialized
- [ ] Supabase project created and configured
- [ ] Environment variables set up (.env.local)
- [ ] Database schema created (11 tables)
- [ ] Initial lesson content seeded (40 lessons: 20 Trading + 20 Finanzas)
- [ ] Initial reward system seeded

### Day 1 Checklist
- [ ] Project scaffolding complete
- [ ] Folder structure set up per CLAUDE.md
- [ ] F001: Onboarding flow complete and tested
- [ ] F002: Google/Apple OAuth working
- [ ] F003: Email/Password auth working
- [ ] All 3 features have passing test steps
- [ ] Build passes: `npm run build`
- [ ] Lint passes: `npm run lint`
- [ ] Commit: "feat: authentication and onboarding (F001-F003)"

### Day 2 Checklist
- [ ] F004: Home screen displays today's lesson correctly
- [ ] F005: Lesson viewer renders cards, supports navigation
- [ ] F006: Quiz questions load, scoring works (70% threshold)
- [ ] All 3 features have passing test steps
- [ ] UserProgress table working correctly
- [ ] Build passes: `npm run build`
- [ ] Lint passes: `npm run lint`
- [ ] Commit: "feat: core learning loop (F004-F006)"

### Day 3 Checklist
- [ ] F007: Completion screen with XP, streak, animations
- [ ] F008: Daily spin wheel functional, probabilities correct
- [ ] F009: Profile dashboard shows all stats accurately
- [ ] All 3 features have passing test steps
- [ ] DailyStreak, Ranking tables updating correctly
- [ ] Build passes: `npm run build`
- [ ] Lint passes: `npm run lint`
- [ ] Commit: "feat: gamification and progress tracking (F007-F009)"

### Day 4 Checklist
- [ ] F010: Rankings page shows Top 10 global, Top 3 local
- [ ] F011: Routes page shows 2 routes with 20 levels each
- [ ] F012: Achievements unlock automatically and display
- [ ] All 3 features have passing test steps
- [ ] Ranking calculation logic (anti-farming rules) working
- [ ] Build passes: `npm run build`
- [ ] Lint passes: `npm run lint`
- [ ] Commit: "feat: progression and leaderboards (F010-F012)"

### Day 5 Checklist
- [ ] F013: Subscription tier comparison, payment flow (test mode)
- [ ] F014: Offline mode working, progress synced on reconnect
- [ ] F015: All error states handled, retry buttons functional
- [ ] All 3 features have passing test steps
- [ ] Mobile and desktop fully responsive
- [ ] Build passes: `npm run build`
- [ ] Lint passes: `npm run lint`
- [ ] No TypeScript errors
- [ ] Commit: "feat: subscriptions, offline, error handling (F013-F015)"
- [ ] Deploy to Vercel

---

## Blockers & Dependencies

### Must Complete Before Day 1
- [ ] Supabase project and authentication configured
- [ ] Environment variables set up

### Must Complete Before Day 2
- [ ] Database schema created (User, Lesson, UserProgress tables)
- [ ] Initial lesson content seeded (at least 5 lessons for testing)

### Must Complete Before Day 3
- [ ] DailyStreak and Ranking tables created
- [ ] Achievement system seeded (basic achievements)
- [ ] Reward system seeded

### Must Complete Before Day 4
- [ ] All 40 lessons seeded (20 per route)
- [ ] Ranking calculation logic implemented

### Must Complete Before Day 5
- [ ] Stripe account and test mode configured (for F013)
- [ ] localStorage sync strategy designed

---

## Technical Decisions

### Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (Google, Apple, Email/Password)
- **Deployment:** Vercel
- **Payments:** Stripe (test mode for v1)

### Architecture
- Server Components by default
- Server Actions for mutations
- React Context API for state
- localStorage for offline support
- Supabase RLS for data isolation

### Key Patterns
- Minimalism first: smallest code that works
- Security by default: validate all input, protect secrets
- Data isolation: filter all queries by user_id
- Idempotency: operations safe to retry
- Mobile-first design

---

## Known Issues & Workarounds

None yet (project just starting)

---

## Success Metrics (Week 1)

### User Engagement
- [ ] 40-50 active users on Day 7 (out of 100)
- [ ] Average streak ≥3 days
- [ ] ≥70% complete daily lesson
- [ ] 5-10 lessons completed per user

### Technical
- [ ] App loads <3 seconds (desktop), <5 seconds (mobile)
- [ ] 99.5% uptime
- [ ] <1% error rate
- [ ] 0 build errors
- [ ] 0 lint errors

### Business
- [ ] 5-10% upgrade to PRO
- [ ] User feedback: "Easy to keep up", "I finally understand"

---

## Notes & Decisions

### Content Strategy
- 40 lessons total for v1 (20 Trading, 20 Finanzas)
- Levels 1-20 in each route (2 lessons per level as placeholder)
- Real content from PDFs to be added post-launch

### Gamification
- XP: 10 base + 5 streak bonus per lesson
- Coins: 5 per completed lesson
- Streaks: 1 day minimum to maintain
- Achievements: 7 types (first_lesson, streak_3, streak_7, level_up, perfect_score, lessons_10, lessons_50)

### Monetization
- FREE: 1 lesson/day limit via DailySpinLog
- PRO: Unlimited lessons, 3 spins/day, no ads
- Soft upsell after daily lesson (non-intrusive)
- Stripe test mode for v1

### Offline Strategy
- Cards, quiz, metadata cached locally
- Sync on reconnect automatically
- Streak protected even if offline

---

## Daily Standup Template

**What was completed yesterday:**
- [Features completed]
- [Bugs fixed]
- [Deliverables achieved]

**What will be done today:**
- [Features to build]
- [Tests to run]
- [Blockers to resolve]

**Blockers or risks:**
- [Any issues]

---

## Post-Launch (Out of Scope v1)

- Creator program (third-party content)
- Advanced simulators and AI coach
- Social features (feed, messaging)
- Mobile native apps (iOS/Android)
- Multi-language support beyond Spanish
- Video content
- Email marketing automation
- Push notifications

---

**Last Updated:** 2026-01-19
**Next Review:** After Day 1 completion
**Maintained By:** Development Team
