import {
    allCategoryTypesString,
    mapCategoryTypeToString,
    mapStringToCategoryType,
} from "../../../service/helper/categoryHelper";

describe("categoryHelper", () => {
    describe("mapCategoryTypeToString", () => {
        it.each([
            ["ANY", "Any"],
            ["EXPENSE", "Expense"],
            ["INCOME", "Income"],
            ["TRANSFER", "Transfer"],
        ] as const)("maps %s to %s", (type, label) => {
            expect(mapCategoryTypeToString(type)).toBe(label);
        });
    });

    describe("mapStringToCategoryType", () => {
        it.each([
            ["Any", "ANY"],
            ["Expense", "EXPENSE"],
            ["Income", "INCOME"],
            ["Transfer", "TRANSFER"],
        ] as const)("maps %s to %s", (label, type) => {
            expect(mapStringToCategoryType(label)).toBe(type);
        });

        it("throws for unknown category type", () => {
            expect(() => mapStringToCategoryType("Unknown")).toThrow("Unknown is not defined");
        });
    });

    it("exports all category type strings", () => {
        expect(allCategoryTypesString).toEqual(["Any", "Income", "Expense", "Transfer"]);
    });
});
