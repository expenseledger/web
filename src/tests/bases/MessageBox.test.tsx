import { screen } from "@testing-library/react";
import MessageBox from "../../components/bases/MessageBox";
import { renderWithProviders } from "./testUtils";

describe("MessageBox", () => {
    it("renders children", () => {
        renderWithProviders(<MessageBox type="info">Info message</MessageBox>);

        expect(screen.getByText("Info message")).toBeInTheDocument();
    });
});
