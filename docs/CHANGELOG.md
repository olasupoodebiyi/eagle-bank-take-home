# Engineering changelog

A record of the work done on this project, grouped by theme. This is the "what we did and why" companion to [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## 1. Environment & tooling
- Pinned the Node version with `.nvmrc` (Node 22).
- Migrated the package manager from npm to **pnpm**: set `packageManager: pnpm@10.3.0` and added `pnpm.onlyBuiltDependencies` to allow native build scripts for `esbuild`, `msw`, `sharp`, and `unrs-resolver`. Updated the README commands accordingly.

## 2. Next.js 16 startup fixes
- **`accordionAnatomy.extendWith is not a function`** — caused by Turbopack misidentifying the workspace root (a parent `package-lock.json`) and by the Chakra theme being evaluated on the server. Fixed by pinning `turbopack.root` in `next.config.ts` and moving Chakra/Auth/Toast/MSW providers into a client-only `Providers.tsx`.
- **MSW "Failed to register a Service Worker"** — the generated worker was missing. Fixed by running `pnpm exec msw init public/ --save` and committing `public/mockServiceWorker.js`.

## 3. Dashboard "Something went wrong"
- Mock handlers were parsing the user id from the auth token incorrectly (`auth.split("_")[2]`). Added `mocks/utils/token.ts` (`getUserIdFromToken`) for robust parsing of `Bearer mock_token_<userId>_<timestamp>` and threaded it through every handler.
- Added `mocks/utils/user.ts` (`toSafeUser`) to strip `passwordHash` from responses cleanly (also removed the related unused-variable lint warnings).

## 4. Linting on Next.js 16
- Next.js 16 removed `next lint`. Moved to the **ESLint CLI flat config** (`eslint.config.mjs`) built on `eslint-config-next` (`core-web-vitals` + `typescript`), with `public/mockServiceWorker.js` added to `globalIgnores`.
- Updated the `lint` / `lint:fix` scripts to call `eslint .` directly.

## 5. Chakra UI v3 migration (verified against the v3 docs)
- **`Field` for forms** — replaced ad-hoc `Box asChild` + `<label>` + `Text` error markup with the v3 `Field` primitive (`Field.Root` / `Field.Label` / `Field.ErrorText`) on the login, register, and profile forms. This auto-wires `aria-invalid` / `aria-describedby`, so the manual ARIA props were removed.
- **`Select` anatomy** — completed the v3 Select on the transactions page: added `Select.IndicatorGroup` + `Select.Indicator` and portalled `Select.Positioner`. Static options use `createListCollection`.
- **Breaking-change fixes** — `Button` icons moved to children (no `leftIcon`); `Text` no longer takes `htmlFor`; `noOfLines` → `lineClamp`; `Box` `justify` → `justifyContent`.
- **Composition** — `NextLinkBox` / `NextLinkButton` wrap `next/link` via `asChild` to satisfy "functions can't be passed to Client Components".
- **Theme** — added `"use client"` to `theme.ts` and applied vendor-prefixed font-smoothing via a `satisfies Record<string, string>` spread to stay type-safe.

## 6. Dark mode fix (unreadable Table)
- The transactions table rendered light with low-contrast text because the app had **no color-mode setup**, so Chakra's `_light` condition (`:root &`, always active) won. Forced dark mode by adding `className="dark"` and `style={{ colorScheme: "dark" }}` to `<html>` in `app/layout.tsx`. This corrected the `Table`, `Select` dropdown, and any other components relying on `_dark` tokens.

## 7. Dead-code cleanup
- **Route protection** — the request interceptor lives in `src/proxy.ts`. Next.js 16 renamed the `middleware.ts` convention to `proxy.ts` (exported function `proxy`, Node.js runtime by default), and with a `src/` directory the file belongs in `src/`. The guard redirects unauthenticated users to `/login` and bounces already-signed-in users away from the auth pages.
- **Removed unused dependencies** — `recharts`, `framer-motion`, and `@emotion/styled` (none imported anywhere). Kept `@emotion/react` because it is a required Chakra UI v3 peer dependency.
- **Removed unused exports** — type exports `AuthResponse`, `TransactionFilters`, `ProfileUpdatePayload`, `ApiError`; and the unused utilities `formatRelativeDate` and `cn`.
- **Documentation accuracy** — corrected the README to match reality: removed references to non-existent `api/` route handlers, the `components/forms/` folder, and Recharts; clarified that route protection uses Next.js 16's `proxy.ts`; and described the `Field`-based form approach.

## Verification
Every change set was validated with `pnpm exec tsc --noEmit`, `pnpm lint`, and the Vitest suite.
