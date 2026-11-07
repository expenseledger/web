---
type: concept
tags: [architecture, tooling]
sources: [package.json, eslint.config.js, vite.config.ts, babel.config.json, jest.config.json]
updated: 2026-10-21
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
| Package mgr | Yarn 4 (`yarn.lock`, `node-modules` linker), Node ≥ 22 (CI uses Node 26) |

Notes:

- Switched to npm on 2026-10-18 and back to Yarn 4 on 2026-10-21. Each
  lockfile was seeded from the previous one, so versions match (a newer
  `styled-components` changes class hashes and breaks the `AccountCard`
  snapshot).
- Peer-dependency fixes made for npm, kept under yarn:
  - `react-firebaseui` (and `firebaseui`) have no release for React 19
    or Firebase 12; yarn only warns (YN0060). Unsupported: check it
    first if sign-in misbehaves.
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
