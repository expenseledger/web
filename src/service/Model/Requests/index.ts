interface IAddTransactionRequest {
  amount: number;
  category: string;
  description?: string;
  date?: Date;
}
export interface IAddExpenseRequest extends IAddTransactionRequest {
  from: string;
}

export interface IAddIncomeRequest extends IAddTransactionRequest {
  to: string;
}

export interface IAddTransferRequest extends IAddTransactionRequest {
  from: string;
  to: string;
}

export interface IListTransactionsRequest {
  wallet: string;
}
