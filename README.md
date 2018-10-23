# expense-ledger-web

## Transaction structure
* Source wallet: Complex
    * name: string
    * type: string
    * balance: decimal
* Destination wallet: Complex
* Amount: decimal
* Date: date
* Transaction type (transfer, income, expense): string
* Category: string
* Description: string

## Features
* CRUD operations on transactions
* Firebase authentication
* Batch update (timer)
* Report (aggregate)
  * categorized by wallet
  * categorized by transaction types
  * and any combinations of the above

## Tables
* Wallet type
* Wallet
* Category
* Transaction type
* Transaction

## Stack
* Golang
* Gin (web framework)
* Heroku PostgreSQL (Database)
* Heroku
* React.js + Typescript
* Bulma