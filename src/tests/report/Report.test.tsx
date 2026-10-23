import { fireEvent, screen, waitFor } from "@testing-library/react";
import { createStore } from "jotai";
import { MemoryRouter } from "react-router-dom";
import { accountsState } from "../../common/shareState";
import Report from "../../components/report/Report";
import { getTransactionMonthYearList, listTransactions } from "../../service/transactionService";
import { renderWithProviders } from "../bases/testUtils";

jest.mock("uuid", () => ({
    v4: jest.fn(() => "generated-uuid"),
}));

jest.mock("swiper/react", () => ({
    Swiper: ({
        children,
        onSlideChange,
    }: {
        children: React.ReactNode;
        onSlideChange?: (swiper: { realIndex: number }) => void;
    }) => (
        <div>
            {children}
            <button type="button" onClick={() => onSlideChange?.({ realIndex: 1 })}>
                Previous month
            </button>
        </div>
    ),
    SwiperSlide: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("swiper/modules", () => ({
    Navigation: {},
}));

jest.mock("../../components/report/BarChartReport", () => (): null => null);
jest.mock("../../components/report/PieChartReport", () => (): null => null);
jest.mock("../../components/report/TableReport", () => (): null => null);

jest.mock("../../service/transactionService", () => ({
    getTransactionMonthYearList: jest.fn(),
    listTransactions: jest.fn(),
}));

const cash = { id: "1", name: "Cash", balance: 100, currency: "THB" as const };

function renderReport(state?: { accountId: string }) {
    const store = createStore();
    store.set(accountsState, [cash]);

    return renderWithProviders(
        <MemoryRouter initialEntries={[{ pathname: "/report", state }]}>
            <Report />
        </MemoryRouter>,
        { store }
    );
}

describe("Report", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.mocked(getTransactionMonthYearList).mockResolvedValue({
            monthYears: ["2026-02", "2026-01"],
        });
        jest.mocked(listTransactions).mockResolvedValue({ items: [] });
    });

    it("loads the newest month of the selected account", async () => {
        renderReport({ accountId: "1" });

        expect(await screen.findByText("February 2026")).toBeInTheDocument();
        expect(listTransactions).toHaveBeenCalledWith({
            accountId: "1",
            fromDate: new Date(2026, 1, 1),
            toDate: new Date(2026, 1, 28, 23, 59, 59, 999),
        });
    });

    it("loads another month after sliding to it", async () => {
        renderReport({ accountId: "1" });
        await screen.findByText("February 2026");

        fireEvent.click(screen.getByRole("button", { name: "Previous month" }));

        await waitFor(() =>
            expect(listTransactions).toHaveBeenLastCalledWith({
                accountId: "1",
                fromDate: new Date(2026, 0, 1),
                toDate: new Date(2026, 0, 31, 23, 59, 59, 999),
            })
        );
    });

    it("renders an empty report when no account is selected", async () => {
        renderReport();

        expect(await screen.findByText("No data")).toBeInTheDocument();
        expect(listTransactions).not.toHaveBeenCalled();
    });

    it("renders an empty report when the selected account has no transactions", async () => {
        jest.mocked(getTransactionMonthYearList).mockResolvedValue({ monthYears: [] });

        renderReport({ accountId: "1" });

        expect(await screen.findByText("No data")).toBeInTheDocument();
    });
});
