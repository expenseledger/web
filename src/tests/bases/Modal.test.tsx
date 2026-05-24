import { fireEvent, screen, waitFor } from "@testing-library/react";
import Modal from "../../components/bases/Modal";
import { renderWithProviders } from "./testUtils";

describe("Modal", () => {
    it("renders trigger and opens dialog on click", async () => {
        const onConfirm = jest.fn().mockResolvedValue(undefined);

        renderWithProviders(
            <Modal
                title="Delete item"
                confirmBtnTxt="Confirm"
                confirmBtnType="danger"
                cancelBtnTxt="Cancel"
                cancelBtnType="default"
                onConfirmHandler={onConfirm}
                triggerer={<button type="button">Open</button>}>
                <p>Are you sure?</p>
            </Modal>
        );

        fireEvent.click(screen.getByRole("button", { name: "Open" }));

        expect(await screen.findByText("Delete item")).toBeInTheDocument();
        expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    });

    it("calls onConfirmHandler when confirm is clicked", async () => {
        const onConfirm = jest.fn().mockResolvedValue(undefined);

        renderWithProviders(
            <Modal
                title="Delete item"
                confirmBtnTxt="Confirm"
                confirmBtnType="danger"
                cancelBtnTxt="Cancel"
                cancelBtnType="default"
                onConfirmHandler={onConfirm}
                triggerer={<button type="button">Open</button>}>
                <p>Are you sure?</p>
            </Modal>
        );

        fireEvent.click(screen.getByRole("button", { name: "Open" }));
        fireEvent.click(await screen.findByRole("button", { name: "Confirm" }));

        await waitFor(() => {
            expect(onConfirm).toHaveBeenCalledTimes(1);
        });
    });
});
