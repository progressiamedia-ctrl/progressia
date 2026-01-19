# [FEATURE ID]: [Feature Name] — Implementation Plan

**Feature ID:** F###
**Feature Name:** [Feature name from feature_list.json]
**Category:** core | secondary | polish
**Priority:** P0 | P1 | P2
**Day:** [1-5]
**Estimated Scope:** [Small (1-2 hours) | Medium (3-5 hours) | Large (6+ hours)]

---

## 1. Feature Overview

### From PRD
- **Description:** [Copy from feature_list.json]
- **Route:** [Route from PRD]
- **User Story:** As a [user], I want to [action] so that [benefit]

### Acceptance Criteria (From feature_list.json)
```
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]
- [ ] [Criterion 4]
- [ ] [Criterion 5]
```

---

## 2. Implementation Strategy

### Components to Create
```
/components
  /[feature-name]
    /[Component1].tsx
    /[Component2].tsx
    /index.ts
```

### Database Schema Changes
**Tables to modify/create:**
```
- [Table 1]: Add/modify columns: [column names]
- [Table 2]: Add/modify columns: [column names]
```

**Migrations:**
```sql
-- [Brief SQL description of schema changes]
```

### API Endpoints / Server Actions
```
POST /api/[feature]/[action]
  - Input: [input fields]
  - Output: [output structure]
  - Errors: [error codes]

GET /api/[feature]/[resource-id]
  - Input: [params]
  - Output: [output structure]
  - Errors: [error codes]
```

### State Management
- **Server Component by default?** Yes | No (because: [reason])
- **Client state needed?** [State variables and hooks]
- **Global state needed?** [Context, stores, etc.]
- **localStorage needed?** [What to persist]

### Key Dependencies
- [ ] Dependency 1: [What/why needed]
- [ ] Dependency 2: [What/why needed]
- [ ] Dependency 3: [What/why needed]

---

## 3. File Structure

### Files to Create
```
app/[feature]/page.tsx          - Main page component
components/[feature]/Foo.tsx    - Component 1
components/[feature]/Bar.tsx    - Component 2
lib/[feature]Service.ts         - Business logic
hooks/use[Feature].ts           - Custom hook (if needed)
types/[feature].types.ts        - TypeScript types
styles/[feature].module.css     - Styles (if needed, else use Tailwind)
```

### Files to Modify
```
app/layout.tsx                  - [Why: e.g., add navigation link]
lib/supabase/types.ts          - [Why: add new types from DB schema]
types/database.types.ts        - [Why: regenerate from Supabase]
```

### No Changes Needed
```
- [Other files that might seem related but won't be modified]
```

---

## 4. Step-by-Step Implementation

### Phase 1: Setup
1. Create component files
2. Define TypeScript interfaces
3. Export from index.ts
4. **Checkpoint:** Files exist, no errors

### Phase 2: Database (if needed)
1. Create/modify schema
2. Run migrations
3. Verify in Supabase
4. **Checkpoint:** Tables ready, can query

### Phase 3: Server Logic
1. Write Server Action (if mutations)
2. Implement business logic
3. Handle errors
4. Test with database
5. **Checkpoint:** Logic works in isolation

### Phase 4: UI (Page Component)
1. Create page.tsx as Server Component
2. Fetch initial data
3. Pass to Client Components
4. **Checkpoint:** Data loading works

### Phase 5: UI (Client Components)
1. Create interactive components
2. Add event handlers
3. Connect to Server Actions
4. **Checkpoint:** Interactions work

### Phase 6: States & Error Handling
1. Add loading state
2. Add empty state
3. Add error state
4. Add success state
5. **Checkpoint:** All states display correctly

### Phase 7: Polish & Responsive
1. Responsive design (mobile-first)
2. Animations/transitions
3. Accessibility (alt text, labels)
4. **Checkpoint:** Works on 320px and 1280px

### Phase 8: Testing
1. Manual testing per checklist
2. Edge cases
3. Error scenarios
4. **Checkpoint:** All test steps pass

