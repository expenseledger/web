export default class AddIncomeRequest {
  /**
   * name of wallet
   */
  public to: string;
  public amount: number;
  public category: string;

  constructor(to: string, amount: number, category: string) {
    this.to = to;
    this.amount = amount;
    this.category = category;
  }
}