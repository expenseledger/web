import { fireEvent, screen, waitFor } from "@testing-library/react";
import { createStore } from "jotai";
import AccountSetting from "../../components/setting/AccountSetting";
import Toast from "../../components/bases/Toast";
import { accountsState } from "../../common/shareState";
import { createAccount, getAllAccount } from "../../service/accountService";
import { renderWithProviders } from "../bases/testUtils";
import { resetMockV3 } from "../mock/mockClient";

jest.mock("../../lib/apollo", () => ({
    __esModule: true,
    default: jest.requireActual("../mock/mockClient").mockClient,
}));

jest.mock("../../common/utils", () => ({
    ...jest.requireActual("../../common/utils"),
    log: jest.fn(),
}));

jest.mock("uuid", () => ({
    v4: jest.fn(() => "generated-uuid"),
}));

async function renderWithAccounts(...names: string[]) {
    for (const name of names) {
        await createAccount({ name, currency: "THB" });
    }
    const store = createStore();
    store.set(accountsState, (await getAllAccount()).accounts);
    renderWithProviders(
        <>
            <AccountSetting />
            <Toast position="top-right" />
        </>,
        { store }
    );

    return store;
}

describe("AccountSetting", () => {
    beforeEach(async () => {
        await resetMockV3();
    });

    it("renames an account and sets its balance", async () => {
        const store = await renderWithAccounts("Cash");

        fireEvent.click(screen.getByLabelText("Edit Cash"));
        fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Wallet" } });
        fireEvent.change(screen.getByLabelText("Balance"), { target: { value: "12.5" } });
        fireEvent.click(screen.getByRole("button", { name: "Save" }));

        await waitFor(() => expect(screen.getByText("Wallet")).toBeInTheDocument());
        expect(store.get(accountsState)).toEqual([
            { id: expect.any(String), name: "Wallet", balance: 12.5, currency: "THB" },
        ]);
    });

    it("keeps the account when the new name is taken", async () => {
        const store = await renderWithAccounts("Bank", "Cash");

        fireEvent.click(screen.getByLabelText("Edit Cash"));
        fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Bank" } });
        fireEvent.click(screen.getByRole("button", { name: "Save" }));

        await waitFor(() => expect(screen.getByText("Edit account failed")).toBeInTheDocument());
        expect(store.get(accountsState).map((a) => a.name)).toEqual(["Bank", "Cash"]);
    });
});
