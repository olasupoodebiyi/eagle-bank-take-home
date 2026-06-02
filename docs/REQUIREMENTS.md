# Take-home requirements traceability

Maps every item from the **Frontend Engineering Take-Home** brief to this repository. Use it in reviews and interviews to show full coverage — including why there are **no** `src/app/api/` Route Handlers.

**Role alignment:** UI Front End Developer · Scalable FE, Accessibility, Performance, Design Systems, Secure Coding, Collaboration

---

## How `/api/*` works in this project (no Next.js API routes)

The brief asks for **mock APIs using local JSON data**, not a real backend. This repo implements that as:

```
Pages / AuthContext  →  fetch('/api/...')
        ↓
MSW Service Worker (dev) or MSW Node server (tests)
        ↓
mocks/handlers/*.ts  →  mocks/data/*.ts (seed data)
```

| Approach | This repo | Alternative (also valid for brief) |
|----------|-----------|-------------------------------------|
| Data | `src/mocks/data/*.ts` (seed JSON-shaped objects) | `public/data.json` imported in UI |
| API layer | **MSW** handlers at the same URLs as production | Next.js `app/api/**/route.ts` |
| `src/app/api/` | **Does not exist (0 files)** | Would duplicate MSW for a take-home |

**Production path (interview talking point):** Keep page `fetch('/api/...')` URLs unchanged. Remove `MSWProvider` in prod. Either call an external channel API or add thin **Route Handlers** (`app/api/dashboard/route.ts`, etc.) that forward to the bank BFF. MSW stays for local dev and tests.

---

## Project objectives (features 1–6)

### 1. Authentication

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Login page | ✅ | `src/app/(auth)/login/page.tsx` |
| Registration page | ✅ | `src/app/(auth)/register/page.tsx` |
| Store auth state on frontend | ✅ | `src/context/AuthContext.tsx` (`useReducer`) |
| Protect authenticated routes | ✅ | `src/proxy.ts` — redirects if `eagle_bank_token` missing |
| Persist session (localStorage **or** cookies) | ✅ | **Cookie** via `js-cookie` (`eagle_bank_token`) |
| Validation + error states | ✅ | `src/lib/validations.ts` + Chakra `Field` + login server error banner |
| Loading states on login/register | ✅ | Chakra `Button` `loading` / `loadingText` |
| `POST /api/auth/register` | ✅ | `src/mocks/handlers/auth.ts` |
| `POST /api/auth/login` | ✅ | `src/mocks/handlers/auth.ts` |
| `POST /api/auth/logout` | ✅ | `src/mocks/handlers/auth.ts` |
| `GET /api/auth/me` | ✅ | `src/mocks/handlers/auth.ts` (session rehydration on mount) |

**Callers:** `AuthContext` (login, register, logout, me), `src/proxy.ts` (cookie presence only).

---

### 2. Dashboard

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Dashboard after login | ✅ | `/dashboard` in `(app)` route group |
| Welcome message + user name | ✅ | `(app)/dashboard/page.tsx` |
| Total account balance | ✅ | `DashboardStats` / UI |
| Summary cards: current balance, monthly deposits, monthly withdrawals | ✅ | `StatCard` components |
| Recent transactions | ✅ | From dashboard API payload |
| Quick actions section | ✅ | Dashboard page |
| Empty states | ✅ | `EmptyState` where lists can be empty |
| Responsive layout | ✅ | Chakra responsive grids |
| `GET /api/dashboard` | ✅ | `src/mocks/handlers/dashboard-profile.ts` |

**Caller:** `useFetch<DashboardData>('/api/dashboard')` in dashboard page.

---

### 3. Accounts management

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| View bank accounts | ✅ | `(app)/accounts/page.tsx` |
| Account types: Savings, Credit | ✅ | Seed data includes **savings**, **credit**, and **checking** |
| Account number | ✅ | Displayed (masked on list via `maskAccountNumber`) |
| Available balance | ✅ | `availableBalance` on `Account` |
| Account type | ✅ | `accountTypeLabel` + badges |
| Status | ✅ | `StatusBadge` / account status |
| Responsive table or card layout | ✅ | **Card grid** on list; detail on `[id]` page |
| `GET /api/accounts` | ✅ | `src/mocks/handlers/accounts.ts` |
| `GET /api/accounts/:id` | ✅ | `src/mocks/handlers/accounts.ts` |

---

### 4. Transactions

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Transaction list | ✅ | `(app)/transactions/page.tsx` |
| Filter by date range | ✅ | `startDate`, `endDate` query params → handler |
| Sorting by amount / date | ✅ | Column headers toggle `sortBy` / `sortOrder` |
| Pagination **or** infinite scrolling | ✅ | **Page-based pagination** (`page`, `limit`) |
| Transaction details | ✅ | `(app)/transactions/[id]/page.tsx` |
| Types: Deposit, Withdrawal, Transfer | ✅ | `TransactionType` + `TransactionTypeBadge` |
| `GET /api/transactions` | ✅ | `src/mocks/handlers/transactions.ts` |
| `GET /api/transactions/:id` | ✅ | `src/mocks/handlers/transactions.ts` |

