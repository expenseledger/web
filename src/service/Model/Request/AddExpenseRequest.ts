export default class AddExpenseRequest {
  /**
   * wallet's name
   */
  public from: string;
  /**
   * amount you expense
   */
  public amount: number;
  /**
   * category name
   */
  public category: string;

  constructor(from: string, amount: number, category: string) {
    this.from = from;
    this.amount = amount;
    this.category = category;
  }
}