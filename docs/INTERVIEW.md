# Interview & take-home assessment guide

Everything below is tied to **this repository** (Eagle Bank) and the **Frontend Engineering Take-Home** rubric. Use it to rehearse interviews, defend architectural choices, and understand where the submission is strong vs where reviewers will probe.

**Related docs:** [`REQUIREMENTS.md`](./REQUIREMENTS.md) (objective-by-objective traceability) · [`ARCHITECTURE.md`](./ARCHITECTURE.md) · [`CHANGELOG.md`](./CHANGELOG.md) · [`../diagrams/`](../diagrams/) · [`../README.md`](../README.md)

---

## Part A — Take-home rubric scorecard

### Weighted overall: **~79 / 100** (strong submission, clear senior path)

| Category | Weight | Score (0–100) | Weighted pts | One-line verdict |
|----------|--------|---------------|--------------|------------------|
| Frontend architecture | 20% | **82** | 16.4 | MSW boundary + App Router groups are production-minded; RSC underused |
| Responsive & accessible design | 15% | **80** | 12.0 | Solid responsive UI + `Field` forms; table nav fixed; no automated a11y |
| Performance optimisation | 15% | **74** | 11.1 | Splitting, fonts, skeletons; no Lighthouse proof; client-heavy |
| Design system thinking | 10% | **82** | 8.2 | Custom theme + reusable badges/cards; no Storybook |
| Backend integration | 10% | **92** | 9.2 | MSW exceeds “local JSON”; all required endpoints |
| Testing quality | 15% | **68** | 10.2 | Good unit/integration base; no E2E/a11y CI |
| Code maintainability | 10% | **86** | 8.6 | Clear folders, typed, lint clean |
| Documentation & communication | 5% | **92** | 4.6 | README + `docs/` + `diagrams/` + brief callout |
| **Total** | **100%** | — | **~80.3** | **Hire-range** for UI FE role if you can defend gaps honestly |

*Scores assume deployment URL + meaningful git history are provided at submission time (not verified in this doc).*

---

### Feature requirements vs implementation

| Requirement | Status | Where in repo | Interview talking point |
|-------------|--------|---------------|---------------------------|
| **1. Auth** — login, register, validation, loading, session, protected routes | ✅ Met | `(auth)/login`, `(auth)/register`, `AuthContext`, `src/proxy.ts` | Cookie via `js-cookie` (brief allows cookies); `proxy.ts` = Next 16 route guard |
| POST/GET auth endpoints | ✅ Met | `mocks/handlers/auth.ts` | Same handlers in Vitest via `mocks/server.ts` |
| **2. Dashboard** — welcome, balances, summary cards, recent txns, quick actions, empty | ✅ Met | `(app)/dashboard/page.tsx` | `GET /api/dashboard` |
| **3. Accounts** — savings/credit, number, balance, type, status, responsive | ✅ Met | `(app)/accounts/page.tsx`, `[id]/page.tsx` | Card grid + detail; `maskAccountNumber` |
| **4. Transactions** — filter, sort, pagination, detail, types | ✅ Met | `transactions/page.tsx`, `[id]/page.tsx` | Page-based pagination (not infinite scroll — either satisfies brief) |
| **5. Profile** — view/edit, avatar mock, validation | ✅ Met | `(app)/profile/page.tsx` | `PUT /api/profile`; `Field` + Zod |
| **6. Error handling** — API errors, empty, loading, retry, 404, boundary | ✅ Met | `ErrorState`, `EmptyState`, `error.tsx`, `not-found.tsx` | Per-page retry via `refetch` |
| Mock APIs (local JSON acceptable) | ✅ Exceeded | MSW + `mocks/data/*.ts` | Swappable without touching pages |
| Preferred React + TS | ✅ (Next.js accepted) | Whole stack | Documented deviation in README |
| Deployment URL | ⚠️ Confirm | — | Add Vercel/etc. link before submit |
| Meaningful git commits | ⚠️ Confirm | — | Squashed history looks weak in review |

---

### Per-category deep dive (what reviewers see)

#### 1. Frontend architecture (82/100)

**Strengths**
- **MSW at the Service Worker boundary** — pages call `fetch('/api/...')` exactly as they would in production; handlers in `mocks/handlers/` mirror domains (auth, accounts, transactions, dashboard-profile).
- **Route groups** — `(auth)` vs `(app)` separates public shell from sidebar shell (`app/(app)/layout.tsx`).
- **`src/proxy.ts`** — Next.js 16 convention (`proxy` export); cookie presence check + redirect with `?redirect=` (real-world pattern for deep links after login).
- **Thin global state** — `AuthContext` + `ToastContext` only; page data stays in `useFetch` / local filter state (scalable mental model).

