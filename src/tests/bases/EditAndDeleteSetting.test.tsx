import { fireEvent, screen, waitFor } from "@testing-library/react";
import EditAndDeleteSetting from "../../components/bases/EditAndDeleteSetting";
import { renderWithProviders } from "./testUtils";

describe("EditAndDeleteSetting", () => {
    const items = [
        { id: 1, name: "Cash" },
        { id: 2, name: "Bank" },
    ];

    const modifyModal = (id: number, triggerer: React.ReactElement) => (
        <button type="button" data-testid={`edit-${id}`}>
            {triggerer}
        </button>
    );

    it("renders all items", () => {
        renderWithProviders(
            <EditAndDeleteSetting
                items={items}
                deleteFuncHandler={jest.fn()}
                modifyModal={modifyModal}
            />
        );

        expect(screen.getByText("Cash")).toBeInTheDocument();
        expect(screen.getByText("Bank")).toBeInTheDocument();
    });

    it("calls deleteFuncHandler after confirm delete", async () => {
        const deleteFuncHandler = jest.fn().mockResolvedValue(undefined);

        renderWithProviders(
            <EditAndDeleteSetting
                items={[{ id: 1, name: "Cash" }]}
                deleteFuncHandler={deleteFuncHandler}
                modifyModal={modifyModal}
            />
        );

        const row = screen.getByText("Cash").parentElement!;
        const icons = row.querySelectorAll("svg");
        fireEvent.click(icons[icons.length - 1]);

        fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

        await waitFor(() => {
            expect(deleteFuncHandler).toHaveBeenCalledWith(1);
        });
    });
});
