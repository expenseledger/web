import axios from "axios";
import * as Constants from "./Constants";
import {
  IAddExpenseRequest,
  IAddIncomeRequest,
  IAddTransferRequest
} from "./Model/Requests";
import {
  IAddExpenseResponse,
  IAddIncomeResponse,
  IAddTransferResponse
} from "./Model/Responses";
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
    transaction: response.data.transaction
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
    transaction: response.data.transaction
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
    transaction: response.data.transaction
  };
}
