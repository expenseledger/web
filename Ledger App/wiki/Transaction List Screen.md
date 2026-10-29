---
type: screen
tags: [ui, screen]
sources: [src/components/transactionList/TransactionList.tsx, src/components/bases/MonthYearSwiper.tsx, src/components/transactionList/TransactionCard.tsx, src/components/transactionList/TransactionCardMessage.tsx, src/service/transactionService.ts]
updated: 2026-10-23
---

# Transaction List Screen

Route `/account/:accountId/transactionList`. One account, one month at
a time, as on `main` ([[API v3 Migration]] § Decided: month navigation).

1. `MonthYearSwiper` over `getTransactionMonthYearList`: every month
   from the account's oldest to newest transaction, newest first,
   **including empty months** ([[Service Layer]]). No transactions →
   the swiper shows "No data".
2. Sliding loads that month with `listTransactions` (every page).
3. "Total" card: the month's signed total ([[Transaction]] sign
   convention) and the **"Paid only"** switch, which hides everything
   except EXPENSE and outgoing TRANSFERs (what was spent from this
   account). The total follows it.
4. Day `TransactionCard`s titled `ddd DD MMM YY`, or "No data" for an
   empty month. Each row is a `TransactionCardMessage` (dark box for
   negative, green for positive) with delete (✕) and edit (✎) modals.
5. An edit that re-dates a row out of the month drops it from the list.
6. "To Top" button scrolls to top.

- Edit modal: amount, category (the tx type's plus ANY, and always its
  current one so saving other edits keeps it), description, date.
- Delete: confirm modal → `deleteTransaction`, then local balance fix.
- A month list failure → navigate home.
- An infinite scroll with month cards was built (2026-10-04) and taken
  out again (2026-10-23) to keep the API v3 PR free of UI changes; it
  may come back in a later UI PR.
- Balance-sync bugs on delete/update: [[Balance Sync]], [[Known Issues]].
