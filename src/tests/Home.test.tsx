import { fireEvent, screen, waitFor } from "@testing-library/react";
import { createStore } from "jotai";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import { accountsState, categoriesState } from "../common/shareState";
import { createAccount } from "../service/accountService";
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

// Home imports useBackToHome from Layout, which pulls in Firebase.
jest.mock("../lib/firebase", () => ({
    auth: {},
}));

jest.mock("../components/hoc/WithAuthProtection", () => ({
    useSignIn: jest.fn(),
}));

jest.mock("uuid", () => ({
    v4: jest.fn(() => "generated-uuid"),
}));

// Swiper ships ESM only; a plain list is enough here.
jest.mock("swiper/react", () => ({
    Swiper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SwiperSlide: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("swiper/modules", () => ({}));

async function renderHome() {
    await createAccount({ name: "Cash", currency: "THB" });
    const { accounts, categories } = await getUserData();
    const store = createStore();
    store.set(accountsState, accounts);
    store.set(categoriesState, categories);
    renderWithProviders(
        <MemoryRouter initialEntries={["/"]}>
            <Routes>
                <Route element={<Outlet context={{ setBackToHomeParam: jest.fn() }} />}>
                    <Route path="/" element={<Home />} />
                </Route>
            </Routes>
        </MemoryRouter>,
        { store }
    );

    return store;
}

describe("Home", () => {
    beforeEach(async () => {
        jest.restoreAllMocks();
        await resetMockV3();
        await initializeUserWithoutAccounts();
    });

    it("lists only the categories that fit an expense", async () => {
        await renderHome();

        fireEvent.click(screen.getByRole("combobox"));

        expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual([
            "Bills",
            "Entertainment",
            "Food",
            "Groceries",
            "Other",
            "Transport",
        ]);
    });

    it("adds the expense with the category shown", async () => {
        const store = await renderHome();
        const bills = store.get(categoriesState).find((c) => c.name === "Bills");
        const mutate = jest.spyOn(mockClient, "mutate");

        fireEvent.change(screen.getByLabelText("Amount"), { target: { value: "30" } });
        fireEvent.click(screen.getByRole("button", { name: "Add" }));

        await waitFor(() => expect(mutate).toHaveBeenCalled());
        expect(mutate.mock.calls[0][0].variables.categoryId).toBe(bills.id);
    });
});
