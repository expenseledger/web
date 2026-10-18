---
type: ops
tags: [tooling, data]
sources: [codegen.ts, src/service/model/gql/]
updated: 2026-10-18
---

# GraphQL Codegen

- Command: `yarn gen-gql-model` (`graphql-codegen`; `npx graphql-codegen`
  without yarn).
- Config `codegen.ts`: schema = remote production endpoint
  ([[GraphQL API]]); documents = `src/**/*.ts` (so only `.ts` files are
  scanned — operations must live in services, not `.tsx`); preset
  `client` with `fragmentMasking: false`; scalars `Cursor` and
  `Datetime` pinned to `any` (newer codegen defaults them to `unknown`).
- Output: `src/service/model/gql/` (`gql.ts`, `graphql.ts`, `index.ts`),
  **committed** to git.
- Usage: `import { graphql } from "./model/gql"` then
  ``graphql(`query X { ... }`)`` gives a typed document.
- `graphql.ts` holds only types the documents use (not the whole
  schema).

Run it after any backend schema change and commit the result. Requires
network access to the production endpoint.
