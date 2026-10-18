---
type: screen
tags: [ui, screen, settings]
sources: [src/components/setting/AccountSetting.tsx, src/components/setting/CategorySetting.tsx, src/components/setting/PageSetting.tsx, src/components/bases/EditAndDeleteSetting.tsx, src/components/bases/TextBoxWithButton.tsx]
updated: 2026-10-19
---

# Settings Screens

Reached from [[Bottom Menu]] → Settings.

## Account (`/account/setting`)

- List via `EditAndDeleteSetting` with edit ✎ ("Edit <name>") and
  delete ✕. Edit opens `EditAccountModal` (name + balance): it calls
  `patchAccount` with only the changed fields, and the balance is set
  **directly**, with no adjustment transaction (2026-10-19).
- Create: `TextBoxWithButton` with a currency dropdown (THB/USD/EUR/
  JPY) → `createAccount` with a zero balance; list re-sorted by name.
  The global currency picker is gone (2026-10-19; [[State Management]]).

## Category (`/category/setting`)

Same list/create/delete pattern for [[Category]] (name only), plus
rename: edit ✎ opens `RenameCategoryModal` → `patchCategory`
(2026-10-19).

The category named "None" has no delete ✕ and no edit ✎ (`undeletable`
and `uneditable` item flags on `EditAndDeleteSetting`, matched by
name), since v3 refuses both (`CATEGORY_PROTECTED`;
[[API v3 Migration]]). The buttons are labelled "Delete <name>" and
"Edit <name>".

## Page (`/page/setting`)

Dark-theme switch → `pageSettingState.isDarkTheme` (Radix `Theme`
appearance, [[Routing and Layout]]).

Delete-account failure handling is broken — see [[Known Issues]].
