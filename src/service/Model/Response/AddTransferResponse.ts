import Wallet from '../Wallet';
import Transaction from '../Transaction';

export default interface IAddTransferResponse {
  dstWallet: Wallet;
  srcWallet: Wallet;
  transaction: Transaction;
}