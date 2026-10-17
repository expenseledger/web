---
type: screen
tags: [ui, screen, settings]
sources: [src/components/setting/AccountSetting.tsx, src/components/setting/CategorySetting.tsx, src/components/setting/PageSetting.tsx, src/components/bases/EditAndDeleteSetting.tsx, src/components/bases/TextBoxWithButton.tsx]
updated: 2026-09-25
---

# Settings Screens

Reached from [[Bottom Menu]] → Settings.

## Account (`/account/setting`)

- List via `EditAndDeleteSetting` (edit ✎ opens modal, delete ✕).
- Edit modal: name, type, **balance**. Changing balance posts an
  "Adjust balance" income/expense under category "Other" — see
  [[Account]]. Name/type → `updateAccount`. Both run in parallel.
- Currency picker (`฿ € $ ¥ ₩`) → `currencyState` ([[State Management]]).
- Create: `TextBoxWithButton` (name + type dropdown) → `createAccount`;
  list re-sorted by name.

## Category (`/category/setting`)

Same list/create pattern for [[Category]] (name + type).

## Page (`/page/setting`)

Dark-theme switch → `pageSettingState.isDarkTheme` (Radix `Theme`
appearance, [[Routing and Layout]]).

Delete-account failure handling is broken — see [[Known Issues]].
