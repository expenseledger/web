---
type: entity
tags: [domain]
sources: [src/service/model/Category.ts, src/service/constants.ts, src/service/categoryService.ts]
updated: 2026-09-25
---

# Category

```ts
interface Category { id: number; name: string; type: CategoryType }
type CategoryType = "ANY" | "INCOME" | "EXPENSE" | "TRANSFER"
```

- `type` scopes which [[Transaction]] forms offer it: a form for type X
  shows categories with type X or `ANY` ([[Home Screen]],
  [[More Screen]], edit modal in [[Transaction List Screen]]).
- Created via `createCategoryV2` (the V2 accepts `type`; the stale local
  schema has only v1 — see [[GraphQL API]]).
- "Other" (type ANY) is auto-created when adjusting an [[Account]] balance.
- Reports group by category name ([[Report Screen]]).
- Deleting a category **cascade-deletes its transactions without
  reversing balances**, so account balances drift from history
  ([[API v2 Backend]], [[Known Issues]]).
- New users get 11 seeded categories (list in [[API v2 Backend]]).
- v1 `createCategory` (no type) always created type `ANY`.

## In API v3

Differs significantly — see [[API v3 Data Model]].
