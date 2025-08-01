import dayjs from "../../lib/dayjs";
import { TransactionType } from "../constants";
import { Transaction } from "../model/Transaction";

export function mapTransactionFromServer(data: any): Transaction {
    return {
        id: data.id,
        fromAccount: data.fromAccount
            ? {
                  ...data.fromAccount,
              }
            : null,
        toAccount: data.toAccount
            ? {
                  ...data.toAccount,
              }
            : null,
        amount: data.amount,
        type: data.type as TransactionType,
        category: data.category
            ? {
                  ...data.category,
              }
            : null,
        description: data.description,
        date: dayjs(data.date).toDate(),
    };
}
