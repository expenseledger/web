import Response from "./Model/Response";

/**
 * @param {any} axiosMethod pass axios method eg. axios.post.
 * @param {string} url url
 */
export async function callAxios(
  axiosMethod: any,
  url: string,
  content?: object
): Promise<Response> {
  try {
    const { data, status } = content
      ? await axiosMethod(url, content)
      : await axiosMethod(url);

    return {
      data: data.data,
      error: null,
      status: Number.parseInt(status, 10),
      success: data.success
    };
  } catch (err) {
    return {
      data: null,
      error: err,
      status: err.response.status || 0,
      success: false
    };
  }
}
