import { fireEvent, screen } from "@testing-library/react";
import Drawer from "../../components/bases/Drawer";
import { renderWithProviders } from "./testUtils";

describe("Drawer", () => {
    it("renders children when open in controlled mode", () => {
        renderWithProviders(
            <Drawer open onOpenChange={jest.fn()}>
                <p>Drawer content</p>
            </Drawer>
        );

        expect(screen.getByText("Drawer content")).toBeInTheDocument();
    });

    it("calls onOpenChange with false when backdrop is clicked", () => {
        const onOpenChange = jest.fn();
        renderWithProviders(
            <Drawer open onOpenChange={onOpenChange}>
                <p>Drawer content</p>
            </Drawer>
        );

        const panel = screen.getByText("Drawer content");
        fireEvent.click(panel.parentElement!.previousElementSibling!);

        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("does not close when click target matches preventCloseIdOrClassList", () => {
        const onOpenChange = jest.fn();
        renderWithProviders(
            <Drawer open onOpenChange={onOpenChange} preventCloseIdOrClassList={["keep-open"]}>
                <div className="keep-open">Drawer content</div>
            </Drawer>
        );

        fireEvent.click(screen.getByText("Drawer content"));

        expect(onOpenChange).not.toHaveBeenCalled();
    });
});