**Gaps (say these out loud)**
- Almost everything is `"use client"` — you **describe** server/client split in interviews but didn’t implement RSC for initial PII loads in the take-home.
- No Next.js Route Handlers — intentional; MSW is the BFF substitute for this exercise.
- Custom `useFetch` — fine for take-home; production → TanStack Query + server fetch for first paint.

**Real-world analogy (UBS / banking)**  
At a bank, the frontend rarely talks to core systems directly. You’d have a **channel API** or BFF. MSW is your stand-in for that contract: same URLs, same auth header shape, same error JSON — so when the real channel API lands, you swap the worker off, not fifty pages.

**Sound bite**  
> “Architecture here optimizes for **contract stability**: MSW is the API boundary, App Router is the navigation boundary, and `proxy.ts` is the session boundary at the edge.”

---

#### 2. Responsive & accessible design (80/100)

**Strengths**
- Responsive grids on dashboard, accounts (cards), profile (two-column on `lg`).
- **Chakra v3 `Field`** on login, register, profile — `aria-invalid` / `aria-describedby` wired without manual duplication.
- Semantic regions: `main` with `aria-label`, sidebar nav with `aria-current="page"`.
- Dark theme with forced `.dark` on `<html>` — fixes Chakra `_light` default (real bug you can tell as a story).
- **Transactions table** — primary cell is now a real link via `NextLinkBox` (keyboard + SR friendly); fixed from `window.location.href` on the row.

**Gaps**
- Sortable column headers use `onClick` on `Table.ColumnHeader` — not ideal for keyboard; production: `<button>` inside header or `aria-sort`.
- No axe/Playwright a11y in CI.
- Micro-interactions are subtle (hover on surfaces) — brief asked for motion; you have skeletons/transitions but not rich motion design.

**Real-world example — the table row bug**  
**Before:** `onClick={() => window.location.href = '...'}` on `<Table.Row>` — mouse-only, full reload, no link in accessibility tree.  
**After:** `NextLinkBox href={/transactions/${id}}` wrapping description + `aria-label={`View transaction: ${description}`}` — Tab focuses each row’s link; screen reader hears “link, View transaction: …”; client-side navigation via Next.js.

**WCAG talking point**  
Banking tables often fail **2.1.1 Keyboard** and **4.1.2 Name, Role, Value**. A row that looks clickable but isn’t a focusable control is a common audit finding — fixing it with a named link is the standard remediation.

---

#### 3. Performance optimisation (74/100)

**Strengths**
- App Router **automatic route splitting** per page.
- **`next/font`** — DM Sans + JetBrains Mono, `display: swap`.
- **Skeletons** on dashboard, accounts, transactions (layout stability vs spinners).
- `useCallback` in `useFetch` and auth actions; `lineClamp` vs deprecated patterns.
- Turbopack `root` pinned — avoids wrong workspace resolution (dev perf).

**Gaps**
- No reported Lighthouse scores or bundle analysis.
- Client-side fetch waterfall on every protected page mount (no RSC cache).
- Chakra runtime cost — acceptable for take-home; at scale you’d measure and possibly lazy-load heavy routes.
- `recharts` was removed as unused — good bundle hygiene.

**Real-world example**  
A payments dashboard at a bank might budget **LCP < 2.5s** on 4G. Today Eagle Bank ships a large client bundle because pages are client components. Production plan: server-render dashboard stats HTML, hydrate only the “recent transactions” interactive strip, pass `initialData` into TanStack Query to avoid double fetch.

**Sound bite**  
> “I optimized for **perceived performance** in the take-home — skeletons and route-level splitting. For production I’d add **measured** budgets: Lighthouse CI on login and dashboard, bundle analyzer on Chakra imports.”

---

#### 4. Design system thinking (82/100)

**Strengths**
- **`src/styles/theme.ts`** — `surface.0–4`, semantic `fg`, `brand`, `positive`, `negative` tokens.
- Reusable **`StatCard`**, **`Badges`** (transaction type, status, account), **`PageHeader`**, **`States`** (empty/error), **`NextLinkBox`/`NextLinkButton`** (composition with `asChild`).
- Consistent form styling via shared `inputStyles` pattern on auth/profile.

**Gaps**
- No Storybook (bonus only).
- No separate `components/forms/Field` wrapper — inline `FormField` duplicated on profile/register (minor DRY gap).

