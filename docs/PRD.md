# Progressia — Product Requirements Document

**Version:** 1.0
**Created:** 2026-01-19
**Status:** Approved for Development
**Program:** 5-Day Build

---

## 1. Executive Summary

### Problem Statement
Andrés Martínez, a 28-year-old administrative employee in urban LATAM, struggles with financial disorder and lack of structured financial education. He doesn't understand how to manage money, save correctly, or start investing without making mistakes. Current workarounds (YouTube videos, TikTok influencers, scattered PDFs) create confusion, frustration, and recurrent abandonment of learning.

### Solution
Progressia converts financial education and trading learning into a daily habit through guided 5-10 minute micro-lessons, eliminating chaos and abandonment with structured progression, visible progress (levels, streaks, achievements), and active learning.

### Target User
**Primary User:** Andrés Martínez, 28 years old, administrative employee/junior executive/digital freelancer in urban LATAM (Mexico/Colombia/Chile), monthly income USD 900-1,800, technical or university education.

**Context:** Uses app daily during evening routine (9-10pm), on mobile device, 5-10 minutes per session. Wants to improve financial situation but needs guidance on what to learn and when, without overwhelming complexity.

### Success Metrics
- **Retention:** ≥40-50 active users on day 7 (out of 100)
- **Streaks:** Average ≥3 days, multiple users reach 5-7 days
- **Completion:** ≥70% of active users complete their daily lesson
- **Progress:** Users complete 5-10 lessons in first week
- **Gamification:** High daily spin usage
- **Conversion:** 5-10% upgrade to PRO in first week
- **Feedback:** "It's easy to keep up", "I finally understand", "I want to come back tomorrow"
- **Technical:** App loads in under 3 seconds
- **Reliability:** Core actions complete without errors

---

## 2. Data Model

### User
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| id | uuid | Yes | auto | Primary key |
| email | string | Yes | - | Unique, used for login |
| display_name | string | No | - | Public nickname for rankings |
| auth_provider | enum | Yes | email | google, apple, email |
| country_code | string(2) | No | - | ISO 3166-1 for local rankings |
| language | string(2) | Yes | es | UI language |
| timezone | string | Yes | - | User timezone |
| subscription_tier | enum | Yes | free | free, pro |
| is_active | boolean | Yes | true | Account status |
| onboarding_completed | boolean | Yes | false | Has finished onboarding |
| preferred_track | enum | No | - | trading, finanzas, ambos |
| created_at | timestamp | Yes | now() | Account creation |
| updated_at | timestamp | Yes | now() | Last modified |

### Lesson
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| id | uuid | Yes | auto | Primary key |
| slug | string | Yes | - | URL-friendly ID (nivel-7-flujo-de-caja-01) |
| track_type | enum | Yes | - | trading, finanzas |
| route_id | uuid | Yes | - | Reference to learning route |
| level_id | integer | Yes | - | 1-20 |
| order_index | integer | Yes | - | Order within level |
| version | string | Yes | 1.0 | e.g., "1.0", "1.1" |
| title | string(60) | Yes | - | Lesson title |
| subtitle | string(140) | Yes | - | One-line objective |
| objective | text | Yes | - | What user will learn |
| estimated_minutes | integer | Yes | - | 5-10 |
| difficulty | enum | Yes | beginner | beginner, intermediate, advanced |
| tags | text[] | No | - | ["riesgo", "liquidez", "presupuesto"] |
| language | string(2) | Yes | es | Content language |
| lesson_format | enum | Yes | cards+quiz | quiz_only, cards+quiz, scenario+quiz |
| cards | jsonb | No | - | Array of content cards |
| questions | jsonb | Yes | - | Array of quiz questions (3-10) |
| is_free | boolean | Yes | true | Available to free users |
| requires_subscription | enum | Yes | free | free, pro |
| prerequisites | uuid[] | No | - | Required lessons/levels |
| mastery_threshold | integer | Yes | 70 | Passing score percentage |
| xp_reward_base | integer | Yes | 10 | Base XP for completion |
| xp_bonus_streak | integer | Yes | 5 | Bonus XP for streak |
| coin_reward | integer | Yes | 5 | Virtual coins earned |
| status | enum | Yes | draft | draft, in_review, approved, published, deprecated, archived |
| created_at | timestamp | Yes | now() | Creation date |
| updated_at | timestamp | Yes | now() | Last update |

### UserProgress
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| id | uuid | Yes | auto | Primary key |
| user_id | uuid | Yes | - | Foreign key to User |
| lesson_id | uuid | Yes | - | Foreign key to Lesson |
| status | enum | Yes | locked | locked, available, in_progress, practice_pending, completed, failed, review_suggested |
| started_at | timestamp | No | - | When user started |
| completed_at | timestamp | No | - | When user finished |
| quiz_score | integer | No | - | Score percentage (0-100) |
| quiz_attempts | integer | Yes | 0 | Number of attempts |
| cards_viewed | integer | Yes | 0 | Cards completed |
| time_spent_seconds | integer | Yes | 0 | Total time on lesson |
| is_passed | boolean | Yes | false | Met mastery threshold |
| needs_review | boolean | Yes | false | Flagged for review |
| xp_earned | integer | Yes | 0 | Total XP from this lesson |
| created_at | timestamp | Yes | now() | First attempt |
| updated_at | timestamp | Yes | now() | Last update |

### DailyStreak
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| id | uuid | Yes | auto | Primary key |
| user_id | uuid | Yes | - | Foreign key to User (unique) |
| current_streak | integer | Yes | 0 | Current consecutive days |
| longest_streak | integer | Yes | 0 | Best streak ever |
| last_activity_date | date | Yes | - | Last lesson completion |
| streak_freeze_count | integer | Yes | 0 | Freezes available (PRO feature) |
| created_at | timestamp | Yes | now() | Streak start |
| updated_at | timestamp | Yes | now() | Last update |

### Achievement
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| id | uuid | Yes | auto | Primary key |
| slug | string | Yes | - | Unique identifier |
| title | string | Yes | - | Achievement name |
| description | text | Yes | - | How to unlock |
| icon | string | Yes | - | Icon identifier |
| tier | enum | Yes | bronze | bronze, silver, gold, platinum |
| xp_reward | integer | Yes | 0 | XP for unlocking |
| requirement_type | enum | Yes | - | streak, lessons_completed, level_up, perfect_score |
| requirement_value | integer | Yes | - | Target value |
| is_hidden | boolean | Yes | false | Hidden until unlocked |
| created_at | timestamp | Yes | now() | Creation date |

### UserAchievement
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| id | uuid | Yes | auto | Primary key |
| user_id | uuid | Yes | - | Foreign key to User |
| achievement_id | uuid | Yes | - | Foreign key to Achievement |
| unlocked_at | timestamp | Yes | now() | When achieved |
| is_visible | boolean | Yes | true | Shown in public profile |

### Ranking
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| id | uuid | Yes | auto | Primary key |
| user_id | uuid | Yes | - | Foreign key to User (unique) |
| total_xp | integer | Yes | 0 | Valid XP for ranking |
| global_rank | integer | No | - | Position globally (Top 10 only) |
| country_rank | integer | No | - | Position in country (Top 3 only) |
| lessons_completed | integer | Yes | 0 | Total lessons finished |
| last_calculated | timestamp | Yes | now() | Last ranking update |

### Reward
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| id | uuid | Yes | auto | Primary key |
| reward_type | enum | Yes | - | xp_boost, coins, streak_freeze, badge |
| tier | enum | Yes | common | common, rare, epic |
| xp_value | integer | No | - | XP amount if applicable |
| coin_value | integer | No | - | Coins if applicable |
| icon | string | Yes | - | Reward icon |
| probability_free | decimal | Yes | - | Drop rate for FREE users (0.0-1.0) |
| probability_pro | decimal | Yes | - | Drop rate for PRO users (0.0-1.0) |

