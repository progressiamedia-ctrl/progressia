# F001: User Onboarding (Demo Lesson Before Signup) - Implementation Plan

**Feature ID:** F001  
**Feature Name:** User Onboarding (Demo Lesson Before Signup)  
**Category:** core  
**Priority:** P0  
**Day:** 1  
**Estimated Scope:** Medium (3-5 hours)

---

## 1. Feature Overview

### From PRD
- **Description:** First-time users see a welcome/onboarding flow with a demo lesson they can try before creating an account.
- **Route:** /welcome
- **User Story:** As a new visitor, I want to try a demo lesson before signing up so I know what to expect.

### Acceptance Criteria (from docs/progress summary)
- [ ] Show welcome hero with clear value proposition
- [ ] Provide demo lesson preview (cards + quiz) without requiring login
- [ ] CTA to create account and to login for existing users
- [ ] Demo includes loading, error, empty state handling
- [ ] Passing threshold shown (70%) and result message
- [ ] Progress not persisted until signup
- [ ] Uses Styleguide colors/typography/layout
- [ ] Mobile-first; works at 320px/768px/1280px
- [ ] Accessible focus states and semantic markup
- [ ] No TypeScript `any`

---

## 2. Implementation Strategy

### Components to Create
```
/components/onboarding/DemoLessonExperience.tsx   - client component for cards/quiz/states
```

### Data
- Static demo lesson content colocated with page (`src/app/welcome/demoLessonContent.ts`).

### State Management
- Local component state only; no backend calls.
- Client component inside server page; CTA routes to signup/login.

---

## 3. File Structure
```
src/app/welcome/page.tsx              - server page shell
src/app/welcome/demoLessonContent.ts  - static demo lesson data
src/components/onboarding/DemoLessonExperience.tsx - interactive demo
```

---

## 4. Step-by-Step Implementation

1) Build static demo content (cards + quiz + metadata).  
2) Implement `DemoLessonExperience` with phases: intro -> cards -> quiz -> result; includes loading/error/empty views.  
3) Wire CTA buttons: hero buttons to signup/login, demo buttons to start/restart, result CTA to signup.  
4) Style to match Styleguide (dark, lime primary, Poppins headings, Inter body, rounded-2xl cards).  
5) Verify mobile/tablet/desktop layout; check focus states.  
6) Run lint/build.

---

## 5. Testing Checklist
- [ ] Hero renders with two CTAs (signup, login)
- [ ] Demo cards advance and gate to quiz
- [ ] Quiz scoring shows percent and pass/fail message
- [ ] Loading block appears when triggered
- [ ] Error block appears via “simular error” trigger
- [ ] Empty state visible if data arrays emptied
- [ ] Buttons navigate correctly (signup/login)
- [ ] Responsive at 320/768/1280
- [ ] No TypeScript errors; lint/build pass

---

## 6. Blockers & Dependencies
- None (static demo content); real lesson data to be wired later.

---

## 7. Notes & Decisions
- Demo progress is ephemeral; persistence waits for auth integration.
- CTA “Iniciar demo” scrolls to interactive block; result CTA pushes to `/signup`.

---

## 8. Post-Implementation
- Update docs/progress.md when feature criteria are met.
- Mark `feature_list.json` F001 `passes: true` after verification.