**Accessibility note:** Row navigation uses `NextLinkBox` on the description cell (keyboard + screen-reader friendly), not `window.location` on the row.

---

### 5. User profile

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| View profile information | ✅ | `(app)/profile/page.tsx` + user from auth / API |
| Edit: full name, email, phone, address | ✅ | Form + `PUT /api/profile` |
| Upload avatar (frontend only / mock) | ✅ | File input + `FileReader` preview (no upload API) |
| Form validation | ✅ | `profileSchema` in `src/lib/validations.ts` |
| `GET /api/profile` | ✅ | `src/mocks/handlers/dashboard-profile.ts` |
| `PUT /api/profile` | ✅ | `src/mocks/handlers/dashboard-profile.ts` |

**Caller:** `authFetch` for profile update mutation.

---

### 6. Error handling

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| API error states | ✅ | `ErrorState` + `useFetch` / `authFetch` errors |
| Empty states | ✅ | `EmptyState` (e.g. transactions filters) |
| Loading indicators | ✅ | Skeletons, button loading states |
| Retry actions | ✅ | `refetch` on `ErrorState` |
| 404 page | ✅ | `src/app/not-found.tsx` |
| Generic error boundary | ✅ | `src/app/error.tsx` |

---

## API endpoint index (all implemented via MSW)

There are **11 HTTP operations** across **4 handler modules**. None are implemented as Next.js Route Handlers.

| Method | Path | Handler file | Used by |
|--------|------|--------------|---------|
| `POST` | `/api/auth/login` | `mocks/handlers/auth.ts` | `AuthContext.login` |
| `POST` | `/api/auth/register` | `mocks/handlers/auth.ts` | `AuthContext.register` |
| `POST` | `/api/auth/logout` | `mocks/handlers/auth.ts` | `AuthContext.logout` |
| `GET` | `/api/auth/me` | `mocks/handlers/auth.ts` | `AuthContext` rehydration |
| `GET` | `/api/dashboard` | `mocks/handlers/dashboard-profile.ts` | Dashboard `useFetch` |
| `GET` | `/api/profile` | `mocks/handlers/dashboard-profile.ts` | Available to profile flow |
| `PUT` | `/api/profile` | `mocks/handlers/dashboard-profile.ts` | Profile `authFetch` |
| `GET` | `/api/accounts` | `mocks/handlers/accounts.ts` | Accounts list |
| `GET` | `/api/accounts/:id` | `mocks/handlers/accounts.ts` | Account detail |
| `GET` | `/api/transactions` | `mocks/handlers/transactions.ts` | Transactions list (filters/pagination) |
| `GET` | `/api/transactions/:id` | `mocks/handlers/transactions.ts` | Transaction detail |

**MSW wiring**

| File | Role |
|------|------|
| `src/mocks/browser.ts` | Service Worker worker (development) |
| `src/mocks/server.ts` | Node server (Vitest — `src/__tests__/setup.ts`) |
| `src/components/feedback/MSWProvider.tsx` | Starts worker in dev only |
| `public/mockServiceWorker.js` | Generated MSW asset (see README) |

**Tests that exercise handlers:** `src/__tests__/hooks/api-handlers.test.ts`, `AuthContext.test.tsx`, plus domain tests.

---

## Technical expectations

| Expectation | Status | Evidence |
|-------------|--------|----------|
| React + TypeScript (Next accepted) | ✅ | Next.js 16 + TS; deviation documented in README |
| Component-driven architecture | ✅ | `src/components/{ui,layout,feedback,providers}` |
| Responsive & accessible UI | ✅ mostly | Responsive layouts; Chakra `Field`; `proxy.ts` + semantic landmarks |
| Frontend performance optimisation | ⚠️ Partial | Route splitting, `next/font`, skeletons; no Lighthouse report in repo |
| Backend integration knowledge | ✅ | HTTP contracts, auth headers, status codes, pagination — via MSW |
| Reusable scalable UI patterns | ✅ | Theme, StatCard, Badges, States, NextLink composition |
| Secure frontend coding practices | ⚠️ Partial | `toSafeUser`, `getUserIdFromToken`; cookie not HttpOnly (prod gap) |
| Error handling & resilience | ✅ | See objective 6 |
| Clean code structure | ✅ | Domain-aligned `mocks/handlers`, shared `types/`, lint + tsc |

### Design system & UI engineering

| Item | Status | Evidence |
|------|--------|----------|
| Typography & spacing system | ✅ | `src/styles/theme.ts`, Chakra tokens |
| Reusable buttons, forms, tables | ✅ | Chakra + `Field`, `Table`, shared components |
| Shared theme / token strategy | ✅ | `surface.*`, `fg.*`, semantic tokens |
| Accessible components & semantic HTML | ✅ mostly | `Field`, landmarks; sort headers could improve |
| Strong visual hierarchy | ✅ | Dark-first banking UI |
| Design system documentation (bonus) | ⚠️ | `docs/ARCHITECTURE.md`, theme file; no Storybook |
| Storybook (bonus) | ❌ | Not included |

