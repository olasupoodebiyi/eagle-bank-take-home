# Eagle Bank — Frontend Engineering Take-Home

A production-grade banking frontend built with **Next.js 16**, **TypeScript**, **Chakra UI v3**, and **MSW v2**. Dark-first modern fintech aesthetic.

---

## A note on the brief

The brief suggested **plain React + Vite with a local JSON file** standing in for the server. I made a deliberate, documented choice to deviate:

- **Next.js 16 over React + Vite** — for a banking app the most valuable property is a clear **server/client boundary**: auth, mutations, and PII fetching can sit behind an opaque server (reading backend tokens from a secrets manager) while interactive UI stays on the client. Vite/React is client-only by default, so it can't demonstrate that boundary. *(For transparency: this take-home keeps things client-rendered for simplicity — the Next.js choice is about the production architecture it enables, which is described in [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).)*
- **MSW over a static JSON file** — MSW intercepts real `fetch` calls at the Service Worker boundary, so application code is identical to running against a real API and the mock is swappable with zero component changes. The same handlers are reused in tests via the Node adapter.

If this were a real ticket rather than a take-home, I'd have raised this deviation in spec/sizing before building. Flagging it here in writing is the take-home equivalent.

---

## Quick start

```bash
# Install dependencies
pnpm install

# Copy the MSW service worker to /public (run once)
pnpm exec msw init public/ --save

# Start development server
pnpm dev

# Production preview (MSW runs automatically — there is no real /api backend)
pnpm build && pnpm start
```

