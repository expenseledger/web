import firebase from "firebase/app";
import "firebase/auth";
import { GraphQLError } from "graphql";
import { useState } from "react";
import { httpStatus } from "./constants";
import Response from "./model/Response";

/**
 * @param {any} axiosMethod pass axios method eg. axios.post.
 * @param {string} url url
 */
export async function callAxios<T>(
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    axiosMethod: any,
    url: string,
    content?: T
): Promise<Response> {
    try {
        const user = firebase.auth().currentUser;
        const token = user ? await user.getIdToken() : "";
        const header = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const { data, status } = await axiosMethod(url, content, header);

        return {
            data: data.data,
            error: null,
            status: Number.parseInt(status, 10),
            success: data.success,
        };
    } catch (err) {
        return {
            data: null,
            error: err,
            status: (err.response && err.response.status) || 0,
            success: false,
        };
    }
}

export function combineClassName(...classNames: string[]): string {
    return classNames
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
): {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    reset: () => void;
    bind: {
        value: string;
        onChange: (e: React.ChangeEvent<any>) => void;
    };
} {
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
            },
        },
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

export function log(message: string, errors?: readonly GraphQLError[]): void {
    console.log(message, extractGraphQLErrors(errors));
}

export function formatNumber(value: number): string {
    return new Intl.NumberFormat("th-TH", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
    }).format(value);
}

export function extractGraphQLErrors(errors?: readonly GraphQLError[]): string {
    return errors?.map((x) => x.message).join("\n") ?? "";
}
