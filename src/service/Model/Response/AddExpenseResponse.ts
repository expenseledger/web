import Wallet from '../Wallet';
import Transaction from '../Transaction';

export default class AddExpenseResponse {
  public srcWallet: Wallet;
  public transaction: Transaction;

  constructor(srcWallet: Wallet, transactoin: Transaction) {
    this.srcWallet = srcWallet;
    this.transaction = transactoin;
  }
}