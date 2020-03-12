import firebase from "firebase/app";
import "firebase/auth";
import { useState } from "react";
import { httpStatus } from "./Constants";
import Response from "./model/Response";

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
        const user = firebase.auth().currentUser;
        const token = user ? await user.getIdToken() : "";
        const header = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        const { data, status } = await axiosMethod(url, content, header);

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
            status: (err.response && err.response.status) || 0,
            success: false
        };
    }
}

export function combineClassName(classNames: object) {
    return Object.values(classNames)
        .reduce(
            (toReturn, className) =>
                className ? toReturn + " " + className : toReturn,
            ""
        )
        .trim();
}

export function useInput(
    initialValue: string,
    updateValue?: (v: string) => void
) {
    const [value, setValue] = useState(initialValue);

    return {
        value,
        setValue,
        reset: () => setValue(""),
        bind: {
            value,
            onChange: (e: React.ChangeEvent<any>) => {
                setValue(e.target.value);
                updateValue && updateValue(e.target.value);
            }
        }
    };
}

export function isReturnSuccessStatus(response: Response): boolean {
    if (
        response.status === httpStatus.ok &&
        response.success &&
        !response.error
    ) {
        return true;
    }

    return false;
}

export function log(...message: string[]) {
    console.log(message);
}
