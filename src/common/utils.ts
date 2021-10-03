import "firebase/auth";
import { GraphQLError } from "graphql";
import { useState } from "react";

export function combineClassName(...classNames: string[]): string {
    return classNames
        .reduce((toReturn, className) => (className ? toReturn + " " + className : toReturn), "")
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
        reset: () => setValue(initialValue),
        bind: {
            value,
            onChange: (e: React.ChangeEvent<any>) => {
                setValue(e.target.value);
                updateValue && updateValue(e.target.value);
            },
        },
    };
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
