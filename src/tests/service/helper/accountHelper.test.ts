import {
    allAccountTypesString,
    allCurrencies,
    mapAccountFromServer,
    mapAccountTypeToString,
    mapStringToAccountType,
} from "../../../service/helper/accountHelper";

describe("accountHelper", () => {
    describe("mapAccountTypeToString", () => {
        it.each([
            ["BANK", "Bank Account"],
            ["CASH", "Cash"],
            ["CREDIT", "Credit"],
        ] as const)("maps %s to %s", (type, label) => {
            expect(mapAccountTypeToString(type)).toBe(label);
        });
    });

    describe("mapStringToAccountType", () => {
        it.each([
            ["Bank Account", "BANK"],
            ["Cash", "CASH"],
            ["Credit", "CREDIT"],
        ] as const)("maps %s to %s", (label, type) => {
            expect(mapStringToAccountType(label)).toBe(type);
        });

        it("throws for unknown account type", () => {
            expect(() => mapStringToAccountType("Unknown")).toThrow("Unknown is not defined");
        });
    });

    describe("mapAccountFromServer", () => {
        it("maps server account to Account", () => {
            const serverAccount = {
                id: 1,
                name: "Savings",
                balance: 500,
                type: "BANK",
            };

            expect(mapAccountFromServer(serverAccount)).toEqual(serverAccount);
        });
    });

    it("exports all account type strings", () => {
        expect(allAccountTypesString).toEqual(["Cash", "Bank Account", "Credit"]);
    });

    it("exports supported currencies", () => {
        expect(allCurrencies).toEqual(["฿", "€"]);
    });
});
