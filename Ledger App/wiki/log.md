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

## [2026-10-18] update | switch from Yarn to npm

Replaced Yarn 4 with npm: `package-lock.json` (seeded from yarn's tree,
same versions), `.npmrc` with `legacy-peer-deps`, CI uses `npm ci` and
`npx vercel`. Touched [[Tech Stack]], [[Build and Test]],
[[CI and Deployment]], [[GraphQL Codegen]].

## [2026-10-18] update | resolve peer dependency conflicts

Dropped `legacy-peer-deps`. Human decisions: keep `react-firebaseui`
via `overrides`; replace eslint-plugin-react with `@eslint-react`;
downgrade graphql to 16. Also aliased `typescript` to the TS 6 API
package and swapped `react-spring` for `@react-spring/web`. Lint works
again. Touched [[Tech Stack]], [[Authentication]], [[Home Screen]].

## [2026-10-18] update | deleteAccount with history implemented

Backend agent: implemented (local, not pushed) with a cut scope.
Signature stays `deleteAccount(id): ID!`; always cascades D's own
transactions and rewrites transfers; no Reassign/Leave. Replaced the
draft proposal. Touched [[API v3 Migration]], [[API v3 Operations]],
[[API v3 Data Model]].

## [2026-10-18] update | deleteCategory implemented

Briefed the backend agent on category delete; it implemented it (local,
not pushed). Signature stays `deleteCategory(id): ID!`; transactions
always move to "None"; deleting "None" fails with
`CATEGORY_UNDELETABLE`. Touched [[API v3 Migration]],
[[API v3 Operations]], [[API v3 Data Model]], [[API v3]].

## [2026-10-18] update | hide None's delete button

Category settings hide the delete ✕ for "None" (matched by name), which
v3 refuses to delete. Touched [[Settings Screens]], [[API v3 Migration]].

## [2026-10-18] ingest | v3 status recheck with backend agent

Asked `ledger-api-v3-14` what v3 `main` covers. New: backdating via
`occurredAt`; `patch*` replaced `updateTransaction`; `deleteTransaction`
replaced `rollBack` (returns only the id); full error enum; 27 commits
unpushed. Still missing: account/category rename, direct balance set,
from ≠ to, import. Touched [[API v3 Migration]], [[API v3 Operations]],
[[API v3 Data Model]], [[API v3]], [[Open Questions]].

## [2026-10-19] ingest | v3 expectations check with backend agent

Sent `ledger-api-v3-d0` our expectations. Done: `patchAccount` (rename,
direct balance set), `patchCategory` (rename), `NAME_TAKEN`;
`CATEGORY_UNDELETABLE` renamed `CATEGORY_PROTECTED`. By design (human
confirmed): no opening balance validation (overdraft allowed), and
`convertedAmount` can't be cleared. 56 commits unpushed;
issuer must come from env. from ≠ to in progress by another agent.
Touched [[API v3 Migration]], [[API v3 Operations]],
[[API v3 Data Model]], [[API v3]], [[Open Questions]], [[Account]],
[[Category]].

## [2026-10-19] ingest | from ≠ to confirmed

Backend agent `ledger-api-v3-89`: T6 done on local `main` (`4194744`),
not pushed, schema unchanged. `transfer`/`patchTransfer` reject from =
to with `INVALID_TRANSACTION`; domain check only, so existing from = to
rows can't be patched at all. Touched [[API v3 Migration]],
[[API v3 Operations]], [[API v3]].

## [2026-10-19] update | from = to rows: remove if found

Backend human decided: no DB constraint for now; existing from = to
transfers, if any, will be removed by a migration. Touched
[[API v3 Migration]].

## [2026-10-19] update | migrate the app to API v3

Human picked a full cutover, per-account currency, a copied schema and
an in-memory mock. Added `src/mock/mockV3.ts` and moved every service,
document and screen to v3 on `feature/api-v3`. `VITE_SERVER_URL` is now
the full endpoint. Found: Prettier breaks the `graphql()` lookup until
codegen reruns. Touched [[API v3 Migration]], [[API v3]],
[[GraphQL API]], [[GraphQL Codegen]], [[Build and Test]],
[[State Management]], [[Settings Screens]], [[Apollo Client]],
[[Environment Variables]], [[Bottom Menu]], [[Overview]].

