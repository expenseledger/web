---
type: screen
tags: [ui, screen]
sources: [src/components/transactionList/TransactionList.tsx, src/components/transactionList/TransactionCard.tsx, src/components/transactionList/TransactionCardMessage.tsx, src/service/transactionService.ts]
updated: 2026-10-18
---

# Transaction List Screen

Route `/account/:accountId/transactionList`. One account, infinite
scroll, newest first. No month list (decision: [[API v3 Migration]] §
Decided: month navigation).

1. `listTransactionsPage` loads 50 at a time (`PAGE_SIZE`), following
   `endCursor` — see [[Service Layer]]. Pages are merged by id and
   re-sorted, so an edited (re-dated) row never shows twice.
2. More loads when the "Load more" button scrolls into view
   (`IntersectionObserver`) or is clicked.
3. Rows group into **month cards** ("MMMM YYYY" plus the month's signed
   total, [[Transaction]] sign convention), then day `TransactionCard`s
   titled `ddd DD MMM YY`. Each row is a `TransactionCardMessage` (dark
   box for negative, green for positive) with delete (✕) and edit (✎)
   modals.
4. The last loaded month has **no total** while more pages exist, since
   it may be incomplete.
5. **"Paid only"** switch: hides everything except EXPENSE and outgoing
   TRANSFERs (i.e. what was spent from this account). Totals follow it.
6. "To Top" button scrolls to top.

- Edit modal: amount, category (all), description, date.
- Delete: confirm modal → `deleteTransaction`, then local balance fix.
- First page fails → navigate home; a later page fails → toast.
- Balance-sync bugs on delete/update: [[Balance Sync]], [[Known Issues]].
