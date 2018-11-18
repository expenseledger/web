const HttpStatus = {
  Ok: 200,
  BadRequest: 400,
  InternalServerError: 500
};

interface Response {
  status: Number;
  data: any;
  error?: Error;
}

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
      error: undefined
    }
  }
  catch(err) {
    console.log(err);
    return {
      status: HttpStatus.InternalServerError,
      data: null,
      error: err
    }
  }
}