import Transaction from "../../service/model/Transaction";

export const getAmount = (tx: Transaction) => {
    switch (tx.type) {
        case "EXPENSE":
            return -tx.amount;
        case "INCOME":
        default:
            return tx.amount;
    }
};
export const expenseFilter = (t: Transaction) => getAmount(t) < 0;
export const incomeFilter = (t: Transaction) => getAmount(t) >= 0;

export const EXPENSE_COLOR = "#ff7285";
export const INCOME_COLOR = "#0088FE";
