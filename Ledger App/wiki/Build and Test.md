---
type: ops
tags: [tooling, testing]
sources: [package.json, jest.config.json, babel.config.json, src/setupTests.ts, src/tests/, eslint.config.js, .prettierrc]
updated: 2026-10-24
---

# Build and Test

| Task | Command |
|---|---|
| Dev server (port 3000, opens browser) | `yarn start` |
| Dev without a backend | `yarn start` with `VITE_SERVER_URL=http://localhost:3000/mock/graphql`: the v3 mock, seeded with Cash and Bank (from `initializeUser`) and Euro, in memory until restart (sign-in still uses Firebase) |
| Type-check | `yarn compile` |
| Prod build (`tsc && vite build` → `build/`) | `yarn build` |
| Preview build | `yarn preview` |
| Tests | `yarn test` / `yarn jest path/to/file.test.tsx` / `-t "name"` |
| Lint / fix | `yarn lint` / `yarn lint:fix` (ESLint on `./src/`) |
| Format | `yarn format` (Prettier) |
| Regenerate GraphQL types | `yarn gen-gql-model` — [[GraphQL Codegen]] |
| Release | `yarn release` (release-it) — [[CI and Deployment]] |

## Tests

- Jest 30, `jsdom`, Babel transform (`babel.config.json`: env, TS,
  React presets). `transformIgnorePatterns` lets `jotai` be transformed.
- CSS/SCSS mapped to `src/tests/__mocks__/styleMock.js`.
- `src/setupTests.ts`: jest-dom matchers, global `React`, stub
  `ResizeObserver`.
- Coverage: every base component ([[Base Components]]), `AccountCard`
  (snapshot), every service and helper. **No tests for screens**
  (Home, More, TransactionList, Report, Settings, Menu).
- Service tests replace `src/lib/apollo` with `src/tests/mock/mockClient.ts`:
  a real Apollo client on a `SchemaLink` (with validation) over the
  in-memory API v3 in `src/mock/mockV3.ts`, so the real documents run
  against the schema. Call `resetMockV3()` in `beforeEach`; spy on
  `mockClient.query`/`mutate` to force failures. Also mock
  `common/utils.log` (2026-10-19).
- The mock (`src/mock/mockV3.ts`) follows the backend's rules: balances,
  validation order, error codes, paging (≤ 50, offset cursors), and
  whole-day date filters. Keep it in step with [[API v3]].
