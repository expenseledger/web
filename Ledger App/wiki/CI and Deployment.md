---
type: ops
tags: [ci, deployment]
sources: [.github/workflows/, .release-it.json]
updated: 2026-10-21
---

# CI and Deployment

Hosting: **Vercel** (via `yarn dlx vercel`). GitHub Actions, Node 26:

| Workflow | Trigger | Does |
|---|---|---|
| `pull_request.yml` | PR to `main`, manual | `yarn install`, `yarn build`, `yarn test` |
| `deploy_preview.yml` | PR comment containing `/deploy` | Calls `deploy.yml` (preview); bot comments the preview URL |
| `release.yml` | Manual only | `yarn release --ci -- minor`, then production deploy |
| `deploy.yml` | Reusable / manual | Preview or `--prod` Vercel deploy |

## Releases

- release-it: bumps **minor** every release (hence v1.110.0), commit
  `Release v${version}`, annotated tag `v${version}`, GitHub release; no
  npm publish.
- The version shown in the [[Bottom Menu]] comes from `package.json`.
- Secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
- Runtime env vars are set in Vercel, not in the repo
  ([[Environment Variables]]).
