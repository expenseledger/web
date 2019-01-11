import axios from 'axios';
import AddTransactionRequest from './Model/Request/AddTransactionRequest';
import * as Utils from './Utils';

/**
 * @param {AddTransactionRequest} request add transaction request
 */
export async function addTransaction(request: AddTransactionRequest): Promise<boolean> {
  const response = await Utils.callAxios(axios.post, "", request);

  if(response.success) {
    return true;
  }
  else {
    console.log(`addTransaction failed, ${ response.error ? response.error : "" }`);
    return false;
  }
}