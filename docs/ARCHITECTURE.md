# Architecture

Eagle Bank is a client-rendered banking dashboard built on the Next.js 16 App Router. There is **no real backend** — the entire network layer is mocked with MSW (Mock Service Worker), which intercepts `fetch` at the Service Worker boundary. This keeps the application code identical to what it would be against a production API, so the mock can be swapped for a real server with no changes to page components.

## Layers

```
┌──────────────────────────────────────────────────────────┐
│  Pages  (app/(auth)/*, app/(app)/*)                        │  React Server/Client components
├──────────────────────────────────────────────────────────┤
│  UI + Layout  (components/ui, layout, feedback)            │  Chakra UI v3 design system
├──────────────────────────────────────────────────────────┤
│  State  (context/AuthContext, ToastContext)                │  Context + useReducer
├──────────────────────────────────────────────────────────┤
│  Data access  (hooks/useFetch, authFetch)                  │  fetch + cookie auth header
├──────────────────────────────────────────────────────────┤
│  Network boundary  (Service Worker)                        │  MSW intercepts here
├──────────────────────────────────────────────────────────┤
│  Mock API  (mocks/handlers + mocks/data)                   │  In-memory stores, realistic delays
└──────────────────────────────────────────────────────────┘
```

The same handler definitions are reused by the Node adapter (`mocks/server.ts`) in tests, so unit/integration tests exercise the exact request logic that runs in the browser.

## Key decisions

### Next.js 16 App Router + Turbopack
Route-level code splitting and streaming come for free. `turbopack.root` is pinned in `next.config.ts` so Turbopack doesn't mistake a parent `package-lock.json` for the workspace root. Route groups separate the public auth shell (`(auth)`) from the authenticated app shell (`(app)`).

### Route protection via `src/proxy.ts`
Next.js 16 renamed the `middleware.ts` convention to **`proxy.ts`** (exported function `proxy`), so route protection lives in `src/proxy.ts`. It reads the `eagle_bank_token` cookie and redirects:
- unauthenticated requests to protected routes → `/login?redirect=<path>`
- authenticated requests hitting `/login` or `/register` → `/dashboard`

It lives in `src/` (alongside `app/`) because the app uses a `src/` directory, and runs on the Node.js runtime (the Next.js 16 default for `proxy.ts`). The matcher excludes static assets and `mockServiceWorker.js`.

### State: Context + useReducer (no external store)
Only auth/session and the toast queue are truly global, so a state library would be overkill.
- **AuthContext** — session state machine (`useReducer`), persisted via `js-cookie`, rehydrated on mount through `GET /api/auth/me`.
- **ToastContext** — global notification queue with auto-dismiss.
- **MSWProvider** — starts the MSW worker on the client in development only.

Per-page data is fetched with the generic `useFetch<T>` hook (memoised with `useCallback`); mutations use `authFetch<T>`. Both attach the bearer token from the cookie automatically.

### Chakra UI v3 design system
A custom dark-first theme (`src/styles/theme.ts`) defines a layered `surface.0–4` hierarchy plus semantic tokens (`bg`, `fg`, `border`, `accent`, `positive`, `negative`). Forms use the v3 `Field` primitive for accessible label/error wiring, and composition uses the `asChild` pattern (e.g. `NextLinkBox`/`NextLinkButton` wrapping `next/link`).

> **Dark mode:** Chakra v3 resolves `_dark` styles only when a `.dark` class is present on an ancestor (`_light` = `:root &` is otherwise always active). Because this app is dark-only, `<html>` is given `className="dark"` and `colorScheme: "dark"` in `app/layout.tsx`. Without this, components like `Table` render with light-mode tokens.

### Forms: react-hook-form + Zod
Schemas in `src/lib/validations.ts` are the single source of truth; form value types are inferred from them. `register` uses `useWatch` where live values are needed (avoids React Compiler re-render warnings).

### Mock API: MSW v2
Handlers are split by domain (`auth`, `accounts`, `transactions`, `dashboard-profile`). Shared helpers live in `mocks/utils/`:
- `token.ts` — parses the user id out of `Bearer mock_token_<userId>_<timestamp>` safely.
- `user.ts` — strips `passwordHash` before returning user objects.

## Tooling
- **Package manager:** pnpm (`packageManager` pinned; `onlyBuiltDependencies` allow-lists native build scripts).
- **Lint:** ESLint 9 flat config (`eslint.config.mjs`) using `eslint-config-next` (Next.js 16 removed `next lint`).
- **Tests:** Vitest + React Testing Library, with MSW's Node server wired up in `src/__tests__/setup.ts`.
