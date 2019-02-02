export default interface IAddIncomeRequest {
  /**
   * name of wallet
   */
  to: string;
  amount: number;
  category: string;
}
