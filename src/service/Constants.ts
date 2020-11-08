export const httpStatus = {
    badRequest: 400,
    internalServerError: 500,
    ok: 200,
};

export type WalletType = "CASH" | "BANK_ACCOUNT" | "CREDIT";

export type TransactionType = "EXPENSE" | "INCOME" | "TRANSFER";
