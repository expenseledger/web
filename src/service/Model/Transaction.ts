export default class Transaction {
  public id: number;
  public srcWallet: string;
  public dstWallet: string;
  public amount: number;
  public type: string;
  public category: string;
  public description: string;
  public date: Date;
}