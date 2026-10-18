/* eslint-disable */
import * as types from "./graphql";
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n    query GetAllAccounts {\n        accounts {\n            nodes {\n                id\n                balance\n                name\n            }\n        }\n    }\n": typeof types.GetAllAccountsDocument;
    "\n    query GetAccountById($id: Int!) {\n        account(id: $id) {\n            id\n            name\n            balance\n        }\n    }\n": typeof types.GetAccountByIdDocument;
    "\n    mutation CreateAccount($name: String!) {\n        createAccount(input: { name: $name, type: CASH, balance: 0.0 }) {\n            account {\n                balance\n                id\n                name\n            }\n        }\n    }\n": typeof types.CreateAccountDocument;
    "\n    mutation DeleteAccount($id: Int!) {\n        closeAccount(input: { id: $id }) {\n            account {\n                balance\n                id\n                name\n            }\n        }\n    }\n": typeof types.DeleteAccountDocument;
    "\n    fragment PlainAccount on Account {\n        id\n        name\n        balance\n    }\n": typeof types.PlainAccountFragmentDoc;
    "\n    mutation CreateCategory($name: String!) {\n        createCategoryV2(input: { name: $name, type: ANY }) {\n            category {\n                id\n                name\n            }\n        }\n    }\n": typeof types.CreateCategoryDocument;
    "\n    mutation DeleteCategory($id: Int!) {\n        deleteCategory(input: { id: $id }) {\n            owner {\n                categories {\n                    nodes {\n                        id\n                        name\n                    }\n                }\n            }\n        }\n    }\n": typeof types.DeleteCategoryDocument;
    "\n    query GetAllCategories {\n        categories {\n            nodes {\n                id\n                name\n            }\n        }\n    }\n": typeof types.GetAllCategoriesDocument;
    "\n    fragment PlainCategory on Category {\n        id\n        name\n    }\n": typeof types.PlainCategoryFragmentDoc;
    "\n    fragment PlainTransaction on Transaction {\n        id\n        amount\n        description\n        type\n        date\n        categoryId\n        fromAccountId\n        toAccountId\n    }\n": typeof types.PlainTransactionFragmentDoc;
    "\n    mutation AddExpense(\n        $amount: Float!\n        $description: String!\n        $categoryId: Int!\n        $fromAccountId: Int!\n        $occurredAt: Datetime!\n    ) {\n        spend(\n            input: {\n                amount: $amount\n                description: $description\n                categoryId: $categoryId\n                fromAccountId: $fromAccountId\n                occurredAt: $occurredAt\n            }\n        ) {\n            transaction {\n                ...PlainTransaction\n                fromAccount {\n                    ...PlainAccount\n                }\n                category {\n                    ...PlainCategory\n                }\n            }\n        }\n    }\n": typeof types.AddExpenseDocument;
    "\n    mutation AddIncome(\n        $amount: Float!\n        $description: String!\n        $categoryId: Int!\n        $toAccountId: Int!\n        $occurredAt: Datetime!\n    ) {\n        receive(\n            input: {\n                amount: $amount\n                description: $description\n                categoryId: $categoryId\n                toAccountId: $toAccountId\n                occurredAt: $occurredAt\n            }\n        ) {\n            transaction {\n                ...PlainTransaction\n                toAccount {\n                    ...PlainAccount\n                }\n                category {\n                    ...PlainCategory\n                }\n            }\n        }\n    }\n": typeof types.AddIncomeDocument;
    "\n    mutation AddTransfer(\n        $amount: Float!\n        $description: String!\n        $categoryId: Int!\n        $fromAccountId: Int!\n        $toAccountId: Int!\n        $occurredAt: Datetime!\n    ) {\n        transferV2(\n            input: {\n                amount: $amount\n                description: $description\n                categoryId: $categoryId\n                fromAccountId: $fromAccountId\n                toAccountId: $toAccountId\n                occurredAt: $occurredAt\n            }\n        ) {\n            transaction {\n                ...PlainTransaction\n                fromAccount {\n                    ...PlainAccount\n                }\n                toAccount {\n                    ...PlainAccount\n                }\n                category {\n                    ...PlainCategory\n                }\n            }\n        }\n    }\n": typeof types.AddTransferDocument;
    "\n    mutation DeleteTransaction($transactionId: Int!) {\n        deleteTransaction(input: { id: $transactionId }) {\n            transaction {\n                ...PlainTransaction\n                fromAccount {\n                    ...PlainAccount\n                }\n                toAccount {\n                    ...PlainAccount\n                }\n                category {\n                    ...PlainCategory\n                }\n            }\n        }\n    }\n": typeof types.DeleteTransactionDocument;
    "\n    query GetTransactions($accountId: Int!, $from: Datetime!, $until: Datetime!) {\n        transactions(\n            condition: { toAccountId: $accountId }\n            filter: { date: { greaterThanOrEqualTo: $from, lessThan: $until } }\n        ) {\n            nodes {\n                ...PlainTransaction\n                toAccount {\n                    ...PlainAccount\n                }\n                fromAccount {\n                    ...PlainAccount\n                }\n                category {\n                    ...PlainCategory\n                }\n            }\n            totalCount\n        }\n    }\n": typeof types.GetTransactionsDocument;
    "\n    query GetTransactionsByFromAccount($accountId: Int!, $from: Datetime!, $until: Datetime!) {\n        transactions(\n            condition: { fromAccountId: $accountId }\n            filter: { date: { greaterThanOrEqualTo: $from, lessThan: $until } }\n        ) {\n            nodes {\n                ...PlainTransaction\n                toAccount {\n                    ...PlainAccount\n                }\n                fromAccount {\n                    ...PlainAccount\n                }\n                category {\n                    ...PlainCategory\n                }\n            }\n            totalCount\n        }\n    }\n": typeof types.GetTransactionsByFromAccountDocument;
    "\n    query GetTransactionsPageByAccountId($accountId: Int!, $first: Int!, $after: Cursor) {\n        transactions(\n            filter: {\n                or: [\n                    { toAccountId: { equalTo: $accountId } }\n                    { fromAccountId: { equalTo: $accountId } }\n                ]\n            }\n            orderBy: [DATE_DESC, ID_DESC]\n            first: $first\n            after: $after\n        ) {\n            nodes {\n                ...PlainTransaction\n                toAccount {\n                    ...PlainAccount\n                }\n                fromAccount {\n                    ...PlainAccount\n                }\n                category {\n                    ...PlainCategory\n                }\n            }\n            pageInfo {\n                endCursor\n                hasNextPage\n            }\n        }\n    }\n": typeof types.GetTransactionsPageByAccountIdDocument;
    "\n    mutation UpdateTransaction(\n        $id: Int!\n        $amount: Float!\n        $description: String!\n        $categoryId: Int!\n        $occurredAt: Datetime!\n    ) {\n        updateTransaction(\n            input: {\n                id: $id\n                amount: $amount\n                description: $description\n                categoryId: $categoryId\n                occurredAt: $occurredAt\n            }\n        ) {\n            transaction {\n                ...PlainTransaction\n                fromAccount {\n                    ...PlainAccount\n                }\n                toAccount {\n                    ...PlainAccount\n                }\n                category {\n                    ...PlainCategory\n                }\n            }\n        }\n    }\n": typeof types.UpdateTransactionDocument;
    "\n    mutation CurrentUser {\n        currentUser(input: {}) {\n            owner {\n                accounts(orderBy: [NAME_ASC]) {\n                    nodes {\n                        id\n                        name\n                        balance\n                    }\n                }\n                categories(orderBy: [NAME_ASC]) {\n                    nodes {\n                        id\n                        name\n                    }\n                }\n            }\n        }\n    }\n": typeof types.CurrentUserDocument;
};
const documents: Documents = {
    "\n    query GetAllAccounts {\n        accounts {\n            nodes {\n                id\n                balance\n                name\n            }\n        }\n    }\n":
        types.GetAllAccountsDocument,
    "\n    query GetAccountById($id: Int!) {\n        account(id: $id) {\n            id\n            name\n            balance\n        }\n    }\n":
        types.GetAccountByIdDocument,
    "\n    mutation CreateAccount($name: String!) {\n        createAccount(input: { name: $name, type: CASH, balance: 0.0 }) {\n            account {\n                balance\n                id\n                name\n            }\n        }\n    }\n":
        types.CreateAccountDocument,
    "\n    mutation DeleteAccount($id: Int!) {\n        closeAccount(input: { id: $id }) {\n            account {\n                balance\n                id\n                name\n            }\n        }\n    }\n":
        types.DeleteAccountDocument,
    "\n    fragment PlainAccount on Account {\n        id\n        name\n        balance\n    }\n":
        types.PlainAccountFragmentDoc,
    "\n    mutation CreateCategory($name: String!) {\n        createCategoryV2(input: { name: $name, type: ANY }) {\n            category {\n                id\n                name\n            }\n        }\n    }\n":
        types.CreateCategoryDocument,
    "\n    mutation DeleteCategory($id: Int!) {\n        deleteCategory(input: { id: $id }) {\n            owner {\n                categories {\n                    nodes {\n                        id\n                        name\n                    }\n                }\n            }\n        }\n    }\n":
        types.DeleteCategoryDocument,
    "\n    query GetAllCategories {\n        categories {\n            nodes {\n                id\n                name\n            }\n        }\n    }\n":
        types.GetAllCategoriesDocument,
    "\n    fragment PlainCategory on Category {\n        id\n        name\n    }\n":
        types.PlainCategoryFragmentDoc,
    "\n    fragment PlainTransaction on Transaction {\n        id\n        amount\n        description\n        type\n        date\n        categoryId\n        fromAccountId\n        toAccountId\n    }\n":
        types.PlainTransactionFragmentDoc,
    "\n    mutation AddExpense(\n        $amount: Float!\n        $description: String!\n        $categoryId: Int!\n        $fromAccountId: Int!\n        $occurredAt: Datetime!\n    ) {\n        spend(\n            input: {\n                amount: $amount\n                description: $description\n                categoryId: $categoryId\n                fromAccountId: $fromAccountId\n                occurredAt: $occurredAt\n            }\n        ) {\n            transaction {\n                ...PlainTransaction\n                fromAccount {\n                    ...PlainAccount\n                }\n                category {\n                    ...PlainCategory\n                }\n            }\n        }\n    }\n":
        types.AddExpenseDocument,
    "\n    mutation AddIncome(\n        $amount: Float!\n        $description: String!\n        $categoryId: Int!\n        $toAccountId: Int!\n        $occurredAt: Datetime!\n    ) {\n        receive(\n            input: {\n                amount: $amount\n                description: $description\n                categoryId: $categoryId\n                toAccountId: $toAccountId\n                occurredAt: $occurredAt\n            }\n        ) {\n            transaction {\n                ...PlainTransaction\n                toAccount {\n                    ...PlainAccount\n                }\n                category {\n                    ...PlainCategory\n                }\n            }\n        }\n    }\n":
        types.AddIncomeDocument,
    "\n    mutation AddTransfer(\n        $amount: Float!\n        $description: String!\n        $categoryId: Int!\n        $fromAccountId: Int!\n        $toAccountId: Int!\n        $occurredAt: Datetime!\n    ) {\n        transferV2(\n            input: {\n                amount: $amount\n                description: $description\n                categoryId: $categoryId\n                fromAccountId: $fromAccountId\n                toAccountId: $toAccountId\n                occurredAt: $occurredAt\n            }\n        ) {\n            transaction {\n                ...PlainTransaction\n                fromAccount {\n                    ...PlainAccount\n                }\n                toAccount {\n                    ...PlainAccount\n                }\n                category {\n                    ...PlainCategory\n                }\n            }\n        }\n    }\n":
        types.AddTransferDocument,
    "\n    mutation DeleteTransaction($transactionId: Int!) {\n        deleteTransaction(input: { id: $transactionId }) {\n            transaction {\n                ...PlainTransaction\n                fromAccount {\n                    ...PlainAccount\n                }\n                toAccount {\n                    ...PlainAccount\n                }\n                category {\n                    ...PlainCategory\n                }\n            }\n        }\n    }\n":
        types.DeleteTransactionDocument,
    "\n    query GetTransactions($accountId: Int!, $from: Datetime!, $until: Datetime!) {\n        transactions(\n            condition: { toAccountId: $accountId }\n            filter: { date: { greaterThanOrEqualTo: $from, lessThan: $until } }\n        ) {\n            nodes {\n                ...PlainTransaction\n                toAccount {\n                    ...PlainAccount\n                }\n                fromAccount {\n                    ...PlainAccount\n                }\n                category {\n                    ...PlainCategory\n                }\n            }\n            totalCount\n        }\n    }\n":
        types.GetTransactionsDocument,
    "\n    query GetTransactionsByFromAccount($accountId: Int!, $from: Datetime!, $until: Datetime!) {\n        transactions(\n            condition: { fromAccountId: $accountId }\n            filter: { date: { greaterThanOrEqualTo: $from, lessThan: $until } }\n        ) {\n            nodes {\n                ...PlainTransaction\n                toAccount {\n                    ...PlainAccount\n                }\n                fromAccount {\n                    ...PlainAccount\n                }\n                category {\n                    ...PlainCategory\n                }\n            }\n            totalCount\n        }\n    }\n":
        types.GetTransactionsByFromAccountDocument,
    "\n    query GetTransactionsPageByAccountId($accountId: Int!, $first: Int!, $after: Cursor) {\n        transactions(\n            filter: {\n                or: [\n                    { toAccountId: { equalTo: $accountId } }\n                    { fromAccountId: { equalTo: $accountId } }\n                ]\n            }\n            orderBy: [DATE_DESC, ID_DESC]\n            first: $first\n            after: $after\n        ) {\n            nodes {\n                ...PlainTransaction\n                toAccount {\n                    ...PlainAccount\n                }\n                fromAccount {\n                    ...PlainAccount\n                }\n                category {\n                    ...PlainCategory\n                }\n            }\n            pageInfo {\n                endCursor\n                hasNextPage\n            }\n        }\n    }\n":
        types.GetTransactionsPageByAccountIdDocument,
    "\n    mutation UpdateTransaction(\n        $id: Int!\n        $amount: Float!\n        $description: String!\n        $categoryId: Int!\n        $occurredAt: Datetime!\n    ) {\n        updateTransaction(\n            input: {\n                id: $id\n                amount: $amount\n                description: $description\n                categoryId: $categoryId\n                occurredAt: $occurredAt\n            }\n        ) {\n            transaction {\n                ...PlainTransaction\n                fromAccount {\n                    ...PlainAccount\n                }\n                toAccount {\n                    ...PlainAccount\n                }\n                category {\n                    ...PlainCategory\n                }\n            }\n        }\n    }\n":
        types.UpdateTransactionDocument,
    "\n    mutation CurrentUser {\n        currentUser(input: {}) {\n            owner {\n                accounts(orderBy: [NAME_ASC]) {\n                    nodes {\n                        id\n                        name\n                        balance\n                    }\n                }\n                categories(orderBy: [NAME_ASC]) {\n                    nodes {\n                        id\n                        name\n                    }\n                }\n            }\n        }\n    }\n":
        types.CurrentUserDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query GetAllAccounts {\n        accounts {\n            nodes {\n                id\n                balance\n                name\n            }\n        }\n    }\n"
): (typeof documents)["\n    query GetAllAccounts {\n        accounts {\n            nodes {\n                id\n                balance\n                name\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query GetAccountById($id: Int!) {\n        account(id: $id) {\n            id\n            name\n            balance\n        }\n    }\n"
): (typeof documents)["\n    query GetAccountById($id: Int!) {\n        account(id: $id) {\n            id\n            name\n            balance\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation CreateAccount($name: String!) {\n        createAccount(input: { name: $name, type: CASH, balance: 0.0 }) {\n            account {\n                balance\n                id\n                name\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation CreateAccount($name: String!) {\n        createAccount(input: { name: $name, type: CASH, balance: 0.0 }) {\n            account {\n                balance\n                id\n                name\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation DeleteAccount($id: Int!) {\n        closeAccount(input: { id: $id }) {\n            account {\n                balance\n                id\n                name\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation DeleteAccount($id: Int!) {\n        closeAccount(input: { id: $id }) {\n            account {\n                balance\n                id\n                name\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    fragment PlainAccount on Account {\n        id\n        name\n        balance\n    }\n"
): (typeof documents)["\n    fragment PlainAccount on Account {\n        id\n        name\n        balance\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation CreateCategory($name: String!) {\n        createCategoryV2(input: { name: $name, type: ANY }) {\n            category {\n                id\n                name\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation CreateCategory($name: String!) {\n        createCategoryV2(input: { name: $name, type: ANY }) {\n            category {\n                id\n                name\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation DeleteCategory($id: Int!) {\n        deleteCategory(input: { id: $id }) {\n            owner {\n                categories {\n                    nodes {\n                        id\n                        name\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation DeleteCategory($id: Int!) {\n        deleteCategory(input: { id: $id }) {\n            owner {\n                categories {\n                    nodes {\n                        id\n                        name\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query GetAllCategories {\n        categories {\n            nodes {\n                id\n                name\n            }\n        }\n    }\n"
): (typeof documents)["\n    query GetAllCategories {\n        categories {\n            nodes {\n                id\n                name\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    fragment PlainCategory on Category {\n        id\n        name\n    }\n"
): (typeof documents)["\n    fragment PlainCategory on Category {\n        id\n        name\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    fragment PlainTransaction on Transaction {\n        id\n        amount\n        description\n        type\n        date\n        categoryId\n        fromAccountId\n        toAccountId\n    }\n"
): (typeof documents)["\n    fragment PlainTransaction on Transaction {\n        id\n        amount\n        description\n        type\n        date\n        categoryId\n        fromAccountId\n        toAccountId\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation AddExpense(\n        $amount: Float!\n        $description: String!\n        $categoryId: Int!\n        $fromAccountId: Int!\n        $occurredAt: Datetime!\n    ) {\n        spend(\n            input: {\n                amount: $amount\n                description: $description\n                categoryId: $categoryId\n                fromAccountId: $fromAccountId\n                occurredAt: $occurredAt\n            }\n        ) {\n            transaction {\n                ...PlainTransaction\n                fromAccount {\n                    ...PlainAccount\n                }\n                category {\n                    ...PlainCategory\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation AddExpense(\n        $amount: Float!\n        $description: String!\n        $categoryId: Int!\n        $fromAccountId: Int!\n        $occurredAt: Datetime!\n    ) {\n        spend(\n            input: {\n                amount: $amount\n                description: $description\n                categoryId: $categoryId\n                fromAccountId: $fromAccountId\n                occurredAt: $occurredAt\n            }\n        ) {\n            transaction {\n                ...PlainTransaction\n                fromAccount {\n                    ...PlainAccount\n                }\n                category {\n                    ...PlainCategory\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation AddIncome(\n        $amount: Float!\n        $description: String!\n        $categoryId: Int!\n        $toAccountId: Int!\n        $occurredAt: Datetime!\n    ) {\n        receive(\n            input: {\n                amount: $amount\n                description: $description\n                categoryId: $categoryId\n                toAccountId: $toAccountId\n                occurredAt: $occurredAt\n            }\n        ) {\n            transaction {\n                ...PlainTransaction\n                toAccount {\n                    ...PlainAccount\n                }\n                category {\n                    ...PlainCategory\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation AddIncome(\n        $amount: Float!\n        $description: String!\n        $categoryId: Int!\n        $toAccountId: Int!\n        $occurredAt: Datetime!\n    ) {\n        receive(\n            input: {\n                amount: $amount\n                description: $description\n                categoryId: $categoryId\n                toAccountId: $toAccountId\n                occurredAt: $occurredAt\n            }\n        ) {\n            transaction {\n                ...PlainTransaction\n                toAccount {\n                    ...PlainAccount\n                }\n                category {\n                    ...PlainCategory\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation AddTransfer(\n        $amount: Float!\n        $description: String!\n        $categoryId: Int!\n        $fromAccountId: Int!\n        $toAccountId: Int!\n        $occurredAt: Datetime!\n    ) {\n        transferV2(\n            input: {\n                amount: $amount\n                description: $description\n                categoryId: $categoryId\n                fromAccountId: $fromAccountId\n                toAccountId: $toAccountId\n                occurredAt: $occurredAt\n            }\n        ) {\n            transaction {\n                ...PlainTransaction\n                fromAccount {\n                    ...PlainAccount\n                }\n                toAccount {\n                    ...PlainAccount\n                }\n                category {\n                    ...PlainCategory\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation AddTransfer(\n        $amount: Float!\n        $description: String!\n        $categoryId: Int!\n        $fromAccountId: Int!\n        $toAccountId: Int!\n        $occurredAt: Datetime!\n    ) {\n        transferV2(\n            input: {\n                amount: $amount\n                description: $description\n                categoryId: $categoryId\n                fromAccountId: $fromAccountId\n                toAccountId: $toAccountId\n                occurredAt: $occurredAt\n            }\n        ) {\n            transaction {\n                ...PlainTransaction\n                fromAccount {\n                    ...PlainAccount\n                }\n                toAccount {\n                    ...PlainAccount\n                }\n                category {\n                    ...PlainCategory\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation DeleteTransaction($transactionId: Int!) {\n        deleteTransaction(input: { id: $transactionId }) {\n            transaction {\n                ...PlainTransaction\n                fromAccount {\n                    ...PlainAccount\n                }\n                toAccount {\n                    ...PlainAccount\n                }\n                category {\n                    ...PlainCategory\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation DeleteTransaction($transactionId: Int!) {\n        deleteTransaction(input: { id: $transactionId }) {\n            transaction {\n                ...PlainTransaction\n                fromAccount {\n                    ...PlainAccount\n                }\n                toAccount {\n                    ...PlainAccount\n                }\n                category {\n                    ...PlainCategory\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query GetTransactions($accountId: Int!, $from: Datetime!, $until: Datetime!) {\n        transactions(\n            condition: { toAccountId: $accountId }\n            filter: { date: { greaterThanOrEqualTo: $from, lessThan: $until } }\n        ) {\n            nodes {\n                ...PlainTransaction\n                toAccount {\n                    ...PlainAccount\n                }\n                fromAccount {\n                    ...PlainAccount\n                }\n                category {\n                    ...PlainCategory\n                }\n            }\n            totalCount\n        }\n    }\n"
): (typeof documents)["\n    query GetTransactions($accountId: Int!, $from: Datetime!, $until: Datetime!) {\n        transactions(\n            condition: { toAccountId: $accountId }\n            filter: { date: { greaterThanOrEqualTo: $from, lessThan: $until } }\n        ) {\n            nodes {\n                ...PlainTransaction\n                toAccount {\n                    ...PlainAccount\n                }\n                fromAccount {\n                    ...PlainAccount\n                }\n                category {\n                    ...PlainCategory\n                }\n            }\n            totalCount\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query GetTransactionsByFromAccount($accountId: Int!, $from: Datetime!, $until: Datetime!) {\n        transactions(\n            condition: { fromAccountId: $accountId }\n            filter: { date: { greaterThanOrEqualTo: $from, lessThan: $until } }\n        ) {\n            nodes {\n                ...PlainTransaction\n                toAccount {\n                    ...PlainAccount\n                }\n                fromAccount {\n                    ...PlainAccount\n                }\n                category {\n                    ...PlainCategory\n                }\n            }\n            totalCount\n        }\n    }\n"
): (typeof documents)["\n    query GetTransactionsByFromAccount($accountId: Int!, $from: Datetime!, $until: Datetime!) {\n        transactions(\n            condition: { fromAccountId: $accountId }\n            filter: { date: { greaterThanOrEqualTo: $from, lessThan: $until } }\n        ) {\n            nodes {\n                ...PlainTransaction\n                toAccount {\n                    ...PlainAccount\n                }\n                fromAccount {\n                    ...PlainAccount\n                }\n                category {\n                    ...PlainCategory\n                }\n            }\n            totalCount\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query GetTransactionsPageByAccountId($accountId: Int!, $first: Int!, $after: Cursor) {\n        transactions(\n            filter: {\n                or: [\n                    { toAccountId: { equalTo: $accountId } }\n                    { fromAccountId: { equalTo: $accountId } }\n                ]\n            }\n            orderBy: [DATE_DESC, ID_DESC]\n            first: $first\n            after: $after\n        ) {\n            nodes {\n                ...PlainTransaction\n                toAccount {\n                    ...PlainAccount\n                }\n                fromAccount {\n                    ...PlainAccount\n                }\n                category {\n                    ...PlainCategory\n                }\n            }\n            pageInfo {\n                endCursor\n                hasNextPage\n            }\n        }\n    }\n"
): (typeof documents)["\n    query GetTransactionsPageByAccountId($accountId: Int!, $first: Int!, $after: Cursor) {\n        transactions(\n            filter: {\n                or: [\n                    { toAccountId: { equalTo: $accountId } }\n                    { fromAccountId: { equalTo: $accountId } }\n                ]\n            }\n            orderBy: [DATE_DESC, ID_DESC]\n            first: $first\n            after: $after\n        ) {\n            nodes {\n                ...PlainTransaction\n                toAccount {\n                    ...PlainAccount\n                }\n                fromAccount {\n                    ...PlainAccount\n                }\n                category {\n                    ...PlainCategory\n                }\n            }\n            pageInfo {\n                endCursor\n                hasNextPage\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation UpdateTransaction(\n        $id: Int!\n        $amount: Float!\n        $description: String!\n        $categoryId: Int!\n        $occurredAt: Datetime!\n    ) {\n        updateTransaction(\n            input: {\n                id: $id\n                amount: $amount\n                description: $description\n                categoryId: $categoryId\n                occurredAt: $occurredAt\n            }\n        ) {\n            transaction {\n                ...PlainTransaction\n                fromAccount {\n                    ...PlainAccount\n                }\n                toAccount {\n                    ...PlainAccount\n                }\n                category {\n                    ...PlainCategory\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation UpdateTransaction(\n        $id: Int!\n        $amount: Float!\n        $description: String!\n        $categoryId: Int!\n        $occurredAt: Datetime!\n    ) {\n        updateTransaction(\n            input: {\n                id: $id\n                amount: $amount\n                description: $description\n                categoryId: $categoryId\n                occurredAt: $occurredAt\n            }\n        ) {\n            transaction {\n                ...PlainTransaction\n                fromAccount {\n                    ...PlainAccount\n                }\n                toAccount {\n                    ...PlainAccount\n                }\n                category {\n                    ...PlainCategory\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation CurrentUser {\n        currentUser(input: {}) {\n            owner {\n                accounts(orderBy: [NAME_ASC]) {\n                    nodes {\n                        id\n                        name\n                        balance\n                    }\n                }\n                categories(orderBy: [NAME_ASC]) {\n                    nodes {\n                        id\n                        name\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation CurrentUser {\n        currentUser(input: {}) {\n            owner {\n                accounts(orderBy: [NAME_ASC]) {\n                    nodes {\n                        id\n                        name\n                        balance\n                    }\n                }\n                categories(orderBy: [NAME_ASC]) {\n                    nodes {\n                        id\n                        name\n                    }\n                }\n            }\n        }\n    }\n"];

export function graphql(source: string) {
    return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
    TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
