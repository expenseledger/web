---
type: concept
tags: [architecture, routing]
sources: [src/index.tsx, src/components/App.tsx, src/components/Layout.tsx, src/components/AnimatedPage.tsx]
updated: 2026-09-25
---

# Routing and Layout

`src/index.tsx` renders `<ApolloProvider><App/></ApolloProvider>`
(StrictMode is commented out). `App.tsx` wraps everything in a Radix
`<Theme>` whose appearance comes from `pageSettingState.isDarkTheme`
([[State Management]]).

## Routes (`src/components/App.tsx`)

| Path | Screen | Loading |
|---|---|---|
| `/signIn` | [[Sign In Screen]] | eager, outside Layout |
| `/` | [[Home Screen]] | eager |
| `/more` | [[More Screen]] | lazy |
| `/account/:accountId/transactionList` | [[Transaction List Screen]] | lazy |
| `/report` | [[Report Screen]] | lazy |
| `/account/setting`, `/category/setting`, `/page/setting` | [[Settings Screens]] | lazy |

All routes except `/signIn` are children of `Layout`.

## Layout (`src/components/Layout.tsx`)

1. Uses `useSignIn()` ([[Authentication]]); redirects to `/signIn` when
   signed out.
2. Once signed in, calls `withRetry(getUserData)` — the `currentUser`
   mutation that returns the owner's accounts and categories sorted by name
   — and stores them in `accountsState` / `categoriesState`. Shows
   `<Loading/>` until done. On failure: toast "Please try restarting the
   app."
3. Renders header title (click → `/` with `backToHomeParam` state), an
   `<Outlet>` inside `Suspense` + `AnimatePresence` keyed by pathname, the
   [[Bottom Menu]], and the `<Toast>` host ([[Notifications]]).

## Back-to-home account memory

`Layout` holds `backToHomeParam: { accountId }`, exposed to children through
outlet context via `useBackToHome()`. Screens set it (e.g. the transaction
list sets its account) so clicking the title returns to Home with that
account's card selected. Home reads it from `location.state`, selects the
slide, then clears it.

## Page transitions

Screens wrap content in `AnimatedPage` (motion fade + 0.98→1 scale,
~180 ms). `AccountSetting` does **not** wrap itself (inconsistency).
