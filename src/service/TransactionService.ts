import axios from "axios";
import * as Constants from "./Constants";
import {
  IAddExpenseRequest,
  IAddIncomeRequest,
  IAddTransferRequest,
  IListTransactionsRequest
} from "./Model/Requests";
import {
  IAddExpenseResponse,
  IAddIncomeResponse,
  IAddTransferResponse,
  IListTransactionsResponse
} from "./Model/Responses";
import Transaction from "./Model/Transaction";
import * as Utils from "./Utils";

const transactionUrl = process.env.REACT_APP_SERVER_URL + "/transaction";

export async function addExpense(
  request: IAddExpenseRequest
): Promise<IAddExpenseResponse | null> {
  console.log("request", request);

  const response = await Utils.callAxios(
    axios.post,
    transactionUrl + "/createExpense",
    request
  );

  if (response.status !== Constants.httpStatus.ok || !response.success) {
    console.log(
      `AddExpense failed, status: ${response.status}, ${
        response.error ? response.error.message : ""
      }`
    );
    return null;
  }

  return {
    srcWallet: response.data.src_wallet,
    transaction: mapJsonToTransaction(response.data.transaction)
  };
}

export async function addIncome(
  request: IAddIncomeRequest
): Promise<IAddIncomeResponse | null> {
  const response = await Utils.callAxios(
    axios.post,
    transactionUrl + "/createIncome",
    request
  );

  if (response.status !== Constants.httpStatus.ok || !response.success) {
    console.log(
      `AddIncome failed, status: ${response.status}, ${
        response.error ? response.error.message : ""
      }`
    );
    return null;
  }

  return {
    dstWallet: response.data.dst_wallet,
    transaction: mapJsonToTransaction(response.data.transaction)
  };
}

export async function addTransfer(
  request: IAddTransferRequest
): Promise<IAddTransferResponse | null> {
  const response = await Utils.callAxios(
    axios.post,
    transactionUrl + "/createTransfer",
    request
  );

  if (response.status !== Constants.httpStatus.ok || !response.success) {
    console.log(
      `AddTransfer failed, status: ${response.status}, ${
        response.error ? response.error.message : ""
      }`
    );
    return null;
  }

  return {
    dstWallet: response.data.dst_wallet,
    srcWallet: response.data.src_wallet,
    transaction: mapJsonToTransaction(response.data.transaction)
  };
}

export async function listTransactions(
  request: IListTransactionsRequest
): Promise<IListTransactionsResponse | null> {
  const response = await Utils.callAxios(
    axios.post,
    transactionUrl + "/list",
    request
  );

  if (response.status !== Constants.httpStatus.ok || !response.success) {
    console.log(
      `ListTransactions failed, status: ${response.status}, ${
        response.error ? response.error.message : ""
      }`
    );
    return null;
  }

  return {
    length: response.data.length,
    items: response.data.items.map(mapJsonToTransaction)
  };
}

function mapJsonToTransaction(json: any): Transaction {
  return {
    id: json.id,
    srcWallet: json.src_wallet,
    dstWallet: json.dst_wallet,
    amount: json.amount,
    type: json.type,
    category: json.category,
    description: json.description,
    date: json.date
  };
}
