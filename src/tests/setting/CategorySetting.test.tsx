import { screen } from "@testing-library/react";
import { createStore } from "jotai";
import CategorySetting from "../../components/setting/CategorySetting";
import { categoriesState } from "../../common/shareState";
import { renderWithProviders } from "../bases/testUtils";

jest.mock("../../lib/apollo", () => ({
    __esModule: true,
    default: {
        query: jest.fn(),
        mutate: jest.fn(),
    },
}));

jest.mock("../../common/utils", () => ({
    ...jest.requireActual("../../common/utils"),
    log: jest.fn(),
}));

jest.mock("uuid", () => ({
    v4: jest.fn(() => "generated-uuid"),
}));

describe("CategorySetting", () => {
    it("hides the delete button of the None category", () => {
        const store = createStore();
        store.set(categoriesState, [
            { id: "1", name: "Food" },
            { id: "2", name: "None" },
        ]);

        renderWithProviders(<CategorySetting />, { store });

        expect(screen.getByLabelText("Delete Food")).toBeInTheDocument();
        expect(screen.getByText("None")).toBeInTheDocument();
        expect(screen.queryByLabelText("Delete None")).not.toBeInTheDocument();
    });
});
