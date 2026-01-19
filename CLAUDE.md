# Project: Progressia

> A gamified financial education and trading learning platform that converts education into a daily habit through 5-10 minute micro-lessons.

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (localhost:3000) |
| `npm run build` | Build for production |
| `npm run lint` | Check for errors |
| `npm run type-check` | Check TypeScript types |

---

## Current Phase

**Day:** 1
**Phase:** Project Setup
**Status:** Creating foundation
**Next:** Build first screen

Progress tracked in [docs/progress.md](docs/progress.md)

---

## Data Model

### User Table

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| user_id | UUID | Yes | Primary key |
| email | String | Yes | User email |
| display_name | String | No | Public nickname for rankings |
| auth_provider | Enum | Yes | google, apple, email |
| country_code | String (2) | No | For local rankings (ISO 3166-1) |
| language | String (2) | Yes | Default: "es" |
| timezone | String | Yes | User timezone |
| subscription_tier | Enum | Yes | free, pro (default: free) |
| is_active | Boolean | Yes | Account status |
| onboarding_completed | Boolean | Yes | Has finished onboarding |
| preferred_track | Enum | No | trading, finanzas, ambos |
| created_at | Timestamp | Yes | Account creation |
| updated_at | Timestamp | Yes | Last update |

### Lesson Table

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| lesson_id | UUID | Yes | Primary key |
| slug | String | Yes | URL-friendly ID (nivel-7-flujo-de-caja-01) |
| track_type | Enum | Yes | trading, finanzas |
| route_id | UUID | Yes | Reference to learning route |
| level_id | Integer | Yes | 1-20 |
| order_index | Integer | Yes | Order within level |
| version | String | Yes | e.g., "1.0", "1.1" |
| title | String (60) | Yes | Lesson title |
| subtitle | String (140) | Yes | One-line objective |
| objective | String | Yes | What user will learn |
| estimated_minutes | Integer | Yes | 5-10 |
| difficulty | Enum | Yes | beginner, intermediate, advanced |
| tags | String[] | No | ["riesgo", "liquidez", "presupuesto"] |
| language | String (2) | Yes | Default: "es" |
| lesson_format | Enum | Yes | quiz_only, cards+quiz, scenario+quiz |
| cards | JSON | No | Array of content cards |
| questions | JSON | Yes | Array of quiz questions (3-10) |
| is_free | Boolean | Yes | Available to free users |
| requires_subscription | Enum | Yes | free, pro |
| prerequisites | UUID[] | No | Required lessons/levels |
| mastery_threshold | Integer | Yes | Passing score (default: 70) |
| xp_reward_base | Integer | Yes | Base XP for completion |
| xp_bonus_streak | Integer | Yes | Bonus XP for streak |
| coin_reward | Integer | Yes | Virtual coins earned |
| status | Enum | Yes | System-level status |
| created_at | Timestamp | Yes | Creation date |
| updated_at | Timestamp | Yes | Last update |

**Lesson Status (System Level):**
`draft` → `in_review` → `approved` → `published` → `deprecated` → `archived`

**Lesson Status (User Level):**
`locked` → `available` → `in_progress` → `practice_pending` → `completed` → `failed` → `review_suggested`

### UserProgress Table

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| progress_id | UUID | Yes | Primary key |
| user_id | UUID | Yes | Foreign key to User |
| lesson_id | UUID | Yes | Foreign key to Lesson |
| status | Enum | Yes | User-level lesson status |
| started_at | Timestamp | No | When user started |
| completed_at | Timestamp | No | When user finished |
| quiz_score | Integer | No | Score percentage (0-100) |
| quiz_attempts | Integer | Yes | Number of attempts (default: 0) |
| cards_viewed | Integer | Yes | Cards completed |
| time_spent_seconds | Integer | Yes | Total time on lesson |
| is_passed | Boolean | Yes | Met mastery threshold |
| needs_review | Boolean | Yes | Flagged for review |
| xp_earned | Integer | Yes | Total XP from this lesson |
| created_at | Timestamp | Yes | First attempt |
| updated_at | Timestamp | Yes | Last update |

