import { TransactionType } from "../Constants";

export interface Transaction {
    id: string;
    srcWallet: string;
    dstWallet: string;
    amount: number;
    type: TransactionType;
    category: string;
    description: string;
    date: Date;
}

export default Transaction;
