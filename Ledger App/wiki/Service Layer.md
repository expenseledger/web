---
type: concept
tags: [architecture, data]
sources: [src/service/accountService.ts, src/service/categoryService.ts, src/service/transactionService.ts, src/service/userService.ts, src/service/helper/, src/service/model/]
updated: 2026-10-18
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
| `transactionService.listTransactionsPage` | one `transactions` query, cursor-paged (see below) |

Shared fragments: `PlainAccount`, `PlainCategory`, `PlainTransaction`.
Mutations return the transaction with its accounts (incl. new `balance`),
which drives [[Balance Sync]].

## listTransactions

Runs **two queries in parallel** — `condition: { toAccountId }` and
`condition: { fromAccountId }` — with `filter: date >= from, < until`,
merges the nodes, sums `totalCount`, and sorts by date desc then id desc.
Used per month by [[Report Screen]]. The shared comparator is
`compareTransactionsDesc` in `transactoinHelper.ts`.

## listTransactionsPage

One query: `filter: { or: [toAccountId, fromAccountId] }`,
`orderBy: [DATE_DESC, ID_DESC]`, `first`/`after`. Returns
`{ items, endCursor, hasNextPage }`, or **null** on failure (not an
empty page, so callers can tell them apart). Always `network-only`.
Used by [[Transaction List Screen]]. The v2 month list query
(`transactionMonthYearListByAccountId`) is no longer called.

## Helpers

- `retryHelper.withRetry(fn, n=3)` — exponential backoff 1 s·2^(n-1);
  used only for `getUserData` in [[Routing and Layout]].
- `accountHelper` / `categoryHelper` — enum ↔ display string mappers
  (`"BANK"` ↔ `"Bank Account"`, etc.), `allCurrencies`.
- `notificationHelper.useNotification()` — see [[Notifications]].
- Note the file-name typo `transactoinHelper.ts`.

## Unused models

`AddTransactionDto`, `httpStatus`, `getAllAccount`, `getAccount`,
`getAllCategories` exist but no component calls them (inferred: legacy;
initial data comes from `currentUser`).