Open [http://localhost:3000](http://localhost:3000). You'll be redirected to `/login`.

**Note:** All `/api/*` traffic is mocked by MSW in the browser (dev and `pnpm start`). Set `NEXT_PUBLIC_API_URL` when you connect a real backend; set `NEXT_PUBLIC_ENABLE_MSW=false` to disable the worker explicitly.

**Stuck on “Starting mock API…” or blank page?** In Chrome DevTools → Application → Service Workers → unregister `localhost`, then hard-refresh (Ctrl+Shift+R). Stale workers from an earlier build often block MSW from starting.

**Demo credentials**
- Email: `alex.morgan@example.com`
- Password: `password123`

---

## Running tests

```bash
# Run all tests once (CI)
pnpm test:run

# Watch mode
pnpm test

# Coverage report
pnpm test:coverage
```

---

## Testing strategy (TDD)

This repository's **git history is intentional test-driven development**. Commits alternate `test:` (specify behavior) and `feat:` / `fix:` (minimal implementation) so reviewers can follow how the app was built:

1. **Contract tests** for all `/api/*` endpoints before MSW handlers.
2. **Unit tests** for Zod validation and formatters before forms consume them.
3. **AuthContext tests** before login/register UI.
4. **React Testing Library tests** before each major page (dashboard, accounts, transactions, profile).
5. **Regression tests** before security and accessibility fixes (token parsing, `passwordHash` stripping, keyboard-accessible transaction links, dark mode on `<html>`).

Run `pnpm test:run` after each phase; `pnpm build` confirms Next.js 16 Cache Components and dynamic routes prerender cleanly.

---

## Architecture decisions

### Next.js 16 App Router

The App Router provides native route-level code splitting, streaming, and `proxy.ts` — the Next.js 16 successor to `middleware.ts` — for route protection at the network boundary (`src/proxy.ts` redirects unauthenticated requests to `/login`).

Route groups keep concerns separated:
- `(auth)/` — login and register, no shell UI
- `(app)/` — authenticated pages with sidebar layout

There are **no Next.js Route Handlers** — every `/api/*` call is intercepted by MSW (see below), so the network layer is a single, swappable mock.

### State management: Context + useReducer

Deliberately kept lightweight. Three contexts:
- **AuthContext** — user session, token, login/logout/register actions. Persists via `js-cookie` (HttpOnly-equivalent pattern for mock purposes). Rehydrates on mount via `GET /api/auth/me`.
- **ToastContext** — global notification queue with auto-dismiss.
- **MSWProvider** — lazy-loads the MSW service worker client-side only in development.

No external state library was needed: data is server-fetched per page via `useFetch`, and auth state is the only truly shared global state.

### Mock API: MSW v2

Mock Service Worker intercepts real `fetch` calls at the Service Worker level. This means:
- The app code doesn't know it's talking to mocks — same fetch calls work in dev and would work against a real API
- Tests use the same handler definitions via `setupServer` (Node adapter)
- No code changes required when replacing mocks with a real backend

Handlers are split by domain: `auth.ts`, `accounts.ts`, `transactions.ts`, `dashboard-profile.ts`. Each supports realistic delays (400–800ms) to exercise loading states.

### Chakra UI v3

Used as the design system foundation. Extended with a custom theme in `src/styles/theme.ts`:
- **Surface hierarchy**: `surface.0` → `surface.4` for layered depth
- **Semantic tokens**: `bg`, `fg`, `border`, `accent`, `positive`, `negative` — all dark-mode aware
- **Brand palette**: deep indigo/violet with emerald accents for positive values, coral for negative
- **Typography**: DM Sans (body/UI) + JetBrains Mono (financial figures)

### Form handling: react-hook-form + Zod

All forms use `react-hook-form` with `zodResolver`. Schemas live in `src/lib/validations.ts` and are tested independently. This approach gives:
- Type-safe form values derived from Zod schemas
- Per-field validation via Chakra UI v3 `Field` (`Field.Root` / `Field.Label` / `Field.ErrorText`), which auto-wires `aria-invalid` and `aria-describedby`
- Password strength indicator on register (real-time, no re-render thrash)

---

## Folder structure

```
src/
├── app/
│   ├── (auth)/           # Login, register — no shell
│   │   ├── layout.tsx    # Split-panel auth layout
│   │   ├── login/
│   │   └── register/
│   ├── (app)/            # Protected pages — sidebar shell
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   ├── accounts/[id]/
│   │   ├── transactions/[id]/
│   │   └── profile/
│   ├── error.tsx         # Root error boundary
│   ├── not-found.tsx     # 404 page
│   └── layout.tsx        # Root layout — providers, fonts
├── proxy.ts              # Route protection (Next.js 16; redirects unauthenticated users)
├── components/
│   ├── ui/               # Design system: StatCard, Badges, NextLink
│   ├── layout/           # Sidebar, PageHeader
│   ├── providers/        # Client provider tree (Chakra, Auth, Toast, MSW)
│   └── feedback/         # States (empty/error/skeleton), Toast, MSWProvider
├── context/
│   ├── AuthContext.tsx   # Auth state + actions
│   └── ToastContext.tsx  # Global notifications
├── hooks/
│   └── useFetch.ts       # Generic authenticated data fetching
├── lib/
│   ├── utils.ts          # Currency, date, masking formatters
│   └── validations.ts    # Zod schemas
├── mocks/
│   ├── browser.ts        # MSW browser worker setup
│   ├── server.ts         # MSW Node server (tests)
│   ├── handlers/         # Per-domain request handlers
│   └── data/             # Seed data
├── styles/
│   └── theme.ts          # Chakra UI custom theme
└── types/
    └── index.ts          # All shared TypeScript types
```

---

## Performance considerations

- **Route splitting**: Every page is a separate chunk via App Router conventions. No manual dynamic imports needed.
- **Font optimisation**: Next.js `next/font/google` loads DM Sans and JetBrains Mono with `display: swap` and zero layout shift.
- **Skeleton loading**: All data-fetching pages show skeleton placeholders (not spinners) to avoid layout shifts while content loads.
- **No unnecessary re-renders**: `useFetch` is memoised with `useCallback`. Auth actions in `AuthContext` use `useCallback` to prevent child re-renders. Form state stays local to each form.
- **Turbopack** (Next.js 16 default): Up to 5–10× faster Fast Refresh in development, 2–5× faster production builds.
- **Staggered skeleton animations**: Each skeleton card uses a CSS animation delay to avoid the "blinking wall" effect.

---

## Accessibility

- **Semantic HTML**: `<main>`, `<nav>`, `<form>`, `<table>` with proper roles. `aria-label` on all landmark regions.
- **Keyboard navigation**: All interactive elements are focusable. Sidebar uses `aria-current="page"` on the active link.
- **Form accessibility**: Every input has an associated `<label>` via `htmlFor`. Validation errors use `aria-invalid`, `aria-describedby`, and `role="alert"`.
- **Screen reader compat**: Loading states use `aria-busy="true"`. Avatar fallback renders initials. Icon-only buttons have `aria-label`.
- **Focus management**: Modal and toast interactions preserve focus context.
- **Colour contrast**: All text colours meet WCAG AA on the dark surface palette. Financial figures use high-contrast emerald/coral rather than grey.

---

## Features implemented

| Feature | Details |
|---|---|
| Authentication | Login, register, logout, session rehydration via cookie |
| Route protection | `src/proxy.ts` redirects unauthenticated requests |
| Dashboard | Stats, recent transactions, accounts summary, quick actions |
| Accounts | Card grid, detail page, masked account numbers |
| Transactions | Filterable table (date range, type), sortable (date/amount), paginated |
| Transaction detail | Full detail view with amount hero |
| Profile | Edit form with real-time validation, avatar preview upload |
| Error handling | Error boundary, per-page error state with retry, 404 page |
| Empty states | All list views handle zero-result gracefully |
| Loading states | Skeleton placeholders on all async views |
| Toasts | Global notification system (success, error, warning, info) |

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI library | Chakra UI v3 |
| Forms | react-hook-form + Zod |
| Mock API | MSW v2 |
| Testing | Vitest + React Testing Library |
| Fonts | DM Sans + JetBrains Mono (via next/font) |
| Icons | Lucide React |
| Date formatting | date-fns |

---

## Extending with a real backend

Replace MSW with real API calls:

1. Remove `MSWProvider` from the provider tree (`src/components/providers/Providers.tsx`)
2. Update `useFetch` base URL or add a `NEXT_PUBLIC_API_URL` env var
3. Switch cookie strategy to `HttpOnly` server-set cookies
4. Replace the `src/proxy.ts` token check with a server-side session validation call

No changes needed to page components — they consume `useFetch` and `authFetch` which are already abstracted.

---

## Deployment

Production build verified with `pnpm build` and `pnpm test:run` (Next.js 16, Turbopack, Cache Components). Deploy the output of `next build` to any Node-compatible host; set `NEXT_PUBLIC_*` only when swapping MSW for a real API.

**Live demo:** _Add URL after deploy (e.g. Vercel preview)._

---

## Documentation & diagrams

- [`docs/`](./docs) — architecture and [`docs/REQUIREMENTS.md`](./docs/REQUIREMENTS.md) (brief ↔ code traceability)
- [`diagrams/`](./diagrams) — Mermaid diagrams (system architecture, request lifecycle, auth flow, routes)
