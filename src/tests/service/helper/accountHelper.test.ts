import { allCurrencies, mapAccountFromServer } from "../../../service/helper/accountHelper";

describe("accountHelper", () => {
    describe("mapAccountFromServer", () => {
        it("maps server account to Account", () => {
            const serverAccount = {
                id: 1,
                name: "Savings",
                balance: 500,
            };

            expect(mapAccountFromServer(serverAccount)).toEqual(serverAccount);
        });
    });

    it("exports supported currencies", () => {
        expect(allCurrencies).toEqual(["฿", "€", "$", "¥", "₩"]);
    });
});
