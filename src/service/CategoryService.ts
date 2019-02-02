import axios from 'axios';
import Category from './Model/Category';
import * as Constants from './Constants';
import * as Utils from './Utils';
import * as _ from 'lodash';

const categoryUrl = process.env.REACT_APP_SERVER_URL + '/category';

export async function getAllCategories(): Promise<Category[]> {
  let toReturn: Category[] = new Array(0);
  const response = await Utils.callAxios(axios.post, categoryUrl + '/list');

  if(response.status !== Constants.httpStatus.ok || !response.success) {
    console.log(`getAllCategories failed, status: ${ response.status }, ${ response.error ? response.error.message : '' }`);
    return toReturn;
  }

  if(response.data) {
    toReturn = response.data.items
  }

  return toReturn;
}