### DailyStreak Table

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| streak_id | UUID | Yes | Primary key |
| user_id | UUID | Yes | Foreign key to User |
| current_streak | Integer | Yes | Current consecutive days |
| longest_streak | Integer | Yes | Best streak ever |
| last_activity_date | Date | Yes | Last lesson completion |
| streak_freeze_count | Integer | Yes | Freezes available (PRO feature) |
| created_at | Timestamp | Yes | Streak start |
| updated_at | Timestamp | Yes | Last update |

### Achievement Table

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| achievement_id | UUID | Yes | Primary key |
| slug | String | Yes | Unique identifier |
| title | String | Yes | Achievement name |
| description | String | Yes | How to unlock |
| icon | String | Yes | Icon identifier |
| tier | Enum | Yes | bronze, silver, gold, platinum |
| xp_reward | Integer | Yes | XP for unlocking |
| requirement_type | Enum | Yes | streak, lessons_completed, level_up, perfect_score |
| requirement_value | Integer | Yes | Target value |
| is_hidden | Boolean | Yes | Hidden until unlocked |
| created_at | Timestamp | Yes | Creation date |

### UserAchievement Table

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| user_achievement_id | UUID | Yes | Primary key |
| user_id | UUID | Yes | Foreign key to User |
| achievement_id | UUID | Yes | Foreign key to Achievement |
| unlocked_at | Timestamp | Yes | When achieved |
| is_visible | Boolean | Yes | Shown in public profile |

### Ranking Table

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| ranking_id | UUID | Yes | Primary key |
| user_id | UUID | Yes | Foreign key to User |
| total_xp | Integer | Yes | Valid XP for ranking |
| global_rank | Integer | No | Position globally (Top 10 only) |
| country_rank | Integer | No | Position in country (Top 3 only) |
| lessons_completed | Integer | Yes | Total lessons finished |
| last_calculated | Timestamp | Yes | Last ranking update |

### Reward Table (Ruleta/Daily Spin)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| reward_id | UUID | Yes | Primary key |
| reward_type | Enum | Yes | xp_boost, coins, streak_freeze, badge |
| tier | Enum | Yes | common, rare, epic (PRO has better odds) |
| xp_value | Integer | No | XP amount if applicable |
| coin_value | Integer | No | Coins if applicable |
| icon | String | Yes | Reward icon |
| probability_free | Decimal | Yes | Drop rate for FREE users |
| probability_pro | Decimal | Yes | Drop rate for PRO users |

### UserReward Table

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| user_reward_id | UUID | Yes | Primary key |
| user_id | UUID | Yes | Foreign key to User |
| reward_id | UUID | Yes | Foreign key to Reward |
| claimed_at | Timestamp | Yes | When claimed |
| is_used | Boolean | Yes | If reward was consumed |
| used_at | Timestamp | No | When used |

### DailySpinLog Table

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| spin_id | UUID | Yes | Primary key |
| user_id | UUID | Yes | Foreign key to User |
| spin_date | Date | Yes | Date of spin |
| spins_used | Integer | Yes | Spins used today (1 FREE, 3 PRO) |
| spins_available | Integer | Yes | Spins remaining |
| last_spin_at | Timestamp | Yes | Last spin time |

---

## Features (Version 1)

### Core Learning Loop
- [ ] Display "Today's Lesson" on Home screen
- [ ] Show daily progress (0% / in progress / completed)
- [ ] Show current streak with fire icon
- [ ] Auto-select next lesson based on user's track and level
- [ ] Display lesson cards (concept, example, visual)
- [ ] Navigate through cards with Next/Repeat/Save
- [ ] Complete micro-practice quiz (3-10 questions)
- [ ] Show immediate feedback on quiz answers
- [ ] Require 70% to pass, allow retry if failed
- [ ] Award XP, coins, and streak on completion

### Progress & Gamification
- [ ] Track and display XP (total and per lesson)
- [ ] Track and display daily streak
- [ ] Track and display current level (1-20)
- [ ] Show progress bar within current level
- [ ] Unlock achievements/badges
- [ ] Display unlocked achievements in profile
- [ ] Daily ruleta/spin feature (1 FREE, 3 PRO)
- [ ] Award random rewards from spin
- [ ] Show "Lesson Completed" success screen

