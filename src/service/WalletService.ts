import axios from 'axios';
import Wallet from './Model/Wallet';
import * as Constants from './Constants';
import * as Utils from './Utils';

const walletUrl = process.env.REACT_APP_SERVER_URL + '/wallet';

export async function getAllWallet(): Promise<Wallet[]> {
  let toReturn: Wallet[] = new Array(0);
  const response = await Utils.callAxios(axios.post, walletUrl + '/list');

  if(response.status !== Constants.httpStatus.ok || !response.success) {
    console.log(`getAllWallet failed, status: ${ response.status }, ${ response.error ? response.error.message : '' }`);
    return toReturn;
  }

  if(response.data) {
    toReturn = response.data.items;
  }

  return toReturn;
}

export async function getWallet(walletName: string): Promise<Wallet | null> {
  const response = await Utils.callAxios(axios.post, walletUrl + '/list', { walletName });

  if(response.status !== Constants.httpStatus.ok || !response.success) {
    console.log(`getWallet failed, status: ${ response.status }, ${ response.error ? response.error.message : '' }`);
    return null;
  }

  return response.data;
}


