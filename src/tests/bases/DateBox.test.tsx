import { fireEvent, screen } from "@testing-library/react";
import DateBox from "../../components/bases/DateBox";
import { renderWithProviders } from "./testUtils";

describe("DateBox", () => {
    it("renders date input", () => {
        renderWithProviders(<DateBox name="date" updateValue={jest.fn()} />);

        expect(screen.getByDisplayValue(/\d{4}-\d{2}-\d{2}/)).toBeInTheDocument();
    });

    it("calls updateValue when date changes", () => {
        const updateValue = jest.fn();
        renderWithProviders(<DateBox name="date" updateValue={updateValue} value="2024-06-15" />);

        fireEvent.change(screen.getByDisplayValue("2024-06-15"), {
            target: { value: "2024-07-01" },
        });

        expect(updateValue).toHaveBeenCalledWith("2024-07-01");
    });
});