## [2026-10-19] update | account edit modal

Account settings edit name and balance through `patchAccount`; the
balance is set directly. Touched [[Settings Screens]], [[Account]],
[[API v3 Migration]].

## [2026-10-19] update | category rename

Category settings rename through `patchCategory`; "None" has no edit
button. Touched [[Settings Screens]], [[Category]], [[API v3 Migration]].

## [2026-10-19] update | error toasts, More date bug, cross-currency transfers

Failure toasts describe v3 error codes. Fixed More's invalid default
date (broke every add on v3). More asks for a converted amount when a
transfer crosses currencies. Codegen now runs Prettier on its output.
Touched [[Notifications]], [[More Screen]], [[Known Issues]],
[[API v3 Migration]].

## [2026-10-19] update | one-currency reports, dev mock server

Reports keep to one currency. `npm start` serves the v3 mock at
`/mock/graphql`. Touched [[Report Screen]], [[Build and Test]],
[[GraphQL Codegen]], [[API v3 Migration]].

## [2026-10-19] update | More bugs fixed, Prettier off for GraphQL

Fixed More's unawaited submit and To-account default (and Dropdown's
loop on empty options). Prettier no longer formats embedded GraphQL,
so `graphql()` lookups can't silently miss. Touched [[Known Issues]],
[[More Screen]], [[GraphQL Codegen]].

## [2026-10-19] update | handle HTTP 401 from API v3

New `unauthorizedLink`: refresh the token and retry once, then sign
out. Touched [[Apollo Client]], [[Authentication]].

## [2026-10-19] update | fix Apollo retry link order

Moved the link chain into `createLink` (`lib/apolloLink.ts`) and put
the retry link before the HTTP link; it skips 4xx. Touched
[[Apollo Client]], [[Known Issues]].

## [2026-10-21] update | local API blocks browser CORS preflight

UI test against `localhost:8080` stuck on Loading: preflight gets 401
with no CORS headers. Asked the backend to enable CORS. Touched
[[API v3]], [[Known Issues]].

## [2026-10-21] update | UI test against the local API

After the backend enabled CORS, ran Home, More (expense, income,
transfer), Transaction List (delete, edit), Report and Account
settings on `localhost:8080`; all worked. Known Issues 7 and 8 are
already fixed; found 12 (stale edit form after a delete). Touched
[[Known Issues]], [[API v3]].

## [2026-10-21] update | fix stale edit form after a delete

`TransactionCard` keys rows by transaction id, not index. Touched
[[Known Issues]].

## [2026-10-21] update | stable list keys everywhere

Fixed the settings list dropping a pending delete (issue 13) and keyed
the other lists (account slides, dropdown options, pie cells, day
cards) by stable values. Touched [[Known Issues]].

## [2026-10-21] update | dev proxy to the deployed API v3

`npm start` proxies `/api/v3` to `ledger.forestware.org` with `Origin`
stripped, so local dev needs no CORS change on the API. Touched
[[Environment Variables]].

## [2026-10-21] update | switch back from npm to Yarn

Restored Yarn 4.17.1 (`.yarnrc.yml`, `.yarn/releases`, `yarn.lock`
seeded from the pre-npm lockfile). The npm peer-dependency fixes stay;
`overrides` is gone. CI uses `yarn install` and `yarn dlx vercel`.
Touched [[Tech Stack]], [[Build and Test]], [[CI and Deployment]],
[[GraphQL Codegen]], [[Authentication]], [[Environment Variables]].

## [2026-10-21] query | no /graphql suffix on API v3

Recorded why the public endpoint stays `/api/v3`: the version belongs
to the GraphQL API. Compared GitHub, GitLab, Shopify and Yelp. Touched
[[API v3]], new [[API Path Conventions]], [[index]].

## [2026-10-22] update | API path moves to /api/graphql

Replaces the 2026-10-21 decision: no version in the path, like GitLab.
The dev proxy and `.sample.env` now use `/api/graphql`; the ingress
change is requested from dotta-8f and pending. Touched [[API v3]],
[[API Path Conventions]], [[Environment Variables]], [[Overview]],
[[API v3 Migration]].

