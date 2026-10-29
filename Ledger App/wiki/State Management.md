---
type: concept
tags: [architecture, state]
sources: [src/common/shareState.ts]
updated: 2026-10-19
---

# State Management

Jotai atoms in `src/common/shareState.ts`. No Provider — the default store
is used. Server data isn't read from the Apollo cache for rendering; it is
copied into atoms.

| Atom | Kind | Purpose |
|---|---|---|
| `accountsState` | `atom<Account[]>` | Loaded by `Layout`; patched after mutations ([[Balance Sync]]) |
| `totalBalancesByCurrencyState` | derived | Balances summed per currency, shown in [[Bottom Menu]] |
| `categoriesState` | `atom<Category[]>` | Loaded by `Layout` |
| `toastState` | `atom<NotificationProps[]>` | Toast queue ([[Notifications]]) |
| `isSignInState` | `atom<boolean>` | Set by `useSignIn` ([[Authentication]]) |
| `pageSettingState` | `atomWithStorage` `"pageSetting"` | `{ isDarkTheme }` |
| `isHideBalanceOnMenuState` | `atomWithStorage` | Mask balances in menu |

`atomWithStorage` → persisted in `localStorage`, per device.

## Currency

Each [[Account]] has its own fixed currency (`THB`, `USD`, `EUR`,
`JPY`; API v3). Amounts show the account's symbol (`currencySymbols`
in `service/constants.ts`). Balances in different currencies are never
added up; totals are per currency. The global currency setting
(`currencyState`) was removed in the v3 cutover (2026-10-19).

## Number formatting

`formatNumber` uses `Intl.NumberFormat("th-TH")` with 2 decimals.
`toNumber` strips only the **first** comma before `parseFloat`.
