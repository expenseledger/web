---
type: synthesis
tags: [bugs, tech-debt]
sources: [src/]
updated: 2026-10-19
---

# Known Issues

Found by reading the code on 2026-09-25 (not yet reproduced in the app).
Remove an entry once fixed and note it in [[log]].

## Bugs

1. **Apollo retry never runs** — `src/lib/apollo.ts`: `retryLink` is
   concatenated *after* the terminating `HttpLink`, so query retries are
   dead. Fix: `from([retryLink, authLink, httpLink])`. [[Apollo Client]]
2. ~~**More: submit not awaited**~~ — fixed 2026-10-19: amount and
   description cleared even on failure, and `isLoading` flipped back at
   once. [[More Screen]]
3. ~~**More: bad default date**~~ — fixed 2026-10-19: it used
   `Date.now.toString()` (the function's source) when `/more` was opened
   without router state; on v3 every add failed with
   `INVALID_DATE_TIME`. Now today.
4. ~~**More: to-account default**~~ — fixed 2026-10-19: it could pick
   From itself, and one account crashed the transfer tab. To is now the
   next account (wrapping), or none; `Dropdown` no longer loops on empty
   options.
5. ~~**Home: category shown ≠ category submitted**~~ — fixed
   2026-10-18: pickers no longer filter by type, so index 0 is the
   category shown. [[Home Screen]]
6. **Delete account failure never reported** —
   `src/components/setting/AccountSetting.tsx`: `const isSuccess = await
   deleteAccount(...)` is an object (`{ isSuccess }`), always truthy.
7. **Delete incoming transfer adjusts balance the wrong way** —
   `TransactionList.tsx` `removeTransactionHandler`: anything not INCOME
   gets `+amount`, but deleting a TRANSFER *into* this account should
   subtract. The other account in a transfer isn't patched at all.
   [[Balance Sync]]
8. **Editing a transaction doesn't refresh balances** — the
   `updateTransaction` response's account balances are ignored.
9. ~~**Report stuck on spinner**~~ — fixed 2026-10-04: with no account
   selected the report now renders empty. [[Report Screen]]
10. **Balance matching by name** — Home/More expense & income patch
    `accountsState` by account *name* (transfer uses id). Works only
    because names are unique per owner.

## API v2 backend

Found in `expense-ledger-api` on 2026-09-25 ([[API v2 Backend]]).

1. **Deleting a category or account corrupts balances** — FKs are
   `ON DELETE CASCADE`, so transactions vanish without reversal.
   Category delete: its accounts keep the old balance. Account delete:
   transfer counterparts keep their change.
2. **Silent no-ops** — every function is `STRICT`; a `null` argument
   (or unknown id in `update_transaction`/`delete_transaction`) returns
   `null` with no error, which the client may treat as success.
3. **Cross-owner transfer** — the insert policy only needs `from` *or*
   `to` to be the caller's account; the other account's balance update
   is silently filtered by RLS, so one side of the transfer is lost.
4. `create_account` ignores currency (always THB); balances use the
   locale-dependent `money` type.
5. `sql/index.sql` has syntax errors; no migrations, so the real DB
   schema is unverifiable from the repo.

## Smells / debt

- `schema.graphql` is stale vs. the remote schema ([[GraphQL API]]).
- `dayjs.tz.setDefault("Asia/Bangkok")` only affects `dayjs.tz()`
  calls; the app uses plain `dayjs()`, i.e. the **device** timezone.
- `listTransactions` reads `.data` before checking `.error`.
- `getAuthToken` sends an empty `authorization` header after 3 failed
  polls instead of failing.
- `onAuthStateChanged` subscriptions are never unsubscribed.
- Dead code: `withAuthProtection`, `AuthProtection`, `AddTransactionDto`,
  `httpStatus`, unused `getAll*` services, unused `rxjs`,
  `react-snowfall`; unused import `a` from react-spring in
  `AccountSetting.tsx`.
- Typos in identifiers/files: `transactoinHelper.ts`,
  `DeleteTranactionRequest`, `cateogry`, `onChangeHanlder`,
  `transations`, toast text "sucess"/"succes".
- `toNumber` removes only the first comma.
- `AccountSetting` isn't wrapped in `AnimatedPage`.
- README "Tables" / "Batch update (timer)" sections are outdated.
