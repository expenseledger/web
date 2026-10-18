---
type: synthesis
tags: [migration, v3, planning]
sources: [backend agent 2026-09-25, human 2026-09-25, human 2026-10-04, backend agent 2026-10-18, src/, expense-ledger-api]
updated: 2026-10-18
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
- Custom transaction date via `occurredAt` (2026-10-18; description added 2026-09-25)
- No account/category update mutations (transactions: `patch*`, 2026-10-05)
- Hard deletes (no longer blocked while referenced, 2026-10-18)
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
| [[Home Screen]] | `withdraw` with Money in the account's currency. Date → `occurredAt`. Description → `description` (send null, not `"-"`, when it's empty) Category can be omitted |
| [[More Screen]] | `deposit`/`transfer`; cross-currency transfers need a `convertedAmount` input. The date is lost; description maps to `description`. Category filtering by type already removed (2026-10-18) |
| [[Transaction List Screen]] | Already an infinite scroll; swap the page query (§ Decided: month navigation). Must page through results (no totalCount). Edit → `patchExpense`/`patchIncome`/`patchTransfer` (amount, date, category, description, accounts; not the type). Omit unchanged variables. Delete → `deleteTransaction` (returns only the id). One `accountId` query replaces the two to/from queries. Direction via `__typename` + `from`/`to` |
| [[Report Screen]] | Already a free month picker (§ Decided: month navigation). Must page through every transaction per month and account. Unaffected by the loss of category types (it splits by transaction type and groups by category name). Still client-side aggregation |
| [[Settings Screens]] | Types and edit modals already removed (2026-10-18). To add on v3: account name + balance edit (balance set directly, § Decided: types), category rename. Account delete cascades (warn the user; § Decided: deleting referenced accounts/categories). Currency picker → per-account currency |
| [[State Management]] | `currencyState` (cosmetic) conflicts with real per-account currencies. IDs become strings |
| [[Balance Sync]] | Read balances from create/`patch*` responses (select `from`/`to { balance }`). Refetch after `deleteTransaction`, account/category deletes, and for an account a patch moved a transaction off |
| [[Apollo Client]] / [[Authentication]] | Same Firebase bearer token (project `expense-ledger-a0aa2`). Handle HTTP 401 separately from GraphQL errors. New endpoint `https://ledger.forestware.org/api/v3` |
| [[GraphQL Codegen]] | Point at the v3 schema (`schema.graphqls`); regenerate; rewrite all documents |
| Dates | Filters must send local-offset strings (e.g. `+07:00`), **not** `toISOString()`. The current code passes `Date` objects |

## Feature regressions to decide on

These are v2 features the app uses that v3 lacks today:

1. ~~Backdating transactions~~ — **done**: `occurredAt` on creates and
   `patch*`, used by filters and sort (backend agent, 2026-10-18)
2. ~~Transaction descriptions~~ — **done** in v3 (backend agent
   `ledger-api-v3-bb`, 2026-09-25): nullable `description` argument on
   `withdraw`/`deposit`/`transfer` and a field on `Transaction`
   ([[API v3 Data Model]])
3. ~~Editing transactions~~ — **done** (now `patch*`, which can also
   move accounts; [[API v3 Operations]])
4. ~~Month list per account~~ — **not needed**; handled on the client
   (human, 2026-10-04; § Decided: month navigation)
5. ~~Account/category types~~ — **dropped** (human, 2026-10-18;
   § Decided: types)
6. Renaming accounts/categories
7. ~~Closing accounts that have history~~ — **decided**: no soft
   close; hard delete with transfer rewrite (human, 2026-10-18;
   § Decided: deleting referenced accounts/categories)
8. Server-side validation for from ≠ to (the client validates it
   already). amount > 0 was added 2026-09-25. from ≠ to is decided
   (backend T6) but not built (2026-10-18).

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

## Decided: types and editing

(human, 2026-10-18) The app drops account and category types. Done on
v2 already: pickers list every category, and settings have no type
fields. v2 creates hardcode `CASH`/`ANY`. The edit modals were removed
too; the human will reimplement them on v3:

- Account: name and balance. Setting a balance changes the account's
  balance **directly**, with no "Adjust balance" transaction (needs a v3
  mutation for it).
- Category: name.

Data migration can ignore v2 types.

## Decided: deleting referenced accounts/categories

(human, 2026-09-25) v3 should **allow** deleting an account or category
that transactions still reference. The user picks one of:

1. **Cascade** — delete dependent transactions and adjust balances.
2. **Reassign** — move dependents to another account/category.
3. **Leave** — delete the entity, leave dependents untouched.

v2 does (1) without the balance adjustment, which is a bug
([[Known Issues]] § API v2 backend). v3 blocked it until 2026-10-18; account delete is now implemented (below).

