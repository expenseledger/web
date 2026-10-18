---
type: synthesis
tags: [questions, backend]
sources: [expense-ledger-api]
updated: 2026-10-18
---

# Open Questions

Things the frontend code can't answer. Resolve by asking the backend
agent (see `../CLAUDE.md`) or the human; then move the answer into the
relevant page. Questions below are about **API v2** unless marked.

Answered on 2026-09-25 from the `expense-ledger-api` source and moved to
[[API v2 Backend]], [[Account]], [[Category]], [[Transaction]]:
`closeAccount`, category delete, `currentUser`, `categoryId: 0`, month
order, repo location, v1 vs V2 operations. DB session timezone
(`Asia/Bangkok`, from the human).

## API v3

Answered by the backend agent and the human (2026-09-25) and recorded in
[[API v3]], [[API v3 Data Model]], [[API v3 Operations]],
[[API v3 Migration]]. Still open:

- Which missing v2 features v3 will add (date, updates, types,
  rename). Soft close: rejected (human, 2026-10-18). Description,
  editing and backdating: added. Rename: still missing. Month list: not needed (client-side). Decided one by
  one on [[API v3 Migration]].
- How v2 balances that don't match their transaction history should be
  migrated ([[API v3 Migration]] § Data migration).
