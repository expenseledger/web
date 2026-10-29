---
type: screen
tags: [ui, screen, auth]
sources: [src/components/signIn/SignIn.tsx]
updated: 2026-09-25
---

# Sign In Screen

Route `/signIn`, outside `Layout`. Logo + "Welcome to Expense Ledger" +
FirebaseUI (Email, Google; popup). Redirects to `/` once
`onAuthStateChanged` reports a user. Details: [[Authentication]].