**Real-world example**  
At UBS-scale, you’d publish tokens to **Figma + code** (Style Dictionary or Chakra recipes). This repo is a **mini design system**: one theme file + slot recipes mindset (Chakra v3 `Field`, `Select` anatomy). Interview line: “I’d extract `FormField` to `components/forms/Field.tsx` and add Storybook stories for Field states: default, invalid, disabled.”

---

#### 5. Backend integration (92/100)

**Strengths**
- All required mock endpoints implemented with realistic delays (400–800ms).
- Auth token format + **`getUserIdFromToken`** — shows you’ve been burned by naive string splits.
- **`toSafeUser`** — never leak `passwordHash` (secure coding awareness).
- Paginated transactions response matches `PaginatedResponse<T>` type.

**Gaps**
- Not “local JSON file” literally — **better** than brief, but explain why in README (already done).

**Real-world example**  
When integrating a real **Open Banking** or internal REST API, you’d keep handler files as **contract documentation**: rename `mocks/handlers/accounts.ts` → contract tests, add Pact against staging. MSW stays for local dev and storybook.

---

#### 6. Testing quality (68/100)

**What exists**

| Test file | Covers |
|-----------|--------|
| `validations.test.ts` | Zod login/register/profile |
| `utils.test.ts` | Currency, dates, masks, labels |
| `token.test.ts` | `getUserIdFromToken` edge cases |
| `api-handlers.test.ts` | MSW handler contracts |
| `useFetch.test.ts` | Hook behavior |
| `AuthContext.test.tsx` | Login flow with MSW |
| `Badges.test.tsx`, `StatCard.test.tsx` | UI components |

**Gaps**
- No page-level RTL tests (dashboard render with MSW).
- No Playwright E2E (login → dashboard → filter → detail).
- No axe in CI.
- Auth **protected route** behavior (`proxy.ts`) not automated.

**Real-world week-one plan**  
Day 1–2: Playwright smoke — login, redirect when logged out, dashboard loads. Day 3: axe on login + transactions. Day 4: CI gate `pnpm test && pnpm exec tsc --noEmit && pnpm lint`.

**Sound bite**  
> “Tests prove **contracts and security helpers** (token parsing, validations). E2E proves **journeys** — that’s what I’d add first before launch.”

---

#### 7. Code maintainability (86/100)

**Strengths**
- Domain-aligned `mocks/handlers/`, shared `mocks/utils/`.
- Single `types/index.ts` for domain models.
- ESLint 9 flat config, TypeScript strict path.
- No dead `recharts` / framer-motion / unused route handlers.

**Gaps**
- Duplicated `FormField` helper (profile + register).
- Some pages are large (dashboard ~380 lines) — could split subcomponents.

---

#### 8. Documentation & communication (92/100)

**Strengths**
- README: architecture, folder structure, perf, a11y, run/test.
- **Brief deviation callout** — React+Vite vs Next+MSW (critical for reviewers).
- `docs/ARCHITECTURE.md`, `CHANGELOG.md`, `diagrams/*.md`.

**Gaps**
- Add **deployment URL** prominently in README when live.
- Optional: link to this `INTERVIEW.md` for reviewers who want depth.

---

## Part B — The 90-second pitch (memorise)

> Eagle Bank is a **Next.js 16** banking dashboard in **TypeScript**. The brief suggested React + Vite with local JSON; I chose **Next.js + MSW** so I could show a **production-style API boundary** and **route protection** via `proxy.ts`, with a path to server-side auth and PII handling banks require.  
>  
> Every page calls `fetch('/api/...')`; **MSW** intercepts at the Service Worker (and the same handlers run in **Vitest** on Node). Auth uses a **cookie** session, global state is only **Auth + Toast** via Context, forms are **react-hook-form + Zod**, UI is **Chakra v3** with a dark theme and **`Field`** for accessible forms.  
>  
> I’d take it to production by: **HttpOnly cookies**, server-side data fetching for PII, **TanStack Query** for client mutations and cache, **E2E + axe**, and keeping **`proxy.ts` thin**.

---

## Part C — Production roadmap (prioritised)

### P0 — Security & correctness
| Item | Today | Production (bank-grade) |
|------|-------|-------------------------|
| Session token | `js-cookie`, JS-readable | `HttpOnly`, `Secure`, `SameSite`, short TTL |
| Route guard | `proxy.ts` checks cookie exists | Same + server validates session on data routes |
| API calls | `Authorization: Bearer` from client | Same-origin BFF; cookie auto-sent; no token in JS |
| CSRF | `SameSite=strict` on set only | CSRF token / custom header on mutations |
| PII exposure | Full lists client-fetched | Server pagination + DTO shaping in DAL |

