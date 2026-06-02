# System architecture

High-level view of how the app is layered. There is no real backend — MSW is the network boundary.

```mermaid
flowchart TB
    subgraph Browser
        direction TB
        Pages["Pages<br/>app/(auth) · app/(app)"]
        UI["Design system<br/>Chakra UI v3 components"]
        Ctx["Global state<br/>AuthContext · ToastContext"]
        Data["Data access<br/>useFetch · authFetch"]
        Pages --> UI
        Pages --> Ctx
        Pages --> Data
    end

    MW["proxy.ts<br/>route protection (cookie check)"]
    SW["Service Worker<br/>(MSW)"]

    subgraph Mock API
        direction TB
        Handlers["Handlers<br/>auth · accounts · transactions · dashboard-profile"]
        Store["In-memory data<br/>mocks/data/*"]
        Handlers --> Store
    end

    Browser -. "page navigation" .-> MW
    MW -. "allow / redirect" .-> Pages
    Data -- "fetch /api/*" --> SW
    SW --> Handlers
    Handlers -- "JSON (delayed)" --> Data

    Tests["Vitest + RTL"] -- "setupServer (Node)" --> Handlers
```

**Notes**
- The same handler set is consumed by the browser worker (`mocks/browser.ts`) and the Node server used in tests (`mocks/server.ts`).
- `proxy.ts` (Next.js 16's renamed middleware) runs on navigations only; `fetch('/api/*')` calls are intercepted client-side by the Service Worker before reaching the network.
