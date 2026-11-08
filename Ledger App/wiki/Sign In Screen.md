---
type: screen
tags: [ui, screen, auth]
sources: [src/components/signIn/SignIn.tsx]
updated: 2026-11-08
---

# Sign In Screen

Route `/signIn` is outside `Layout`. The Radix Themes screen offers
email/password sign-in, account creation, password reset, and a Google popup.
Text links open account creation at `/signIn?mode=sign-up` and password reset
at `/signIn?mode=reset`.
Switching views moves focus to the email field. The reset confirmation
shows the email submitted with the request.
It redirects to `/` after authentication and any credential linking finish.
See [[Authentication]].
