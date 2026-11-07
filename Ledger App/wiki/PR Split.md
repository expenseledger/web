---
type: synthesis
tags: [git, pr, v3]
sources: [human 2026-10-24, git branches]
updated: 2026-10-24
---

# PR Split

PR #131 ("Migrate the app to API v3", `feature/api-v3` → `main`) had
grown to 63 commits and ~138 files. On 2026-10-24 the human split it so
the PR holds only the API migration; the rest moved to branches stacked
on it (human, 2026-10-24).

## Rule

- **PR 1 (`feature/api-v3`)**: whatever makes the app on v3 behave as
  `main` does on v2. That includes changes v3 forces (string IDs,
  `convertedAmount`, error codes, `initializeUser`, 401 retry), restoring
  `main`'s features on v3 (category types, account and category editing,
  the month swiper, hiding delete on the default category), the dev proxy
  and mock, and the whole wiki.
- **Separate PRs**: bugs that already exist on `main`, new UX, and
  tooling.
- New API v3 changes go to PR 1 only. The stacked branches stay stale
  (not rebased) until PR 1 settles (human, 2026-10-24).

## Branches

| Branch | Base | Holds |
|---|---|---|
| `feature/api-v3` | `main` | PR 1: the migration and the wiki |
| `chore/tooling` | PR 1 | `.mcp.json`, `.idea`, `.editorconfig`, the write-code and request-api-change skills, lint fixes, the yarn/npm round trip |
| `fix/stable-list-keys` | PR 1 | Row keys by id, keeping a pending settings delete ([[Known Issues]] 12) |
| `feature/one-currency-report` | PR 1 | Each report stays in one currency ([[Report Screen]]) |
| `backup/api-v3-full` | — | The full pre-split history (local) |

## Consequences

- The wiki moved whole into PR 1, so some pages describe tooling, fixes
  and report behaviour that live in the other branches. Those pages run
  ahead of PR 1's code until the branches merge.
- Stable keys and one-currency reports are absent from PR 1 by design,
  not regressions.
