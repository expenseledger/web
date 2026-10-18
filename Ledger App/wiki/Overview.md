---
type: synthesis
tags: [overview]
sources: [README.md, package.json, src/components/App.tsx]
updated: 2026-09-25
---

# Overview

**Expense Ledger** (`expense-ledger-web`, v1.110.0) is a mobile-first PWA
for tracking personal expenses, income, and transfers across multiple
accounts, with monthly reports. This repo is the **frontend only**; the
backend is a Postgraphile GraphQL API over PostgreSQL, hosted separately at
`expense-ledger.forestware.org` (see [[GraphQL API]]).

## Domain in one paragraph

A user (an *Owner*, identified by Firebase UID) has [[Account]]s and [[Category|categories]]. Every money movement is a
[[Transaction]] of type EXPENSE (out of one account), INCOME (into one
account), or TRANSFER (between two). The server keeps each account's
`balance`; the client patches its cached copy after each mutation (see
[[Balance Sync]]).

## Architecture at a glance

```
Firebase Auth ──ID token──▶ Apollo Client ──▶ Postgraphile /graphql
                                 ▲
React pages ──▶ service layer ───┘      Jotai atoms (accounts, categories,
      │                                  settings) ◀── Layout bootstrap
      └── Radix Themes + styled-components + motion
```

- [[Tech Stack]] — libraries and tooling.
- [[Routing and Layout]] — routes, lazy loading, bootstrap.
- [[Authentication]] — Firebase sign-in and token injection.
- [[Apollo Client]] — links, retry, round-robin server URLs.
- [[Service Layer]] — all GraphQL calls; never throw, return empty/null.
- [[State Management]] — Jotai atoms and persisted settings.

## Screens

[[Home Screen]] (quick expense) · [[More Screen]] (expense/income/transfer)
· [[Transaction List Screen]] · [[Report Screen]] · [[Settings Screens]] ·
[[Sign In Screen]] · [[Bottom Menu]]

## Where to look next

- Bugs spotted while reading the code: [[Known Issues]].
- Things the frontend code can't answer: [[Open Questions]].
