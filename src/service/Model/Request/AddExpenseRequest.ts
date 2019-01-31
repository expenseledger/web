export default interface IAddExpenseRequest {
  /**
   * wallet's name
   */
  from: string;
  /**
   * amount you expense
   */
  amount: number;
  /**
   * category name
   */
  category: string;
}