## [2026-10-22] update | /api/graphql route ready

The deploy agent added the `/api/graphql` route; it's live once its
repo's main is pushed. Touched [[API v3]].

## [2026-10-22] update | drop /api/v3 without a transition

Nothing uses `/api/v3`, so its rule is removed along with adding
`/api/graphql` (requested from dotta-8f). Touched [[API v3]].

## [2026-10-22] update | /api/graphql live

Deployed (main@8c1ffae): `/api/graphql` answers 401 without a token,
`/api/v3` 404. Touched [[API v3]], [[Environment Variables]].

## [2026-10-23] update | bring back category type

Human decision: categories get ANY/EXPENSE/INCOME/TRANSFER again so
forms list only fitting categories; UI filter only, no server check.
Waits on v3 adding the field. Touched [[API v3 Migration]],
[[Category]].

## [2026-10-23] ingest | category type back in the app and v3

Backend agent `ledger-api-v3-d8` implemented the type (main@9f27aad,
local, not deployed). App: schema, mock, service, `categoriesFor`
filter on Home, More and the transaction edit modal, type on category
create/edit. Pickers hold the category by id. Touched [[Category]],
[[API v3 Data Model]], [[API v3 Operations]], [[API v3 Migration]],
[[Home Screen]], [[More Screen]], [[Transaction List Screen]],
[[Settings Screens]], [[Known Issues]], [[Service Layer]], [[index]].

## [2026-10-23] update | month swiper back for the API v3 PR

Human decision: restore `main`'s month swiper on the transaction list
and report so the API v3 PR has no UI change; UI work goes in a later
PR. Months come from the oldest and newest transaction, empty months
included; no backend change. Known Issue 9's fix kept. Branch
`feature/api-v3-month-swiper`. Touched [[Transaction List Screen]],
[[Report Screen]], [[Service Layer]], [[Base Components]],
[[API v3 Migration]], [[index]].

## [2026-10-24] ingest | default accounts and the "Other" category

Backend agent `ledger-api-v3-65` (main@c5f644c and @592f9f5, local,
not deployed): `initializeUser(currency = THB)` also seeds "Cash" and
"Bank" at 0; the default category "None" is now "Other" (migration
V7). App on `feature/api-v3`: schema, mock (seeds once, like the
server's `isInitialized`), dev mock, the "Other" checks and tests.
Touched [[API v3]], [[API v3 Data Model]], [[API v3 Operations]],
[[API v3 Migration]], [[Category]], [[Settings Screens]],
[[Build and Test]].

## [2026-10-24] test | App against local API v3

Drove the app in Chrome against `localhost:8080`. `.env`
`VITE_SERVER_URL=/graphql` 404'd (the dev proxy only maps
`/api/graphql`); pointed it at `http://localhost:8080/graphql`.
Home/More add, edit, delete, transfers, Report, account and category
settings work. Added issues 14–16 to [[Known Issues]]. Sent API findings
(`first` ≤ 0, unvalidated names, case-sensitive NAME_TAKEN, category
type not enforced, sub-unit amounts, nullability) to backend agent
`ledger-api-v3-8f`.

## [2026-10-24] ingest | Backend answers to the test findings

Source: backend agent `ledger-api-v3-8f`. Added "Findings from app
testing" to [[API v3]].

## [2026-10-24] change | Round money to the currency's minor unit

Services round amounts and balances before sending (`roundMoney`,
`currencyDecimals`). Updated [[Service Layer]] and [[API v3]].

## [2026-10-24] update | PR #131 split

Human decision: PR #131 (`feature/api-v3`) keeps only the API
migration and the wiki; tooling, `main`'s existing bugs and new UX
go to `chore/tooling`, `fix/stable-list-keys` and
`feature/one-currency-report`, stacked on it and left stale for now.
Added [[PR Split]]. Not yet in `index.md`; [[Known Issues]] 16 still
reads the split as a regression.

## [2026-10-24] lint | Known Issues 16 vs PR Split

Removed [[Known Issues]] 16: the missing stable keys and one-currency
reports are by design ([[PR Split]]). Marked 14–15 as `main` bugs for a
separate PR. Added [[PR Split]] to [[index]].
