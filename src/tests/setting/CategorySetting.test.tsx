import { fireEvent, screen, waitFor } from "@testing-library/react";
import { createStore } from "jotai";
import CategorySetting from "../../components/setting/CategorySetting";
import { categoriesState } from "../../common/shareState";
import { getUserData } from "../../service/userService";
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

async function renderCategories() {
    const store = createStore();
    store.set(categoriesState, (await getUserData()).categories);
    renderWithProviders(<CategorySetting />, { store });

    return store;
}

describe("CategorySetting", () => {
    beforeEach(async () => {
        await resetMockV3();
    });

    it("hides the edit and delete buttons of the None category", async () => {
        await renderCategories();

        expect(screen.getByLabelText("Delete Food")).toBeInTheDocument();
        expect(screen.getByLabelText("Edit Food")).toBeInTheDocument();
        expect(screen.getByText("None")).toBeInTheDocument();
        expect(screen.queryByLabelText("Delete None")).not.toBeInTheDocument();
        expect(screen.queryByLabelText("Edit None")).not.toBeInTheDocument();
    });

    it("renames a category", async () => {
        const store = await renderCategories();

        fireEvent.click(screen.getByLabelText("Edit Food"));
        fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Meals" } });
        fireEvent.click(screen.getByRole("button", { name: "Save" }));

        await waitFor(() => expect(screen.getByText("Meals")).toBeInTheDocument());
        expect(store.get(categoriesState).map((c) => c.name)).toContain("Meals");
        expect(store.get(categoriesState).map((c) => c.name)).not.toContain("Food");
    });
});
