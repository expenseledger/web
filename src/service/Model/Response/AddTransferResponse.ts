import Transaction from "../Transaction";
import Wallet from "../Wallet";

export default interface IAddTransferResponse {
  dstWallet: Wallet;
  srcWallet: Wallet;
  transaction: Transaction;
}
