---
type: entity
tags: [backend, api, v3]
sources: [backend agent 2026-09-25, human 2026-09-25]
updated: 2026-10-18
---

# API v3

The **new** backend (`ledger-api-v3`), not yet used by this app. The app
runs on API v2 today ([[GraphQL API]]). Everything here comes from the
backend agent (2026-09-25); paths are relative to `ledger-api-v3/`.

Related: [[API v3 Data Model]] · [[API v3 Operations]] ·
[[API v3 Migration]]

## Stack and deployment

- Kotlin 2.3, Spring Boot 4.0.6, Java 25 (virtual threads), Spring for
  GraphQL, JPA/Hibernate + Querydsl, PostgreSQL + Flyway
  (`db/migration/V1–V3`), Postgres **row-level security** per user.
- GraphQL only: `POST /graphql`, GraphiQL at `/graphiql`. Schema:
  `src/main/resources/graphql/schema.graphqls`.
- Actuator: liveness/readiness without auth; `/actuator/info` and
  `/prometheus` need auth.
- GitLab CI → multi-arch container image (tagged with the version, e.g.
  1.0.0, plus `latest` on main) → Kubernetes via a Helm chart kept
  elsewhere. DB credentials come from OpenBao/Vault.
- Public endpoint: **`https://ledger.forestware.org/api/v3`** (human,
  2026-09-25).
- The backend repo has its own Obsidian wiki (`Ledger/wiki/`) with
  domain docs and decision records.

## Auth and user setup

- OAuth2 JWT resource server: `Authorization: Bearer <JWT>`. The issuer
  comes from the deploy env; the local launcher uses Firebase project
  `expense-ledger-a0aa2`, so the **same Firebase ID token** as today
  should work ([[Authentication]]). Prod trusts the same project
  (human, 2026-09-25).
- User = JWT `sub` (Firebase UID). An `app_user` row is created
  automatically on the first authenticated request.
- The client must call **`initializeUser: Boolean`** once (it's
  idempotent). It seeds 7 categories: Food, Transport, Groceries,
  Bills, Entertainment, Salary, None. Until then, uncategorised
  transactions fail with `CATEGORY_DEFAULTS_NOT_FOUND`.
- No `currentUser` or profile type: fetch `accounts` and `categories`
  separately.

## Errors

- Standard GraphQL `errors[]`, HTTP 200. Mapped errors carry
  `extensions.classification` (NOT_FOUND | BAD_REQUEST |
  INTERNAL_ERROR) and `extensions.code`:
  `RESOURCE_NOT_FOUND`, `TRANSACTION_FILTER_INVALID_DATE_RANGE`,
  `TOO_MANY_ROWS`, `CATEGORY_DEFAULTS_NOT_FOUND`, and on transaction
  mutations `CURRENCY_MISMATCH`, `NON_POSITIVE_AMOUNT`,
  `INVALID_TRANSACTION` (BAD_REQUEST). These three were added 2026-09-25
  and were INTERNAL_ERROR before. `deleteCategory` on "None" gives
  `CATEGORY_UNDELETABLE` (BAD_REQUEST, 2026-10-18).
- **Everything else is a generic INTERNAL_ERROR with no code**:
  duplicate names, FK violations, bad date strings. The client can't tell these apart.
- A missing or invalid token gets **HTTP 401** from Spring Security, not a
  GraphQL error.

## Pagination

- Relay connections: `edges { cursor node }`, `pageInfo { hasNextPage
  … endCursor }`. Forward-only (`first`, `after`), with opaque
  offset-based cursors.
- `first` is **required, max 50** (`TOO_MANY_ROWS` above that). There's
  **no totalCount**. Keep `first` constant while paging.
- `sort: [{ property, direction }]` uses entity property names
  (`committedAt`, `id`, `name`); the default is `id ASC`.

## Dates

- `committedAt` is set by the server (`Instant.now()`), returned as an
  ISO-8601 UTC string. The client can't set it.
- Filter `fromDate`/`toDate` must be OffsetDateTime strings **with an
  offset** (`2026-09-01T00:00:00+07:00`). The server takes the calendar
  date in that offset, so `toDate` is inclusive through the end of that
  day.
- ⚠ `Date.toISOString()` of a local midnight (a `Z` string) lands on
  the **previous day** for UTC+ zones such as Bangkok. A bare
  `2026-09-01` gives INTERNAL_ERROR.

## Known backend gaps (v3, as of 2026-09-25)

Decided but not enforced: from ≠ to on transfers. amount > 0 **is**
enforced since 2026-09-25. Missing: account/category update mutations,
soft close/archive, reporting, most typed domain errors, and user
deletion.

Concurrency (2026-09-25): transaction mutations use pessimistic row
locks (`SELECT … FOR UPDATE`). They lock the transaction row first, then
its accounts in ID order, so they can't deadlock. A test covers lost
updates.