**Real-world war story to cite**  
“If an XSS payload runs in the browser and the session token is in `document.cookie` readable form, the attacker can call `/api/profile` as the user. HttpOnly doesn’t stop XSS entirely but removes **direct token exfiltration** — standard control for retail banking web apps.”

### P1 — Reliability
- TanStack Query: dedup, retry, `invalidateQueries` after profile update.
- Sentry in `error.tsx` + server logging.
- Playwright + axe in CI.
- Hydrate query cache from RSC `initialData` to avoid double fetch.

### P2 — Scale & polish
- i18n / multi-currency.
- Storybook for `Field`, `StatCard`, badges.
- Lighthouse budgets on PRs.
- Feature flags for risky flows (e.g. transfers).

---

## Part D — Interview Q&A with real-world examples

### D.1 Why Next.js instead of React + Vite?

**Weak answer:** “Next is better.”  
**Strong answer:**  
“The brief allowed any framework. I chose Next because **banks care about where secrets live**. With Next I can put auth verification and PII fetch on the server in production while keeping filters and forms on the client. Vite SPAs default to ‘everything in the bundle.’ I didn’t implement full RSC in the take-home for time, but the **framework choice** matches where I’d deploy Eagle Bank for real.”

**Follow-up:** “Show me in the code.”  
→ Point to `src/proxy.ts`, `AuthContext` cookie, README callout, `docs/ARCHITECTURE.md` server/client table.

---

### D.2 Walk through auth end-to-end (as implemented)

1. User submits login → `AuthContext.login` → `POST /api/auth/login` (MSW).
2. MSW returns `{ user, token }` → `Cookies.set('eagle_bank_token', …)`.
3. User navigates to `/dashboard` → **`proxy.ts`** sees cookie → allows.
4. Dashboard `useFetch('/api/dashboard')` → reads cookie → `Authorization: Bearer mock_token_…` → handler uses `getUserIdFromToken`.
5. Refresh: mount → `GET /api/auth/me` rehydrates session.

**Production delta:** steps 2 and 4–5 use HttpOnly cookie only; client never sets Bearer manually.

---

### D.3 RSC + TanStack Query (the “both” question)

| Layer | Responsibility | Eagle Bank example |
|-------|----------------|-------------------|
| **RSC / server** | First paint, PII, authz, pagination totals | Dashboard stats + first 10 transactions HTML |
| **URL searchParams** | Sharable filter state | `?type=deposit&page=2` → server re-render |
| **TanStack Query** | Post-hydration cache, mutations, polling | Profile `PUT` with optimistic UI; balance poll every 30s |

**Banking rule:** never fetch 50 transactions to show 20 client-side (data minimization). Server returns `limit=20`; Query caches **that page** only.

**Hydration one-liner:**  
`dehydrate(queryClient)` on server, `HydrationBoundary` on client — filters don’t refetch blindly after hydration.

---

### D.4 Security deep-dive (model answers)

**Q: Biggest hole today?**  
A: JS-readable session cookie + `proxy.ts` doesn’t validate token — only checks existence. XSS could steal token; expired/forged cookie still passes edge until API 401.

**Q: Profile save with HttpOnly?**  
A: `POST /api/profile` route handler; browser sends cookie; server reads `cookies()`, calls core API with service credential from vault; returns DTO. Client form stays react-hook-form; no `Authorization` header in browser code.

**Q: CSRF?**  
A: `SameSite=Strict` + CSRF token on mutating routes, or `X-Requested-With` / custom header pattern on BFF.

---

### D.5 Accessibility (model answers + this repo)

| Pattern | Good example in repo | Fix / gap |
|---------|---------------------|-----------|
| Labels | `Field.Label` + `htmlFor` on login/profile | — |
| Errors | `Field.ErrorText` + `invalid` on root | — |
| Landmarks | `main`, `nav`, `aria-current` | — |
| Table navigation | `NextLinkBox` on transaction description | Was `window.location` on row — **fixed** |
| Sortable headers | Clickable `ColumnHeader` | Use `<button>` + `aria-sort` in prod |
| Focus | Chakra `_focusVisible` on transaction link | Extend to all custom controls |

**axe first three URLs:** `/login`, `/dashboard`, `/transactions`.

---

### D.6 Testing pyramid (model answer)

