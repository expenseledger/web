---
type: synthesis
tags: [migration, v3, planning]
sources: [backend agent 2026-09-25, human 2026-09-25, human 2026-10-04, src/, expense-ledger-api]
updated: 2026-10-04
---

# API v3 Migration

What moving this app from API v2 ([[GraphQL API]]) to [[API v3]] would
involve. Status: **information gathering**; decisions are recorded per feature
below.
Combines the backend agent's answers (2026-09-25) with this repo's
code.

## Breaking changes (backend view)

- Money objects replace plain numbers
- No account or category types
- No custom transaction date (description was added 2026-09-25)
- No account/category update mutations (`updateTransaction` added 2026-09-25)
- Hard deletes, blocked while referenced
- `initializeUser` replaces `currentUser`
- Renamed mutations
- A single `accountId` filter
- No totalCount or month list
- Mandatory pagination (≤ 50)
- Offset-bearing date filters

Details: [[API v3 Data Model]], [[API v3 Operations]].

## Impact by screen (frontend view)

| Area | Impact |
|---|---|
| Bootstrap ([[Routing and Layout]]) | Call `initializeUser` once, then page through `accounts` and `categories` (≤ 50 each) instead of one `currentUser` |
| [[Home Screen]] | `withdraw` with Money in the account's currency. **The Date field has no v3 target.** Description → `description` (send null, not `"-"`, when it's empty) Category can be omitted |
| [[More Screen]] | `deposit`/`transfer`; cross-currency transfers need a `convertedAmount` input. The date is lost; description maps to `description`. Category filtering by type disappears |
| [[Transaction List Screen]] | Already an infinite scroll; swap the page query (§ Decided: month navigation). Must page through results (no totalCount). Edit → `updateTransaction` (amount, category, description; not the date). Omit unchanged variables. Delete → `rollBack`. One `accountId` query replaces the two to/from queries. Direction via `__typename` + `from`/`to` |
| [[Report Screen]] | Already a free month picker (§ Decided: month navigation). Must page through every transaction per month and account. Category types are gone. Still client-side aggregation |
| [[Settings Screens]] | Account: no type, no rename. The balance-adjust trick still works via withdraw/deposit, and keeps the "Adjust balance" description. Delete fails if the account has transactions. Category: no type, no rename. Currency picker → per-account currency |
| [[State Management]] | `currencyState` (cosmetic) conflicts with real per-account currencies. IDs become strings |
| [[Balance Sync]] | Can read balances from every mutation response, including `rollBack` (select `from`/`to { balance }`) |
| [[Apollo Client]] / [[Authentication]] | Same Firebase bearer token (project `expense-ledger-a0aa2`). Handle HTTP 401 separately from GraphQL errors. New endpoint `https://ledger.forestware.org/api/v3` |
| [[GraphQL Codegen]] | Point at the v3 schema (`schema.graphqls`); regenerate; rewrite all documents |
| Dates | Filters must send local-offset strings (e.g. `+07:00`), **not** `toISOString()`. The current code passes `Date` objects |

## Feature regressions to decide on

These are v2 features the app uses that v3 lacks today:

1. Backdating transactions (the Date field)
2. ~~Transaction descriptions~~ — **done** in v3 (backend agent
   `ledger-api-v3-bb`, 2026-09-25): nullable `description` argument on
   `withdraw`/`deposit`/`transfer` and a field on `Transaction`
   ([[API v3 Data Model]])
3. ~~Editing transactions~~ — **done** (`updateTransaction`, backend
   agent 2026-09-25; [[API v3 Operations]])
4. ~~Month list per account~~ — **not needed**; handled on the client
   (human, 2026-10-04; § Decided: month navigation)
5. Account/category types (and type-filtered category pickers)
6. Renaming accounts/categories
7. Closing accounts that have history
8. Server-side validation for from ≠ to (the client validates it
   already). amount > 0 was added 2026-09-25.

Each needs either a backend addition in v3 or an accepted product
change. Decided **per feature**; this page is where that happens
(human, 2026-09-25).

## Decided: month navigation without a month list

(human, 2026-10-04) v3 gets **no** month list endpoint. This assumes
backdating (item 1) is possible, so months can have gaps.

- [[Transaction List Screen]]: drop `MonthYearSwiper`. Use an infinite
  scroll, newest first, paged with `after`. Group rows under month
  headers, then day cards. Months come from the loaded data, so empty
  months never appear.
- [[Report Screen]]: a free month picker (prev/next) that starts on the
  current month and shows an empty state for months with nothing.
- Backend requirement: the transaction date added for backdating must
  be usable in `sort` and in `fromDate`/`toDate`, not only
  `committedAt`.
- **Implemented on v2 already** (2026-10-04): the app no longer calls
  the month list. On v3, `listTransactionsPage` maps to `transactions`
  with `accountId` and a date sort ([[Service Layer]]).
- The last loaded month shows no total while more pages exist.

## Decided: deleting referenced accounts/categories

(human, 2026-09-25) v3 should **allow** deleting an account or category
that transactions still reference. The user picks one of:

1. **Cascade** — delete dependent transactions and adjust balances.
2. **Reassign** — move dependents to another account/category.
3. **Leave** — delete the entity, leave dependents untouched.

v2 does (1) without the balance adjustment, which is a bug
([[Known Issues]] § API v2 backend). v3 currently blocks the delete.

## Data migration

- Plan: **manual migration in Postgres** by the human (2026-09-25). v3
  has its own schema (Flyway); v2 and v3 can run side by side.
- Suggested: write it as a re-runnable SQL script (load v2 tables into a
  staging schema via `pg_dump`/`postgres_fdw`, then
  `INSERT … SELECT`) so it can be rehearsed and rerun at cut-over.
- Users map 1:1: v2 `owner.id` and v3 user are both the Firebase UID
  of the same project.
- Cast `money` via `::numeric`, not text (text is locale-formatted).
- **Reconcile balances**: v2 `account.balance` ≠ sum of its
  transactions when a category was deleted (cascade without reversal)
  or when the account was created with a nonzero balance. Decide whether
  v3 keeps the v2 balance and records the difference as an opening
  adjustment.
- Open mapping decisions: v2 dates (nowhere to store them); v2 `"-"`
  descriptions (map to NULL?);
  account types, category types, and the currency per account (v2 has
  none; the app assumes one cosmetic symbol).

## Error handling

Transaction mutations now have typed codes (`CURRENCY_MISMATCH`,
`NON_POSITIVE_AMOUNT`, `INVALID_TRANSACTION`, `RESOURCE_NOT_FOUND`), so
the app can show specific toasts. Other mutations still need generic
failure toasts ([[API v3]] § Errors, [[Notifications]]).
