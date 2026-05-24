import { fireEvent, screen, waitFor } from "@testing-library/react";
import TextBoxWithButton from "../../components/bases/TextBoxWithButton";
import { renderWithProviders } from "./testUtils";

describe("TextBoxWithButton", () => {
    it("renders input and button", () => {
        renderWithProviders(
            <TextBoxWithButton
                name="search"
                buttonText="Go"
                buttonType="primary"
                onClick={jest.fn()}
            />
        );

        expect(screen.getByRole("textbox")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Go" })).toBeInTheDocument();
    });

    it("calls onClick with value when button is clicked", async () => {
        const onClick = jest.fn().mockResolvedValue(undefined);

        renderWithProviders(
            <TextBoxWithButton
                name="search"
                buttonText="Go"
                buttonType="primary"
                defaultValue="test"
                onClick={onClick}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "Go" }));

        await waitFor(() => {
            expect(onClick).toHaveBeenCalledWith("test", "");
        });
    });

    it("renders combobox when dropdown options are provided", () => {
        renderWithProviders(
            <TextBoxWithButton
                name="search"
                buttonText="Go"
                buttonType="primary"
                dropdown={["Cash", "Bank"]}
                onClick={jest.fn()}
            />
        );

        expect(screen.getByRole("combobox")).toBeInTheDocument();
    });
});
