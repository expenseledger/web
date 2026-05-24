import { fireEvent, screen } from "@testing-library/react";
import TextField from "../../components/bases/TextField";
import { renderWithProviders } from "./testUtils";

describe("TextField", () => {
    it("renders textarea with placeholder", () => {
        renderWithProviders(
            <TextField name="note" placeholder="Enter note" updateValue={jest.fn()} />
        );

        expect(screen.getByPlaceholderText("Enter note")).toBeInTheDocument();
    });

    it("calls updateValue when textarea changes", () => {
        const updateValue = jest.fn();
        renderWithProviders(<TextField name="note" updateValue={updateValue} />);

        fireEvent.change(screen.getByRole("textbox"), { target: { value: "hello" } });

        expect(updateValue).toHaveBeenCalledWith("hello");
    });
});
