# Authentication & route protection

## Login → session

```mermaid
sequenceDiagram
    participant U as User
    participant L as Login page
    participant A as AuthContext
    participant SW as MSW (auth handler)
    participant C as Cookie (eagle_bank_token)

    U->>L: submit email + password
    L->>A: login({ email, password })
    A->>SW: POST /api/auth/login
    alt invalid credentials
        SW-->>A: 401 { message }
        A-->>L: throw → show error
    else valid
        SW-->>A: 200 { user, token }
        A->>C: set token (7d, sameSite=strict)
        A->>A: dispatch LOGIN_SUCCESS
        A-->>L: resolve → router.push(redirect ?? /dashboard)
    end
```

## Session rehydration on mount

```mermaid
flowchart LR
    Start([App mounts]) --> Read{token cookie?}
    Read -- no --> Done[isLoading = false<br/>unauthenticated]
    Read -- yes --> Me[GET /api/auth/me]
    Me -- 200 --> Login[LOGIN_SUCCESS<br/>user restored]
    Me -- error --> Clear[remove cookie<br/>unauthenticated]
```

## Proxy guard (per navigation)

```mermaid
flowchart TD
    Req([Navigation request]) --> Pub{path is<br/>/login or /register?}
    Pub -- yes --> HasT1{has token?}
    HasT1 -- yes --> Dash[redirect → /dashboard]
    HasT1 -- no --> Allow1[allow]
    Pub -- no --> HasT2{has token?}
    HasT2 -- yes --> Allow2[allow]
    HasT2 -- no --> LoginR["redirect → /login?redirect=path"]
```

> The token cookie is set by `js-cookie` (readable by `proxy.ts`). For a real backend this would become an `HttpOnly` server-set cookie validated server-side.
