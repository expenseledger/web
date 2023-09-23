# expense-ledger-web

## Transaction structure

-   Source account: Complex
    -   name: string
    -   type: string
    -   balance: decimal
-   Destination account: Complex
-   Amount: decimal
-   Date: date
-   Transaction type (transfer, income, expense): string
-   Category: string
-   Description: string

## Features

-   CRUD operations on transactions
-   Firebase authentication
-   Batch update (timer)
-   Report (aggregate)
    -   categorized by account
    -   categorized by transaction types
    -   and any combinations of the above

## Tables

-   Account type
-   Account
-   Category
-   Transaction type
-   Transaction

## Stack

-   Postgraphile
-   PostgreSQL
-   Vercel
-   React.js + Typescript
-   Radix UI

^\_^
