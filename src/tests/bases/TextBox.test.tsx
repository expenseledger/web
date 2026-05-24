import { fireEvent, screen } from "@testing-library/react";
import TextBox from "../../components/bases/TextBox";
import { renderWithProviders } from "./testUtils";

describe("TextBox", () => {
    it("renders input with placeholder", () => {
        renderWithProviders(
            <TextBox name="amount" placeholder="Enter amount" updateValue={jest.fn()} />
        );

        expect(screen.getByPlaceholderText("Enter amount")).toBeInTheDocument();
    });

    it("calls updateValue when input changes", () => {
        const updateValue = jest.fn();
        renderWithProviders(<TextBox name="amount" updateValue={updateValue} />);

        fireEvent.change(screen.getByRole("textbox"), { target: { value: "100" } });

        expect(updateValue).toHaveBeenCalledWith("100");
    });

    it("renders front addon when configured", () => {
        renderWithProviders(
            <TextBox
                name="amount"
                updateValue={jest.fn()}
                addOn={{ text: "฿", position: "front" }}
            />
        );

        expect(screen.getByText("฿")).toBeInTheDocument();
    });
});
