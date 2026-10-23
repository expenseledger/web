---
type: entity
tags: [backend, api, v3]
sources: [backend agent 2026-09-25, human 2026-09-25]
updated: 2026-10-24
---

# API v3

The **new** backend (`ledger-api-v3`). The app uses it since the cutover
on branch `feature/api-v3` (2026-10-19; [[API v3 Migration]]). Most of
this page comes from the backend agent (2026-09-25); paths are relative
to `ledger-api-v3/`.

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
- Public endpoint: **`https://ledger.forestware.org/api/graphql`**,
  mapped by the ingress to the app's `/graphql`; clients use it as is.
  It replaces `/api/v3` (2026-09-25), dropped with no transition
  since nothing used it (human, 2026-10-22). The app config moved first. The deploy
  agent (dotta-8f, 2026-10-22) added the route in the deploy repo's
  `apps/ledger-api-v3/release.yaml` (PathPrefix + full-path rewrite
  to `/graphql`, so `/api/graphql/anything` also reaches `/graphql`;
  replacing the `/api/v3` rule, which is removed). Live since 2026-10-22
  (Flux, deploy repo main@8c1ffae); `/api/v3` returns 404.
- No version in the path (human, 2026-10-22), as in GitLab: the
  GraphQL API evolves by deprecating fields, and a path version would
  wrongly cover any other API on the host. See [[API Path Conventions]].
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
- The client must call **`initializeUser(currency: Currency! = THB):
  Boolean`** once. It seeds 7 categories (Food, Transport, Groceries,
  Bills, Entertainment, Salary, Other) and, since 2026-10-24, two
  accounts, "Cash" and "Bank", with balance 0 in `currency`. Until
  then, uncategorised transactions fail with
  `CATEGORY_DEFAULTS_NOT_FOUND`.
- It is idempotent: later calls return `true`, add nothing and ignore
  `currency`. `currency: null` is a validation error; omit it instead.
  Users initialized before 2026-10-24 have no default accounts. The
  seeded accounts are ordinary: renamable, editable, deletable
  (backend agent `ledger-api-v3-65`, 2026-10-24; main@c5f644c, local,
  not deployed).
- The default category was "None" until 2026-10-24 (main@592f9f5,
  local, not deployed). Migration V7 renames each user's "None"; a
  user's own "Other" is merged into it.
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
  and were INTERNAL_ERROR before. Also `INVALID_DATE_TIME`, and (2026-10-19)
  `CATEGORY_PROTECTED` (delete or rename of "Other"; replaced
  `CATEGORY_UNDELETABLE`) and `NAME_TAKEN` (duplicate account/category
  name on create or patch), both BAD_REQUEST.
- **Everything else is a generic INTERNAL_ERROR with no code**:
  e.g. FK violations. The client can't tell these apart.
- A missing or invalid token gets **HTTP 401** from Spring Security, not a
  GraphQL error.
- **CORS** (2026-10-21, backend `ea73da8`): allowed origins come from
  `ledger.cors.allowed-origins` (empty by default, so none in prod);
  the local launcher allows `localhost:5173` and `:3000`. Only `POST`
  and `OPTIONS` cross-origin, so send queries as POST. Before this the
  preflight got 401 and the dev app showed `Failed to fetch`.

## Pagination

- Relay connections: `edges { cursor node }`, `pageInfo { hasNextPage
  … endCursor }`. Forward-only (`first`, `after`), with opaque
  offset-based cursors.
- `first` is **required, max 50** (`TOO_MANY_ROWS` above that). There's
  **no totalCount**. Keep `first` constant while paging.
- `sort: [{ property, direction }]` uses entity property names
  (`occurredAt`, `id`, `name`); the default is `id ASC`.

## Dates

- `occurredAt` (was `committedAt`) is optional on creates and
  `patch*`; returned as an ISO-8601 UTC string (2026-10-18).
- Filter `fromDate`/`toDate` must be OffsetDateTime strings **with an
  offset** (`2026-09-01T00:00:00+07:00`). The server takes the calendar
  date in that offset, so `toDate` is inclusive through the end of that
  day.
- ⚠ `Date.toISOString()` of a local midnight (a `Z` string) lands on
  the **previous day** for UTC+ zones such as Bangkok. A bare
  `2026-09-01` gives INTERNAL_ERROR.

## Known backend gaps (v3, as of 2026-09-25)

from ≠ to on transfers is enforced since 2026-10-19
(`INVALID_TRANSACTION`; [[API v3 Operations]]). amount > 0 **is**
enforced since 2026-09-25. Missing: account/category update mutations,
soft close/archive, reporting, most typed domain errors, and user
deletion.

Concurrency (2026-09-25): transaction mutations use pessimistic row
locks (`SELECT … FOR UPDATE`). They lock the transaction row first, then
its accounts in ID order, so they can't deadlock. A test covers lost
updates.

## Findings from app testing (2026-10-24)

Backend agent `ledger-api-v3-8f`, 2026-10-24. Logged, not fixed:
`first` ≤ 0 isn't rejected (`0` → INTERNAL_ERROR, `-1` → all rows;
same for categories and transactions), and names aren't trimmed or
checked for blanks.

- `NAME_TAKEN` is case-sensitive (plain `UNIQUE(name, user_id)`);
  intent asked of the author. Assume case-sensitive.
- Category type is only a hint, by design (author, 2026-10-23): the
  server never checks it against the transaction type. Filter on the
  client ([[Category]]).
- No rounding policy: amounts are `NUMERIC(19,4)`, and the server
  doesn't know minor units. Asked of the author; until then the client
  rounds to the currency's minor unit ([[Service Layer]]).
- Nullability quirks (`transfer` → nullable `Transfer`, `category(id)`
  nullable) have been there since the first schema. Asked of the author;
  code against the schema as it is.
