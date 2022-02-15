export const httpStatus = {
    badRequest: 400,
    internalServerError: 500,
    ok: 200,
};

export const allAccountTypes: AccountType[] = ["CASH", "BANK", "CREDIT"];

export const allCategoryTypes: CategoryType[] = ["ANY", "INCOME", "EXPENSE", "TRANSFER"];

export const allTransactionType: TransactionType[] = ["EXPENSE", "INCOME", "TRANSFER"];

export type AccountType = "CASH" | "BANK" | "CREDIT";

export type TransactionType = "EXPENSE" | "INCOME" | "TRANSFER";

export type CategoryType = "ANY" | "INCOME" | "EXPENSE" | "TRANSFER";
