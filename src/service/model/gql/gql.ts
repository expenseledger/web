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
    "\n    fragment PlainAccount on Account {\n        id\n        name\n        balance {\n            amount\n            currency\n        }\n    }\n": typeof types.PlainAccountFragmentDoc;
    '\n    query GetAccountsPage($first: Int!, $after: String) {\n        accounts(first: $first, after: $after, sort: [{ property: "name", direction: ASC }]) {\n            edges {\n                node {\n                    ...PlainAccount\n                }\n            }\n            pageInfo {\n                hasNextPage\n                endCursor\n            }\n        }\n    }\n': typeof types.GetAccountsPageDocument;
    "\n    query GetAccountById($id: ID!) {\n        account(id: $id) {\n            ...PlainAccount\n        }\n    }\n": typeof types.GetAccountByIdDocument;
    "\n    mutation CreateAccount($name: String!, $balance: MoneyInput!) {\n        createAccount(name: $name, balance: $balance) {\n            ...PlainAccount\n        }\n    }\n": typeof types.CreateAccountDocument;
    "\n    mutation PatchAccount($id: ID!, $name: String, $balance: MoneyInput) {\n        patchAccount(id: $id, name: $name, balance: $balance) {\n            ...PlainAccount\n        }\n    }\n": typeof types.PatchAccountDocument;
    "\n    mutation DeleteAccount($id: ID!) {\n        deleteAccount(id: $id)\n    }\n": typeof types.DeleteAccountDocument;
    "\n    fragment PlainCategory on Category {\n        id\n        name\n    }\n": typeof types.PlainCategoryFragmentDoc;
    "\n    mutation CreateCategory($name: String!) {\n        createCategory(name: $name) {\n            ...PlainCategory\n        }\n    }\n": typeof types.CreateCategoryDocument;
    "\n    mutation PatchCategory($id: ID!, $name: String) {\n        patchCategory(id: $id, name: $name) {\n            ...PlainCategory\n        }\n    }\n": typeof types.PatchCategoryDocument;
    "\n    mutation DeleteCategory($id: ID!) {\n        deleteCategory(id: $id)\n    }\n": typeof types.DeleteCategoryDocument;
    '\n    query GetCategoriesPage($first: Int!, $after: String) {\n        categories(first: $first, after: $after, sort: [{ property: "name", direction: ASC }]) {\n            edges {\n                node {\n                    ...PlainCategory\n                }\n            }\n            pageInfo {\n                hasNextPage\n                endCursor\n            }\n        }\n    }\n': typeof types.GetCategoriesPageDocument;
    "\n    fragment PlainTransaction on Transaction {\n        __typename\n        id\n        amount {\n            amount\n            currency\n        }\n        description\n        occurredAt\n        category {\n            ...PlainCategory\n        }\n        ... on Expense {\n            from {\n                ...PlainAccount\n            }\n        }\n        ... on Income {\n            to {\n                ...PlainAccount\n            }\n        }\n        ... on Transfer {\n            from {\n                ...PlainAccount\n            }\n            to {\n                ...PlainAccount\n            }\n            convertedAmount {\n                amount\n                currency\n            }\n        }\n    }\n": typeof types.PlainTransactionFragmentDoc;
    "\n    mutation AddExpense(\n        $amount: MoneyInput!\n        $description: String\n        $categoryId: ID\n        $fromAccountId: ID!\n        $occurredAt: String\n    ) {\n        withdraw(\n            amount: $amount\n            description: $description\n            categoryId: $categoryId\n            fromAccountId: $fromAccountId\n            occurredAt: $occurredAt\n        ) {\n            ...PlainTransaction\n        }\n    }\n": typeof types.AddExpenseDocument;
    "\n    mutation AddIncome(\n        $amount: MoneyInput!\n        $description: String\n        $categoryId: ID\n        $toAccountId: ID!\n        $occurredAt: String\n    ) {\n        deposit(\n            amount: $amount\n            description: $description\n            categoryId: $categoryId\n            toAccountId: $toAccountId\n            occurredAt: $occurredAt\n        ) {\n            ...PlainTransaction\n        }\n    }\n": typeof types.AddIncomeDocument;
    "\n    mutation AddTransfer(\n        $amount: MoneyInput!\n        $convertedAmount: MoneyInput\n        $description: String\n        $categoryId: ID\n        $fromAccountId: ID!\n        $toAccountId: ID!\n        $occurredAt: String\n    ) {\n        transfer(\n            amount: $amount\n            convertedAmount: $convertedAmount\n            description: $description\n            categoryId: $categoryId\n            fromAccountId: $fromAccountId\n            toAccountId: $toAccountId\n            occurredAt: $occurredAt\n        ) {\n            ...PlainTransaction\n        }\n    }\n": typeof types.AddTransferDocument;
    "\n    mutation DeleteTransaction($transactionId: ID!) {\n        deleteTransaction(id: $transactionId)\n    }\n": typeof types.DeleteTransactionDocument;
    '\n    query GetTransactionsPage(\n        $first: Int!\n        $after: String\n        $accountId: ID\n        $fromDate: String\n        $toDate: String\n    ) {\n        transactions(\n            first: $first\n            after: $after\n            sort: [{ property: "occurredAt", direction: DESC }, { property: "id", direction: DESC }]\n            filter: { accountId: $accountId, fromDate: $fromDate, toDate: $toDate }\n        ) {\n            edges {\n                node {\n                    ...PlainTransaction\n                }\n            }\n            pageInfo {\n                hasNextPage\n                endCursor\n            }\n        }\n    }\n': typeof types.GetTransactionsPageDocument;
    "\n    mutation PatchExpense(\n        $id: ID!\n        $amount: MoneyInput\n        $categoryId: ID\n        $description: String\n        $occurredAt: String\n    ) {\n        patchExpense(\n            id: $id\n            amount: $amount\n            categoryId: $categoryId\n            description: $description\n            occurredAt: $occurredAt\n        ) {\n            ...PlainTransaction\n        }\n    }\n": typeof types.PatchExpenseDocument;
    "\n    mutation PatchIncome(\n        $id: ID!\n        $amount: MoneyInput\n        $categoryId: ID\n        $description: String\n        $occurredAt: String\n    ) {\n        patchIncome(\n            id: $id\n            amount: $amount\n            categoryId: $categoryId\n            description: $description\n            occurredAt: $occurredAt\n        ) {\n            ...PlainTransaction\n        }\n    }\n": typeof types.PatchIncomeDocument;
    "\n    mutation PatchTransfer(\n        $id: ID!\n        $amount: MoneyInput\n        $convertedAmount: MoneyInput\n        $categoryId: ID\n        $description: String\n        $occurredAt: String\n    ) {\n        patchTransfer(\n            id: $id\n            amount: $amount\n            convertedAmount: $convertedAmount\n            categoryId: $categoryId\n            description: $description\n            occurredAt: $occurredAt\n        ) {\n            ...PlainTransaction\n        }\n    }\n": typeof types.PatchTransferDocument;
    "\n    mutation InitializeUser {\n        initializeUser\n    }\n": typeof types.InitializeUserDocument;
};
const documents: Documents = {
    "\n    fragment PlainAccount on Account {\n        id\n        name\n        balance {\n            amount\n            currency\n        }\n    }\n":
        types.PlainAccountFragmentDoc,
    '\n    query GetAccountsPage($first: Int!, $after: String) {\n        accounts(first: $first, after: $after, sort: [{ property: "name", direction: ASC }]) {\n            edges {\n                node {\n                    ...PlainAccount\n                }\n            }\n            pageInfo {\n                hasNextPage\n                endCursor\n            }\n        }\n    }\n':
        types.GetAccountsPageDocument,
    "\n    query GetAccountById($id: ID!) {\n        account(id: $id) {\n            ...PlainAccount\n        }\n    }\n":
        types.GetAccountByIdDocument,
    "\n    mutation CreateAccount($name: String!, $balance: MoneyInput!) {\n        createAccount(name: $name, balance: $balance) {\n            ...PlainAccount\n        }\n    }\n":
        types.CreateAccountDocument,
    "\n    mutation PatchAccount($id: ID!, $name: String, $balance: MoneyInput) {\n        patchAccount(id: $id, name: $name, balance: $balance) {\n            ...PlainAccount\n        }\n    }\n":
        types.PatchAccountDocument,
    "\n    mutation DeleteAccount($id: ID!) {\n        deleteAccount(id: $id)\n    }\n":
        types.DeleteAccountDocument,
    "\n    fragment PlainCategory on Category {\n        id\n        name\n    }\n":
        types.PlainCategoryFragmentDoc,
    "\n    mutation CreateCategory($name: String!) {\n        createCategory(name: $name) {\n            ...PlainCategory\n        }\n    }\n":
        types.CreateCategoryDocument,
    "\n    mutation PatchCategory($id: ID!, $name: String) {\n        patchCategory(id: $id, name: $name) {\n            ...PlainCategory\n        }\n    }\n":
        types.PatchCategoryDocument,
    "\n    mutation DeleteCategory($id: ID!) {\n        deleteCategory(id: $id)\n    }\n":
        types.DeleteCategoryDocument,
    '\n    query GetCategoriesPage($first: Int!, $after: String) {\n        categories(first: $first, after: $after, sort: [{ property: "name", direction: ASC }]) {\n            edges {\n                node {\n                    ...PlainCategory\n                }\n            }\n            pageInfo {\n                hasNextPage\n                endCursor\n            }\n        }\n    }\n':
        types.GetCategoriesPageDocument,
    "\n    fragment PlainTransaction on Transaction {\n        __typename\n        id\n        amount {\n            amount\n            currency\n        }\n        description\n        occurredAt\n        category {\n            ...PlainCategory\n        }\n        ... on Expense {\n            from {\n                ...PlainAccount\n            }\n        }\n        ... on Income {\n            to {\n                ...PlainAccount\n            }\n        }\n        ... on Transfer {\n            from {\n                ...PlainAccount\n            }\n            to {\n                ...PlainAccount\n            }\n            convertedAmount {\n                amount\n                currency\n            }\n        }\n    }\n":
        types.PlainTransactionFragmentDoc,
    "\n    mutation AddExpense(\n        $amount: MoneyInput!\n        $description: String\n        $categoryId: ID\n        $fromAccountId: ID!\n        $occurredAt: String\n    ) {\n        withdraw(\n            amount: $amount\n            description: $description\n            categoryId: $categoryId\n            fromAccountId: $fromAccountId\n            occurredAt: $occurredAt\n        ) {\n            ...PlainTransaction\n        }\n    }\n":
        types.AddExpenseDocument,
    "\n    mutation AddIncome(\n        $amount: MoneyInput!\n        $description: String\n        $categoryId: ID\n        $toAccountId: ID!\n        $occurredAt: String\n    ) {\n        deposit(\n            amount: $amount\n            description: $description\n            categoryId: $categoryId\n            toAccountId: $toAccountId\n            occurredAt: $occurredAt\n        ) {\n            ...PlainTransaction\n        }\n    }\n":
        types.AddIncomeDocument,
    "\n    mutation AddTransfer(\n        $amount: MoneyInput!\n        $convertedAmount: MoneyInput\n        $description: String\n        $categoryId: ID\n        $fromAccountId: ID!\n        $toAccountId: ID!\n        $occurredAt: String\n    ) {\n        transfer(\n            amount: $amount\n            convertedAmount: $convertedAmount\n            description: $description\n            categoryId: $categoryId\n            fromAccountId: $fromAccountId\n            toAccountId: $toAccountId\n            occurredAt: $occurredAt\n        ) {\n            ...PlainTransaction\n        }\n    }\n":
        types.AddTransferDocument,
    "\n    mutation DeleteTransaction($transactionId: ID!) {\n        deleteTransaction(id: $transactionId)\n    }\n":
        types.DeleteTransactionDocument,
    '\n    query GetTransactionsPage(\n        $first: Int!\n        $after: String\n        $accountId: ID\n        $fromDate: String\n        $toDate: String\n    ) {\n        transactions(\n            first: $first\n            after: $after\n            sort: [{ property: "occurredAt", direction: DESC }, { property: "id", direction: DESC }]\n            filter: { accountId: $accountId, fromDate: $fromDate, toDate: $toDate }\n        ) {\n            edges {\n                node {\n                    ...PlainTransaction\n                }\n            }\n            pageInfo {\n                hasNextPage\n                endCursor\n            }\n        }\n    }\n':
        types.GetTransactionsPageDocument,
    "\n    mutation PatchExpense(\n        $id: ID!\n        $amount: MoneyInput\n        $categoryId: ID\n        $description: String\n        $occurredAt: String\n    ) {\n        patchExpense(\n            id: $id\n            amount: $amount\n            categoryId: $categoryId\n            description: $description\n            occurredAt: $occurredAt\n        ) {\n            ...PlainTransaction\n        }\n    }\n":
        types.PatchExpenseDocument,
    "\n    mutation PatchIncome(\n        $id: ID!\n        $amount: MoneyInput\n        $categoryId: ID\n        $description: String\n        $occurredAt: String\n    ) {\n        patchIncome(\n            id: $id\n            amount: $amount\n            categoryId: $categoryId\n            description: $description\n            occurredAt: $occurredAt\n        ) {\n            ...PlainTransaction\n        }\n    }\n":
        types.PatchIncomeDocument,
    "\n    mutation PatchTransfer(\n        $id: ID!\n        $amount: MoneyInput\n        $convertedAmount: MoneyInput\n        $categoryId: ID\n        $description: String\n        $occurredAt: String\n    ) {\n        patchTransfer(\n            id: $id\n            amount: $amount\n            convertedAmount: $convertedAmount\n            categoryId: $categoryId\n            description: $description\n            occurredAt: $occurredAt\n        ) {\n            ...PlainTransaction\n        }\n    }\n":
        types.PatchTransferDocument,
    "\n    mutation InitializeUser {\n        initializeUser\n    }\n":
        types.InitializeUserDocument,
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
    source: "\n    fragment PlainAccount on Account {\n        id\n        name\n        balance {\n            amount\n            currency\n        }\n    }\n"
): (typeof documents)["\n    fragment PlainAccount on Account {\n        id\n        name\n        balance {\n            amount\n            currency\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n    query GetAccountsPage($first: Int!, $after: String) {\n        accounts(first: $first, after: $after, sort: [{ property: "name", direction: ASC }]) {\n            edges {\n                node {\n                    ...PlainAccount\n                }\n            }\n            pageInfo {\n                hasNextPage\n                endCursor\n            }\n        }\n    }\n'
): (typeof documents)['\n    query GetAccountsPage($first: Int!, $after: String) {\n        accounts(first: $first, after: $after, sort: [{ property: "name", direction: ASC }]) {\n            edges {\n                node {\n                    ...PlainAccount\n                }\n            }\n            pageInfo {\n                hasNextPage\n                endCursor\n            }\n        }\n    }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query GetAccountById($id: ID!) {\n        account(id: $id) {\n            ...PlainAccount\n        }\n    }\n"
): (typeof documents)["\n    query GetAccountById($id: ID!) {\n        account(id: $id) {\n            ...PlainAccount\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation CreateAccount($name: String!, $balance: MoneyInput!) {\n        createAccount(name: $name, balance: $balance) {\n            ...PlainAccount\n        }\n    }\n"
): (typeof documents)["\n    mutation CreateAccount($name: String!, $balance: MoneyInput!) {\n        createAccount(name: $name, balance: $balance) {\n            ...PlainAccount\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation PatchAccount($id: ID!, $name: String, $balance: MoneyInput) {\n        patchAccount(id: $id, name: $name, balance: $balance) {\n            ...PlainAccount\n        }\n    }\n"
): (typeof documents)["\n    mutation PatchAccount($id: ID!, $name: String, $balance: MoneyInput) {\n        patchAccount(id: $id, name: $name, balance: $balance) {\n            ...PlainAccount\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation DeleteAccount($id: ID!) {\n        deleteAccount(id: $id)\n    }\n"
): (typeof documents)["\n    mutation DeleteAccount($id: ID!) {\n        deleteAccount(id: $id)\n    }\n"];
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
    source: "\n    mutation CreateCategory($name: String!) {\n        createCategory(name: $name) {\n            ...PlainCategory\n        }\n    }\n"
): (typeof documents)["\n    mutation CreateCategory($name: String!) {\n        createCategory(name: $name) {\n            ...PlainCategory\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation PatchCategory($id: ID!, $name: String) {\n        patchCategory(id: $id, name: $name) {\n            ...PlainCategory\n        }\n    }\n"
): (typeof documents)["\n    mutation PatchCategory($id: ID!, $name: String) {\n        patchCategory(id: $id, name: $name) {\n            ...PlainCategory\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation DeleteCategory($id: ID!) {\n        deleteCategory(id: $id)\n    }\n"
): (typeof documents)["\n    mutation DeleteCategory($id: ID!) {\n        deleteCategory(id: $id)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n    query GetCategoriesPage($first: Int!, $after: String) {\n        categories(first: $first, after: $after, sort: [{ property: "name", direction: ASC }]) {\n            edges {\n                node {\n                    ...PlainCategory\n                }\n            }\n            pageInfo {\n                hasNextPage\n                endCursor\n            }\n        }\n    }\n'
): (typeof documents)['\n    query GetCategoriesPage($first: Int!, $after: String) {\n        categories(first: $first, after: $after, sort: [{ property: "name", direction: ASC }]) {\n            edges {\n                node {\n                    ...PlainCategory\n                }\n            }\n            pageInfo {\n                hasNextPage\n                endCursor\n            }\n        }\n    }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    fragment PlainTransaction on Transaction {\n        __typename\n        id\n        amount {\n            amount\n            currency\n        }\n        description\n        occurredAt\n        category {\n            ...PlainCategory\n        }\n        ... on Expense {\n            from {\n                ...PlainAccount\n            }\n        }\n        ... on Income {\n            to {\n                ...PlainAccount\n            }\n        }\n        ... on Transfer {\n            from {\n                ...PlainAccount\n            }\n            to {\n                ...PlainAccount\n            }\n            convertedAmount {\n                amount\n                currency\n            }\n        }\n    }\n"
): (typeof documents)["\n    fragment PlainTransaction on Transaction {\n        __typename\n        id\n        amount {\n            amount\n            currency\n        }\n        description\n        occurredAt\n        category {\n            ...PlainCategory\n        }\n        ... on Expense {\n            from {\n                ...PlainAccount\n            }\n        }\n        ... on Income {\n            to {\n                ...PlainAccount\n            }\n        }\n        ... on Transfer {\n            from {\n                ...PlainAccount\n            }\n            to {\n                ...PlainAccount\n            }\n            convertedAmount {\n                amount\n                currency\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation AddExpense(\n        $amount: MoneyInput!\n        $description: String\n        $categoryId: ID\n        $fromAccountId: ID!\n        $occurredAt: String\n    ) {\n        withdraw(\n            amount: $amount\n            description: $description\n            categoryId: $categoryId\n            fromAccountId: $fromAccountId\n            occurredAt: $occurredAt\n        ) {\n            ...PlainTransaction\n        }\n    }\n"
): (typeof documents)["\n    mutation AddExpense(\n        $amount: MoneyInput!\n        $description: String\n        $categoryId: ID\n        $fromAccountId: ID!\n        $occurredAt: String\n    ) {\n        withdraw(\n            amount: $amount\n            description: $description\n            categoryId: $categoryId\n            fromAccountId: $fromAccountId\n            occurredAt: $occurredAt\n        ) {\n            ...PlainTransaction\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation AddIncome(\n        $amount: MoneyInput!\n        $description: String\n        $categoryId: ID\n        $toAccountId: ID!\n        $occurredAt: String\n    ) {\n        deposit(\n            amount: $amount\n            description: $description\n            categoryId: $categoryId\n            toAccountId: $toAccountId\n            occurredAt: $occurredAt\n        ) {\n            ...PlainTransaction\n        }\n    }\n"
): (typeof documents)["\n    mutation AddIncome(\n        $amount: MoneyInput!\n        $description: String\n        $categoryId: ID\n        $toAccountId: ID!\n        $occurredAt: String\n    ) {\n        deposit(\n            amount: $amount\n            description: $description\n            categoryId: $categoryId\n            toAccountId: $toAccountId\n            occurredAt: $occurredAt\n        ) {\n            ...PlainTransaction\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation AddTransfer(\n        $amount: MoneyInput!\n        $convertedAmount: MoneyInput\n        $description: String\n        $categoryId: ID\n        $fromAccountId: ID!\n        $toAccountId: ID!\n        $occurredAt: String\n    ) {\n        transfer(\n            amount: $amount\n            convertedAmount: $convertedAmount\n            description: $description\n            categoryId: $categoryId\n            fromAccountId: $fromAccountId\n            toAccountId: $toAccountId\n            occurredAt: $occurredAt\n        ) {\n            ...PlainTransaction\n        }\n    }\n"
): (typeof documents)["\n    mutation AddTransfer(\n        $amount: MoneyInput!\n        $convertedAmount: MoneyInput\n        $description: String\n        $categoryId: ID\n        $fromAccountId: ID!\n        $toAccountId: ID!\n        $occurredAt: String\n    ) {\n        transfer(\n            amount: $amount\n            convertedAmount: $convertedAmount\n            description: $description\n            categoryId: $categoryId\n            fromAccountId: $fromAccountId\n            toAccountId: $toAccountId\n            occurredAt: $occurredAt\n        ) {\n            ...PlainTransaction\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation DeleteTransaction($transactionId: ID!) {\n        deleteTransaction(id: $transactionId)\n    }\n"
): (typeof documents)["\n    mutation DeleteTransaction($transactionId: ID!) {\n        deleteTransaction(id: $transactionId)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: '\n    query GetTransactionsPage(\n        $first: Int!\n        $after: String\n        $accountId: ID\n        $fromDate: String\n        $toDate: String\n    ) {\n        transactions(\n            first: $first\n            after: $after\n            sort: [{ property: "occurredAt", direction: DESC }, { property: "id", direction: DESC }]\n            filter: { accountId: $accountId, fromDate: $fromDate, toDate: $toDate }\n        ) {\n            edges {\n                node {\n                    ...PlainTransaction\n                }\n            }\n            pageInfo {\n                hasNextPage\n                endCursor\n            }\n        }\n    }\n'
): (typeof documents)['\n    query GetTransactionsPage(\n        $first: Int!\n        $after: String\n        $accountId: ID\n        $fromDate: String\n        $toDate: String\n    ) {\n        transactions(\n            first: $first\n            after: $after\n            sort: [{ property: "occurredAt", direction: DESC }, { property: "id", direction: DESC }]\n            filter: { accountId: $accountId, fromDate: $fromDate, toDate: $toDate }\n        ) {\n            edges {\n                node {\n                    ...PlainTransaction\n                }\n            }\n            pageInfo {\n                hasNextPage\n                endCursor\n            }\n        }\n    }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation PatchExpense(\n        $id: ID!\n        $amount: MoneyInput\n        $categoryId: ID\n        $description: String\n        $occurredAt: String\n    ) {\n        patchExpense(\n            id: $id\n            amount: $amount\n            categoryId: $categoryId\n            description: $description\n            occurredAt: $occurredAt\n        ) {\n            ...PlainTransaction\n        }\n    }\n"
): (typeof documents)["\n    mutation PatchExpense(\n        $id: ID!\n        $amount: MoneyInput\n        $categoryId: ID\n        $description: String\n        $occurredAt: String\n    ) {\n        patchExpense(\n            id: $id\n            amount: $amount\n            categoryId: $categoryId\n            description: $description\n            occurredAt: $occurredAt\n        ) {\n            ...PlainTransaction\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation PatchIncome(\n        $id: ID!\n        $amount: MoneyInput\n        $categoryId: ID\n        $description: String\n        $occurredAt: String\n    ) {\n        patchIncome(\n            id: $id\n            amount: $amount\n            categoryId: $categoryId\n            description: $description\n            occurredAt: $occurredAt\n        ) {\n            ...PlainTransaction\n        }\n    }\n"
): (typeof documents)["\n    mutation PatchIncome(\n        $id: ID!\n        $amount: MoneyInput\n        $categoryId: ID\n        $description: String\n        $occurredAt: String\n    ) {\n        patchIncome(\n            id: $id\n            amount: $amount\n            categoryId: $categoryId\n            description: $description\n            occurredAt: $occurredAt\n        ) {\n            ...PlainTransaction\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation PatchTransfer(\n        $id: ID!\n        $amount: MoneyInput\n        $convertedAmount: MoneyInput\n        $categoryId: ID\n        $description: String\n        $occurredAt: String\n    ) {\n        patchTransfer(\n            id: $id\n            amount: $amount\n            convertedAmount: $convertedAmount\n            categoryId: $categoryId\n            description: $description\n            occurredAt: $occurredAt\n        ) {\n            ...PlainTransaction\n        }\n    }\n"
): (typeof documents)["\n    mutation PatchTransfer(\n        $id: ID!\n        $amount: MoneyInput\n        $convertedAmount: MoneyInput\n        $categoryId: ID\n        $description: String\n        $occurredAt: String\n    ) {\n        patchTransfer(\n            id: $id\n            amount: $amount\n            convertedAmount: $convertedAmount\n            categoryId: $categoryId\n            description: $description\n            occurredAt: $occurredAt\n        ) {\n            ...PlainTransaction\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation InitializeUser {\n        initializeUser\n    }\n"
): (typeof documents)["\n    mutation InitializeUser {\n        initializeUser\n    }\n"];

export function graphql(source: string) {
    return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
    TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
