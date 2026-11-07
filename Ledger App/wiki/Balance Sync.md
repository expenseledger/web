---
type: concept
tags: [domain, state]
sources: [src/components/Home.tsx, src/components/More.tsx, src/components/transactionList/TransactionList.tsx, src/components/setting/AccountSetting.tsx]
updated: 2026-09-25
---

# Balance Sync

The server owns account balances, but the client never re-fetches accounts
after the initial `currentUser` load ([[Routing and Layout]]). Instead each
screen **patches `accountsState` by hand** after a mutation
([[State Management]]):

| Action | Where | How the local balance is patched |
|---|---|---|
| Add expense | [[Home Screen]], [[More Screen]] | Copy `fromAccount.balance` from response (matched by **name**) |
| Add income | [[More Screen]] | Copy `toAccount.balance` from response (by name) |
| Add transfer | [[More Screen]] | Copy both balances from response (by **id**) |
| Delete tx | [[Transaction List Screen]] | Recompute locally: INCOME → −amount, else +amount, only for the viewed account |
| Update tx | [[Transaction List Screen]] | **Not patched** |
| Edit balance | [[Settings Screens]] | Set to the typed value after the adjust tx succeeds |

Server-returned balances are trustworthy; the local recomputations are
where drift appears (see [[Known Issues]]). A full reload always resyncs.

Design takeaway: any new mutation that changes balances must also update
`accountsState`, ideally from the balances in the mutation response.
