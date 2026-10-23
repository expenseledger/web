---
type: screen
tags: [ui, screen, reporting]
sources: [src/components/report/]
updated: 2026-10-23
---

# Report Screen

Route `/report`. Monthly income/expense analytics across one or more
accounts.

- Initial selection: the account passed in router state from
  [[Home Screen]]. `AccountSelection` checkboxes let you add accounts
  (at least one must stay checked). One currency at a time: checking an
  account in another currency switches to that account alone, and the
  report shows that currency's symbol (2026-10-19).
- Month: `MonthYearSwiper` over the merged, deduplicated
  `getTransactionMonthYearList` of the selected accounts, newest first
  (empty months included; [[API v3 Migration]] § Decided: month
  navigation).
- No account selected, or none of them has transactions → empty report
  (no spinner; Known Issue 9).
- Transactions = `listTransactions` per account for the month, flattened,
  **TRANSFERs removed**, sorted by date asc.
- Widgets (recharts):
  - `BarChartReport` — income vs expense per **week bucket** of the month
    (days 1–7, 8–14, …).
  - `PieChartReport` ×2 — income / expense share by category.
  - `TableReport` ×2 — per category: total, count, average, median
    (`getMedian` in `reportHelper.ts`).
- Colors: expense `#ff7285`, income `#0088FE`.

Selecting two accounts that transact with each other isn't a problem
(transfers are excluded).
