---
type: screen
tags: [ui, navigation]
sources: [src/components/menu/Menu.tsx, src/components/bases/Drawer.tsx]
updated: 2026-09-25
---

# Bottom Menu

`src/components/menu/Menu.tsx`, rendered by `Layout` on every screen.
Floating frosted-glass bar (fixed, bottom 24 px, safe-area aware) with
three tabs animated by `motion`:

- **Home** → `/`.
- **Accounts** → toggles a `Drawer` listing every [[Account]] balance and
  the total (`totalAccountsBalanceState`), with a **Hide balance** switch
  (`isHideBalanceOnMenuState`, persisted).
- **Settings** → toggles a `Drawer` with links to the
  [[Settings Screens]], **Sign out**, and the app version
  (`package.json` version, passed from `Layout`).

Tapping the active drawer tab closes it; the Home tab is highlighted only
at `/`. Recent work (PR #130, v1.110.0) refactored this menu's animation.
