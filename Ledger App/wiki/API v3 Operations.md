---
type: entity
tags: [backend, api, v3]
sources: [backend agent 2026-09-25, src/service/]
updated: 2026-10-18
---

# API v3 Operations

How each v2 operation used by the [[Service Layer]] maps to v3. Source:
backend agent, 2026-09-25.

| v2 (current) | v3 | Notes |
|---|---|---|
| `currentUser` | `initializeUser` + `accounts` + `categories` | `initializeUser` returns only a Boolean |
| `accounts` | `accounts(first!, after, sort)` | Connection, max 50 per page |
| `account(id)` | `account(id: ID!)` | Unknown id → NOT_FOUND |
| `createAccount` | `createAccount(name, balance: MoneyInput!)` | No type; sets the opening balance and currency |
| `updateAccount` | **none** | No rename |
| `closeAccount` | `deleteAccount(id): ID!` | Hard delete; deletes its expenses/incomes and rewrites its transfers (2026-10-18, [[API v3 Migration]]) |
| `categories` | `categories(first!, after, sort)` | Plus `category(id)` |
| `createCategoryV2` | `createCategory(name)` | No type |
| `updateCategory` | **none** | |
| `deleteCategory` | `deleteCategory(id): ID!` | Hard delete; fails if the category is in use |
| `spend` | `withdraw(fromAccountId, amount: MoneyInput, categoryId?, description?)` → `Expense!` | |
| `receive` | `deposit(toAccountId, amount, categoryId?, description?)` → `Income!` | |
| `transferV2` | `transfer(fromAccountId, toAccountId, amount, convertedAmount?, categoryId?, description?)` → `Transfer` (nullable) | `convertedAmount` is required iff currencies differ |
| `updateTransaction` | `updateTransaction(id, amount?, convertedAmount?, categoryId?, description?)` → `Transaction!` | Partial update, see below |
| `deleteTransaction` | `rollBack(transactionId)` → `Transaction!` | Reverses the balance change, hard-deletes, returns `committedAt: null` |
| `transactions` (by to/from account + date range, `totalCount`) | `transactions(first!, after, sort, filter)` | Filter `{ fromDate, toDate, categoryId, accountId, type }`, ANDed; `accountId` matches **either side**; **no totalCount** |
| `transactionMonthYearListByAccountId` | **none** | |

Other rules:

- `categoryId` is optional (it defaults to "None"). `0` or someone else's
  id → NOT_FOUND.
- Amount currency must equal the account currency (`CURRENCY_MISMATCH`).
  amount and convertedAmount must be > 0 (`NON_POSITIVE_AMOUNT`).

`updateTransaction` (backend agent, 2026-09-25):

- **Omitted argument = unchanged.** An explicit `categoryId: null`
  resets the category to "None", and `description: null` clears it.
  `amount`/`convertedAmount: null` count as unchanged. ⚠ To leave a
  field unchanged, leave its variable **out of the variables map**. A
  declared variable sent as `null` is an explicit null.
- Type, accounts, id and `committedAt` can't change. There's no
  `updatedAt`.
- Reverses the old movement and applies the new one in one DB
  transaction, so balances change by the difference.
- The amount's currency is checked against the `from` account (Expense,
  Transfer) or the `to` account (Income). Transfer rules match
  `transfer`. Changing `amount` without `convertedAmount` keeps the old
  converted amount, so the implied rate changes. `convertedAmount` on an
  Expense or Income → `INVALID_TRANSACTION`.
- Balances: select them through fragments (`... on Expense { from {
  balance { amount currency } } }`, and the same for Income `to` and
  Transfer `from`/`to`).
- Backend ADR: `Ledger/wiki/Decisions/0007-editing-reverses-and-reapplies.md`
  (proposed).
- For newest first: `sort: [{ property: "committedAt", direction: DESC }]`.
