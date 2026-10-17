---
type: concept
tags: [architecture, state]
sources: [src/common/shareState.ts]
updated: 2026-09-25
---

# State Management

Jotai atoms in `src/common/shareState.ts`. No Provider — the default store
is used. Server data isn't read from the Apollo cache for rendering; it is
copied into atoms.

| Atom | Kind | Purpose |
|---|---|---|
| `accountsState` | `atom<Account[]>` | Loaded by `Layout`; patched after mutations ([[Balance Sync]]) |
| `totalAccountsBalanceState` | derived | Sum of balances, shown in [[Bottom Menu]] |
| `categoriesState` | `atom<Category[]>` | Loaded by `Layout` |
| `toastState` | `atom<NotificationProps[]>` | Toast queue ([[Notifications]]) |
| `isSignInState` | `atom<boolean>` | Set by `useSignIn` ([[Authentication]]) |
| `currencyState` | `atomWithStorage` `"currency"`, default `฿` | Display symbol only |
| `pageSettingState` | `atomWithStorage` `"pageSetting"` | `{ isDarkTheme }` |
| `isHideBalanceOnMenuState` | `atomWithStorage` | Mask balances in menu |

`atomWithStorage` → persisted in `localStorage`, per device.

## Currency

Purely cosmetic: a symbol prefix; there's no conversion or per-account
currency. `Currency` type is `"฿" | "€"` but `allCurrencies` offers
`฿ € $ ¥ ₩` (cast in [[Settings Screens]]).

## Number formatting

`formatNumber` uses `Intl.NumberFormat("th-TH")` with 2 decimals.
`toNumber` strips only the **first** comma before `parseFloat`.
