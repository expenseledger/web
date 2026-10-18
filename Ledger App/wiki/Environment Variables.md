---
type: ops
tags: [config]
sources: [.sample.env, src/lib/firebase.ts, src/lib/rr.ts, src/env.d.ts]
updated: 2026-10-19
---

# Environment Variables

Vite-style: `VITE_*`, read via `import.meta.env`. Template:
`.sample.env`; real `.env` is git-ignored.

| Var | Used by | Notes |
|---|---|---|
| `VITE_SERVER_URL` | `src/lib/rr.ts` | Full GraphQL endpoint(s), comma-separated; e.g. `https://ledger.forestware.org/api/v3` ([[Apollo Client]]) |
| `VITE_FIREBASE_API_KEY` | `src/lib/firebase.ts` | |
| `VITE_FIREBASE_AUTHDOMAIN` | 〃 | |
| `VITE_FIREBASE_DATABASE_URL` | 〃 | |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | 〃 | |
| `VITE_FIREBASE_APP_ID` | 〃 | |
| `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_BUCKET` | — | In template, unused |

See [[Authentication]].