### Performance & optimisation

| Item | Status | Evidence |
|------|--------|----------|
| Lazy loading / route splitting | ✅ | App Router per-page chunks |
| Optimised rendering patterns | ⚠️ | `useCallback` in hooks/context; mostly client components |
| Efficient state management | ✅ | Minimal global state |
| Avoid unnecessary re-renders | ⚠️ | `useWatch` on register; no measured audit |
| Lighthouse best practices | ❌ | Not documented in submission |

### Accessibility

| Item | Status | Evidence |
|------|--------|----------|
| Keyboard navigation | ✅ mostly | Links, forms, sidebar; transaction links fixed |
| Semantic HTML | ✅ | `main`, `nav`, `form`, `table` |
| Labels & ARIA | ✅ | `Field.*`; `aria-label` on nav/controls |
| Contrast & readability | ✅ | Dark theme + forced `.dark` on `<html>` |
| Focus management | ⚠️ | Focus visible on transaction links; room to improve globally |
| Screen reader basics | ✅ mostly | Named links for transactions; table semantics |

### Animations & micro-interactions

| Item | Status | Evidence |
|------|--------|----------|
| Smooth transitions | ✅ | Hover/focus on surfaces, buttons |
| Hover / focus states | ✅ | Throughout Chakra styling |
| Loading / skeletons | ✅ | List and dashboard loading |
| Motion enhances usability | ⚠️ | Subtle; not a primary focus |

### Engineering & collaboration

| Item | Status | Notes |
|------|--------|-------|
| Meaningful Git commits | ⚠️ | Confirm before submit |
| PR-style structure | ✅ | Clear module boundaries |
| Readability & maintainability | ✅ | |
| Thoughtful abstraction | ✅ | MSW utils, shared types |
| Separation of concerns | ✅ | handlers / data / UI / context |
| Clear documentation | ✅ | README, `docs/`, `diagrams/` |

### Testing

| Suggested area | Status | Location |
|----------------|--------|----------|
| Authentication flows | ✅ | `AuthContext.test.tsx`, `api-handlers.test.ts` |
| Form validation | ✅ | `validations.test.ts` |
| API integrations | ✅ | `api-handlers.test.ts`, MSW in `setup.ts` |
| E2E | ❌ | Not in repo |

### README requirements

| README section | Status | Location |
|----------------|--------|----------|
| Architecture decisions | ✅ | `README.md`, `docs/ARCHITECTURE.md` |
| Folder structure rationale | ✅ | `README.md` |
| State management | ✅ | `README.md`, `AuthContext` |
| Performance considerations | ✅ | `README.md` |
| Accessibility considerations | ✅ | `README.md` |
| How to run and test | ✅ | `README.md` |
| Brief deviation (stack) | ✅ | README “A note on the brief” |

### Submission extras

| Item | Status | Notes |
|------|--------|-------|
| Public GitHub repository | ⚠️ | Assumed; verify visibility |
| Deployment URL | ⚠️ | Add to README when live |
| README | ✅ | |

---

## Evaluation rubric (weighted) — quick scores

Overall **~80 / 100** (weighted rubric below).

| Category | Weight | Score (/100) | Weighted |
|----------|--------|--------------|----------|
| Frontend architecture | 20% | 82 | 16.4 |
| Responsive & accessible design | 15% | 80 | 12.0 |
| Performance optimisation | 15% | 74 | 11.1 |
| Design system thinking | 10% | 82 | 8.2 |
| Backend integration | 10% | 92 | 9.2 |
| Testing quality | 15% | 68 | 10.2 |
| Code maintainability | 10% | 86 | 8.6 |
| Documentation & communication | 5% | 92 | 4.6 |

---

## Stack deviation (documented)

| Brief suggestion | This submission |
|------------------|-----------------|
| React + Vite | **Next.js 16** App Router |
| Local JSON mock | **`mocks/data/*.ts`** + **MSW** at `/api/*` |
| — | **`src/proxy.ts`** for route protection (Next 16 convention) |

Rationale: [`README.md`](../README.md) section **“A note on the brief”**.

---

## Gaps to mention proactively in interview

1. **No `src/app/api/`** — intentional; MSW is the mock server (see top of this doc).
2. **No deployment URL in repo** — add before final submit.
3. **Session cookie** — JS-readable; production → HttpOnly + server session validation.
4. **`proxy.ts`** — checks cookie presence, not token validity at the edge.
5. **E2E / axe / Lighthouse** — not automated in CI.
6. **RSC** — described for production; take-home is client-rendered for scope.

---

## Related documentation

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — system design
- [`../diagrams/request-lifecycle.md`](../diagrams/request-lifecycle.md) — fetch → MSW flow
- [`../diagrams/auth-flow.md`](../diagrams/auth-flow.md) — login + `proxy.ts`
