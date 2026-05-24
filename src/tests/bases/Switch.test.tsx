import { fireEvent, screen } from "@testing-library/react";
import Switch from "../../components/bases/Switch";
import { renderWithProviders } from "./testUtils";

describe("Switch", () => {
    it("renders label on the right by default", () => {
        renderWithProviders(
            <Switch name="dark-mode" label="Dark mode" isOn={false} onChange={jest.fn()} />
        );

        expect(screen.getByText("Dark mode")).toBeInTheDocument();
    });

    it("calls onChange when toggled", () => {
        const onChange = jest.fn();
        renderWithProviders(
            <Switch name="dark-mode" label="Dark mode" isOn={false} onChange={onChange} />
        );

        fireEvent.click(screen.getByRole("switch"));

        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("renders label on the left when isRtl is true", () => {
        const { container } = renderWithProviders(
            <Switch
                name="dark-mode"
                label="Dark mode"
                isOn
                isRtl
                onChange={jest.fn()}
            />
        );

        expect(screen.getByText("Dark mode")).toBeInTheDocument();
        expect(container.querySelector("label")).toBeInTheDocument();
    });
});