**No soft close** (human, 2026-10-18): an archived flag is rejected,
e.g. because archived rows still hold their unique name.

**Transfer rewrite** (human, 2026-10-18): before deleting an account,
convert each transfer with the remaining account, whatever option the
user picks:

- remaining → deleted becomes an **Expense** on the remaining account
- deleted → remaining becomes an **Income** on the remaining account

The remaining balance stays as is (the money really moved) and now
matches its history. So "adjust balances" in (1) never undoes the
other side of a transfer.

**Implemented** (backend agent `ledger-api-v3-24`, 2026-10-18; local
commits, not pushed). The human cut the scope:

- Signature unchanged: `deleteAccount(id: ID!): ID!`.
- Always Cascade: D's own expenses and incomes are deleted. Reassign
  is a possible future feature; Leave is dropped (FKs and CHECKs
  forbid account-less transactions).
- Transfers with R are rewritten in place as above; id, category,
  description and `occurredAt` kept. Amount is R's side
  (`convertedAmount` if R was a cross-currency `to`). R's balance is
  unchanged.
- Deleting (formerly `rollBack`) a rewritten row restores R's balance correctly.
- **Client**: after `deleteAccount`, refetch accounts and transactions.
  Balances don't change, but R's former transfers change type
  (Transfer → Expense/Income).

**Categories: Reassign only** (human, 2026-10-18). A category is a
label and moves no money, so deleting one must not touch balances or
remove transactions. This narrows the three options for categories:

- Deleting a category moves its transactions to a category the user
  picks, defaulting to "None" (the v3 default for an omitted
  `categoryId`; [[API v3 Operations]]).
- No Cascade: dropping real transactions with the label is the v2 bug.
  Leave can't apply (a transaction can't point at a missing category);
  reassigning to "None" is its v3 equivalent.
- **Protect "None"**: the backend must refuse to delete it, and
  [[Settings Screens]] hides its Delete button. Before 2026-10-18 it
  could be deleted while unused, breaking uncategorised transactions
  with `CATEGORY_DEFAULTS_NOT_FOUND` ([[API v3 Data Model]]).

**Implemented** (backend agent `ledger-api-v3-24`, 2026-10-18; local
commits, not pushed). Scope cut like `deleteAccount`:

- Signature unchanged: `deleteCategory(id: ID!): ID!`.
- Transactions always move to the user's "None" category, keeping id,
  amount, accounts, description and `occurredAt`; no balance changes.
  Picking a target is a possible future feature.
- Deleting "None" (matched by name) is refused: `BAD_REQUEST`,
  `extensions.code` `CATEGORY_UNDELETABLE`. Unknown or not-owned id →
  `RESOURCE_NOT_FOUND`.
- **Client**: refetch transactions after a delete. "None"'s Delete
  button is already hidden (2026-10-18, on v2).

## What's left (2026-10-18)

From the backend agent `ledger-api-v3-14`, checked against v3 `main`.

Backend gaps blocking app features:

- No account rename or direct balance set (name and currency are
  immutable) → blocks the account edit modal ([[Settings Screens]]).
- No category rename → blocks the category edit modal.
- from ≠ to (T6) decided, not built.
- Duplicate account/category names return an untyped internal error;
  `createAccount` doesn't validate the opening balance.
- `patch*` can't clear `convertedAmount` (cross- → same-currency move
  needs delete + re-create).
- No v2 import or adjustment transaction (§ Data migration).
- **Not pushed**: local v3 `main` is 27 commits ahead of origin (all
  2026-10-18 work: deletes, `occurredAt`, `INVALID_DATE_TIME`, account
  moves in patches). Deployed version unknown.
- Endpoint host and Firebase issuer are deploy-time config, unconfirmed.

App work (all of it; nothing migrated yet): the impact table above.

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
  transactions when a category was deleted (cascade without reversal),
  when an account with transfers was deleted (the other side keeps its
  change), or when the account was created with a nonzero balance.
  Decide whether v3 keeps the v2 balance and records the difference as
  an opening adjustment.
- v3 has no import: the only API route is `createAccount` with an
  opening balance plus backdated creates. v2 dates map to `occurredAt`.
- Open mapping decisions: v2 `"-"`
  descriptions (map to NULL?);
  the currency per account (v2 has
  none; the app assumes one cosmetic symbol).

## Error handling

Transaction mutations have typed codes (`CURRENCY_MISMATCH`,
`NON_POSITIVE_AMOUNT`, `INVALID_TRANSACTION`, `INVALID_DATE_TIME`,
`RESOURCE_NOT_FOUND`), so the app can show specific toasts.
Account/category mutations only give `RESOURCE_NOT_FOUND` and
`CATEGORY_UNDELETABLE`; anything else (e.g. duplicate name) needs a
generic failure toast ([[API v3]] § Errors, [[Notifications]]).
