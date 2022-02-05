import { TransactionType } from "../constants";
import Account from "./Account";
import Category from "./Category";

export interface Transaction {
    id: number;
    fromAccount?: Account;
    toAccount?: Account;
    amount: number;
    type: TransactionType;
    category?: Category;
    description: string;
    date: Date;
}

export default Transaction;
