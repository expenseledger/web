---
type: concept
tags: [architecture, auth]
sources: [src/lib/firebase.ts, src/components/hoc/WithAuthProtection.tsx, src/components/signIn/SignIn.tsx, src/lib/apollo.ts]
updated: 2026-10-21
---

# Authentication

Firebase Auth, initialised in `src/lib/firebase.ts` from `VITE_FIREBASE_*`
env vars ([[Environment Variables]]). Only `apiKey`, `authDomain`,
`databaseURL`, `messagingSenderId`, `appId` are passed; `PROJECT_ID` and
`BUCKET` exist in `.sample.env` but are unused.

## Sign-in

[[Sign In Screen]] uses `react-firebaseui` (`StyledFirebaseAuth`) with
Email and Google providers, popup flow. It doesn't support React 19 or
Firebase 12; yarn installs it with a peer warning. `onAuthStateChanged` navigates to
`/` once a user exists.

## Guarding routes

`src/components/hoc/WithAuthProtection.tsx` exports three things:

- `useSignIn()` — **the one actually used** (by `Layout`). Subscribes to
  `onAuthStateChanged`, writes `isSignInState`, and returns
  `[isSignIn, redirectToSignIn, isLoading]`. Loading also ends after a 3 s
  timeout even without an auth callback.
- `withAuthProtection` HOC and `AuthProtection` component — older
  alternatives, not referenced by any route (inferred: dead code).

Note: none of these unsubscribe from `onAuthStateChanged`.

## Token to backend

[[Apollo Client]]'s `SetContextLink` calls
`auth.currentUser.getIdToken()` and sends `authorization: Bearer <token>`.
If no user yet, it polls every 1 s up to 3 times, then sends an empty
header. The backend identifies the *Owner* by Firebase UID (`ownerId:
String` in the schema — inferred).

Sign-out: [[Bottom Menu]] → Settings → "Sign out" → `auth.signOut()`.
Also automatic when API v3 keeps answering HTTP 401 after a token
refresh ([[Apollo Client]]); the auth listeners then show sign-in.
