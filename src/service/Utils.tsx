import Response from './Model/Response';
import * as Constants from './Constants';

/**
 * @param {any} axiosMethod pass axios method eg. axios.post.
 * @param {string} url url
 */
export async function callAxios(axiosMethod: any, url: String, content?: Object): Promise<Response> {
  try {
    let response: any = content ? await axiosMethod(url, content) :  await axiosMethod(url);
    return {
      status: Number.parseInt(response.status),
      data: response.data,
      success: response.success,
      error: undefined
    }
  }
  catch(err) {
    console.log(err);
    return {
      status: Constants.httpStatus.internalServerError,
      data: null,
      success: false,
      error: err
    }
  }
}