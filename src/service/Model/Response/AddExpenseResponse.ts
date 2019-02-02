import Transaction from "../Transaction";
import Wallet from "../Wallet";

export default interface IAddExpenseResponse {
  srcWallet: Wallet;
  transaction: Transaction;
}