### UserReward
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| id | uuid | Yes | auto | Primary key |
| user_id | uuid | Yes | - | Foreign key to User |
| reward_id | uuid | Yes | - | Foreign key to Reward |
| claimed_at | timestamp | Yes | now() | When claimed |
| is_used | boolean | Yes | false | If reward was consumed |
| used_at | timestamp | No | - | When used |

### DailySpinLog
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| id | uuid | Yes | auto | Primary key |
| user_id | uuid | Yes | - | Foreign key to User |
| spin_date | date | Yes | - | Date of spin |
| spins_used | integer | Yes | 0 | Spins used today |
| spins_available | integer | Yes | - | Spins remaining (1 FREE, 3 PRO) |
| last_spin_at | timestamp | Yes | now() | Last spin time |

### Relationships
- User has many UserProgress records
- User has one DailyStreak
- User has many UserAchievements
- User has one Ranking
- User has many UserRewards
- User has many DailySpinLogs
- Lesson has many UserProgress records
- Achievement has many UserAchievements
- Reward has many UserRewards

### Data Rules
1. Users can only access their own data (filter all queries by user_id)
2. Lesson status transitions (system): draft → in_review → approved → published → deprecated → archived
3. UserProgress status transitions (user): locked → available → in_progress → practice_pending → completed/failed → review_suggested
4. Validation rules:
   - Email: valid email format, unique
   - Display name: max 30 characters, alphanumeric + spaces
   - Lesson title: max 60 characters
   - Lesson subtitle: max 140 characters
   - Quiz: 3-10 questions per lesson
   - Passing score: minimum 70%
5. Limits:
   - FREE users: 1 lesson per day, 1 daily spin
   - PRO users: unlimited lessons, 3 daily spins
   - Max 2 active devices per account
   - Country change: once every 30 days
   - Lesson duration: max 10 minutes

---

## 3. Features

### Feature F001: User Onboarding (Demo Lesson Before Signup)

**Category:** core
**Priority:** P0
**Day:** 1

**Description:**
New users experience a 2-3 minute demo lesson before being asked to create an account. This demonstrates value upfront and creates motivation to save progress by signing up. The flow includes minimal intro slides, track selection, demo lesson with quiz, and signup prompt.

**User Story:**
As a new visitor, I want to try a real lesson before creating an account so that I understand the value and can decide if this app is right for me.

**Route:** /welcome

**User Flow:**
1. User opens app for first time
2. System shows welcome screen with "Empezar" button
3. User clicks "Empezar"
4. System shows 3 intro slides explaining the problem, solution, and benefit
5. User swipes through slides
6. System asks "¿Qué te interesa más ahora?" with options: Educación financiera / Trading / Ambos
7. User selects preference
8. System loads demo lesson (2-3 minutes, 3-5 questions)
9. User completes demo lesson and quiz
10. System shows preview of XP, streak, level progress
11. System prompts "Crear cuenta y guardar mi progreso" with Google/Apple/Email options
12. User selects signup method
13. System creates account and saves demo progress
14. User redirected to /home

**Acceptance Criteria:**
- [ ] Welcome screen shows brand message and CTA
- [ ] Intro slides can be swiped or skipped
- [ ] Track selection saves temporarily (not committed until signup)
- [ ] Demo lesson is fully functional (cards + quiz)
- [ ] Quiz feedback is immediate and educational
- [ ] Progress preview shows accurate XP, streak, level
- [ ] Signup prompt explains progress will be lost if user exits
- [ ] All three auth methods (Google, Apple, Email) work
- [ ] After signup, user sees their demo progress saved in /home
- [ ] If user exits before signup, progress is lost (localStorage cleared)

**Test Steps:**
1. Navigate to / (root)
2. Verify welcome screen appears
3. Click "Empezar"
4. Swipe through 3 intro slides
5. Select "Trading" preference
6. Complete demo lesson (view cards, answer questions)
7. Verify immediate feedback on quiz answers
8. See progress preview screen
9. Click signup option (test with email)
10. Verify account created and redirected to /home
11. Confirm demo progress appears in profile

**States:**
- **Loading:** Skeleton loader while demo lesson loads
- **Empty:** N/A (first-time users always see onboarding)
- **Success:** Progress preview shows XP/streak/level, signup prompt appears
- **Error:** "Could not load demo lesson. Please refresh." with retry button

**Validation Rules:**
| Field | Rule | Error Message |
|-------|------|---------------|
| Email (if email signup) | Valid email format, unique | "Please enter a valid email address" / "Email already registered" |
| Password (if email signup) | Min 8 characters | "Password must be at least 8 characters" |
| Track selection | One option required | "Please select what interests you" |

---

### Feature F002: Google & Apple Sign-In

**Category:** core
**Priority:** P0
**Day:** 1

**Description:**
Users can sign up and log in using Google or Apple OAuth. This reduces friction and increases conversion by eliminating manual email/password entry. OAuth handles authentication securely via Supabase Auth.

**User Story:**
As a new user, I want to sign up with Google or Apple so that I can start learning quickly without creating another password.

**Route:** /signup, /login

**User Flow:**
1. User clicks "Sign up with Google" or "Sign up with Apple"
2. System opens OAuth popup/redirect
3. User authenticates with provider
4. Provider returns to app with auth token
5. System creates user account (if new) or logs in (if existing)
6. System creates DailyStreak, Ranking records for new users
7. User redirected to /home

**Acceptance Criteria:**
- [ ] Google OAuth button visible and functional
- [ ] Apple OAuth button visible and functional
- [ ] OAuth popup/redirect works on mobile and desktop
- [ ] New users: account created, DailyStreak and Ranking initialized
- [ ] Existing users: logged in directly
- [ ] User display_name populated from OAuth provider (first name or email)
- [ ] User redirected to /home after successful auth
- [ ] Error shown if OAuth fails or user denies permission
- [ ] Session stored in httpOnly cookie (7 days)

**Test Steps:**
1. Navigate to /signup
2. Click "Sign up with Google"
3. Authenticate with Google account
4. Verify redirected to /home
5. Check user record created in database
6. Log out
7. Navigate to /login
8. Click "Sign in with Google"
9. Verify logged in and redirected to /home
10. Repeat for Apple Sign-In

**States:**
- **Loading:** "Signing in..." spinner while OAuth processes
- **Empty:** N/A
- **Success:** Redirect to /home, user authenticated
- **Error:** "Could not sign in with [Provider]. Please try again." with retry button

**Validation Rules:**
| Field | Rule | Error Message |
|-------|------|---------------|
| OAuth token | Valid token from provider | "Authentication failed. Please try again." |

---

### Feature F003: Email/Password Authentication

**Category:** core
**Priority:** P0
**Day:** 1

**Description:**
Users can sign up and log in using email and password as an alternative to OAuth. This provides access for users who prefer not to use Google/Apple or don't have accounts with those providers.

**User Story:**
As a user without Google or Apple accounts, I want to sign up with email and password so that I can access the app.

**Route:** /signup, /login

**User Flow:**
1. User navigates to /signup
2. User clicks "Sign up with Email"
3. System shows email/password form
4. User enters email, password, confirms password
5. System validates input
6. System creates account via Supabase Auth
7. System creates DailyStreak, Ranking records
8. User redirected to /home

**Acceptance Criteria:**
- [ ] Email/password form validates on submit
- [ ] Password minimum 8 characters enforced
- [ ] Email uniqueness enforced (show error if exists)
- [ ] Password and confirm password must match
- [ ] Account created in Supabase Auth
- [ ] DailyStreak and Ranking initialized for new users
- [ ] User redirected to /home after signup
- [ ] Login form authenticates existing users
- [ ] Session stored in httpOnly cookie (7 days)
- [ ] "Forgot password" link present (triggers Supabase password reset email)

**Test Steps:**
1. Navigate to /signup
2. Click "Sign up with Email"
3. Enter valid email and password (8+ chars)
4. Confirm password matches
5. Submit form
6. Verify account created
7. Verify redirected to /home
8. Log out
9. Navigate to /login
10. Enter same email/password
11. Verify logged in and redirected to /home

