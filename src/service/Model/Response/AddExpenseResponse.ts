import Wallet from '../Wallet';
import Transaction from '../Transaction';

export default interface IAddExpenseResponse {
  srcWallet: Wallet;
  transaction: Transaction;
}