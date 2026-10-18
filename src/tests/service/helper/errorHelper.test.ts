import { CombinedGraphQLErrors } from "@apollo/client";
import { getErrorCode } from "../../../service/helper/errorHelper";

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
});
