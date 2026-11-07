---
type: concept
tags: [architecture, data]
sources: [src/lib/apollo.ts, src/lib/rr.ts]
updated: 2026-10-19
---

# Apollo Client

Defined in `src/lib/apollo.ts`; single default export used by the
[[Service Layer]] (and mocked in service tests — [[Build and Test]]).

- **Link chain**: built by `createLink` in `src/lib/apolloLink.ts`
  (testable with a fake HTTP link; `apollo.ts` passes the Firebase
  token functions). Order: `ApolloLink.from([unauthorizedLink,
  retryLink, authLink, httpLink])` (2026-10-19).
  - `unauthorizedLink` (`lib/unauthorizedLink.ts`): on an HTTP 401
    (API v3's answer to a missing or rejected token) it force-refreshes
    the Firebase ID token and retries once. A second 401, or no
    signed-in user, calls `auth.signOut()` and the error propagates. An
    `ErrorLink` doesn't see its own retry's errors, so the retry is
    caught in its pipe. It sits outside `retryLink` so a 401 isn't
    retried 5 times first.
  - `retryLink`: up to 5 attempts, queries only, exponential delay
    1 s·2^(n-1); skips 4xx responses. Before 2026-10-19 it sat after
    the terminating `HttpLink` and never ran ([[Known Issues]]).
  - `authLink` (`SetContextLink`) injects the Firebase bearer token
    ([[Authentication]]); every retry passes through it again.
  - `httpLink` URI is a *function*, `getServerUrl`, from `src/lib/rr.ts`.
- **Cache**: `InMemoryCache` from `lib/apolloCache.ts` with
  `possibleTypes` for the v3 `Transaction` interface (shared with the
  tests' mock client). Every v3 query uses `network-only`; data is kept
  in Jotai atoms, not read from the cache ([[State Management]]).

## Round-robin servers (`src/lib/rr.ts`)

`VITE_SERVER_URL` may be a comma-separated list. Each request takes the
next URL (module-level index) and uses it as is (each entry is a full
GraphQL endpoint; `/graphql` was appended before the v3 cutover). Simple client-side
load balancing / failover-by-rotation.

## Error model

Apollo 4 returns `{ data, error }`; services check `response.error`, log
via `log()` from `src/common/utils.ts`, and return a neutral value. See
[[Service Layer]].
