import Response from './Model/Response';
import * as Constants from './Constants';

/**
 * @param {any} axiosMethod pass axios method eg. axios.post.
 * @param {string} url url
 */
export async function callAxios(axiosMethod: any, url: string, content?: object): Promise<Response> {
  try {
    const response: any = content ? await axiosMethod(url, content) :  await axiosMethod(url);
    return {
      data: response.data.data,
      error: undefined,
      status: Number.parseInt(response.status, 10),
      success: response.data.success
    }
  }
  catch(err) {
    console.log(err);
    return {
      data: undefined,
      error: err,
      status: Constants.httpStatus.internalServerError,
      success: false
    }
  }
}