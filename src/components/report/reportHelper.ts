import Transaction from "../../service/model/Transaction";

export const getAmount = (tx: Transaction, accountIds: number[]) => {
    switch (tx.type) {
        case "EXPENSE":
            return -tx.amount;
        case "TRANSFER":
            return accountIds.some((a) => a === tx.toAccount.id) ? tx.amount : -tx.amount;
        case "INCOME":
        default:
            return tx.amount;
    }
};
