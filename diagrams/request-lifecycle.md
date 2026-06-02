# Request lifecycle

How a data request flows from a page to the mock API and back. Example: loading the dashboard.

```mermaid
sequenceDiagram
    participant P as Page (dashboard)
    participant H as useFetch<T>
    participant C as js-cookie
    participant SW as Service Worker (MSW)
    participant HD as Handler (dashboard-profile)
    participant DS as In-memory store

    P->>H: useFetch("/api/dashboard")
    H->>C: read eagle_bank_token
    C-->>H: token
    H->>SW: fetch("/api/dashboard", Authorization: Bearer <token>)
    SW->>HD: matched request
    HD->>HD: getUserIdFromToken(auth)
    alt token missing / invalid
        HD-->>H: 401 Unauthorized
        H-->>P: { error }  → ErrorState
    else authorized
        HD->>DS: read user / accounts / transactions
        DS-->>HD: records
        HD->>HD: toSafeUser() (strip passwordHash)
        HD-->>H: 200 JSON (after 400–800ms delay)
        H-->>P: { data }  → render
    end
```

While the request is in flight, `useFetch` exposes `isLoading`, so the page shows skeleton placeholders. Mutations (e.g. profile update) follow the same path through `authFetch<T>`.
