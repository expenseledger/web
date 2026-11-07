---
type: screen
tags: [ui, screen]
sources: [src/components/Home.tsx, src/components/AccountCard.tsx]
updated: 2026-10-23
---

# Home Screen

Route `/`. The fast path: **add an expense** in a few taps.

- **Account carousel**: Swiper (loop, pagination) of `AccountCard`s. Only
  the selected card shows its balance (others animate to 0 via
  `@react-spring/web`). Initial slide = `backToHomeParam.accountId` if present
  ([[Routing and Layout]]).
- Links for the selected account: **Transactions** →
  [[Transaction List Screen]], **Report** → [[Report Screen]] (passes
  `accountId` in router state).
- Form: Amount (with currency prefix), Date (default today), Category
  (EXPENSE and ANY [[Category|categories]]), Description (optional).
- **Add** → `addExpense` ([[Service Layer]]); on success patches the
  balance ([[Balance Sync]]), toasts, clears amount/description.
- **More** → [[More Screen]], carrying the current form values in router
  state (`accountIdx`, `categoryId`, `amount`, `date`).

The picked category is held by id; with none picked, the first option
(the one the dropdown shows) is used.
