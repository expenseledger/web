import axios from 'axios';
import Wallet from './Model/Wallet';
import Response from './Model/Response';
import * as Constants from './Constants';
import * as Utils from './Utils';
import * as config from './serviceConfig.json';

const walletUrl = config.serverUrl + '/wallet';

export async function getAllWallet(): Promise<Wallet[]> {
  let toReturn: Wallet[] = new Array(0);
  const response: Response = await Utils.callAxios(axios.post, walletUrl + '/list');

  if(response.status !== Constants.httpStatus.ok || !response.success) {
    console.log(`getAllWallet failed, status: ${ response.status }, ${ response.error ? response.error.message : '' }`);
    return toReturn;
  }

  const items: any[] = response.data.items; 

  toReturn = items.map(item => new Wallet(item.name, item.type, item.balance));

  return toReturn;
}

export async function getWallet(name: String): Promise<Wallet | undefined> {
  const response: Response = await Utils.callAxios(axios.post, walletUrl + '/list', { name: name });

  if(response.status !== Constants.httpStatus.ok || !response.success) {
    console.log(`getWallet failed, status: ${ response.status }, ${ response.error ? response.error.message : '' }`);
    return undefined;
  }

  return new Wallet(response.data.name, response.data.type, response.data.balance);
}


