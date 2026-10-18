---
type: screen
tags: [ui, screen, settings]
sources: [src/components/setting/AccountSetting.tsx, src/components/setting/CategorySetting.tsx, src/components/setting/PageSetting.tsx, src/components/bases/EditAndDeleteSetting.tsx, src/components/bases/TextBoxWithButton.tsx]
updated: 2026-10-18
---

# Settings Screens

Reached from [[Bottom Menu]] → Settings.

## Account (`/account/setting`)

- List via `EditAndDeleteSetting` with delete ✕ only. Its `modifyModal`
  (edit ✎) is optional; neither settings screen passes one since
  2026-10-18. Name + balance editing comes back with v3 ([[Account]]).
- Currency picker (`฿ € $ ¥ ₩`) → `currencyState` ([[State Management]]).
- Create: `TextBoxWithButton` (name only) → `createAccount`;
  list re-sorted by name.

## Category (`/category/setting`)

Same list/create/delete pattern for [[Category]] (name only).

The category named "None" has no delete ✕ (`undeletable` item flag on
`EditAndDeleteSetting`, matched by name), since v3 refuses to delete it
([[API v3 Migration]]). The ✕ is labelled "Delete <name>".

## Page (`/page/setting`)

Dark-theme switch → `pageSettingState.isDarkTheme` (Radix `Theme`
appearance, [[Routing and Layout]]).

Delete-account failure handling is broken — see [[Known Issues]].
