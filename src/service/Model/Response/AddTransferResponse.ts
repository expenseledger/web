import Wallet from '../Wallet';
import Transaction from '../Transaction';

export default class AddTransferResponse {
  public dstWallet: Wallet;
  public srcWallet: Wallet;
  public transaction: Transaction;
}