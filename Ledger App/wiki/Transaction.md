---
type: entity
tags: [domain]
sources: [src/service/model/Transaction.ts, src/service/transactionService.ts, src/service/helper/transactoinHelper.ts, src/components/transactionList/TransactionList.tsx]
updated: 2026-09-25
---

# Transaction

```ts
interface Transaction {
  id: number; type: "EXPENSE" | "INCOME" | "TRANSFER";
  amount: number;            // always positive on the server
  fromAccount?: Account; toAccount?: Account;
  category?: Category; description: string; date: Date;
}
```

| Type | Accounts | Mutation | Effect on balance (server) |
|---|---|---|---|
| EXPENSE | `fromAccount` | `spend` | from −amount |
| INCOME | `toAccount` | `receive` | to +amount |
| TRANSFER | both | `transferV2` | from −amount, to +amount |

## Sign convention (client-side)

Amounts are stored positive; the **sign is derived by perspective**:

- [[Transaction List Screen]] `getAmount`: EXPENSE → −, INCOME → +,
  TRANSFER → + if `toAccount` is the viewed account else −.
- `report/reportHelper.getAmount`: EXPENSE → −, everything else +
  (TRANSFERs are filtered out before reporting anyway).

## Fields and rules

- `description` is required by the API; forms send `"-"` when empty.
- `categoryId` is required by the add mutations; forms fall back to `0`
  if no category is selected. The server rejects `0` (FK violation: no
  category has id 0). `null` would silently do nothing (functions are
  `STRICT`, see [[API v2 Backend]]).
- v1 `transfer` had no category; `transferV2` added `categoryId`.
- `date` sent as `occurredAt`; forms use day precision (`YYYY-MM-DD` →
  `dayjs(...).toDate()`, i.e. local midnight).
- Editable: amount, category, description, date. **Not** editable: type
  or accounts (`updateTransaction` input).
- Amount validation (client): must parse and be > 0.
- Transfer validation: from ≠ to.

See [[Balance Sync]] for how the UI updates balances afterwards, and
[[Known Issues]] for sync bugs on delete/update.

## In API v3

Differs significantly — see [[API v3 Data Model]].
