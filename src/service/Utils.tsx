import Response from './Model/Response';
import * as Constants from './Constants';

/**
 * @param {any} axiosMethod pass axios method eg. axios.post.
 * @param {string} url url
 */
export async function callAxios(axiosMethod: any, url: string): Promise<Response> {
  try {
    let response: any = await axiosMethod(url);
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
      status: Constants.httpStatus.InternalServerError,
      data: null,
      success: false,
      error: err
    }
  }
}