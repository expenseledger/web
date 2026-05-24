import { screen } from "@testing-library/react";
import Dropdown from "../../components/bases/Dropdown";
import { renderWithProviders } from "./testUtils";

describe("Dropdown", () => {
    it("renders with default selected option", () => {
        renderWithProviders(
            <Dropdown options={["Cash", "Bank"]} updateSelectedValue={jest.fn()} />
        );

        expect(screen.getByRole("combobox")).toBeInTheDocument();
        expect(screen.getByText("Cash")).toBeInTheDocument();
    });

    it("uses provided default value", () => {
        renderWithProviders(
            <Dropdown
                options={["Cash", "Bank"]}
                defaultValue="Bank"
                updateSelectedValue={jest.fn()}
            />
        );

        expect(screen.getByText("Bank")).toBeInTheDocument();
    });
});
