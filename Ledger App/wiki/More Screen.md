---
type: screen
tags: [ui, screen]
sources: [src/components/More.tsx]
updated: 2026-10-19
---

# More Screen

Route `/more`. Full transaction form with Radix `Tabs`: **Expense /
Income / Transfer**.

- Prefilled from [[Home Screen]] router state.
- Account section: one "Account" dropdown (used as `fromAccount` for
  expense and as `toAccount` for income), or "From"/"To" for transfer,
  each list excluding the other's selection. Shows the account balance.
- Category options: all categories, whatever the tab ([[Category]]).
- Changing the from-account sets `backToHomeParam` so the title link
  returns to that account.
- Validation: amount > 0; transfer from ≠ to ([[Transaction]]).
- Cross-currency transfer: when From and To differ in currency, a
  **Converted amount** field (in To's currency) appears and is sent as
  `convertedAmount` (2026-10-19; [[API v3 Data Model]]).
- Amounts show the selected account's currency symbol.
- Failure toasts explain v3 error codes ([[Notifications]]).
- After success patches balances ([[Balance Sync]]).

Bugs remain here (async not awaited, to-account index) — see
[[Known Issues]]. Tested in `src/tests/More.test.tsx` against the v3
mock.
