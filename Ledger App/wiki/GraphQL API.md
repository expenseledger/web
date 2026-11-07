---
type: entity
tags: [backend, api]
sources: [codegen.ts, schema.graphql, src/service/model/gql/graphql.ts]
updated: 2026-10-19
---

# GraphQL API

This page describes **API v2**, which the app used until the v3
cutover on branch `feature/api-v3` (2026-10-19). The app now talks to
**API v3** ([[API v3]], [[API v3 Migration]]); this page is history
until v2 is retired.

Backend: **Postgraphile** over PostgreSQL; source and internals in
[[API v2 Backend]]. Production
endpoint `https://expense-ledger.forestware.org/graphql` (from
`codegen.ts`). Runtime URL(s) come from `VITE_SERVER_URL`
([[Environment Variables]], [[Apollo Client]]).

## Shape

Postgraphile conventions: `Node` interface with `nodeId`, connections
with `nodes`/`edges`/`totalCount`, `condition`/`filter` args, `orderBy`
enums like `NAME_ASC`. Custom business mutations (Postgres functions):
`spend`, `receive`, `transferV2`, `closeAccount`, `currentUser`,
`createCategoryV2`, `transactionMonthYearListByAccountId`.

Core types: `Owner`, `Account`, `Category`, `Transaction` — see
[[Account]], [[Category]], [[Transaction]]. All have `ownerId: String`,
`createdAt`, `updatedAt`.

## Schema sources

Before the cutover, `codegen.ts` pulled the remote v2 schema and the
root `schema.graphql` was a stale v2 copy. Since 2026-10-19
`schema.graphql` is the **v3** schema ([[GraphQL Codegen]]).

See [[GraphQL Codegen]] for regeneration.
