---
type: concept
tags: [architecture, data]
sources: [src/service/accountService.ts, src/service/categoryService.ts, src/service/transactionService.ts, src/service/userService.ts, src/service/helper/, src/service/model/]
updated: 2026-10-24
---

# Service Layer

Convention: components never call fetch/Apollo directly; they call async
functions in `src/service/*Service.ts`. Each file declares its GraphQL
documents with the codegen `graphql()` tag ([[GraphQL Codegen]]) and uses
the shared [[Apollo Client]].

## Contract

- Functions take a `*Request` and return a `*Response` (interfaces in
  `src/service/model/Requests` / `Responses`).
- **They don't throw** (except `getUserData`). On `response.error` or an
  exception they `log()` and return a neutral value: `[]`, `{ x: null }`,
  `{ isSuccess: false }`, or bare `null` for the add-transaction functions.
  Callers must check for that value rather than use try/catch.
- Server data goes through mappers in `src/service/helper/`
  (`mapAccountFromServer`, `mapTransactionFromServer` — the latter converts
  `date` via dayjs into a JS `Date`, and nulls missing relations).

## Functions → GraphQL operations

| Service fn | Operation (root field) |
|---|---|
| `userService.getUserData` | mutation `currentUser` → owner accounts + categories (NAME_ASC) |
| `accountService.getAllAccount` | query `accounts` |
| `accountService.getAccount` | query `account(id)` |
| `accountService.createAccount` | `createAccount` (balance 0.0, type CASH) |
| `accountService.deleteAccount` | `closeAccount` |
| `categoryService.getAllCategories` | query `categories` |
| `categoryService.createCategory` | `createCategoryV2` (type ANY) |
| `categoryService.deleteCategory` | `deleteCategory` |
| `transactionService.addExpense` | `spend` |
| `transactionService.addIncome` | `receive` |
| `transactionService.addTransfer` | `transferV2` |
| `transactionService.updateTransaction` | `updateTransaction` |
| `transactionService.deleteTransaction` | `deleteTransaction` |
| `transactionService.listTransactions` | two `transactions` queries (see below) |
| `transactionService.getTransactionMonthYearList` | one query, `oldest`/`newest` aliases of `transactions` (see below) |

Shared fragments: `PlainAccount`, `PlainCategory`, `PlainTransaction`.
Mutations return the transaction with its accounts (incl. new `balance`),
which drives [[Balance Sync]].

## listTransactions

Runs **two queries in parallel** — `condition: { toAccountId }` and
`condition: { fromAccountId }` — with `filter: date >= from, < until`,
merges the nodes, sums `totalCount`, and sorts by date desc then id desc.
Used per month by [[Report Screen]]. The shared comparator is
`compareTransactionsDesc` in `transactoinHelper.ts`.

## getTransactionMonthYearList

v3 has no month list, so one query (`GetTransactionDateRange`) asks
`transactions` twice with `first: 1`: `occurredAt` ASC (`oldest`) and
DESC (`newest`), filtered by `accountId`. `monthYearsBetween` in
`transactoinHelper.ts` turns that into every local month (`YYYY-MM`)
from oldest to newest, newest first, so months without transactions
are included. No transactions or a failure → `[]`. Always
`network-only`. Used by [[Transaction List Screen]] and
[[Report Screen]]. Replaced `listTransactionsPage` (2026-10-23).

## Helpers

- `retryHelper.withRetry(fn, n=3)` — exponential backoff 1 s·2^(n-1);
  used only for `getUserData` in [[Routing and Layout]].
- `accountHelper` — account mapping.
- `categoryHelper` — `categoriesFor` picker filter, category type ↔
  label (`"ANY"` ↔ `"Any"`).
- `notificationHelper.useNotification()` — see [[Notifications]].
- Note the file-name typo `transactoinHelper.ts`.

## Unused models

`AddTransactionDto`, `httpStatus`, `getAllAccount`, `getAccount`,
`getAllCategories` exist but no component calls them (inferred: legacy;
initial data comes from `currentUser`).

## Money rounding

Every amount or balance a service sends (add, patch transaction, patch
account) goes through `roundMoney` (`helper/moneyHelper.ts`). It rounds
half away from zero to `currencyDecimals` (JPY 0, others 2), because API
v3 rejects finer amounts with `SUB_MINOR_UNIT_AMOUNT` ([[API v3]],
2026-10-24). An amount that rounds to 0 gets `NON_POSITIVE_AMOUNT`.
`getAccount` returns `account: null` for an unknown id.
