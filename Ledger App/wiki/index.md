---
type: meta
tags: [index]
updated: 2026-10-22
---

# Index

Catalog of every wiki page. Start at [[Overview]]. Log: [[log]].
Schema/conventions: `../CLAUDE.md`.

## Synthesis

- [[Overview]] — what the app is, architecture at a glance, map of pages.
- [[Known Issues]] — bugs and tech debt found in the code.
- [[Open Questions]] — unknowns needing backend sources or answers.
- [[API v3 Migration]] — v2→v3 breaking changes, screen impact, gaps.
- [[API Path Conventions]] — protocols and versions on one host; why no `/graphql`.

## Architecture (concept)

- [[Tech Stack]] — libraries, versions, tooling.
- [[Routing and Layout]] — routes, lazy loading, bootstrap, back-to-home.
- [[Authentication]] — Firebase sign-in, route guarding, bearer token.
- [[Apollo Client]] — link chain, retry, round-robin server URLs.
- [[Service Layer]] — service fns ↔ GraphQL ops, no-throw contract.
- [[State Management]] — Jotai atoms, persisted settings, currency.
- [[Balance Sync]] — how local account balances are patched.
- [[Base Components]] — reusable UI wrappers over Radix.
- [[Notifications]] — toast system.

## Domain (entity)

- [[Account]] — untyped, server-owned balance, no editing yet.
- [[Category]] — untyped; every form lists every category.
- [[Transaction]] — EXPENSE/INCOME/TRANSFER, sign convention, rules.
- [[GraphQL API]] — API v2 (replaced by v3 on `feature/api-v3`): Postgraphile.
- [[API v2 Backend]] — v2 server source: SQL functions, RLS, cascades.
- [[API v3]] — backend the app uses: stack, auth, init, errors, paging, dates.
- [[API v3 Data Model]] — Money, Account, Category, Transaction in v3.
- [[API v3 Operations]] — v2 operation → v3 operation mapping.

## Screens

- [[Home Screen]] — account carousel + quick expense.
- [[More Screen]] — expense/income/transfer form.
- [[Transaction List Screen]] — infinite scroll by month, edit/delete, paid-only.
- [[Report Screen]] — weekly bar, category pies/tables.
- [[Settings Screens]] — account, category, page settings.
- [[Sign In Screen]] — FirebaseUI.
- [[Bottom Menu]] — floating nav, balances drawer, settings drawer.

## Ops

- [[Build and Test]] — scripts, Jest setup, coverage gaps.
- [[CI and Deployment]] — GitHub Actions, Vercel, release-it.
- [[Environment Variables]] — `VITE_*` config, dev proxy to API v3.
- [[GraphQL Codegen]] — regenerating typed documents.
