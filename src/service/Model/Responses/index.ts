import Transaction from "../Transaction";
import Wallet from "../Wallet";

export interface IAddExpenseResponse {
  srcWallet: Wallet;
  transaction: Transaction;
}

export interface IAddIncomeResponse {
  dstWallet: Wallet;
  transaction: Transaction;
}

export interface IAddTransferResponse {
  dstWallet: Wallet;
  srcWallet: Wallet;
  transaction: Transaction;
}