**States:**
- **Loading:** "Creating account..." / "Signing in..." spinner
- **Empty:** Clean form with placeholder text
- **Success:** Redirect to /home
- **Error:** Inline errors per field, general error at top if server fails

**Validation Rules:**
| Field | Rule | Error Message |
|-------|------|---------------|
| Email | Required, valid format, unique | "Email is required" / "Please enter a valid email" / "Email already registered" |
| Password | Required, min 8 chars | "Password is required" / "Password must be at least 8 characters" |
| Confirm Password | Must match password | "Passwords do not match" |

---

### Feature F004: Home Screen - "Today's Lesson"

**Category:** core
**Priority:** P0
**Day:** 2

**Description:**
The Home screen is the primary entry point after login. It displays "Today's Lesson" prominently, shows daily progress (0% / in progress / completed), current streak with fire icon, and a large "Empezar" or "Continuar" button. This eliminates decision paralysis and guides users to their next action.

**User Story:**
As a returning user, I want to see exactly what lesson I should do today so that I can maintain my learning habit without thinking about what to study.

**Route:** /home

**User Flow:**
1. User logs in or navigates to /home
2. System loads user's current streak, daily progress, and today's lesson
3. System displays:
   - "Tu lección de hoy" card with lesson title and estimated time
   - Daily progress: "0%" (not started) / "En progreso" / "Completada"
   - Streak: "🔥 Racha: X días"
   - CTA: "Empezar" (if not started) or "Continuar" (if in progress)
4. User clicks CTA
5. System navigates to /lesson/[slug]

**Acceptance Criteria:**
- [ ] Home screen loads in under 2 seconds
- [ ] Today's lesson auto-selected based on user's track and progress
- [ ] Lesson card shows: title, subtitle, estimated minutes, difficulty badge
- [ ] Daily progress accurately reflects: not started, in progress, or completed
- [ ] Streak displays current count with fire emoji
- [ ] CTA button changes text: "Empezar" vs "Continuar"
- [ ] If lesson already completed today (FREE user), show "Vuelve mañana" message
- [ ] PRO users can click "Siguiente lección" even after completing daily lesson
- [ ] If user has no active track selected, prompt to choose track
- [ ] Loading state shows skeleton cards

**Test Steps:**
1. Log in as new user (Day 1, no lessons completed)
2. Verify Home shows first lesson (Level 1, Order 1) from preferred track
3. Verify progress shows "0%"
4. Verify streak shows "Día 0" or "Día 1"
5. Click "Empezar"
6. Verify navigates to /lesson/[slug]
7. Return to /home (without completing)
8. Verify CTA now says "Continuar"
9. Complete lesson
10. Return to /home
11. Verify progress shows "Completada"

**States:**
- **Loading:** Skeleton loader for lesson card, progress, streak
- **Empty:** "Selecciona tu ruta de aprendizaje" if no track chosen
- **Success:** Lesson card, progress, streak, CTA displayed
- **Error:** "No se pudo cargar tu lección. Intenta de nuevo." with retry button

**Validation Rules:**
| Field | Rule | Error Message |
|-------|------|---------------|
| User track | Must have preferred_track set | "Selecciona tu ruta de aprendizaje primero" |

---

### Feature F005: Lesson Viewer - Cards & Content

**Category:** core
**Priority:** P0
**Day:** 2

**Description:**
The Lesson Viewer displays educational content as a series of cards (concept, example, tip, warning, visual). Users swipe or click "Siguiente" to progress through cards. This breaks learning into digestible chunks and maintains engagement.

**User Story:**
As a learner, I want to consume lesson content in small, clear chunks so that I can understand concepts without feeling overwhelmed.

**Route:** /lesson/[slug]

**User Flow:**
1. User navigates to /lesson/[slug] from Home
2. System loads lesson data (cards, metadata)
3. System displays:
   - Lesson title and subtitle at top
   - Progress bar showing card X of Y
   - Current card content (concept/example/tip/warning/visual)
   - Navigation: "Siguiente" button, "Guardar" (bookmark), optional "No entendí" (mark for review)
4. User reads card
5. User clicks "Siguiente"
6. System advances to next card, updates progress bar
7. User repeats until all cards viewed
8. System transitions to Practice/Quiz screen

**Acceptance Criteria:**
- [ ] Lesson title, subtitle, estimated time displayed at top
- [ ] Progress bar shows current card / total cards
- [ ] Cards render correctly: text, images, icons
- [ ] "Siguiente" button advances to next card
- [ ] "Guardar" bookmarks lesson for later review
- [ ] "No entendí" marks lesson for review (sets needs_review flag)
- [ ] Swipe gestures work on mobile (left = next, right = previous)
- [ ] Last card transitions automatically to quiz
- [ ] Exit button prompts confirmation: "¿Quieres salir? Tu progreso se guardará."
- [ ] UserProgress.cards_viewed increments correctly

**Test Steps:**
1. Navigate to /lesson/nivel-1-introduccion-finanzas-01
2. Verify lesson title and subtitle appear
3. Verify progress bar shows "1 / 5" (example)
4. Read first card
5. Click "Siguiente"
6. Verify progress bar updates to "2 / 5"
7. Continue through all cards
8. Verify after last card, quiz loads automatically
9. Test "Guardar" button (lesson saved to bookmarks)
10. Test "No entendí" button (needs_review flag set)

**States:**
- **Loading:** Skeleton loader for lesson content
- **Empty:** N/A (lessons always have cards)
- **Success:** Cards display, progress updates
- **Error:** "No se pudo cargar la lección. Intenta de nuevo." with retry button

**Validation Rules:**
| Field | Rule | Error Message |
|-------|------|---------------|
| Lesson slug | Must exist in database | "Lección no encontrada" (404) |

---

### Feature F006: Practice Quiz with Immediate Feedback

**Category:** core
**Priority:** P0
**Day:** 2

**Description:**
After viewing lesson cards, users complete a practice quiz (3-10 questions). Each question shows immediate feedback: if correct, show explanation + reinforcement; if incorrect, show explanation + example + "intentar de nuevo" option. Users must score 70% to pass.

**User Story:**
As a learner, I want to test my understanding immediately after the lesson so that I can confirm I've learned the concepts and identify gaps.

**Route:** /lesson/[slug]/practice

**User Flow:**
1. User completes all lesson cards
2. System loads practice quiz (3-10 questions from lesson.questions)
3. System displays:
   - Question number (1 of X)
   - Question text
   - 4 multiple-choice options (A/B/C/D) or True/False
4. User selects answer
5. System shows immediate feedback:
   - Correct: Green checkmark, "¡Correcto! [explanation]", "Siguiente pregunta" button
   - Incorrect: Red X, "Incorrecto. [explanation + example]", "Intentar de nuevo" or "Siguiente pregunta"
6. User proceeds through all questions
7. System calculates score (% correct)
8. If score ≥70%: pass, award XP, advance to completion screen
9. If score <70%: fail, show "Reintentar quiz" or "Repasar 2 cards clave"

**Acceptance Criteria:**
- [ ] Quiz loads after final lesson card
- [ ] Questions display one at a time
- [ ] Answer options are clickable/tappable
- [ ] Immediate feedback shown after each answer
- [ ] Correct answers: show explanation, "Siguiente pregunta"
- [ ] Incorrect answers: show explanation + example, allow retry
- [ ] Progress bar shows question X of Y
- [ ] Final score calculated as percentage
- [ ] If score ≥70%: mark lesson as passed, award XP
- [ ] If score <70%: show retry options (quiz or review cards)
- [ ] UserProgress.quiz_score and quiz_attempts saved

**Test Steps:**
1. Complete all cards in a lesson
2. Verify quiz loads automatically
3. Answer first question correctly
4. Verify green checkmark and explanation appear
5. Click "Siguiente pregunta"
6. Answer next question incorrectly
7. Verify red X and explanation appear
8. Click "Intentar de nuevo"
9. Select correct answer
10. Complete all questions
11. Verify final score displayed
12. If ≥70%, verify XP awarded and lesson marked complete

