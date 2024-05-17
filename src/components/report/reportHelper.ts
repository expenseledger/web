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

export const getMedian = (arr: number[]) => {
    const mid = Math.floor(arr.length / 2);
    const nums = [...arr].sort((a, b) => a - b);

    return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

export const EXPENSE_COLOR = "#ff7285";
export const INCOME_COLOR = "#0088FE";
