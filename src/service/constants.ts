export const httpStatus = {
    badRequest: 400,
    internalServerError: 500,
    ok: 200,
};

export const allTransactionType: TransactionType[] = ["EXPENSE", "INCOME", "TRANSFER"];

export type TransactionType = "EXPENSE" | "INCOME" | "TRANSFER";

export const allCategoryTypes: CategoryType[] = ["ANY", "EXPENSE", "INCOME", "TRANSFER"];

/** ANY fits every transaction type; the others fit only their own. */
export type CategoryType = "ANY" | TransactionType;

export type Currency = "THB" | "USD" | "EUR" | "JPY";

export const allCurrencies: Currency[] = ["THB", "USD", "EUR", "JPY"];

export const currencySymbols: Record<Currency, string> = {
    THB: "฿",
    USD: "$",
    EUR: "€",
    JPY: "¥",
};
