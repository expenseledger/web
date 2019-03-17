import { TransactionType } from "../Constants";

export interface ITransaction {
  id: number;
  srcWallet: string;
  dstWallet: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  date: Date;
}

export default ITransaction;
