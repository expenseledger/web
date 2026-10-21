---
type: ops
tags: [config]
sources: [.sample.env, src/lib/firebase.ts, src/lib/rr.ts, src/env.d.ts, vite.config.ts]
updated: 2026-10-22
---

# Environment Variables

Vite-style: `VITE_*`, read via `import.meta.env`. Template:
`.sample.env`; real `.env` is git-ignored.

| Var | Used by | Notes |
|---|---|---|
| `VITE_SERVER_URL` | `src/lib/rr.ts` | Full GraphQL endpoint(s), comma-separated; e.g. `https://ledger.forestware.org/api/graphql` ([[Apollo Client]]) |
| `API_PROXY_TARGET` | `vite.config.ts` | Dev only, not exposed to the app. Origin `yarn start` proxies `/api/graphql` to; unset = no proxy |
| `VITE_FIREBASE_API_KEY` | `src/lib/firebase.ts` | |
| `VITE_FIREBASE_AUTHDOMAIN` | 〃 | |
| `VITE_FIREBASE_DATABASE_URL` | 〃 | |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | 〃 | |
| `VITE_FIREBASE_APP_ID` | 〃 | |
| `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_BUCKET` | — | In template, unused |

## Local dev against the deployed API

API v3's CORS list is empty in production and won't get `localhost`.
So in dev set `VITE_SERVER_URL=/api/graphql` (the `.sample.env`
default): with `API_PROXY_TARGET=https://ledger.forestware.org`,
`yarn start` proxies `/api/graphql` there (`server.proxy` in `vite.config.ts`). The proxy strips the `Origin`
header; browsers send it even on same-origin POSTs, and Spring would
see `localhost` vs `ledger.forestware.org` and answer 403. Deployed
builds keep the full URL ([[API v3]]).

See [[Authentication]].
