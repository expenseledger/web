---
type: concept
tags: [architecture, tooling]
sources: [package.json, eslint.config.js, vite.config.ts, babel.config.json, jest.config.json]
updated: 2026-10-18
---

# Tech Stack

| Concern | Choice |
|---|---|
| UI | React 19, TypeScript, React Compiler (babel plugin) |
| Build | Vite 8 (+ rolldown babel plugin), output `build/`, dev port 3000 |
| PWA | `vite-plugin-pwa` (autoUpdate, standalone), `vite-plugin-svgr` |
| Components | `@radix-ui/themes` (+ icons, toggle-group) — see [[Base Components]] |
| Styling | styled-components 6, SCSS (`src/index.scss`), `src/styles.css` |
| Animation | `motion` (page/menu transitions), `@react-spring/web` (card balances) |
| Carousels | `swiper` (account cards) |
| Charts | `recharts` — see [[Report Screen]] |
| Data | `@apollo/client` 4 + `graphql` — see [[Apollo Client]] |
| Codegen | `@graphql-codegen/cli` client preset — see [[GraphQL Codegen]] |
| State | `jotai` 3 — see [[State Management]] |
| Auth | `firebase` 12 + `react-firebaseui` — see [[Authentication]] |
| Dates | `dayjs` with utc/timezone plugins (`src/lib/dayjs.ts`) |
| Routing | `react-router-dom` 7 — see [[Routing and Layout]] |
| Tests | Jest 30 + jsdom + Testing Library, Babel transform — see [[Build and Test]] |
| Hosting | Vercel — see [[CI and Deployment]] |
| Package mgr | npm (`package-lock.json`), Node ≥ 22 (CI uses Node 26) |

Notes:

- Switched from Yarn 4 to npm on 2026-10-18. The lockfile was seeded
  from yarn's tree, so versions match it (a newer `styled-components`
  changes class hashes and breaks the `AccountCard` snapshot).
- npm enforces peer dependencies, which yarn only warned about:
  - `react-firebaseui` (and `firebaseui`) have no release for React 19
    or Firebase 12; `overrides` in `package.json` forces our versions.
    Unsupported: check it first if sign-in misbehaves.
  - TypeScript 7 has no API, so `typescript` is aliased to
    `@typescript/typescript6` for typescript-eslint, and
    `@typescript/native` (TS 7) provides `tsc`.
  - `graphql` stays on 16: Apollo's `graphql-tag` and codegen don't
    support 17.
  - ESLint 10 uses `@eslint-react/eslint-plugin` (eslint-plugin-react
    is unmaintained); its duplicate hook rules are off in favour of
    `react-hooks`.
- `rxjs`, `uuid`, `react-snowfall` are dependencies; `uuid` is used for
  toast ids ([[Notifications]]). `rxjs`/`react-snowfall` usage not found in
  `src/` (inferred: leftovers).
- The README lists "Batch update (timer)" as a feature; no such code exists
  now (inferred: removed or never built).
