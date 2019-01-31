import Wallet from '../Wallet';
import Transaction from '../Transaction';

export default class AddIncomeResponse {
  public dstWallet: Wallet;
  public transaction: Transaction;
}