### Learning Paths
- [ ] Create "Trading" learning route (Levels 1-20)
- [ ] Create "Educación Financiera" route (Levels 1-20)
- [ ] Lock lessons until prerequisites met
- [ ] Show available vs locked lessons
- [ ] Progressive unlock based on completion
- [ ] Display route progress percentage

### Rankings
- [ ] Calculate valid XP for ranking (anti-farming rules)
- [ ] Display Top 10 Global Ranking
- [ ] Display Top 3 Country Ranking
- [ ] Show user's own rank (if in top positions)
- [ ] Anonymize rankings with display_name only
- [ ] Update rankings daily

### Authentication
- [ ] Google Sign-In
- [ ] Apple Sign-In
- [ ] Email/Password authentication
- [ ] Onboarding: select preferred track (demo lesson first)
- [ ] Demo lesson for new users (pre-registration)
- [ ] Save progress only after account creation

### User Profile
- [ ] Display total XP
- [ ] Display current streak
- [ ] Display longest streak
- [ ] Display lessons completed
- [ ] Display achievements/badges
- [ ] Show learning history
- [ ] Show progress by route
- [ ] Privacy: all data private by default
- [ ] Allow opt-in to public ranking display

### Subscription Tiers
- [ ] FREE: 1 lesson/day, 1 spin, show ads after completion
- [ ] PRO: unlimited lessons, 3 spins, no ads
- [ ] Display tier-based limitations clearly
- [ ] Soft upsell to PRO (non-intrusive)

### States to Handle
- [ ] Empty state (new user, no lessons completed)
- [ ] Onboarding flow (demo → signup → first lesson)
- [ ] Loading states (lessons, quiz submission, sync)
- [ ] Error states (network, invalid input, sync failure)
- [ ] Success confirmations (lesson complete, achievement unlocked)
- [ ] Offline mode (save progress locally, sync when online)
- [ ] Mid-lesson exit (save state, allow resume)
- [ ] Quiz retry (after failing to meet 70% threshold)

### Content Management (Admin-Only, v1 Minimal)
- [ ] Seed initial 40 lessons (20 Trading + 20 Finanzas) from PDFs
- [ ] Lessons editable via database or JSON config
- [ ] No in-app CMS needed for v1 (hardcoded or DB seeded)

### Out of Scope (Deferred)
- Creator program (third-party content upload)
- Advanced financial tools (budgets, simulators, trading diary)
- AI Coach / personalized recommendations
- Social features (feed, likes, comments, chat)
- Real trading integration or broker connections
- KYC or identity verification
- Long onboarding questionnaires
- Advanced analytics dashboard

---

## Technical Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (Google, Apple, Email/Password)
- **Deployment:** Vercel
- **State Management:** React Context API + Server Components
- **Data Fetching:** Server Components + Server Actions
- **Offline Support:** localStorage + sync on reconnect
- **Analytics:** (Optional) Vercel Analytics or Plausible

### Folder Structure (Best Practices for App Router)

```
/app
  /(auth)
    /login
    /signup
  /(main)
    /home
    /lesson/[slug]
    /profile
    /ranking
  /layout.tsx
  /page.tsx
/components
  /ui (buttons, cards, modals - reusable)
  /lesson (lesson-specific components)
  /profile (profile-specific)
  /shared (header, footer, nav)
/lib
  /supabase (client, server, types)
  /utils (helpers, formatters)
  /constants (config, enums)
/hooks
  /useStreak.ts
  /useProgress.ts
  /useLessons.ts
/services
  /lessonService.ts
  /progressService.ts
  /rankingService.ts
/types
  /database.types.ts
  /lesson.types.ts
  /user.types.ts
/styles
  /globals.css
/public
  /icons
  /images
```

---

## Rules

### Before Writing Code
1. **Read context files:** Always read [CLAUDE.md](CLAUDE.md), [Styleguide.md](Styleguide.md), and [docs/progress.md](docs/progress.md) before starting
2. **Review design system:** Familiarize yourself with colors, typography, and component templates
3. **Explain your plan:** For changes over 20 lines, explain approach before writing code
4. **Check existing components:** Search `/components` before creating new components
5. **Understand the data model:** Review tables above and match field names exactly

