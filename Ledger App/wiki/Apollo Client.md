---
type: concept
tags: [architecture, data]
sources: [src/lib/apollo.ts, src/lib/rr.ts]
updated: 2026-09-25
---

# Apollo Client

Defined in `src/lib/apollo.ts`; single default export used by the
[[Service Layer]] (and mocked in service tests — [[Build and Test]]).

- **Link chain**: `authLink.concat(httpLink).concat(retryLink)`.
  - `authLink` (`SetContextLink`) injects the Firebase bearer token
    ([[Authentication]]).
  - `httpLink` URI is a *function*, `getServerUrl`, from `src/lib/rr.ts`.
  - `retryLink`: up to 5 attempts, queries only, exponential delay
    1 s·2^(n-1). **Placed after the terminating HttpLink, so it never
    runs** — see [[Known Issues]].
- **Cache**: default `InMemoryCache`. Most queries use default fetch
  policy; `listTransactions` uses `network-only` unless `useCache: true`
  (no caller passes it).

## Round-robin servers (`src/lib/rr.ts`)

`VITE_SERVER_URL` may be a comma-separated list. Each request takes the
next URL (module-level index) and appends `/graphql`. Simple client-side
load balancing / failover-by-rotation.

## Error model

Apollo 4 returns `{ data, error }`; services check `response.error`, log
via `log()` from `src/common/utils.ts`, and return a neutral value. See
[[Service Layer]].
