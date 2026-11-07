import { CombinedGraphQLErrors } from "@apollo/client";
import { describeError, getErrorCode } from "../../../service/helper/errorHelper";

describe("errorHelper", () => {
    describe("getErrorCode", () => {
        it("returns the code of the first GraphQL error", () => {
            const error = new CombinedGraphQLErrors({
                errors: [{ message: "taken", extensions: { code: "NAME_TAKEN" } }],
            });

            expect(getErrorCode(error)).toBe("NAME_TAKEN");
        });

        it("returns undefined for other errors", () => {
            expect(getErrorCode(new Error("network"))).toBeUndefined();
            expect(getErrorCode(undefined)).toBeUndefined();
        });
    });

    describe("describeError", () => {
        it("describes a known code", () => {
            expect(describeError("NAME_TAKEN", "Create account failed")).toBe(
                "Create account failed: the name is already taken"
            );
        });

        it("falls back for an unknown or missing code", () => {
            expect(describeError("SOMETHING_ELSE", "Create account failed")).toBe(
                "Create account failed"
            );
            expect(describeError(undefined, "Create account failed")).toBe("Create account failed");
        });
    });
});