```
        ┌─────────────┐
        │  E2E few    │  Playwright: login journey, proxy redirect
        ├─────────────┤
        │ Integration │  AuthContext + MSW server, handlers
        ├─────────────┤
        │  Unit many  │  Zod, token.ts, utils, badges
        └─────────────┘
```

**First test I’d add:**  
`e2e/auth.spec.ts` — visit `/dashboard` unauthenticated → lands on `/login?redirect=%2Fdashboard` → login with demo creds → sees welcome text.

---

### D.7 Live design: “Transfer money” (60-second structure)

1. **Route:** `/accounts/[id]/transfer` — 3 steps: details → review → result.  
2. **Server:** load account + beneficiaries (RSC). **Client:** stepped form (Zod).  
3. **Mutation:** `POST /api/transfers` route handler, idempotency key, server-side balance check.  
4. **UI:** TanStack `useMutation`; invalidate transactions + account queries.  
5. **Bank controls:** step-up auth above threshold; audit log server-side.  
6. **Tests:** Zod unit; MSW 402 insufficient funds; E2E happy path.

---

### D.8 Behavioral: disagreeing with the spec

**What you did:** README “A note on the brief” — explicit deviation, rationale, MSW vs JSON, Next vs Vite.  
**What you’d do on the job:** raise in refinement/sizing; if deadline forbids, document ADR and ship smallest compliant slice, or negotiate scope.  
**Senior signal:** “My job isn’t only to build — it’s to **align build choices with risk**, especially in regulated environments.”

---

### D.9 Mistakes that are OK to admit

| Mistake | Recovery narrative |
|---------|-------------------|
| Claimed BFF benefits before implementing server fetch | “I corrected to: framework enables it; take-home is client-only for scope.” |
| `middleware` vs `proxy` | “I verified Next 16 docs and reverted; now I research before changing conventions.” |
| Light table in dark app | “Traced Chakra `_dark` / `.dark` class — fixed at root.” |
| Table row not keyboard accessible | “Code review caught it — link in primary cell pattern.” |

---

## Part E — Mock interview scorecard (how *you* performed in practice)

Based on the role-play session in this project (not the code alone):

| Dimension | Rating | Notes |
|-----------|--------|-------|
| Opening pitch | **B+** | UBS context strong; initially contradicted server vs client — recovered well |
| Architecture depth | **A-** | URL params + route handlers + RSC/Query split after coaching |
| Security fluency | **B+ → A-** | Strong once prompted on HttpOnly, CSRF, data minimization |
| Accessibility awareness | **B** | Knew Field patterns; missed table bug until pointed at code |
| Testing narrative | **B** | Pyramid clear; needed prompting on E2E first |
| Collaboration / judgment | **A-** | Pushback calibrated to team/time; senior “guide decisions” framing |
| Honesty / self-awareness | **A** | Placeholder `useFetch`, take-home tradeoffs |

**Overall interview performance:** **Strong hire with coaching** — you absorb pushback and refine answers; lead with honesty about gaps before the interviewer finds them.

**To sound “strong hire” in the room:** open with current-state vs production-target; cite **file paths**; end security answers with banking impact (XSS, audit, data minimization).

---

## Part F — Rapid-fire crib sheet

| Question | Answer |
|----------|--------|
| Why MSW? | Same `fetch` in dev/test/prod; swap worker off for real API |
| Why cookies? | `proxy.ts` can read them; brief allows; prod → HttpOnly |
| Why not Redux? | Only auth + toasts global; rest is server/cache state |
| Why Zod? | Single schema → types + tests + Field errors |
| Why skeletons? | CLS + perceived speed on 400–800ms mock delay |
| Why pnpm? | Fast CI, strict deps, pinned in `packageManager` |
| Biggest prod risk? | Session token exposed to JS |
| First E2E test? | Unauthenticated dashboard redirect |
| Chakra dark bug? | Missing `.dark` on `<html>` → `_light` won |

---

## Part G — Pre-interview checklist

- [ ] Deployment URL in README
- [ ] Rehearse Part B pitch (90s)
- [ ] Walk code: `proxy.ts` → `AuthContext` → `useFetch` → `mocks/handlers/auth.ts`
- [ ] Explain MSW vs “JSON in public/”
- [ ] Admit RSC not implemented; describe production split
- [ ] Mention transaction link fix (`NextLinkBox` + `aria-label`)
- [ ] Run `pnpm test` / `pnpm lint` before interview
- [ ] Optional: one Lighthouse screenshot on dashboard

---

*Last updated after: transaction table a11y fix (`NextLinkBox`), README brief callout, rubric alignment.*