### While Writing Code
6. **One feature at a time:** Finish current feature completely before starting next
7. **Follow data model exactly:** Use field names and types from tables above
8. **Handle all states:** Every user action needs loading, success, error states
9. **Mobile-first:** Design for 320px first, then scale to 1280px+ (see Styleguide breakpoints)
10. **Use TypeScript strictly:** No `any` types, define all interfaces
11. **Follow Next.js 14 patterns:** Use Server Components by default, Client Components only when needed
12. **Follow design system:** Use Styleguide colors, typography, spacing, and component templates
13. **Use Tailwind consistently:** No inline styles, use Tailwind utility classes
14. **Protect user progress:** Never lose streak/XP/progress due to errors
15. **No over-engineering:** Keep it simple, avoid abstractions for single-use code
16. **Security first:** Validate input, prevent XSS/injection, sanitize data

### After Writing Code
17. **Build must pass:** Run `npm run build` — fix all errors
18. **Lint must pass:** Run `npm run lint` — fix all warnings
19. **Type-check must pass:** Run `npm run type-check` — fix all type errors
20. **Design compliance:** Verify all components match Styleguide (colors, spacing, typography, effects)
21. **Test in browser:** Check on mobile (320px), tablet (768px), and desktop (1280px)
22. **Test all states:** Verify loading, success, error, and empty states work
23. **Test accessibility:** Verify focus states, ARIA labels, semantic HTML
24. **Update progress:** Always update [docs/progress.md](docs/progress.md) after completing a feature

---

## Constraints

### Learning Limits
- **FREE users:** Max 1 lesson per day, access to limited levels
- **PRO users:** Unlimited lessons, full access to all 20 levels per track
- **Lesson duration:** Max 10 minutes
- **Quiz questions:** 3-10 per lesson
- **Passing score:** 70% minimum

### Gamification Limits
- **FREE:** 1 daily spin
- **PRO:** 3 daily spins
- **XP farming prevention:** Repeated lessons earn reduced/zero XP after X attempts
- **Valid XP only:** Ranking uses XP with anti-farming rules applied

### Ranking Display
- **Global:** Top 10 only
- **Local:** Top 3 per country only
- **Privacy:** Only display_name shown, no personal data

### Content Limits
- **Lesson titles:** Max 60 characters
- **Lesson subtitles:** Max 140 characters
- **Answer explanations:** Max 500 characters
- **Routes:** 2 routes (Trading, Finanzas)
- **Levels per route:** 20

### Technical Limits
- **Active devices:** Max 2 per account
- **Country change:** Once every 30 days (prevent ranking manipulation)
- **Session timeout:** After prolonged inactivity
- **Offline storage:** localStorage for progress, sync on reconnect

### Notification Limits
- **Daily reminder:** Max 1 per day
- **Additional notifications:** Only for major achievements or streak at risk
- **No spam:** Avoid notification fatigue

### Business Rules
- **No real trading:** No broker integration, no real money
- **No social network:** No feed, no public posts, no user-to-user messaging
- **No creator uploads:** Content is internal only in v1
- **No financial advice:** Educational content only, not investment recommendations

---

## Quality Checklist

Before any feature is "done":

**Build & Code Quality:**
- [ ] `npm run build` passes with no errors
- [ ] `npm run lint` passes with no warnings
- [ ] `npm run type-check` passes with no type errors
- [ ] Uses TypeScript types (no `any`)
- [ ] Tailwind classes used (no inline styles)
- [ ] No security vulnerabilities (XSS, injection, etc.)
- [ ] Follows data model field names exactly

**Responsiveness:**
- [ ] Works on mobile (320px width)
- [ ] Works on tablet (768px width)
- [ ] Works on desktop (1280px width)
- [ ] Responsive breakpoints use Tailwind `sm`, `md`, `lg`, `xl`
- [ ] Mobile-first approach (base styles for mobile)

**User Experience:**
- [ ] Loading state works correctly
- [ ] Error state shows helpful message
- [ ] Success state shows clear feedback
- [ ] Empty state works (if applicable)
- [ ] Offline behavior tested (if applicable)
- [ ] User progress is protected (no data loss on errors)

