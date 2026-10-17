---
type: ops
tags: [tooling, data]
sources: [codegen.ts, src/service/model/gql/]
updated: 2026-09-25
---

# GraphQL Codegen

- Command: `yarn gen-gql-model` (`graphql-codegen`).
- Config `codegen.ts`: schema = remote production endpoint
  ([[GraphQL API]]); documents = `src/**/*.ts` (so only `.ts` files are
  scanned — operations must live in services, not `.tsx`); preset
  `client` with `fragmentMasking: false`.
- Output: `src/service/model/gql/` (`gql.ts`, `graphql.ts`, `index.ts`),
  **committed** to git.
- Usage: `import { graphql } from "./model/gql"` then
  ``graphql(`query X { ... }`)`` gives a typed document. Generated enums
  (e.g. `AccountType`, `CategoryType`) are used to cast the app's string
  unions from `src/service/constants.ts`.

Run it after any backend schema change and commit the result. Requires
network access to the production endpoint.
