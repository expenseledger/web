import Transaction from "../Transaction";
import Wallet from "../Wallet";

export default interface IAddIncomeResponse {
  dstWallet: Wallet;
  transaction: Transaction;
}
