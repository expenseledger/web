import { act, screen } from "@testing-library/react";
import Loading from "../../components/bases/Loading";
import { renderWithProviders } from "./testUtils";

const mockAddNotification = jest.fn();

jest.mock("../../service/helper/notificationHelper", () => ({
    useNotification: () => ({ addNotification: mockAddNotification }),
}));

describe("Loading", () => {
    beforeEach(() => {
        jest.useFakeTimers();
        mockAddNotification.mockClear();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("renders nothing initially", () => {
        renderWithProviders(<Loading />);

        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    it("shows loading UI after delay", () => {
        renderWithProviders(<Loading />);

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("shows error notification after timeout", () => {
        renderWithProviders(<Loading />);

        act(() => {
            jest.advanceTimersByTime(10000);
        });

        expect(mockAddNotification).toHaveBeenCalledWith(
            "Please try restarting the app.",
            "danger"
        );
    });
});
