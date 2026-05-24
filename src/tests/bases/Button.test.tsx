import { fireEvent, screen } from "@testing-library/react";
import Button from "../../components/bases/Button";
import { renderWithProviders } from "./testUtils";

describe("Button", () => {
    it("renders button label", () => {
        renderWithProviders(<Button value="Save" />);

        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });

    it("calls onClickHandler when clicked", () => {
        const onClick = jest.fn();
        renderWithProviders(<Button value="Save" onClickHandler={onClick} />);

        fireEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("is disabled while loading", () => {
        renderWithProviders(<Button value="Save" isLoading />);

        expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    });
});