**States:**
- **Loading:** Skeleton loader while quiz loads
- **Empty:** N/A (quizzes always have questions)
- **Success:** Quiz complete, score ≥70%, XP awarded
- **Error:** "No se pudo cargar la práctica. Intenta de nuevo." with retry button

**Validation Rules:**
| Field | Rule | Error Message |
|-------|------|---------------|
| Answer selection | Must select one option | "Selecciona una respuesta para continuar" |
| Passing score | ≥70% | "Necesitas al menos 70% para aprobar" |

---

### Feature F007: Lesson Completion & Rewards

**Category:** core
**Priority:** P0
**Day:** 3

**Description:**
After passing the quiz (≥70%), users see a celebration screen showing XP earned, streak updated, level progress, and any unlocked achievements. FREE users also see one short ad (5-10 sec) after the celebration, followed by daily spin opportunity.

**User Story:**
As a learner, I want to see my progress and rewards immediately after completing a lesson so that I feel motivated to continue my streak tomorrow.

**Route:** /lesson/[slug]/complete

**User Flow:**
1. User completes quiz with ≥70% score
2. System calculates rewards:
   - Base XP (from lesson.xp_reward_base)
   - Streak bonus XP (if applicable)
   - Coins (from lesson.coin_reward)
   - Check for unlocked achievements
3. System displays completion screen:
   - "¡Lección completada!"
   - "Hoy avanzaste un paso más en tu educación financiera"
   - XP earned: "+XX XP"
   - Level progress bar updated
   - Streak updated: "🔥 Racha: X días"
   - Achievements unlocked (if any)
4. If FREE user: show 5-10 sec ad
5. System prompts daily spin: "Gira la ruleta y gana tu premio diario"
6. User spins wheel, wins reward
7. System shows final CTA:
   - "Continuar mañana" (habit message)
   - "Ver mi progreso"
   - "Hacer práctica extra" (optional, PRO only)

**Acceptance Criteria:**
- [ ] Completion screen shows immediately after quiz pass
- [ ] XP calculation correct: base + streak bonus
- [ ] Coins awarded and displayed
- [ ] Level progress bar animates to new percentage
- [ ] Streak increments if lesson completed on new day
- [ ] Achievements unlocked if criteria met (e.g., "First Lesson", "3-Day Streak")
- [ ] FREE users see ad after completion (not before or during lesson)
- [ ] Ad skippable after 5 seconds
- [ ] Daily spin button appears after ad (or immediately for PRO)
- [ ] UserProgress marked as completed, is_passed = true
- [ ] DailyStreak.current_streak and last_activity_date updated

**Test Steps:**
1. Complete lesson with ≥70% quiz score
2. Verify completion screen appears
3. Verify XP displayed (e.g., "+15 XP")
4. Verify level progress bar updates
5. Verify streak shows correct count
6. If FREE user, verify ad plays
7. Skip ad after 5 seconds
8. Verify daily spin button appears
9. Spin wheel
10. Verify reward awarded
11. Click "Ver mi progreso"
12. Verify profile shows updated XP, streak, lesson count

**States:**
- **Loading:** "Guardando tu progreso..." spinner
- **Empty:** N/A
- **Success:** Celebration screen, rewards displayed
- **Error:** "No se pudo guardar tu progreso. Reconectando..." with auto-retry

**Validation Rules:**
| Field | Rule | Error Message |
|-------|------|---------------|
| Quiz score | Must be ≥70% to reach this screen | N/A (enforced earlier) |

---

### Feature F008: Daily Spin / Ruleta

**Category:** core
**Priority:** P1
**Day:** 3

**Description:**
Users can spin a reward wheel once per day (FREE) or three times per day (PRO). The wheel awards random rewards: XP boosts, coins, streak freezes, or badges. PRO users have better odds for rare/epic rewards.

**User Story:**
As a user, I want to spin the daily wheel for rewards so that I have an extra incentive to complete my daily lesson and feel excited about random bonuses.

**Route:** /spin (or modal on /home)

**User Flow:**
1. User clicks "Gira la ruleta" button (appears after lesson completion or on Home)
2. System checks DailySpinLog for today:
   - FREE: 1 spin available
   - PRO: 3 spins available
3. If spins remaining:
   - System displays wheel with reward options
   - User clicks "Girar"
   - Wheel animates and lands on reward
   - System awards reward (XP, coins, streak freeze, badge)
   - System updates DailySpinLog (spins_used++)
   - System shows "¡Ganaste [reward]!" message
4. If no spins remaining:
   - Show "Vuelve mañana para girar de nuevo"

**Acceptance Criteria:**
- [ ] Wheel displays with reward segments (XP, coins, badges, etc.)
- [ ] Spin animation smooth and realistic
- [ ] Reward probabilities differ: FREE (lower odds for rare) vs PRO (higher odds for rare)
- [ ] Reward correctly awarded to UserReward table
- [ ] DailySpinLog updated: spins_used increments
- [ ] If all spins used, show "Vuelve mañana" message
- [ ] Streak freeze reward (PRO) adds to DailyStreak.streak_freeze_count
- [ ] XP boost immediately adds to user's total XP
- [ ] Modal closes after reward claimed

**Test Steps:**
1. Complete a lesson as FREE user
2. Click "Gira la ruleta"
3. Verify wheel displays
4. Click "Girar"
5. Verify animation plays
6. Verify reward awarded and message shown
7. Check DailySpinLog: spins_used = 1, spins_available = 0
8. Try to spin again
9. Verify "Vuelve mañana" message
10. Test as PRO user: verify 3 spins available

**States:**
- **Loading:** "Cargando ruleta..." while wheel loads
- **Empty:** "No tienes giros disponibles. Vuelve mañana."
- **Success:** Reward awarded, message displayed
- **Error:** "No pudimos cargar la ruleta. Intenta de nuevo." with retry button

**Validation Rules:**
| Field | Rule | Error Message |
|-------|------|---------------|
| Spins available | Must have spins_available > 0 | "No tienes giros disponibles hoy" |

---

### Feature F009: User Profile & Progress Dashboard

**Category:** core
**Priority:** P1
**Day:** 3

**Description:**
The Profile screen displays user's learning stats: total XP, current streak, longest streak, lessons completed, achievements/badges, learning history, and progress by route (Trading vs Finanzas). All data is private by default.

**User Story:**
As a user, I want to see my overall progress and achievements so that I can track my learning journey and feel proud of what I've accomplished.

**Route:** /profile

**User Flow:**
1. User navigates to /profile
2. System loads:
   - User data (display_name, subscription_tier)
   - Ranking data (total_xp, lessons_completed)
   - DailyStreak (current_streak, longest_streak)
   - UserAchievements (unlocked badges)
   - UserProgress (history of completed lessons)
3. System displays:
   - Header: display_name, total XP, level
   - Streak section: "🔥 Racha actual: X días", "Mejor racha: Y días"
   - Lessons completed: total count
   - Achievements: grid of unlocked badges
   - Progress by route: % complete in Trading, % complete in Finanzas
   - Learning history: list of recent lessons with dates

**Acceptance Criteria:**
- [ ] Profile loads in under 2 seconds
- [ ] All stats accurately reflect database values
- [ ] Display name shown (editable via settings icon)
- [ ] Total XP and current level displayed
- [ ] Current streak and longest streak shown with fire emoji
- [ ] Lessons completed count accurate
- [ ] Achievements displayed as badge grid (locked badges grayed out)
- [ ] Progress by route shows percentage bars for Trading and Finanzas
- [ ] Learning history shows last 10 completed lessons with titles and dates
- [ ] Privacy: all data private, not visible to other users (except opt-in ranking)

**Test Steps:**
1. Navigate to /profile
2. Verify display name appears
3. Verify total XP matches database
4. Verify current streak matches DailyStreak table
5. Verify lessons completed count matches UserProgress (status = completed)
6. Verify achievements grid shows unlocked badges
7. Verify progress bars show correct percentages
8. Verify learning history shows recent lessons
9. Test on mobile and desktop

