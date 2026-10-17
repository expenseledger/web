---
type: screen
tags: [ui, screen]
sources: [src/components/More.tsx]
updated: 2026-09-25
---

# More Screen

Route `/more`. Full transaction form with Radix `Tabs`: **Expense /
Income / Transfer**.

- Prefilled from [[Home Screen]] router state.
- Account section: one "Account" dropdown (used as `fromAccount` for
  expense and as `toAccount` for income), or "From"/"To" for transfer,
  each list excluding the other's selection. Shows the account balance.
- Category options filtered by active tab type + ANY ([[Category]]).
- Changing the from-account sets `backToHomeParam` so the title link
  returns to that account.
- Validation: amount > 0; transfer from ≠ to ([[Transaction]]).
- After success patches balances ([[Balance Sync]]).

Several bugs live here (async not awaited, default date, to-account
index) — see [[Known Issues]].
