---
type: entity
tags: [domain]
sources: [src/service/model/Category.ts, src/service/constants.ts, src/service/categoryService.ts]
updated: 2026-10-23
---

# Category

```ts
interface Category { id: string; name: string; type: CategoryType }
type CategoryType = "ANY" | "EXPENSE" | "INCOME" | "TRANSFER";
```

- **Type** (back 2026-10-23, after being dropped 2026-10-18): only a
  picker filter. `categoriesFor(categories, txType)` in
  `src/service/helper/categoryHelper.ts` keeps the tx type's own
  categories plus ANY, in order. Used by [[Home Screen]] (EXPENSE),
  [[More Screen]] (per tab) and the edit modal on
  [[Transaction List Screen]]. The server never checks it
  ([[API v3 Migration]] § Decided: category type).
- Name and type are edited via `patchCategory` in [[Settings Screens]];
  "None" can't be changed.
- Reports group by category name ([[Report Screen]]).
- Deleting a category **cascade-deletes its transactions without
  reversing balances**, so account balances drift from history
  ([[API v2 Backend]], [[Known Issues]]).
- New users get 11 seeded categories (list in [[API v2 Backend]]).
- v1 `createCategory` (no type) always created type `ANY`.

## In API v3

Differs significantly — see [[API v3 Data Model]].
