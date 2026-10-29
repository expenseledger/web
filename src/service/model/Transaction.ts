import { TransactionType } from "../constants";
import Account from "./Account";
import Category from "./Category";

export interface Transaction {
    id: string;
    fromAccount?: Account;
    toAccount?: Account;
    /** In the from account's currency (the to account's for an income). */
    amount: number;
    /** What the to account receives in a cross-currency transfer. */
    convertedAmount?: number;
    type: TransactionType;
    category?: Category;
    description: string | null;
    date: Date;
}

export default Transaction;
