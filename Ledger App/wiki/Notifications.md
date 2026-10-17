---
type: concept
tags: [ui, feedback]
sources: [src/service/helper/notificationHelper.ts, src/components/bases/Toast.tsx, src/components/bases/Notification.tsx]
updated: 2026-09-25
---

# Notifications

User feedback is toast-only.

- `useNotification().addNotification(message, type)` appends
  `{ id: uuid, text, type }` to `toastState` ([[State Management]]).
- `Toast` (mounted once in `Layout`, top-right) renders the queue.
- Each `Notification` starts hiding after **3 s**, is removed 1 s later,
  or on ✕ click. Types: primary, info, success, link, warning, danger,
  none.
- Convention: every mutation handler toasts success/failure. Service
  errors are only `console.log`ged ([[Service Layer]]).
