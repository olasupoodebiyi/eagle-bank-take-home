# Eagle Bank — Documentation

This folder documents how Eagle Bank is built and the engineering decisions made along the way.

| Document | What's inside |
|---|---|
| [`REQUIREMENTS.md`](./REQUIREMENTS.md) | **Full take-home traceability** — every objective, all 11 `/api` endpoints, why there are no Route Handlers |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | System overview, layers, data flow, and the rationale behind each major technical choice |
| [`CHANGELOG.md`](./CHANGELOG.md) | A chronological log of the work done on this project — setup, the Next.js 16 / Chakra UI v3 migration, bug fixes, and the cleanup pass |
Diagrams (Mermaid, render natively on GitHub) live in [`../diagrams`](../diagrams):

- [`system-architecture.md`](../diagrams/system-architecture.md) — high-level component/layer map
- [`request-lifecycle.md`](../diagrams/request-lifecycle.md) — how a data request flows through MSW
- [`auth-flow.md`](../diagrams/auth-flow.md) — login, session rehydration, and route protection
- [`routes.md`](../diagrams/routes.md) — route groups and the protected/public boundary
- [`component-hierarchy.md`](../diagrams/component-hierarchy.md) — provider tree and UI composition

For day-to-day commands (install, run, test) see the root [`README.md`](../README.md).
