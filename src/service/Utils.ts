import Response from './Model/Response';
import * as Constants from './Constants';

/**
 * @param {any} axiosMethod pass axios method eg. axios.post.
 * @param {string} url url
 * @deprecated will obsolete soon
 */
export async function callAxiosOld<TResponse>(axiosMethod: any, url: string, content?: object): Promise<Response<TResponse>> {
  try {
    const response: any = content ? await axiosMethod(url, content) :  await axiosMethod(url);
    return {
      data: response.data.data,
      error: null,
      status: Number.parseInt(response.status, 10),
      success: response.data.success
    }
  }
  catch(err) {
    console.log(err);
    return {
      data: null,
      error: err,
      status: Constants.httpStatus.internalServerError,
      success: false
    }
  }
}

/**
 * @param {any} axiosMethod pass axios method eg. axios.post.
 * @param {string} url url
 */
export async function callAxios<TRequest, TResponse>(axiosMethod: any, url: string, content?: TRequest): Promise<Response<TResponse>> {
  try {
    const response: any = content ? await axiosMethod(url, content) :  await axiosMethod(url);
    return {
      data: response.data.data,
      error: null,
      status: Number.parseInt(response.status, 10),
      success: response.data.success
    }
  }
  catch(err) {
    console.log(err);
    return {
      data: null,
      error: err,
      status: Constants.httpStatus.internalServerError,
      success: false
    }
  }
}