---

## 5. Code Patterns to Follow

### Server Components
```typescript
// Server Component pattern (no 'use client')
export default async function FeaturePage() {
  const user = await getCurrentUser()
  const data = await fetchData(user.id)

  return <ClientComponent data={data} />
}
```

### Server Actions
```typescript
// In lib/actions.ts
'use server'

import { revalidatePath } from 'next/cache'

export async function updateFeature(formData: FormData) {
  // Validate input
  // Query database
  // Handle errors
  // Revalidate cache
  revalidatePath('/[route]')
  return { success: true, data: ... }
}
```

### Client Components
```typescript
'use client'

import { useState } from 'react'
import { updateFeature } from '@/lib/actions'

export function FeatureForm({ initialData }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(formData) {
    setLoading(true)
    setError(null)
    try {
      const result = await updateFeature(formData)
      // Handle success
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    // JSX
  )
}
```

### TypeScript Types
```typescript
// types/feature.types.ts
export interface Feature {
  id: string
  name: string
  // ... fields
  created_at: Date
  updated_at: Date
}

export interface FeatureInput {
  name: string
  // ... required fields (no id, dates)
}

export type FeatureResponse = {
  success: boolean
  data?: Feature
  error?: string
}
```

### Tailwind Classes (No Inline Styles)
```typescript
// Good ✅
<button className="bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 text-white font-semibold">
  Submit
</button>

// Bad ❌
<button style={{ backgroundColor: '#2563eb', padding: '8px 16px' }}>
  Submit
</button>
```

---

## 6. Testing Checklist

### Test Steps (From feature_list.json)
```
- [ ] [Test step 1]
- [ ] [Test step 2]
- [ ] [Test step 3]
- [ ] [Test step 4]
- [ ] [Test step 5]
```

### State Testing
- [ ] **Loading State:** [What should display while loading]
- [ ] **Empty State:** [What should display with no data]
- [ ] **Success State:** [What should display on success]
- [ ] **Error State:** [What should display on error]

### Responsive Testing
- [ ] Mobile (320px): [What to verify]
- [ ] Tablet (768px): [What to verify]
- [ ] Desktop (1280px): [What to verify]

### Edge Cases
- [ ] [Edge case 1]
- [ ] [Edge case 2]
- [ ] [Edge case 3]

### Browser/Device Testing
- [ ] Chrome desktop
- [ ] Firefox desktop
- [ ] Safari desktop
- [ ] Chrome mobile
- [ ] Safari mobile

---

## 7. Blockers & Dependencies

### Must Be Done First
- [ ] [Dependency 1]
- [ ] [Dependency 2]
- [ ] [Dependency 3]

### Unblocked By
- These features can be worked on in parallel: [F###, F###]
- These features depend on this: [F###, F###]

### External Blockers
- [ ] Supabase schema ready? [Yes/No]
- [ ] Third-party API key ready? [Yes/No]
- [ ] Mock data available? [Yes/No]

---

## 8. Notes & Decisions

### Why This Approach?
- [Decision 1: Why chosen over alternatives]
- [Decision 2: Why chosen over alternatives]

### Alternatives Considered
- [Alternative 1]: Rejected because [reason]
- [Alternative 2]: Rejected because [reason]

### Known Limitations
- [Limitation 1]: [Explanation]
- [Limitation 2]: [Explanation]

---

## 9. Post-Implementation

### After PR Merged
- [ ] Update docs/progress.md with "COMPLETED" status
- [ ] Update feature_list.json: `"status": "completed"`
- [ ] Note any learnings in this file

### Metrics to Track
- [ ] Time spent: [_____ hours]
- [ ] Bugs found: [_____]
- [ ] Test pass rate: [_____]%
- [ ] Code review feedback: [_____ items]

### Followup Items (If Any)
- [ ] [Item 1]
- [ ] [Item 2]

---

**Created:** YYYY-MM-DD
**Last Updated:** YYYY-MM-DD
**Status:** In Planning | In Progress | Completed
**Author:** [Your name]
