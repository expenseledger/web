import Wallet from '../Wallet';
import Transaction from '../Transaction';

export default interface IAddIncomeResponse {
  dstWallet: Wallet;
  transaction: Transaction;
}