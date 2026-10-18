---
type: ops
tags: [tooling, testing]
sources: [package.json, jest.config.json, babel.config.json, src/setupTests.ts, src/tests/, eslint.config.js, .prettierrc]
updated: 2026-10-18
---

# Build and Test

| Task | Command |
|---|---|
| Dev server (port 3000, opens browser) | `npm start` |
| Type-check | `npm run compile` |
| Prod build (`tsc && vite build` → `build/`) | `npm run build` |
| Preview build | `npm run preview` |
| Tests | `npm test` / `npx jest path/to/file.test.tsx` / `-t "name"` |
| Lint / fix | `npm run lint` / `npm run lint:fix` (ESLint on `./src/`) |
| Format | `npm run format` (Prettier) |
| Regenerate GraphQL types | `npm run gen-gql-model` — [[GraphQL Codegen]] |
| Release | `npm run release` (release-it) — [[CI and Deployment]] |

## Tests

- Jest 30, `jsdom`, Babel transform (`babel.config.json`: env, TS,
  React presets). `transformIgnorePatterns` lets `jotai` be transformed.
- CSS/SCSS mapped to `src/tests/__mocks__/styleMock.js`.
- `src/setupTests.ts`: jest-dom matchers, global `React`, stub
  `ResizeObserver`.
- Coverage: every base component ([[Base Components]]), `AccountCard`
  (snapshot), every service and helper. **No tests for screens**
  (Home, More, TransactionList, Report, Settings, Menu).
- Service tests mock `src/lib/apollo` (`query`/`mutate` as `jest.fn()`)
  and `common/utils.log` — follow this pattern for new services.
