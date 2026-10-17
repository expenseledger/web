---
type: entity
tags: [domain]
sources: [src/service/model/Account.ts, src/service/constants.ts, src/service/accountService.ts, src/components/setting/AccountSetting.tsx]
updated: 2026-09-25
---

# Account

A money container owned by the user.

```ts
interface Account { id: number; name: string; type: AccountType; balance: number }
type AccountType = "CASH" | "BANK" | "CREDIT"   // UI: Cash / Bank Account / Credit
```

- `balance` is authoritative on the **server** (updated by the
  transaction mutations); the client mirrors it in `accountsState`
  ([[State Management]], [[Balance Sync]]).
- Created with balance 0. Names are unique per owner (schema has
  `accountByNameAndOwnerId`).
- "Delete" calls `closeAccount`, which is a **hard delete**: all its
  transactions are cascade-deleted, and the other side of its transfers
  keeps its balance change ([[API v2 Backend]], [[Known Issues]]).
- New users get "Cash" (CASH) and "My Bank" (BANK) seeded by the server.
- **Manual balance adjustment** ([[Settings Screens]]): editing the balance
  creates an INCOME or EXPENSE [[Transaction]] for the difference, with
  description "Adjust balance" and category "Other" (auto-created as type
  ANY if missing).
- Home shows accounts as a swipeable card carousel (6 gradient colors
  cycling by index) — [[Home Screen]].
- Account type has no behavioral effect in the frontend (credit accounts
  aren't treated differently).

## In API v3

Differs significantly — see [[API v3 Data Model]].
