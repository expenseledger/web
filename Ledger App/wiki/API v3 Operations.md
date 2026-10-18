---
type: entity
tags: [backend, api, v3]
sources: [backend agent 2026-09-25, backend agent 2026-10-18, src/service/]
updated: 2026-10-19
---

# API v3 Operations

How each v2 operation used by the [[Service Layer]] maps to v3. Source:
backend agent, 2026-09-25.

| v2 (current) | v3 | Notes |
|---|---|---|
| `currentUser` | `initializeUser` + `accounts` + `categories` | The user row is auto-created on any authed request; `initializeUser` (idempotent, always `true`) seeds default categories incl. "None". Skip it → omitted `categoryId` fails with `CATEGORY_DEFAULTS_NOT_FOUND` |
| `accounts` | `accounts(first!, after, sort)` | Connection, max 50 per page |
| `account(id)` | `account(id: ID!)` | Unknown id → NOT_FOUND |
| `createAccount` | `createAccount(name, balance: MoneyInput!)` | No type; sets the opening balance and currency |
| `updateAccount` | `patchAccount(id, name?, balance: MoneyInput?)` → `Account!` | Balance is overwritten directly, no transaction; currency fixed (`CURRENCY_MISMATCH`); taken name → `NAME_TAKEN` (2026-10-19) |
| `closeAccount` | `deleteAccount(id): ID!` | Hard delete; deletes its expenses/incomes and rewrites its transfers (2026-10-18, [[API v3 Migration]]) |
| `categories` | `categories(first!, after, sort)` | Plus `category(id)` |
| `createCategoryV2` | `createCategory(name)` | No type |
| `updateCategory` | `patchCategory(id, name?)` → `Category!` | Renaming "None" → `CATEGORY_PROTECTED`; taken name → `NAME_TAKEN` (2026-10-19) |
| `deleteCategory` | `deleteCategory(id): ID!` | Hard delete; moves its transactions to "None"; "None" itself is refused (`CATEGORY_PROTECTED`, formerly `CATEGORY_UNDELETABLE`) (2026-10-19) |
| `spend` | `withdraw(fromAccountId, amount: MoneyInput, categoryId?, description?, occurredAt?)` → `Expense!` | |
| `receive` | `deposit(toAccountId, amount, categoryId?, description?, occurredAt?)` → `Income!` | |
| `transferV2` | `transfer(fromAccountId, toAccountId, amount, convertedAmount?, categoryId?, description?, occurredAt?)` → `Transfer` (nullable) | `convertedAmount` is required iff currencies differ |
| `updateTransaction` | `patchExpense` / `patchIncome` / `patchTransfer` | Partial update, see below (replaced `updateTransaction` 2026-10-05) |
| `deleteTransaction` | `deleteTransaction(id): ID` | Reverses the balance change, hard-deletes; returns only the id, so refetch balances (replaced `rollBack`) |
| `transactions` (by to/from account + date range, `totalCount`) | `transactions(first!, after, sort, filter)` | Filter `{ fromDate, toDate, categoryId, accountId, type }`, ANDed; `accountId` matches **either side**; **no totalCount** (use `pageInfo.hasNextPage`; offset cursors) |
| `transactionMonthYearListByAccountId` | **none** | |

Other rules:

- `categoryId` is optional (it defaults to "None"). `0` or someone else's
  id → NOT_FOUND.
- Amount currency must equal the account currency (`CURRENCY_MISMATCH`).
  amount and convertedAmount must be > 0 (`NON_POSITIVE_AMOUNT`).
- Transfer from = to → `INVALID_TRANSACTION` (BAD_REQUEST) on
  `transfer` and `patchTransfer`; a patch is checked on its final
  state, so a one-sided move onto the other account fails. Existing
  from = to rows can't be patched at all (2026-10-19).

Dates and sort (backend agent, 2026-10-18):

- `occurredAt` (optional on creates and patches) is the business date;
  it is what `fromDate`/`toDate` filter on. Sort newest first with
  `sort: [{ property: "occurredAt", direction: DESC }]` (`property` goes
  straight to Spring Data; the default is `id ASC`).
- Filter dates: full ISO-8601 with offset (`2026-10-01T00:00:00+07:00`).
  Only the date and offset count: whole days in that offset, `toDate`
  inclusive. `fromDate` > `toDate` → `TRANSACTION_FILTER_INVALID_DATE_RANGE`;
  malformed → `INVALID_DATE_TIME`. A future `occurredAt` is not checked.
- `first` > 50 → `TOO_MANY_ROWS`.

`patch*` (backend agent, 2026-10-18):

- All three: `amount`, `occurredAt`, `categoryId`, `description`. Plus
  `fromAccountId` (Expense, Transfer), `toAccountId` (Income, Transfer),
  `convertedAmount` (Transfer). The id is kept. Type can't change
  (delete + create, new id).
- **Omitted = unchanged.** `categoryId: null` resets to "None",
  `description: null` clears it. For every other argument `null` also
  means unchanged.
- `convertedAmount` can't be cleared: moving a cross-currency transfer
  onto two same-currency accounts → `INVALID_TRANSACTION` (delete and
  re-create instead). Moving to an account in another currency needs a
  matching `amount` in the same patch, else `CURRENCY_MISMATCH`.
- Response balances (`from`/`to { balance }` via fragments) are current.
  An account the transaction was moved **off** isn't in the response,
  so refetch it.
- Reverses the old movement and applies the new one in one DB
  transaction (ADR `Ledger/wiki/Decisions/0007-editing-reverses-and-reapplies.md`).

Schema quirks: `category(id)` is nullable but throws NOT_FOUND;
`transfer` returns a nullable `Transfer`.
