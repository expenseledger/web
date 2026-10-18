import { CombinedGraphQLErrors } from "@apollo/client";

/** The API v3 `extensions.code` of a GraphQL error, e.g. `NAME_TAKEN`. */
export function getErrorCode(error: unknown): string | undefined {
    if (!CombinedGraphQLErrors.is(error)) {
        return undefined;
    }

    const code = error.errors[0]?.extensions?.code;

    return typeof code === "string" ? code : undefined;
}

const errorDescriptions: Record<string, string> = {
    NAME_TAKEN: "the name is already taken",
    CATEGORY_PROTECTED: "the None category can't be changed",
    CURRENCY_MISMATCH: "the currency doesn't match the account",
    NON_POSITIVE_AMOUNT: "amounts must be more than 0",
    INVALID_TRANSACTION: "check the accounts and the converted amount",
    INVALID_DATE_TIME: "the date isn't valid",
    RESOURCE_NOT_FOUND: "it no longer exists, please reload",
};

/** A toast message for a failed request, e.g. "Create account failed: the name is already taken". */
export function describeError(errorCode: string | undefined, fallback: string): string {
    const description = errorDescriptions[errorCode];

    return description ? `${fallback}: ${description}` : fallback;
}
