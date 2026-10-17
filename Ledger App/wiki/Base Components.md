---
type: concept
tags: [ui, components]
sources: [src/components/bases/]
updated: 2026-10-04
---

# Base Components

Thin wrappers in `src/components/bases/`, mostly over Radix Themes. Each
has a test in `src/tests/bases/` ([[Build and Test]]).

| Component | Notes |
|---|---|
| `Button` | Radix button; `type`: primary, info, link, success, danger, default; `variant` (default solid); `isLoading` |
| `TextBox` / `TextField` | Text input with optional front/back add-on (currency prefix) |
| `DateBox` | Native date input, value `YYYY-MM-DD` |
| `Dropdown` | Radix `Select` over `string[]`. Keeps its own value; if the current value disappears from `options`, it auto-selects `options[0]` **and calls `updateSelectedValue`** |
| `Modal` | Radix `Dialog` with trigger element; confirm awaits `onConfirmHandler` then closes |
| `Drawer` | Motion-animated bottom sheet + backdrop, used by [[Bottom Menu]] |
| `Switch` | Toggle with label, rounded/size/RTL options |
| `EditAndDeleteSetting` | List with edit/delete per item (settings) |
| `TextBoxWithButton` | Input + optional dropdown + button; `onClick(value, dropdownValue)` |
| `MonthPicker` | Prev/next month stepper over a dayjs month ("MMMM YYYY") |
| `AmountTxt` / `BalanceWithCurrency` | Formatted money with currency atom; can mask |
| `MessageBox` | Colored box (used for transaction rows) |
| `Loading` | Full-page spinner |
| `Toast` / `Notification` | See [[Notifications]] |

Styling mixes Radix props, styled-components (transient `$props`, often
cast via `as unknown as React.ComponentType<...>`), and global SCSS.
Primary color is Radix `blue` / `#007aff` (`src/common/constants.ts`).
