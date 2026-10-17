---
type: entity
tags: [backend, api]
sources: [codegen.ts, schema.graphql, src/service/model/gql/graphql.ts]
updated: 2026-09-25
---

# GraphQL API

This page describes **API v2**, the backend the app uses today. A new
backend, **API v3**, will replace it — see [[API v3 Migration]].

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

## Two schema sources (important)

- `codegen.ts` pulls the **remote** schema; generated types in
  `src/service/model/gql/graphql.ts` are current (they include `transferV2`,
  `createCategoryV2`, `update*`, `Category.type`).
- `schema.graphql` in the repo root is **stale**: it lacks those
  mutations and `Category.type`, and has old `transfer`/`createCategory`.
  Don't trust it — see [[Known Issues]]. `.graphqlconfig` points IDE
  tooling at it.

See [[GraphQL Codegen]] for regeneration.
