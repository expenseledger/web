---
type: entity
tags: [domain]
sources: [src/service/model/Category.ts, src/service/constants.ts, src/service/categoryService.ts]
updated: 2026-10-19
---

# Category

```ts
interface Category { id: number; name: string }
```

- **No type in the app** (2026-10-18): every [[Transaction]] form lists
  every category. v2 still stores ANY/INCOME/EXPENSE/TRANSFER; created
  via `createCategoryV2` with a hardcoded `ANY` (the stale local schema
  has only v1 — see [[GraphQL API]]). API v3 has no category type.
- No rename for now; the human will reimplement it on v3 with
  `patchCategory` (available 2026-10-19; [[API v3 Operations]]).
- Reports group by category name ([[Report Screen]]).
- Deleting a category **cascade-deletes its transactions without
  reversing balances**, so account balances drift from history
  ([[API v2 Backend]], [[Known Issues]]).
- New users get 11 seeded categories (list in [[API v2 Backend]]).
- v1 `createCategory` (no type) always created type `ANY`.

## In API v3

Differs significantly — see [[API v3 Data Model]].
