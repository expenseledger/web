export default class AddTransactionRequest {
  public amount: number;
  public date: Date;
  public note: string;
  public wallet: string;

  constructor() {
    this.amount = 0;
    this.date = new Date();
    this.note = '';
    this.wallet = '';
  }
}