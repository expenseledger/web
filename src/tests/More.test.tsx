import { fireEvent, screen, waitFor } from "@testing-library/react";
import { createStore } from "jotai";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import More from "../components/More";
import { accountsState, categoriesState } from "../common/shareState";
import { createAccount, patchAccount } from "../service/accountService";
import { Currency } from "../service/constants";
import { getUserData } from "../service/userService";
import { renderWithProviders } from "./bases/testUtils";
import { resetMockV3 } from "./mock/mockClient";

jest.mock("../lib/apollo", () => ({
    __esModule: true,
    default: jest.requireActual("./mock/mockClient").mockClient,
}));

jest.mock("../common/utils", () => ({
    ...jest.requireActual("../common/utils"),
    log: jest.fn(),
}));

// More imports useBackToHome from Layout, which pulls in Firebase.
jest.mock("../lib/firebase", () => ({
    auth: {},
}));

jest.mock("../components/hoc/WithAuthProtection", () => ({
    useSignIn: jest.fn(),
}));

jest.mock("uuid", () => ({
    v4: jest.fn(() => "generated-uuid"),
}));

async function account(name: string, currency: Currency, balance: number) {
    const { account } = await createAccount({ name, currency });
    await patchAccount({ id: account.id, balance: { amount: balance, currency } });
}

async function renderMore() {
    const { accounts, categories } = await getUserData();
    const store = createStore();
    store.set(accountsState, accounts);
    store.set(categoriesState, categories);
    renderWithProviders(
        <MemoryRouter initialEntries={["/more"]}>
            <Routes>
                <Route element={<Outlet context={{ setBackToHomeParam: jest.fn() }} />}>
                    <Route path="/more" element={<More />} />
                </Route>
            </Routes>
        </MemoryRouter>,
        { store }
    );

    return store;
}

describe("More", () => {
    beforeEach(async () => {
        await resetMockV3();
    });

    it("adds a transaction for today when opened directly", async () => {
        await account("Cash", "THB", 100);
        const store = await renderMore();

        fireEvent.change(screen.getByLabelText("Amount"), { target: { value: "30" } });
        fireEvent.click(screen.getByRole("button", { name: "Add" }));

        await waitFor(() => expect(store.get(accountsState).map((a) => a.balance)).toEqual([70]));
    });
});
