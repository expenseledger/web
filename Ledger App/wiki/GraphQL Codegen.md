---
type: ops
tags: [tooling, data]
sources: [codegen.ts, schema.graphql, src/service/model/gql/]
updated: 2026-10-19
---

# GraphQL Codegen

- Command: `npm run gen-gql-model` (`graphql-codegen`).
- Config `codegen.ts`: schema = the local `schema.graphql`, a copy of
  the v3 `schema.graphqls` plus the `*Connection`/`*Edge`/`PageInfo`
  types Spring for GraphQL generates at runtime ([[API v3]]); documents
  = `src/**/*.ts` minus `src/tests/` and `src/mock/` (operations must
  live in services, not `.tsx`); preset `client` with
  `fragmentMasking: false`.
- Output: `src/service/model/gql/` (`gql.ts`, `graphql.ts`, `index.ts`),
  **committed** to git.
- Usage: `import { graphql } from "./model/gql"` then
  ``graphql(`query X { ... }`)`` gives a typed document.
- `graphql.ts` holds only types the documents use (not the whole
  schema).

Refresh `schema.graphql` by hand from `../ledger-api-v3` when the
backend schema changes, then run codegen and commit the result.

Codegen runs Prettier on its output (`hooks.afterAllFileWrite`), since
it otherwise drops the final newline of `gql/index.ts` and fails lint.

⚠ `graphql()` looks documents up by their **exact source text**; a
miss returns an empty document and the operation fails silently at
runtime. So `.prettierrc` sets `embeddedLanguageFormatting: "off"`:
Prettier no longer reformats queries behind codegen's back
(2026-10-19). After editing a query by hand, still run codegen; the
mock-backed service tests fail if you forget ([[Build and Test]]).
