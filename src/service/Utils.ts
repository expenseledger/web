import { useState } from "react";
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

export function combineClassName(classNames: object) {
  return Object.values(classNames).reduce((toReturn, className) => toReturn + " " + className, "").trim();
}

export function useInput(initialValue: string, updateValue: (v: string) => void) {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    setValue,
    reset: () => setValue(""),
    bind: {
      value,
      onChange: (e: React.ChangeEvent<any>) => {
        setValue(e.target.value);
        updateValue(e.target.value);
      }
    }
  };
}
