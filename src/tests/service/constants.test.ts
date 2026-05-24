import {
    allAccountTypes,
    allCategoryTypes,
    allTransactionType,
    httpStatus,
} from "../../service/constants";

describe("constants", () => {
    it("exports http status codes", () => {
        expect(httpStatus).toEqual({
            badRequest: 400,
            internalServerError: 500,
            ok: 200,
        });
    });

    it("exports account types", () => {
        expect(allAccountTypes).toEqual(["CASH", "BANK", "CREDIT"]);
    });

    it("exports category types", () => {
        expect(allCategoryTypes).toEqual(["ANY", "INCOME", "EXPENSE", "TRANSFER"]);
    });

    it("exports transaction types", () => {
        expect(allTransactionType).toEqual(["EXPENSE", "INCOME", "TRANSFER"]);
    });
});
