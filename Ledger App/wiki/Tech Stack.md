---
type: concept
tags: [architecture, tooling]
sources: [package.json, vite.config.ts, babel.config.json, jest.config.json]
updated: 2026-10-04
---

# Tech Stack

| Concern | Choice |
|---|---|
| UI | React 19, TypeScript, React Compiler (babel plugin) |
| Build | Vite 8 (+ rolldown babel plugin), output `build/`, dev port 3000 |
| PWA | `vite-plugin-pwa` (autoUpdate, standalone), `vite-plugin-svgr` |
| Components | `@radix-ui/themes` (+ icons, toggle-group) — see [[Base Components]] |
| Styling | styled-components 6, SCSS (`src/index.scss`), `src/styles.css` |
| Animation | `motion` (page/menu transitions), `react-spring` (card balances) |
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
| Package mgr | Yarn 4.17.1, Node ≥ 22 (CI uses Node 26) |

Notes:

- `rxjs`, `uuid`, `react-snowfall` are dependencies; `uuid` is used for
  toast ids ([[Notifications]]). `rxjs`/`react-snowfall` usage not found in
  `src/` (inferred: leftovers).
- The README lists "Batch update (timer)" as a feature; no such code exists
  now (inferred: removed or never built).