**States:**
- **Loading:** Skeleton loader for all sections
- **Empty:** "Completa tu primera lección para empezar" if no progress
- **Success:** All stats displayed
- **Error:** "No se pudo cargar tu perfil. Intenta de nuevo." with retry button

**Validation Rules:**
| Field | Rule | Error Message |
|-------|------|---------------|
| User ID | Must be authenticated | Redirect to /login |

---

### Feature F010: Rankings - Global Top 10 & Local Top 3

**Category:** secondary
**Priority:** P1
**Day:** 4

**Description:**
The Rankings screen shows the Top 10 global users and Top 3 users from the user's country, based on valid XP (anti-farming rules applied). Only display_name and XP are shown, maintaining privacy. Users see their own rank if they're in the top positions.

**User Story:**
As a competitive user, I want to see how I rank compared to other learners globally and in my country so that I feel motivated to continue learning and climbing the leaderboard.

**Route:** /ranking

**User Flow:**
1. User navigates to /ranking
2. System calculates rankings (runs daily via cron job, cached):
   - Global: Top 10 by total_xp
   - Local: Top 3 by total_xp filtered by country_code
3. System displays:
   - Tabs: "Global" and "Mi País"
   - Global tab: Top 10 users with rank, display_name, XP
   - Local tab: Top 3 users with rank, display_name, XP, country flag
   - User's own rank (if in top positions): highlighted row
4. If user not in top positions: "Sigue aprendiendo para entrar al ranking"

