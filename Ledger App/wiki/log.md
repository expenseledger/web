---
type: meta
tags: [log]
---

# Log

Append-only. Newest at the bottom.

## [2026-09-25] ingest | Initial codebase exploration

Source: whole repo at `7adc27a` (v1.110.0, branch `feature/api-v3`).
Created the wiki: all pages in [[index]]. Recorded 10 bugs and debt in
[[Known Issues]] and backend unknowns in [[Open Questions]].

## [2026-09-25] ingest | API v3 answers from backend agent

Source: backend agent `ledger-api-v3-24` (read-only answers, cites
`ledger-api-v3/` paths). Created [[API v3]], [[API v3 Data Model]],
[[API v3 Operations]], [[API v3 Migration]]. Labelled [[GraphQL API]] as
v2. Added v3 sections to [[Open Questions]] and v3 pointers on
[[Account]], [[Category]], [[Transaction]]. Updated schema with the
backend-agent source and v2/v3 labelling rule.

## [2026-09-25] ingest | API v2 backend source + v3 answers

Sources: `expense-ledger-api` at `82a6110` (cloned via glab), and the
human's answers on v3. Created [[API v2 Backend]]. Updated [[GraphQL API]],
[[Account]], [[Category]], [[Transaction]], [[Known Issues]] (new v2
backend section), [[API v3]] (hostname, Firebase project),
[[API v3 Migration]] (delete behaviour decision, data migration notes),
[[Open Questions]], [[index]].

## [2026-09-25] update | DB timezone, v3 descriptions request

Human: v2 DB session timezone should be `Asia/Bangkok` (UTC+7). Asked
backend agent `ledger-api-v3-bb` (new name, schema updated) to add
transaction descriptions to v3. Touched [[API v2 Backend]],
[[Open Questions]], [[API v3 Migration]], `../CLAUDE.md`.

## [2026-09-25] ingest | v3 transaction descriptions added

Source: backend agent `ledger-api-v3-bb` (uncommitted; files include
`db/migration/V4__add_transaction_description.sql`,
`graphql/TransactionController.kt`, `domain/transaction/*.kt`). Touched
[[API v3 Data Model]], [[API v3 Operations]], [[API v3 Migration]],
[[Open Questions]].

## [2026-09-25] update | v3 transaction editing requested

Asked backend agent `ledger-api-v3-bb` to add a transaction update
mutation (amount, category, description, convertedAmount). Touched
[[API v3 Migration]].

## [2026-09-25] ingest | v3 updateTransaction added

Source: backend agent `ledger-api-v3-bb` (uncommitted; no migration;
`graphql/TransactionController.kt`, `domain/transaction/*.kt`,
`graphql/ControllerAdviser.kt`, ADR 0007). Also new: amount > 0
enforced, typed transaction error codes, row locks. Touched [[API v3]],
[[API v3 Operations]], [[API v3 Migration]], [[Open Questions]].

## [2026-10-04] update | v3 month navigation without a month list

Human decided v3 needs no month list endpoint: an infinite scroll with
month headers on the transaction list, and a free month picker on the
report. Needs the backdating date to be sortable and filterable. Touched
[[API v3 Migration]], [[Transaction List Screen]], [[Report Screen]],
[[Open Questions]].

## [2026-10-04] ingest | month list removed from the app

Code change (uncommitted): `listTransactionsPage` (cursor-paged v2
query) replaces `getTransactionMonthYearList`; `TransactionList.tsx` is
an infinite scroll with month cards; `Report.tsx` uses the new
`MonthPicker`; `MonthYearSwiper` deleted. Known Issue 9 fixed. Touched
[[Transaction List Screen]], [[Report Screen]], [[Service Layer]],
[[Base Components]], [[Tech Stack]], [[Known Issues]],
[[API v3 Migration]].

## [2026-10-18] lint | Report Screen doesn't use category types

Checked `src/components/report/`: income/expense split uses the
transaction type, and grouping uses the category name. Losing v3
category types doesn't affect the report. Corrected the Report row in
[[API v3 Migration]].

## [2026-10-18] ingest | account and category types removed

Code change (uncommitted): `type` gone from `Account`/`Category` models,
queries, settings, and category pickers (Home, More, transaction edit).
v2 creates send `CASH`/`ANY`. Account/category edit modals, the
"Adjust balance" transaction, `updateAccount`/`updateCategory`, and
`categoryHelper.ts` deleted. Codegen regenerated with scalars pinned to
`any`. Decision: v3 balance edit sets the balance directly. Known Issue 5
fixed. Touched [[Account]], [[Category]], [[Settings Screens]],
[[Home Screen]], [[More Screen]], [[Transaction List Screen]],
[[Service Layer]], [[Known Issues]], [[GraphQL Codegen]], [[Overview]],
[[API v3 Migration]], [[index]].

## [2026-10-18] update | account delete: transfer rewrite, no soft close

Human decision: no soft close (archived rows keep unique names). v3
account delete rewrites transfers with the remaining account into an
Expense/Income on that account, so its balance is kept and matches its
history. Added deleted-account transfers as a third balance-drift cause
for migration. Touched [[API v3 Migration]], [[Open Questions]].

## [2026-10-18] update | category delete: reassign only, protect None

Human decision: deleting a v3 category reassigns its transactions
(default "None"); no Cascade or Leave for categories. "None" must not
be deletable. The human will raise both with the backend. Touched
[[API v3 Migration]].

## [2026-10-18] update | backend proposal for deleteAccount

Briefed backend agent `ledger-api-v3-24` on the desired account delete.
Recorded its draft: `deleteAccount(id, moveTransactionsTo)` returning a
payload; Leave dropped for accounts; in-place transfer rewrite. Noted
the `committedAt` → `occurredAt` rename (V5). Touched
[[API v3 Migration]], [[API v3 Data Model]], [[Open Questions]].

## [2026-10-18] update | deleteAccount with history implemented

Backend agent: implemented (local, not pushed) with a cut scope.
Signature stays `deleteAccount(id): ID!`; always cascades D's own
transactions and rewrites transfers; no Reassign/Leave. Replaced the
draft proposal. Touched [[API v3 Migration]], [[API v3 Operations]],
[[API v3 Data Model]].
