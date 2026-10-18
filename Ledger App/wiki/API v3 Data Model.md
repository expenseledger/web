---
type: entity
tags: [backend, api, v3, domain]
sources: [backend agent 2026-09-25]
updated: 2026-10-18
---

# API v3 Data Model

The v3 equivalents of [[Account]], [[Category]], [[Transaction]]. Source:
backend agent, 2026-09-25 (`schema.graphqls`, `domain/`,
`V1__init.sql`).

## Money (new)

`Money { amount: Float!, currency: Currency! }`. Currency is USD, THB,
EUR, or JPY. Stored as NUMERIC(19,4) plus a currency column. **Every amount
and balance is Money.** Inputs use `MoneyInput`.

## Account

`Account { id: ID!, name, balance: Money }`

| vs v2 | |
|---|---|
| Removed | `type` (CASH/BANK/CREDIT); closed/archived flag |
| New | per-account **currency** (fixed); opening balance in `createAccount` |
| Same | name unique per user; server-owned balance |

- After creation, only transactions change the balance.
- Negative balances are allowed.

## Category

`Category { id: ID!, name }`. The `type` (ANY/INCOME/…) is **removed**.
Names are unique per user. Seeded defaults include "None"; see
[[API v3]].

## Transaction

An interface `Transaction { id, amount: Money, category: Category,
committedAt: String, description: String }` with three concrete types:

- `Expense { from: Account! }`
- `Income { to: Account! }`
- `Transfer { from, to, convertedAmount: Money }`: cross-currency
  transfers (new)

Tell the types apart with `__typename` or inline fragments.

`description` is nullable TEXT, stored exactly as sent (no trim, `""`
stays `""`), with no max length. It's set only at creation. It was added
by migration `V4__add_transaction_description.sql` (backend agent,
2026-09-25; uncommitted at the time).

**Removed vs v2:** any user-chosen date.
`committedAt` is the server time at creation, so **backdating isn't
possible**.

`committedAt` was renamed `occurredAt` (migration V5; backend agent,
2026-10-18). Whether it is now client-settable (backdating) is
unconfirmed; other v3 pages still say `committedAt`.

## Balance effects

These happen inside one DB transaction per mutation:

- Expense: from −amount
- Income: to +amount
- Transfer: from −amount; to +(`convertedAmount` ?: amount)
- `rollBack` runs the exact inverse, then hard-deletes the row

Mutation responses can return updated balances (select `from`/`to {
balance }`), which suits [[Balance Sync]].

## Deletion semantics

- `deleteAccount` is a hard delete that cascades D's expenses and
  incomes and rewrites its transfers into Expense/Income on the other
  account (2026-10-18; [[API v3 Migration]]).
- `deleteCategory` is a hard delete that first moves its transactions
  to the user's "None" category (no balance changes). Deleting "None"
  (matched by name) is refused with `BAD_REQUEST` /
  `CATEGORY_UNDELETABLE` (2026-10-18; [[API v3 Migration]]).

## IDs

BIGINT identities starting at 1, exposed as GraphQL `ID` **strings**.
The v2 frontend uses `number` ids.
