import axios from 'axios';
import Category from './Model/Category';
import Response from './Model/Response';
import * as Constants from './Constants';
import * as Utils from './Utils';
import * as appConfig from '../../appConfig.json';

const categoryUrl = appConfig.serverUrl + '/category';

export async function getAllCategories(): Promise<Category[]> {
  let toReturn: Category[] = new Array(0);
  const response: Response = await Utils.callAxios(axios.post, categoryUrl + '/list');

  if(response.status !== Constants.httpStatus.Ok || !response.success) {
    console.log(`getAllCategories failed, status: ${ response.status }, ${ response.error ? response.error.message : '' }`);
    return toReturn;
  }

  const items: any[] = response.data.items; 

  toReturn = items.map(item => new Category(item.name));

  return toReturn;
}

export async function getCategory() {
 
}

