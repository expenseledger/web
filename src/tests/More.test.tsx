import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { createStore } from "jotai";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import More from "../components/More";
import { accountsState, categoriesState } from "../common/shareState";
import { createAccount, patchAccount } from "../service/accountService";
import { Currency } from "../service/constants";
import { getUserData } from "../service/userService";
import { renderWithProviders } from "./bases/testUtils";
import { initializeUserWithoutAccounts, mockClient, resetMockV3 } from "./mock/mockClient";

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

async function renderMore(state?: { accountIdx: number; categoryId?: string }) {
    const { accounts, categories } = await getUserData();
    const store = createStore();
    store.set(accountsState, accounts);
    store.set(categoriesState, categories);
    renderWithProviders(
        <MemoryRouter initialEntries={[{ pathname: "/more", state }]}>
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
        jest.restoreAllMocks();
        await resetMockV3();
        await initializeUserWithoutAccounts();
    });

    it("clears the amount after adding and keeps it when adding fails", async () => {
        await account("Cash", "THB", 100);
        await renderMore();
        const amount = screen.getByLabelText("Amount") as HTMLInputElement;

        fireEvent.change(amount, { target: { value: "30" } });
        fireEvent.click(screen.getByRole("button", { name: "Add" }));
        await waitFor(() => expect(amount.value).toBe(""));

        const mutate = jest.spyOn(mockClient, "mutate").mockRejectedValueOnce(new Error("down"));
        fireEvent.change(amount, { target: { value: "40" } });
        fireEvent.click(screen.getByRole("button", { name: "Add" }));
        await waitFor(() => expect(mutate).toHaveBeenCalled());
        await act(() => Promise.resolve());

        expect(amount.value).toBe("40");
    });

    it("adds a transaction for today when opened directly", async () => {
        await account("Cash", "THB", 100);
        const store = await renderMore();

        fireEvent.change(screen.getByLabelText("Amount"), { target: { value: "30" } });
        fireEvent.click(screen.getByRole("button", { name: "Add" }));

        await waitFor(() => expect(store.get(accountsState).map((a) => a.balance)).toEqual([70]));
    });

    it("asks for the converted amount of a transfer between currencies", async () => {
        await account("Cash", "THB", 1000);
        await account("Euro", "EUR", 0);
        const store = await renderMore();

        fireEvent.click(screen.getByRole("tab", { name: /Transfer/ }));
        fireEvent.change(screen.getByLabelText("Amount"), { target: { value: "400" } });
        fireEvent.change(screen.getByLabelText("Converted amount"), {
            target: { value: "10" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Add" }));

        await waitFor(() =>
            expect(store.get(accountsState).map((a) => a.balance)).toEqual([600, 10])
        );
    });

    it("doesn't ask for a converted amount within one currency", async () => {
        await account("Bank", "THB", 0);
        await account("Cash", "THB", 0);
        await renderMore();

        fireEvent.click(screen.getByRole("tab", { name: /Transfer/ }));

        expect(screen.queryByLabelText("Converted amount")).not.toBeInTheDocument();
    });

    it("defaults To to the account after From, wrapping after the last", async () => {
        for (const name of ["A", "B", "C"]) {
            await account(name, "THB", 0);
        }
        await renderMore({ accountIdx: 2 });

        fireEvent.click(screen.getByRole("tab", { name: /Transfer/ }));
        const [from, to] = screen.getAllByRole("combobox");

        expect(from).toHaveTextContent("C");
        expect(to).toHaveTextContent("A");
    });

    it("lists only the categories that fit the transaction type", async () => {
        await account("Cash", "THB", 100);
        await renderMore();
        const category = () => screen.getAllByRole("combobox")[1];

        expect(category()).toHaveTextContent("Bills");

        fireEvent.click(screen.getByRole("tab", { name: /Income/ }));
        await waitFor(() => expect(category()).toHaveTextContent("Other"));
        fireEvent.click(category());

        expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual([
            "Other",
            "Salary",
        ]);
    });

    it("adds the transaction with the category shown", async () => {
        await account("Cash", "THB", 100);
        const store = await renderMore();
        const other = store.get(categoriesState).find((c) => c.name === "Other");
        const mutate = jest.spyOn(mockClient, "mutate");

        fireEvent.click(screen.getByRole("tab", { name: /Income/ }));
        fireEvent.change(screen.getByLabelText("Amount"), { target: { value: "30" } });
        fireEvent.click(screen.getByRole("button", { name: "Add" }));

        await waitFor(() => expect(mutate).toHaveBeenCalled());
        expect(mutate.mock.calls[0][0].variables.categoryId).toBe(other.id);
    });

    it("starts with the category picked on Home", async () => {
        await account("Cash", "THB", 100);
        const { categories } = await getUserData();
        const food = categories.find((c) => c.name === "Food");
        await renderMore({ accountIdx: 0, categoryId: food.id });

        expect(screen.getAllByRole("combobox")[1]).toHaveTextContent("Food");
    });

    it("refuses a transfer with a single account", async () => {
        await account("Cash", "THB", 100);
        await renderMore();
        const mutate = jest.spyOn(mockClient, "mutate");

        fireEvent.click(screen.getByRole("tab", { name: /Transfer/ }));
        fireEvent.change(screen.getByLabelText("Amount"), { target: { value: "30" } });
        fireEvent.click(screen.getByRole("button", { name: "Add" }));
        await act(() => Promise.resolve());

        expect(screen.getByText("From")).toBeInTheDocument();
        expect(mutate).not.toHaveBeenCalled();
    });
});
