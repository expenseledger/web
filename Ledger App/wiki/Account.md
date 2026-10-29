---
type: entity
tags: [domain]
sources: [src/service/model/Account.ts, src/service/constants.ts, src/service/accountService.ts, src/components/setting/AccountSetting.tsx]
updated: 2026-10-30
---

# Account

A money container owned by the user.

```ts
interface Account { id: string; name: string; balance: number; currency: Currency }
```

- `id` is a `string` since the v3 migration: v3 exposes ids as GraphQL
  `ID`, which serializes as a string ([[API v3 Data Model]]).
- **No type in the app** (2026-10-18). v2 still stores CASH/BANK/CREDIT;
  `createAccount` always sends `CASH` because v2 requires one. API v3 has
  no account type.

- `balance` is authoritative on the **server** (updated by the
  transaction mutations); the client mirrors it in `accountsState`
  ([[State Management]], [[Balance Sync]]).
- Created with balance 0. Names are unique per owner (schema has
  `accountByNameAndOwnerId`).
- "Delete" calls `closeAccount`, which is a **hard delete**: all its
  transactions are cascade-deleted, and the other side of its transfers
  keeps its balance change ([[API v2 Backend]], [[Known Issues]]).
- New users get "Cash" (CASH) and "My Bank" (BANK) seeded by the server.
- **No editing for now** (2026-10-18): rename and balance edit were
  removed with the type. The human will reimplement name + balance
  editing on v3. Planned: setting a balance changes the account's balance
  **directly**, not via an "Adjust balance" transaction (the v2 app
  posted a phantom INCOME/EXPENSE under category "Other"). Back on v3
  via `patchAccount` (2026-10-19; [[Settings Screens]]).
- Home shows accounts as a swipeable card carousel (6 gradient colors
  cycling by index) — [[Home Screen]].

## In API v3

Differs significantly — see [[API v3 Data Model]].