**Design System Compliance (Styleguide):**
- [ ] Uses brand colors from palette (#9ACD32, #1A2942, etc.)
- [ ] Typography follows scale (Poppins headings, Inter body)
- [ ] Component spacing uses Tailwind spacing (gap-2, gap-4, gap-6, p-6)
- [ ] Border radius matches component types (rounded-xl buttons, rounded-2xl cards)
- [ ] Hover effects applied (scale-105, shadow-glow-green, or bg-hover)
- [ ] Focus states visible (focus:ring-2 focus:ring-[#9ACD32])
- [ ] Icons use Lucide React at 20-24px
- [ ] Follows component templates (buttons, cards, badges, inputs)
- [ ] No custom CSS (all Tailwind utilities)
- [ ] No color hardcoding outside Tailwind config
- [ ] Gamification elements visible (XP, streaks, badges)
- [ ] Accessibility standards met (ARIA labels, semantic HTML)

---

## Stop and Ask If

- Something in the Vision Document is unclear
- You want to install a new npm package
- You've tried 3 times and the approach isn't working
- A feature is more complex than expected (requires 100+ lines)
- You need to change the data model structure
- You need to add a new database table
- A user requirement seems contradictory
- You're unsure about authentication flow
- You need to modify Supabase schema
- Performance seems slow (need optimization strategy)

---

## Session Handoff

### Ending a Session
1. Update [docs/progress.md](docs/progress.md) with:
   - What was completed
   - What is in progress
   - What is next
   - Any blockers or notes
2. If using git: `git add . && git commit -m "Progress: [description]"`
3. Say: **"Ready for handoff"**

### Starting a New Session
1. Read [CLAUDE.md](CLAUDE.md) (this file)
2. Read [docs/PRD.md](docs/PRD.md) (if exists)
3. Read [docs/progress.md](docs/progress.md)
4. Say: **"Ready to continue from [last point in progress.md]"**

---

## Additional Context

### Target User
**Andrés Martínez, 28**, administrative employee/junior executive/digital freelancer in urban LATAM (Mexico/Colombia/Chile), monthly income USD 900-1,800, technical or university education. Struggles with financial disorder and lack of structured education. Wants to improve but doesn't know where to start or what to trust.

### Core Value Proposition
Progressia eliminates chaos, overwhelm, and abandonment by providing:
- **Daily guidance:** "What to do today"
- **Micro-lessons:** 5-10 minutes, easy to maintain as habit
- **Visible progress:** Levels, streaks, achievements
- **Active learning:** Practice immediately after theory
- **Habit psychology:** Designed to create and maintain habits

### Design Principles
- **Simple. Motivating. Trustworthy.**
- **"Enter, learn something useful, leave better than yesterday."**
- **No noise. No stress. No unrealistic promises. Only real daily progress.**
- Inspired by Duolingo: clean, gamified, colorful but not overwhelming, progress very visible

### Success Metrics (100 users, 1 week)
- **Retention:** ≥40-50 active users on day 7
- **Streaks:** Average ≥3 days, multiple users reach 5-7 days
- **Completion:** ≥70% complete daily lesson
- **Progress:** Users complete 5-10 lessons in week
- **Gamification:** High daily spin usage
- **Conversion:** 5-10% upgrade to PRO
- **Feedback:** "It's easy to keep up", "I finally understand", "I want to come back tomorrow"

### Content Source
- **20 levels Trading** (from PDF content)
- **20 levels Educación Financiera** (from PDF content)
- Content structured as cards (concept, example, tip, warning, visual)
- Each lesson: 3-10 quiz questions with explanations

---

## Next.js 14 Best Practices Reference

Based on latest 2026 best practices:

1. **Use Server Components by default:** Only use "use client" when you need interactivity, state, or browser APIs
2. **Use Server Actions for mutations:** Form submissions, data updates (no separate API routes needed)
3. **Optimize images:** Use `next/image` with proper sizing and formats
4. **Use TypeScript strictly:** Enable strict mode, no `any` types
5. **Folder structure:** Collocate related files, use route groups `(auth)` `(main)` for organization
6. **Data fetching:** Fetch at component level in Server Components, avoid client-side waterfalls
7. **Error handling:** Use `error.tsx` and `loading.tsx` in route folders
8. **Metadata:** Use `metadata` export for SEO in each page
9. **Tailwind:** Use utility classes, avoid inline styles, configure theme in `tailwind.config.js`
10. **Performance:** Use `React.cache()` for deduplication, `unstable_cache()` for persistence

### Supabase Auth Setup (App Router)
- Use `@supabase/supabase-js` and `@supabase/ssr`
- Create client/server utilities in `/lib/supabase`
- Handle cookies correctly for SSR
- Use middleware for protected routes
- Reference: [Supabase Next.js Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)

---

## Design System (Styleguide)

All UI components must follow the Progressia Design System defined in [Styleguide.md](Styleguide.md). This ensures visual consistency and supports the gamified, dark-themed aesthetic.

### Color Palette

| Purpose | Color | Hex |
|---------|-------|-----|
| **Primary** | Lime Green | `#9ACD32` |
| **Primary Light** | Bright Green | `#7FFF00` |
| **Accent** | Purple | `#8B5CF6` |
| **Info** | Blue | `#3B82F6` |
| **Background** | Dark Navy | `#0A1628` |
| **Surface** | Dark Blue | `#1A2942` |
| **Surface Hover** | Lighter Blue | `#243550` |
| **Border** | Steel Blue | `#2D3F5F` |
| **Text Primary** | White | `#FFFFFF` |
| **Text Secondary** | Light Gray | `#94A3B8` |
| **Text Tertiary** | Muted Gray | `#64748B` |
| **Success** | Green | `#22C55E` |
| **Error** | Red | `#EF4444` |

### Typography

| Element | Font | Size Class | Weight | Usage |
|---------|------|-----------|--------|-------|
| **Headings (H1)** | Poppins | `text-5xl` | Bold | Page titles |
| **Headings (H2)** | Poppins | `text-4xl` | Bold | Section headers |
| **Headings (H3)** | Poppins | `text-2xl` | Semibold | Subsection headers |
| **Body** | Inter | `text-base` | Regular/Medium | Main content |
| **Small** | Inter | `text-sm` | Regular | Secondary text |
| **Caption** | Inter | `text-xs` | Regular | Metadata, timestamps |

**Font Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700;800&display=swap');
```

### Layout & Spacing

| Type | Spacing | Example |
|------|---------|---------|
| **Tight** | `gap-2 p-2` | Small cards, compact lists |
| **Normal** | `gap-4 p-4` | Standard spacing |
| **Relaxed** | `gap-6 p-6` | Large sections |
| **Cards** | `p-6` | All card components |

### Border Radius

| Component | Radius |
|-----------|--------|
| **Buttons** | `rounded-xl` |
| **Cards** | `rounded-2xl` |
| **Inputs** | `rounded-lg` |
| **Badges** | `rounded-full` |

### Shadow & Effects

| Effect | Tailwind | Usage |
|--------|----------|-------|
| **Default Shadow** | `shadow-md` | Cards, dropdowns |
| **Glow (Green)** | `shadow-[0_0_20px_rgba(154,205,50,0.3)]` | Highlights, hover states |
| **Transition** | `transition-all duration-200` | All interactive elements |
| **Hover Scale** | `hover:scale-105` | Button/card hover effect |

### Component Templates

**Primary Button:**
```jsx
<button className="bg-[#9ACD32] hover:bg-[#7FFF00] text-[#0A1628] font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-[0_0_20px_rgba(154,205,50,0.3)]">
  Action
</button>
```

**Card:**
```jsx
<div className="bg-[#1A2942] rounded-2xl p-6 border border-[#2D3F5F] hover:bg-[#243550] transition-all duration-200">
  Content
</div>
```

**Badge:**
```jsx
<span className="bg-[#9ACD32] text-[#0A1628] text-xs font-semibold px-3 py-1 rounded-full">
  ⭐ +20 XP
</span>
```

**Input Field:**
```jsx
<input className="w-full bg-[#1A2942] border border-[#2D3F5F] rounded-lg px-4 py-3 text-white placeholder:text-[#64748B] focus:border-[#9ACD32] focus:ring-2 focus:ring-[#9ACD32]/20" />
```

**Progress Bar:**
```jsx
<div className="w-full bg-[#1A2942] rounded-full h-3">
  <div className="bg-gradient-to-r from-[#9ACD32] to-[#7FFF00] h-full rounded-full transition-all duration-500" style={{width: '75%'}}></div>
</div>
```

### Icons & Emojis

- **Library:** Lucide React (20-24px)
- **Primary Color:** `text-[#9ACD32]`
- **Secondary Color:** `text-[#94A3B8]`

**Common Emojis:**
| Emoji | Usage |
|-------|-------|
| 🔥 | Streak/fire motivation |
| 🏆 | Achievements/rankings |
| ⭐ | XP rewards |
| ⚡ | Actions/momentum |
| 👑 | PRO tier |
| 💎 | Premium/special |

### Grid Layouts

**Card Grid:**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
```

**Container:**
```jsx
<div className="max-w-7xl mx-auto px-4">
```

### Responsive Breakpoints

| Breakpoint | Width | Use Case |
|-----------|-------|----------|
| **sm** | 640px | Mobile landscape |
| **md** | 768px | Tablet |
| **lg** | 1024px | Desktop |
| **xl** | 1280px | Large desktop |

### Tailwind Configuration

The project's `tailwind.config.js` should extend with:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#9ACD32',
        'primary-light': '#7FFF00',
        background: { primary: '#0A1628', secondary: '#0F1D33' },
        surface: { DEFAULT: '#1A2942', hover: '#243550' },
        border: '#2D3F5F',
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(154, 205, 50, 0.3)',
      },
    },
  },
}
```

### Design Principles

1. **Gamification First:** XP, badges, and progress everywhere
2. **Dark-First Approach:** No light mode needed (dark theme only)
3. **Mobile-First Design:** Responsive from 640px upwards
4. **Accessibility:**
   - Focus states: `focus:ring-2 focus:ring-[#9ACD32]`
   - Semantic HTML
   - ARIA labels for interactive elements
   - Sufficient color contrast
   - Clear visual hierarchy

### Style Guide Rules

**When Creating Components:**

- ✅ Use Tailwind utility classes exclusively (no inline styles)
- ✅ Follow component templates from Styleguide.md
- ✅ Maintain consistent color usage (green for primary actions)
- ✅ Add hover effects for interactivity (shadow-glow or scale-105)
- ✅ Use proper typography scale (Poppins for headings, Inter for body)
- ✅ Include loading and error states with visual feedback
- ✅ Test on mobile (320px) and desktop (1280px)

**Never:**

- ❌ Mix color schemes (e.g., blue buttons next to green)
- ❌ Use inline `style=` attributes
- ❌ Hardcode colors instead of using Tailwind config
- ❌ Create custom components that diverge from Styleguide
- ❌ Ignore accessibility (focus states, ARIA labels)
- ❌ Skip responsive design (always mobile-first)

---

## Resources

### Official Documentation
- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Best Practices Articles (2026)
- [Next.js Best Practices 2025/2026](https://www.serviots.com/blog/nextjs-development-best-practices)
- [Next.js Folder Structure Guide](https://www.codebydeep.com/blog/next-js-folder-structure-best-practices-for-scalable-applications-2026-guide)
- [Tailwind + Next.js Guide](https://codeparrot.ai/blogs/nextjs-and-tailwind-css-2025-guide-setup-tips-and-best-practices)
- [Supabase SSR Setup](https://medium.com/@zeyd.ajraou/the-easiest-way-to-setup-supabase-ssr-in-next-js-14-c590f163773d)

---

**Last Updated:** 2026-01-19
**Version:** 1.1
**Status:** Ready for Development (with Design System Integration)

## Version History

- **v1.1** (2026-01-19): Integrated Styleguide design system. Added Design System section with colors, typography, spacing, component templates, and design principles. Updated Rules and Quality Checklist to include design system compliance.
- **v1.0** (2026-01-19): Initial project guidelines and best practices.
