# Copilot instructions for expense-ledger-web

Build / Test / Lint

- Start dev server: yarn start
- Build (prod): yarn build  (runs tsc && vite build)
- Type-check only: yarn compile
- Preview production build: yarn preview
- Run tests (Jest): yarn test
  - Run a single test file: yarn jest <path/to/file.test.(ts|tsx)>  (e.g. yarn jest src/tests/My.test.tsx)
  - Run by test name: yarn jest -t "pattern" or yarn test -- -t "pattern"
- Lint: yarn lint
  - Fix autofixable issues: yarn lint:fix
- Format: yarn format
- Generate GraphQL client/models: yarn gen-gql-model
- Release (release-it): yarn release

Notes: the repository uses yarn@4 (see package.json). Node >= 22 is expected.

High-level architecture

- Frontend: React + TypeScript, built with Vite.
- Data: GraphQL (Apollo Client) communicating with a Postgraphile backend. GraphQL schema is referenced at codegen.ts (remote schema) and schema.graphql.
- State: Jotai for local state management; service layer under src/service (accountService, transactionService, userService, etc.).
- Auth: Firebase (initialization in src/lib/firebase.ts). Environment variables use import.meta.env (VITE_*).
- GraphQL codegen: config in codegen.ts; generated types/models land under src/service/model/gql/.
- Styling: styled-components and SCSS; global styles in src/index.scss and styles.css.
- Tests: Jest + @testing-library/react. Jest config is in jest.config.json; CSS modules are mocked (see src/tests/__mocks__/styleMock.js).
- Deployment / CI: Vercel for hosting; GitHub Actions workflows in .github/workflows run build + test on PRs and releases.

Key conventions

- Service layer pattern: keep API/GraphQL calls inside src/service/*; components should use services or the generated gql client rather than calling fetch directly.
- GraphQL codegen: run `yarn gen-gql-model` after schema changes. Generated files are committed under src/service/model/gql/ (watch for updates on codegen run).
- Env vars: runtime config uses VITE_ prefix and import.meta.env (e.g., VITE_SERVER_URL, VITE_FIREBASE_*). Do not commit secrets to the repo; use project-level environment variables in CI/Vercel.
- Tests: put unit tests under src/tests or alongside components; run specific tests with the jest CLI for faster feedback.
- Linting/Formatting: eslint configured for ./src/ and Prettier is used via `yarn format`. Prefer `yarn lint:fix` before committing.
- Fonts and static assets: stored in src/assets; reference them directly from components using relative imports.
- CSS mocking for tests: jest moduleNameMapper maps scss/css to src/tests/__mocks__/styleMock.js — update if changing styling approach.

Files and places to check quickly

- package.json: scripts and packageManager (yarn@4)
- codegen.ts and schema.graphql: GraphQL codegen and schema
- src/lib/firebase.ts: Firebase setup (uses VITE_* env vars)
- src/service/: centralized API/service logic
- src/service/model/gql/: generated GraphQL client/types
- .github/workflows/: CI that runs yarn build && yarn test

Notes for Copilot sessions

- Prefer referencing generated GraphQL models in src/service/model/gql/ when suggesting type-safe data access.
- Respect the Vite import.meta.env pattern when proposing environment variables or runtime config changes.
- Suggest running `yarn gen-gql-model` after schema edits and include the path to generated artifacts when referring to types.
- Keep suggestions scoped to front-end concerns; backend is Postgraphile and lives outside this repo.

If this file already exists, integrate these sections rather than overwriting unrelated guidance.
