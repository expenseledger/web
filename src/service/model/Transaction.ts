import { TransactionType } from "../constants";
import Category from "./Category";
import Wallet from "./Wallet";

export interface Transaction {
    id: number;
    fromAccount?: Wallet;
    toAccount?: Wallet;
    amount: number;
    type: TransactionType;
    category?: Category;
    description: string;
    date: Date;
}

export default Transaction;
