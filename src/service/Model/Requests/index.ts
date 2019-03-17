export interface IAddExpenseRequest {
  from: string;
  amount: number;
  category: string;
}

export interface IAddIncomeRequest {
  to: string;
  amount: number;
  category: string;
}

export interface IAddTransferRequest {
  from: string;
  to: string;
  amount: number;
  category: string;
}