**Acceptance Criteria:**
- [ ] Rankings page loads in under 2 seconds
- [ ] Global tab shows Top 10 users by XP
- [ ] Local tab shows Top 3 users from user's country
- [ ] Each row shows: rank (#1, #2, etc.), display_name, total XP
- [ ] User's own rank highlighted if in top positions
- [ ] If user not in top 10/3: show encouragement message
- [ ] Country flags displayed in Local tab
- [ ] Rankings cached and updated daily (not real-time)
- [ ] Privacy: only display_name and XP shown, no personal data
- [ ] Empty state: "Aún no hay rankings. ¡Sé el primero!"

**Test Steps:**
1. Navigate to /ranking
2. Verify Global tab shows Top 10
3. Verify each user has rank, display_name, XP
4. Click "Mi País" tab
5. Verify Top 3 from user's country shown
6. Verify country flag appears
7. If test user in top 10/3, verify highlighted
8. If test user not in top, verify encouragement message
9. Test with empty database (no rankings yet)

**States:**
- **Loading:** Skeleton loader for ranking table
- **Empty:** "Aún no hay rankings. ¡Sé el primero!"
- **Success:** Rankings displayed
- **Error:** "No se pudieron cargar los rankings. Intenta de nuevo." with retry button

**Validation Rules:**
| Field | Rule | Error Message |
|-------|------|---------------|
| Country code | Must be set in user profile | "Configura tu país en Perfil para ver el ranking local" |

---

### Feature F011: Learning Routes - Trading & Finanzas Paths

**Category:** core
**Priority:** P1
**Day:** 4

**Description:**
Users can view and select between two structured learning routes: Trading (20 levels) and Educación Financiera (20 levels). Each route shows levels, locked/unlocked lessons, progress percentage, and next lesson to complete.

**User Story:**
As a user, I want to see my learning path clearly laid out so that I understand what I'm working toward and can see my progression through the curriculum.

**Route:** /routes

**User Flow:**
1. User navigates to /routes
2. System loads user's preferred_track and UserProgress data
3. System displays:
   - Two route cards: "Trading" and "Educación Financiera"
   - Each card shows: title, description, total levels (20), progress percentage
   - Active route highlighted
4. User clicks route card
5. System shows route detail:
   - List of levels (1-20)
   - Each level shows: locked/unlocked icon, level number, lesson count, completion status
6. User clicks unlocked level
7. System shows lessons in that level
8. User clicks unlocked lesson
9. System navigates to /lesson/[slug]

**Acceptance Criteria:**
- [ ] Routes page shows two cards: Trading and Educación Financiera
- [ ] Each card displays: title, description, progress percentage
- [ ] Active route highlighted (based on preferred_track)
- [ ] Clicking card shows route detail view
- [ ] Route detail shows all 20 levels
- [ ] Levels display locked/unlocked status (based on prerequisites)
- [ ] Unlocked levels clickable, locked levels grayed out
- [ ] Clicking unlocked level shows lessons in that level
- [ ] Lessons display: title, estimated time, completed/in-progress/locked status
- [ ] Clicking unlocked lesson navigates to /lesson/[slug]
- [ ] User can switch active route (updates preferred_track)

**Test Steps:**
1. Navigate to /routes
2. Verify two route cards appear
3. Verify active route highlighted
4. Click Trading route
5. Verify 20 levels listed
6. Verify Level 1 unlocked, Level 2+ locked (for new user)
7. Click Level 1
8. Verify lessons in Level 1 shown
9. Click first lesson
10. Verify navigates to /lesson/[slug]
11. Go back, switch to Finanzas route
12. Verify preferred_track updated

**States:**
- **Loading:** Skeleton loader for route cards and levels
- **Empty:** N/A (routes always exist)
- **Success:** Routes and levels displayed
- **Error:** "No se pudieron cargar las rutas. Intenta de nuevo." with retry button

**Validation Rules:**
| Field | Rule | Error Message |
|-------|------|---------------|
| Route selection | Must select one route | "Selecciona una ruta para continuar" |

---

### Feature F012: Achievements & Badges System

**Category:** secondary
**Priority:** P2
**Day:** 4

**Description:**
Users unlock achievements by reaching milestones: completing first lesson, reaching 3-day streak, completing a level, getting perfect quiz score, etc. Achievements award XP and display as badges in the user's profile.

**User Story:**
As a user, I want to unlock achievements for reaching milestones so that I feel recognized for my progress and motivated to keep learning.

**Route:** /profile (achievements section)

**User Flow:**
1. User completes an action that meets achievement criteria (e.g., completes first lesson)
2. System checks Achievement table for matching requirement_type and requirement_value
3. If criteria met and not already unlocked:
   - System creates UserAchievement record
   - System awards xp_reward to user's total XP
   - System shows modal: "¡Logro desbloqueado! [achievement title]" with badge icon
4. User clicks "Aceptar"
5. Badge appears in profile achievements grid

**Acceptance Criteria:**
- [ ] Achievements trigger automatically when criteria met
- [ ] Achievement modal displays: title, description, badge icon, XP reward
- [ ] XP reward added to user's total XP
- [ ] UserAchievement record created with unlocked_at timestamp
- [ ] Badge appears in profile achievements grid
- [ ] Locked badges shown as grayed out silhouettes (if not is_hidden)
- [ ] Hidden achievements don't appear until unlocked
- [ ] Multiple achievements can unlock simultaneously (show queue)
- [ ] Achievement criteria: first_lesson, streak_3, streak_7, level_up, perfect_score, lessons_10, lessons_50

**Test Steps:**
1. Complete first lesson
2. Verify achievement modal appears: "¡Primera Lección!"
3. Verify XP reward added
4. Navigate to /profile
5. Verify badge appears in achievements grid
6. Complete 3 lessons on consecutive days
7. Verify "Racha de 3 Días" achievement unlocks
8. Get 100% on a quiz
9. Verify "Quiz Perfecto" achievement unlocks

**States:**
- **Loading:** N/A (achievements trigger in background)
- **Empty:** All badges grayed out (locked) in profile
- **Success:** Achievement modal appears, badge unlocked
- **Error:** If achievement fails to save, retry silently in background

**Validation Rules:**
| Field | Rule | Error Message |
|-------|------|---------------|
| Achievement criteria | Must meet requirement_type and requirement_value | N/A (automatic) |

---

### Feature F013: Subscription Tiers - FREE vs PRO

**Category:** core
**Priority:** P1
**Day:** 5

**Description:**
Users can view subscription tiers and upgrade from FREE to PRO. FREE: 1 lesson/day, 1 spin, ads after lesson. PRO: unlimited lessons, 3 spins, no ads, streak freezes. Soft upsell after completing daily lesson (FREE users).

**User Story:**
As a FREE user, I want to understand the benefits of PRO and upgrade if I want unlimited lessons and no ads.

**Route:** /upgrade

**User Flow:**
1. User navigates to /upgrade (or sees soft upsell after lesson)
2. System displays comparison table:
   - FREE: 1 lesson/day, 1 spin, ads, basic features
   - PRO: unlimited lessons, 3 spins, no ads, streak freezes, early access
3. User clicks "Upgrade to PRO"
4. System shows payment modal (Stripe or placeholder)
5. User enters payment details
6. System processes payment
7. System updates user.subscription_tier to "pro"
8. System shows confirmation: "¡Bienvenido a PRO!"
9. User redirected to /home

**Acceptance Criteria:**
- [ ] Upgrade page shows clear comparison: FREE vs PRO
- [ ] Benefits listed: lessons/day, spins, ads, features
- [ ] Pricing displayed (e.g., $4.99/month or local equivalent)
- [ ] "Upgrade to PRO" button triggers payment flow
- [ ] Payment modal shows price and confirmation
- [ ] Successful payment updates subscription_tier to "pro"
- [ ] Confirmation screen shows "Welcome to PRO" message
- [ ] User immediately gains PRO benefits (unlimited lessons, no ads)
- [ ] Soft upsell appears for FREE users after completing daily lesson
- [ ] Upsell is non-intrusive, dismissable

**Test Steps:**
1. Log in as FREE user
2. Navigate to /upgrade
3. Verify comparison table shows FREE vs PRO
4. Click "Upgrade to PRO"
5. Verify payment modal appears (use test mode)
6. Enter test payment details
7. Confirm payment
8. Verify subscription_tier updated to "pro"
9. Navigate to /home
10. Verify "Siguiente lección" available (no 1/day limit)
11. Complete lesson
12. Verify no ad shown

**States:**
- **Loading:** "Procesando pago..." while payment processes
- **Empty:** N/A
- **Success:** "¡Bienvenido a PRO!" confirmation
- **Error:** "No se pudo procesar el pago. Intenta de nuevo." with retry button

**Validation Rules:**
| Field | Rule | Error Message |
|-------|------|---------------|
| Payment details | Valid card, sufficient funds | "Pago rechazado. Verifica tus datos." |

---

### Feature F014: Offline Mode - Save Progress Locally

**Category:** secondary
**Priority:** P2
**Day:** 5

**Description:**
Users can continue learning even when offline. Lesson progress, quiz answers, and rewards are saved to localStorage and synced when the user reconnects to the internet. This ensures no progress is lost due to network issues.

**User Story:**
As a user with unstable internet, I want my progress saved locally so that I never lose my streak or XP due to connection problems.

**Route:** All routes

**User Flow:**
1. User starts lesson while online
2. User loses internet connection mid-lesson
3. System detects offline state, shows "Modo sin conexión" indicator
4. User continues viewing cards and answering quiz
5. System saves progress to localStorage:
   - cards_viewed, quiz_answers, time_spent
6. User completes lesson
7. System shows "Tu progreso se sincronizará cuando vuelvas a conectarte"
8. User reconnects to internet
9. System detects online state
10. System syncs localStorage data to Supabase:
    - UserProgress, DailyStreak, Ranking updated
11. System shows "Progreso sincronizado" confirmation
12. localStorage cleared

**Acceptance Criteria:**
- [ ] Offline state detected automatically (navigator.onLine)
- [ ] "Modo sin conexión" indicator appears when offline
- [ ] Lesson progress saved to localStorage: cards_viewed, quiz_answers, time_spent
- [ ] Quiz can be completed offline (feedback shown from cached data)
- [ ] Completion screen shows "Se sincronizará cuando te conectes"
- [ ] Online state triggers automatic sync
- [ ] Sync uploads all cached progress to Supabase
- [ ] Streak protected: if lesson completed offline on correct day, streak counts
- [ ] Sync confirmation shown: "Progreso sincronizado"
- [ ] localStorage cleared after successful sync
- [ ] If sync fails, retry automatically (max 3 attempts)

**Test Steps:**
1. Start lesson while online
2. Turn off internet (airplane mode or disable WiFi)
3. Verify "Modo sin conexión" indicator appears
4. Continue lesson, view cards
5. Answer quiz questions
6. Complete lesson
7. Verify "Se sincronizará cuando te conectes" message
8. Turn internet back on
9. Verify sync triggers automatically
10. Verify UserProgress updated in database
11. Verify streak updated
12. Verify localStorage cleared

**States:**
- **Loading:** "Sincronizando progreso..." during sync
- **Empty:** N/A
- **Success:** "Progreso sincronizado" confirmation
- **Error:** "No se pudo sincronizar. Reintentando..." with auto-retry

**Validation Rules:**
| Field | Rule | Error Message |
|-------|------|---------------|
| Sync data | Must be valid JSON in localStorage | "Datos corruptos. Contacta soporte." |

---

### Feature F015: Error States & Retry Logic

**Category:** core
**Priority:** P0
**Day:** 5

**Description:**
All user actions have graceful error handling with clear messages and retry options. No error breaks the user's habit or causes data loss. Network errors show "Connection lost. Retry?" with button. Validation errors are inline and specific.

**User Story:**
As a user, I want helpful error messages and retry options so that I can recover from problems without frustration or losing my progress.

**Route:** All routes

**User Flow:**
1. User performs action (e.g., submit quiz, complete lesson)
2. Action fails (network error, validation error, server error)
3. System detects error type
4. System shows appropriate error message:
   - Network: "Conexión perdida. Verifica tu internet e intenta de nuevo." + "Reintentar" button
   - Validation: Inline error per field, "Corrige los errores e intenta de nuevo."
   - Server (500): "Algo salió mal. Intenta de nuevo." + "Reintentar" button
5. User clicks "Reintentar"
6. System retries action
7. If success: proceed normally
8. If failure persists: "El problema persiste. Contáctanos si continúa." + link to support

**Acceptance Criteria:**
- [ ] All fetch/API calls wrapped in try/catch
- [ ] Network errors show: message + "Reintentar" button
- [ ] Validation errors show inline per field (red text, icon)
- [ ] Server errors (500) show: message + "Reintentar" button
- [ ] 404 errors show: "Página no encontrada" + link to /home
- [ ] 401 errors redirect to /login with message: "Por favor inicia sesión"
- [ ] 403 errors show: "No tienes permiso para esto"
- [ ] Retry button triggers same action again
- [ ] Max 3 auto-retries for critical actions (save progress, sync)
- [ ] User progress never lost due to errors (saved to localStorage)
- [ ] Loading states prevent double-submission

**Test Steps:**
1. Disconnect internet
2. Try to submit quiz
3. Verify network error message appears
4. Verify "Reintentar" button present
5. Reconnect internet
6. Click "Reintentar"
7. Verify quiz submitted successfully
8. Test validation error (submit empty form)
9. Verify inline errors appear per field
10. Test server error (mock 500 response)
11. Verify "Algo salió mal" message + "Reintentar"

**States:**
- **Loading:** "Intentando de nuevo..." during retry
- **Empty:** N/A
- **Success:** Action completes, error cleared
- **Error:** Error message displayed with retry option

**Validation Rules:**
| Field | Rule | Error Message |
|-------|------|---------------|
| Network | Online required for sync | "Sin conexión. Verifica tu internet." |
| Server | Valid response (200-299) | "Error del servidor. Intenta de nuevo." |

---

## 4. Authentication

**Method:** Google OAuth, Apple OAuth, Email/Password (via Supabase Auth)

### Sign-up Flow
1. User navigates to /signup (or sees signup after demo lesson)
2. User chooses: "Sign up with Google", "Sign up with Apple", or "Sign up with Email"
3. OAuth: System opens provider popup/redirect, user authenticates, returns with token
4. Email: User enters email, password (min 8 chars), confirms password
5. System validates input
6. System creates account via Supabase Auth
7. System creates User, DailyStreak, Ranking records in database
8. User redirected to /home

### Login Flow
1. User navigates to /login
2. User chooses: "Sign in with Google", "Sign in with Apple", or "Sign in with Email"
3. OAuth: System opens provider popup/redirect, user authenticates, returns with token
4. Email: User enters email and password
5. System validates credentials
6. On success: System creates session (httpOnly cookie, 7 days), redirect to /home
7. On failure: Show error "Email o contraseña incorrectos. Intenta de nuevo."

### Session
- **Duration:** 7 days
- **Inactivity timeout:** 30 minutes
- **Token storage:** httpOnly cookie (secure, not accessible via JavaScript)
- **Refresh:** Automatic via Supabase Auth
- **Logout:** Clear session, redirect to /login

---

## 5. Error Handling

| Error Type | User Message | Technical Action |
|------------|--------------|------------------|
| Network failure | "Conexión perdida. Verifica tu internet e intenta de nuevo." | Show "Reintentar" button, save progress to localStorage |
| Validation error | "[Field-specific message]" | Inline error with red text and icon, focus field |
| Server error (500) | "Algo salió mal. Intenta de nuevo." | Log error, show "Reintentar" button |
| Not found (404) | "Página no encontrada" | Show 404 page with link to /home |
| Unauthorized (401) | "Por favor inicia sesión para continuar" | Redirect to /login, preserve intended destination |
| Forbidden (403) | "No tienes permiso para esto" | Show message, link to /home |
| Lesson not found | "Lección no encontrada" | Show 404, suggest returning to /routes |
| Quiz submission error | "No se pudo enviar tu quiz. Intenta de nuevo." | Retry automatically (max 3), save answers to localStorage |
| Sync failure (offline) | "No se pudo sincronizar. Reintentando..." | Auto-retry sync (max 3), keep data in localStorage |
| Payment error | "No se pudo procesar el pago. Verifica tus datos." | Show payment error, allow retry |
| Ad load failure (FREE) | "No pudimos cargar el anuncio." | Continue to next screen (don't block user) |

### Confirmation Dialogs Required For:

**Exit lesson in progress:**
- Title: "¿Quieres salir?"
- Message: "Tu progreso se guardará y podrás continuar luego."
- Buttons: "Cancelar" (secondary), "Salir" (primary)

**Reset quiz:**
- Title: "¿Reiniciar la práctica?"
- Message: "Esto reiniciará la lección actual."
- Buttons: "Cancelar" (secondary), "Reiniciar" (primary)

**Cancel subscription (PRO):**
- Title: "¿Cancelar PRO?"
- Message: "Perderás acceso Premium al final del período actual."
- Buttons: "Mantener PRO" (secondary), "Cancelar suscripción" (destructive)

**Delete account:**
- Title: "¿Eliminar cuenta?"
- Message: "Esta acción es permanente. Perderás todo tu progreso, racha, y logros. Escribe ELIMINAR para confirmar."
- Input: Text field requiring "ELIMINAR"
- Buttons: "Cancelar" (secondary), "Eliminar cuenta" (destructive, disabled until text matches)

**NO confirmation required for:** Complete lesson, answer questions, earn XP, spin wheel, view progress, navigate routes.

---

## 6. Screens & Navigation

### Site Map

```
/ (Root)
├── /welcome (Onboarding - unauthenticated)
│   ├── Intro slides
│   ├── Track selection
│   ├── Demo lesson
│   └── Signup prompt
│
├── /signup (Authentication - unauthenticated)
│   ├── Google OAuth
│   ├── Apple OAuth
│   └── Email/Password form
│
├── /login (Authentication - unauthenticated)
│   ├── Google OAuth
│   ├── Apple OAuth
│   └── Email/Password form
│
├── /home (Main dashboard - authenticated)
│   ├── Today's Lesson card
│   ├── Daily progress indicator
│   ├── Streak display
│   └── CTA: Empezar / Continuar
│
├── /lesson/[slug] (Lesson viewer - authenticated)
│   ├── Lesson cards (content)
│   ├── Progress bar
│   ├── Navigation: Siguiente, Guardar, No entendí
│   └── /lesson/[slug]/practice (Quiz)
│       └── /lesson/[slug]/complete (Completion & rewards)
│
├── /routes (Learning paths - authenticated)
│   ├── Trading route (20 levels)
│   ├── Educación Financiera route (20 levels)
│   └── Route detail view (levels & lessons)
│
├── /profile (User profile - authenticated)
│   ├── Stats: XP, streak, lessons completed
│   ├── Achievements grid
│   ├── Progress by route
│   └── Learning history
│
├── /ranking (Leaderboards - authenticated)
│   ├── Global Top 10
│   └── Local Top 3 (by country)
│
├── /upgrade (Subscription - authenticated)
│   ├── FREE vs PRO comparison
│   ├── Pricing
│   └── Payment flow
│
└── /404 (Not found)
    └── "Página no encontrada" + link to /home
```

### Navigation Structure

**Top Navigation (Authenticated):**
- Logo (link to /home)
- Home
- Rutas (Routes)
- Ranking
- Profile icon (dropdown: Perfil, Upgrade to PRO, Logout)

**Bottom Navigation (Mobile - Authenticated):**
- Home
- Rutas
- Ranking
- Perfil

**Unauthenticated:**
- Logo (link to /)
- Login (top right)
- Signup (top right, primary button)

---

## 7. Content Strategy

### Initial Content Seeding

**Source:** PDF documents for Trading (Levels 1-20) and Educación Financiera (Levels 1-20)

**Structure:**
- **2 Routes:** Trading, Educación Financiera
- **20 Levels per route:** Progressive difficulty (beginner → intermediate → advanced)
- **3-5 Lessons per level:** Estimated 60-100 total lessons per route
- **Each Lesson contains:**
  - 3-8 Cards: concept, example, tip, warning, visual
  - 3-10 Quiz questions: multiple choice or true/false
  - Metadata: title (max 60 chars), subtitle (max 140 chars), objective, estimated_minutes (5-10), tags

**Lesson Format:**
```json
{
  "slug": "nivel-1-introduccion-finanzas-01",
  "track_type": "finanzas",
  "level_id": 1,
  "order_index": 1,
  "title": "¿Qué es la educación financiera?",
  "subtitle": "Aprende por qué gestionar tu dinero cambia tu vida",
  "objective": "Hoy aprenderás qué es la educación financiera y por qué importa para tu futuro económico.",
  "estimated_minutes": 5,
  "difficulty": "beginner",
  "tags": ["introducción", "conceptos básicos"],
  "cards": [
    {
      "type": "concept",
      "content": "La educación financiera es el conocimiento para tomar decisiones inteligentes con tu dinero."
    },
    {
      "type": "example",
      "content": "Ejemplo: Saber cuánto ahorrar cada mes para comprar un auto en 2 años."
    },
    {
      "type": "tip",
      "content": "Tip: No necesitas ser experto en matemáticas, solo entender conceptos clave."
    }
  ],
  "questions": [
    {
      "id": "q1",
      "prompt": "¿Qué es la educación financiera?",
      "options": [
        "Solo para ricos",
        "Conocimiento para gestionar dinero",
        "Aprender a invertir en bolsa",
        "Un curso universitario"
      ],
      "correct_option": 1,
      "explanation": "La educación financiera es el conocimiento para tomar decisiones inteligentes con tu dinero, sin importar cuánto ganes."
    }
  ]
}
```

**Seeding Process:**
1. Parse PDF content into structured JSON
2. Create Lesson records in database (status: published)
3. Set prerequisites: Level 2 requires Level 1 complete, etc.
4. Assign XP/coin rewards based on difficulty
5. Create initial Achievement records (first_lesson, streak_3, etc.)
6. Create initial Reward records for daily spin

---

## 8. Design System

### Color Palette
- **Primary:** #6366F1 (Indigo - motivation, learning)
- **Secondary:** #EC4899 (Pink - gamification, rewards)
- **Success:** #10B981 (Green - correct answers, completion)
- **Warning:** #F59E0B (Amber - caution, review needed)
- **Error:** #EF4444 (Red - incorrect answers, errors)
- **Neutral:** #6B7280 (Gray - text, borders)
- **Background:** #F9FAFB (Light gray - main background)
- **Surface:** #FFFFFF (White - cards, modals)

### Typography
- **Font:** Inter (sans-serif) - clean, modern, readable
- **Headings:** Bold, larger sizes (text-2xl, text-xl, text-lg)
- **Body:** Regular, 16px base (text-base)
- **Small text:** 14px (text-sm) for metadata, labels

### Components
- **Buttons:** Rounded (rounded-lg), shadow on hover, primary/secondary/destructive variants
- **Cards:** White background, subtle shadow, rounded corners, padding
- **Progress bars:** Animated fill, rounded ends, gradient optional
- **Badges:** Small pills for difficulty, status, achievements
- **Modals:** Centered, overlay background, close button, max-width
- **Forms:** Clear labels, inline errors, focus states

### Spacing
- **Base unit:** 4px (Tailwind's spacing scale)
- **Common gaps:** 4, 8, 16, 24, 32px

### Responsive Breakpoints
- **Mobile:** 320px - 640px (default, mobile-first)
- **Tablet:** 640px - 1024px
- **Desktop:** 1024px+

---

## 9. Technical Architecture

### Stack
- **Frontend:** Next.js 14 (App Router), React Server Components
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (Google, Apple, Email/Password)
- **Deployment:** Vercel
- **Payments:** Stripe (for PRO subscriptions)
- **Analytics:** Vercel Analytics (optional: Plausible for privacy-focused)

### Folder Structure
```
/app
  /(auth)
    /login
    /signup
  /(main)
    /home
    /lesson/[slug]
    /routes
    /profile
    /ranking
    /upgrade
  /welcome
  /layout.tsx
  /page.tsx
/components
  /ui (buttons, cards, modals)
  /lesson (lesson-specific)
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

### Data Flow
1. **User visits /home**
2. **Server Component:** Fetch user, streak, today's lesson from Supabase
3. **Render:** Display lesson card, progress, streak
4. **User clicks "Empezar"**
5. **Client Component:** Navigate to /lesson/[slug]
6. **Server Component:** Fetch lesson data (cards, questions)
7. **Client Component:** Render cards, handle navigation
8. **User completes quiz**
9. **Client Component:** Submit answers via Server Action
10. **Server Action:** Calculate score, update UserProgress, DailyStreak, Ranking
11. **Server Action:** Return rewards (XP, coins, achievements)
12. **Client Component:** Show completion screen

### Security
- **Row Level Security (RLS):** All Supabase tables filtered by user_id
- **Authentication:** httpOnly cookies, secure sessions
- **Input validation:** Zod schemas for all form inputs
- **Sanitization:** Escape user-generated content (display_name)
- **Rate limiting:** Prevent spam (e.g., quiz submissions, API calls)
- **Environment variables:** Secrets stored in .env.local (never committed)

### Performance
- **Server Components:** Reduce client JavaScript, faster initial load
- **Image optimization:** next/image with proper sizing
- **Code splitting:** Dynamic imports for heavy components (e.g., payment modal)
- **Caching:** Supabase queries cached with React cache()
- **Lazy loading:** Images, modals, below-fold content
- **Prefetching:** Next lesson preloaded on /home

---

## 10. Success Criteria

### Week 1 (100 users)
- **Retention:** ≥40-50 active users on Day 7
- **Streaks:** Average ≥3 days, multiple users reach 5-7 days
- **Completion:** ≥70% of active users complete daily lesson
- **Progress:** Users complete 5-10 lessons in first week
- **Gamification:** High daily spin usage (≥80% of eligible users)
- **Conversion:** 5-10% upgrade to PRO
- **Feedback:** "Easy to keep up", "Finally understand", "Want to come back"

### Technical
- **Load time:** App loads in <3 seconds (desktop), <5 seconds (mobile)
- **Uptime:** ≥99.5%
- **Build success:** npm run build passes with 0 errors
- **Lint:** npm run lint passes with 0 errors
- **Type safety:** No `any` types, all interfaces defined
- **Test coverage:** Manual testing passes for all features

### User Experience
- **Onboarding:** ≥70% of visitors complete demo lesson
- **Signup conversion:** ≥50% of demo completions → signup
- **Daily return:** ≥40% of Day 1 users return on Day 2
- **Quiz pass rate:** ≥70% pass on first attempt
- **Error rate:** <1% of user actions result in errors

---

## 11. Out of Scope (v1)

**NOT included in 5-day build:**
- Creator program (third-party content upload)
- Advanced financial tools (budgets, simulators, trading diary)
- AI Coach / personalized recommendations
- Social features (feed, likes, comments, chat)
- Real trading integration or broker connections
- KYC or identity verification
- Long onboarding questionnaires
- Advanced analytics dashboard for users
- Mobile native apps (iOS/Android) - web-only
- Multi-language support beyond Spanish
- Community forums or discussion boards
- Referral program
- Email marketing automation
- Push notifications
- Advanced search/filtering in lessons
- Custom lesson playlists
- Video content
- Live events or webinars

---

## 12. Assumptions & Risks

### Assumptions
- Users have smartphones or computers with modern browsers
- Users have stable internet (offline mode mitigates)
- Users understand basic Spanish
- Users willing to commit 5-10 minutes daily
- Content from PDFs is accurate and structured
- Supabase free tier sufficient for initial 100 users
- Payment processing (Stripe) available in target countries

### Risks
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Low user retention | Medium | High | Strong onboarding, clear value, streak psychology |
| Content quality issues | Low | High | Manual review of seeded lessons, user feedback |
| Technical bugs | Medium | Medium | Thorough testing, error handling, monitoring |
| Supabase rate limits | Low | Medium | Monitor usage, optimize queries, cache aggressively |
| Payment fraud | Low | High | Use Stripe's fraud detection, monitor transactions |
| Users farm XP | Medium | Low | Anti-farming rules in ranking calculation |
| Slow load times | Low | Medium | Optimize images, code split, use Server Components |
| Ad blockers (FREE) | Medium | Low | Non-intrusive ads, clear PRO upsell |

---

## 13. Glossary

- **Streak:** Consecutive days user completes at least one lesson
- **XP (Experience Points):** Points earned for completing lessons, used for leveling and ranking
- **Level:** Group of related lessons (1-20 per route)
- **Route:** Learning path (Trading or Educación Financiera)
- **Micro-lesson:** Short lesson (5-10 minutes) with cards and quiz
- **Card:** Single piece of content (concept, example, tip, warning, visual)
- **Quiz:** Practice questions (3-10) after lesson cards
- **Mastery threshold:** Minimum score to pass (70%)
- **Achievement/Badge:** Unlockable reward for reaching milestones
- **Daily spin / Ruleta:** Reward wheel (1 spin FREE, 3 spins PRO)
- **Streak freeze:** PRO feature to protect streak when missing a day
- **FREE tier:** 1 lesson/day, 1 spin, ads
- **PRO tier:** Unlimited lessons, 3 spins, no ads, freezes
- **Anti-farming:** Rules to prevent XP exploitation (e.g., repeated lessons earn less XP)

---

**END OF PRD**

**Version:** 1.0
**Last Updated:** 2026-01-19
**Status:** Approved for Development

---

**Next Steps:**
1. Review and approve PRD
2. Generate feature_list.json from PRD features
3. Set up Next.js project and Supabase
4. Begin Day 1 development (Features F001-F003: Onboarding & Auth)
