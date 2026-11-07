---
type: entity
tags: [backend, api, v2]
sources: [expense-ledger-api@82a6110]
updated: 2026-09-25
---

# API v2 Backend

Server behind [[GraphQL API]] (API v2). Repo:
<https://gitlab.com/forestware/expense-ledger/expense-ledger-api>
(package `expenseledger-api-v2` 1.19.0). Read on 2026-09-25 at
`82a6110`; paths below are relative to that repo.

## Stack

- Express + **Postgraphile 4.13** with `pg-simplify-inflector` and
  `connection-filter` plugins (`src/middleware/postgraphile/index.ts`).
- All business logic is SQL: schema in `sql/index.sql`, functions in
  `sql/mutation/*.sql` and `sql/query/transaction.sql`. No migration
  tool; `sql/index.sql` has syntax errors (missing `,` after the
  `currency` column, missing `;` after `category_type`), so it is not
  exactly what ran against the live DB (inferred).
- Container image built by GitLab CI (`Containerfile`, node 20, multi-arch).
  In production GraphiQL is on and the external route is
  `/expenseledger/graphql` (behind a proxy, inferred).
- CORS allows `localhost:3000`, `expense-ledger-web.herokuapp.com`,
  `expenseledger.vercel.app` (`src/middleware/cors.ts`).

## Auth

- `src/middleware/auth.ts`: `Bearer` Firebase ID token →
  `firebase-admin verifyIdToken`. Valid → PG role `authuser` and
  setting `jwt.claims.firebase_uid`. No header → role `nologin`. Bad
  token → HTTP 403 with the error JSON.
- Every table has row-level security `owner_id = firebase_uid`.

## Tables

`owner(id = Firebase UID)`, `account`, `category`, `transaction`. All
have `created_at`/`updated_at` (`moddatetime` trigger). Postgraphile
CRUD is omitted (`@omit create,update,delete`); writes go through the
functions below.

- `account`: `balance` is Postgres **`money`** (locale-formatted),
  `currency` enum EUR/THB/USD default THB — **no function sets it**.
  `UNIQUE(name, owner_id)`.
- `category`: `type` default `ANY`; `UNIQUE(name, owner_id)`.
- `transaction`: `occurred_at` exposed as `date`; `description` default
  `''`; FKs to category and both accounts are **`ON DELETE CASCADE`**.

## Functions (→ GraphQL mutations)

| Function | Does |
|---|---|
| `current_user()` | Returns owner; on first call runs `new_owner()` |
| `new_owner()` | Creates owner + 11 categories + accounts "Cash", "My Bank" |
| `create_account(name, type, balance)` | Insert (currency stays THB) |
| `update_account(id, name, type)` | Rename / retype |
| `close_account(id)` | **Hard `DELETE`** |
| `create_category` / `_v2(name, type)` | v1 always type ANY |
| `update_category`, `delete_category` | `delete` is a hard `DELETE` |
| `spend` / `receive` | Insert + adjust one balance |
| `transfer` / `transfer_v2` | v2 adds `category_id` |
| `update_transaction(id, amount, desc, category, date)` | Reverses old amount, applies new |
| `delete_transaction(id)` | Deletes + reverses balance |

Seeded categories: Food And Drink, Transportation, Shopping, Bill,
Petrol, Withdraw, Doctor, Game (EXPENSE), Salary (INCOME), Transfer
(TRANSFER), Other (ANY).

- `current_user` is a **mutation** because Postgraphile exposes
  non-`STABLE` functions as mutations, and it may insert.
- All functions are `STRICT`: any `null` argument makes the call return
  `null` **without doing anything or raising an error**.
- `transaction_month_year_list_by_account_id` returns distinct
  `TO_CHAR(occurred_at, 'YYYY-MM')` **ordered DESC**, using the DB
  session's `TimeZone`. The server doesn't set one; it **should be
  `Asia/Bangkok` (UTC+7)** (human, 2026-09-25).

Backend bugs: see [[Known Issues]] § API v2 backend.
