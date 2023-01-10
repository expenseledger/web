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

export function log(message: string, error?: unknown): void {
    if (error && Array.isArray(error) && error.every((e) => e instanceof GraphQLError)) {
        console.log(message, extractGraphQLErrors(error as unknown as GraphQLError[]));
    } else {
        console.log(message, error);
    }
}

export function formatNumber(value: number, decimalScale = 2): string {
    return new Intl.NumberFormat("th-TH", {
        maximumFractionDigits: decimalScale,
        minimumFractionDigits: decimalScale,
    }).format(value);
}

export function toNumber(value: string): number {
    return Number.parseFloat(value.replace(",", ""));
}

export function extractGraphQLErrors(errors?: readonly GraphQLError[]): string {
    return errors?.map((x) => x.message).join("\n") ?? "";
}
