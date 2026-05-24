import { act, fireEvent, screen } from "@testing-library/react";
import Notification from "../../components/bases/Notification";
import { renderWithProviders } from "./testUtils";

describe("Notification", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("renders notification text", () => {
        renderWithProviders(
            <Notification id="1" text="Saved successfully" type="success" />
        );

        expect(screen.getByText("Saved successfully")).toBeInTheDocument();
    });

    it("calls onClose when close icon is clicked", () => {
        const onClose = jest.fn();
        const { container } = renderWithProviders(
            <Notification id="1" text="Saved" type="success" onClose={onClose} />
        );

        fireEvent.click(container.querySelector("svg")!);

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(onClose).toHaveBeenCalledWith("1");
    });

    it("auto-hides and calls onClose after timeout", () => {
        const onClose = jest.fn();
        renderWithProviders(
            <Notification id="2" text="Auto hide" type="info" onClose={onClose} />
        );

        act(() => {
            jest.advanceTimersByTime(4000);
        });

        expect(onClose).toHaveBeenCalledWith("2");
    });
});
