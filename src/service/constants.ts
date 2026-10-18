export const httpStatus = {
    badRequest: 400,
    internalServerError: 500,
    ok: 200,
};

export const allTransactionType: TransactionType[] = ["EXPENSE", "INCOME", "TRANSFER"];

export type TransactionType = "EXPENSE" | "INCOME" | "TRANSFER";

export type Currency = "THB" | "USD" | "EUR" | "JPY";

export const allCurrencies: Currency[] = ["THB", "USD", "EUR", "JPY"];

export const currencySymbols: Record<Currency, string> = {
    THB: "฿",
    USD: "$",
    EUR: "€",
    JPY: "¥",
};
