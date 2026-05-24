import { screen } from "@testing-library/react";
import AmountTxt from "../../components/bases/AmountTxt";
import { renderWithProviders } from "./testUtils";

describe("AmountTxt", () => {
    it("renders formatted amount with currency", () => {
        renderWithProviders(<AmountTxt amount={500} />);

        expect(screen.getByText("฿")).toBeInTheDocument();
        expect(screen.getByText("500.00")).toBeInTheDocument();
    });
});
