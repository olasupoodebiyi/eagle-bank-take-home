# Route map

Route groups separate the public auth shell from the authenticated app shell. The dotted boundary is enforced by `src/proxy.ts`.

```mermaid
flowchart TB
    Root["/  (redirects → /dashboard)"]

    subgraph Public["(auth) — public, no shell"]
        Login["/login"]
        Register["/register"]
    end

    subgraph Protected["(app) — requires token, sidebar shell"]
        Dash["/dashboard"]
        Accts["/accounts"]
        AcctId["/accounts/[id]"]
        Txns["/transactions"]
        TxnId["/transactions/[id]"]
        Profile["/profile"]
    end

    NotFound["not-found.tsx (404)"]
    ErrorB["error.tsx (error boundary)"]

    Root --> Dash
    Protected -. "no token → /login?redirect=…" .-> Login
    Public -. "has token → /dashboard" .-> Dash
```

| Group | Layout | Auth |
|---|---|---|
| `(auth)` | `app/(auth)/layout.tsx` (split panel) | Public; redirects to `/dashboard` if already signed in |
| `(app)` | `app/(app)/layout.tsx` (sidebar shell) | Protected by `proxy.ts` |
