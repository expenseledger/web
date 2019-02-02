import axios from "axios";
import * as Utils from "./Utils";
import AddExpenseRequest from "./Model/Request/AddExpenseRequest";
import AddExpenseResponse from "./Model/Response/AddExpenseResponse";
import * as config from "./serviceConfig.json";
import * as Constants from "./Constants"; 
import AddIncomeRequest from './Model/Request/AddIncomeRequest';
import AddIncomeResponse from './Model/Response/AddIncomeResponse';
import AddTransferRequest from './Model/Request/AddTransferRequest';
import AddTransferResponse from './Model/Response/AddTransferResponse';

const transactionUrl = config.serverUrl + "/transaction";

export async function addExpense(request: AddExpenseRequest): Promise<AddExpenseResponse | null> {
  const response = await Utils.callAxios(axios.post, transactionUrl + "/createExpense", request);

  if(response.status !== Constants.httpStatus.ok || !response.success) {
    console.log(`AddExpense failed, status: ${ response.status }, ${ response.error ? response.error.message : "" }`);
    return null;
  }

  return {
    srcWallet: response.data.src_wallet,
    transaction: response.data.transaction
  };
}

export async function addIncome(request: AddIncomeRequest): Promise<AddIncomeResponse | null> {
  const response = await Utils.callAxios(axios.post, transactionUrl + "/createIncome", request);

  if(response.status !== Constants.httpStatus.ok || !response.success) {
    console.log(`AddIncome failed, status: ${ response.status }, ${ response.error ? response.error.message : "" }`);
    return null;
  }
  
  return {
    dstWallet: response.data.dst_wallet,
    transaction: response.data.transaction
  };
}

export async function addTransfer(request: AddTransferRequest): Promise<AddTransferResponse | null> {
  const response = await Utils.callAxios(axios.post, transactionUrl + "/createIncome", request);

  if(response.status !== Constants.httpStatus.ok || !response.success) {
    console.log(`AddTransfer failed, status: ${ response.status }, ${ response.error ? response.error.message : "" }`);
    return null;
  }
  
  return {
    dstWallet: response.data.dst_wallet,
    srcWallet: response.data.src_wallet,
    transaction: response.data.transaction
  };
}
