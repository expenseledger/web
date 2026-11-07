import { fireEvent, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { TransactionList } from "../../components/transactionList/TransactionList";
import Transaction from "../../service/model/Transaction";
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

jest.mock("../../components/Layout", () => ({
    useBackToHome: () => ({ setBackToHomeParam: jest.fn() }),
}));

jest.mock("../../service/accountService", () => ({
    getAllAccount: jest.fn(),
}));

jest.mock("../../service/transactionService", () => ({
    deleteTransaction: jest.fn(),
    getTransactionMonthYearList: jest.fn(),
    listTransactions: jest.fn(),
    updateTransaction: jest.fn(),
}));

const cash = { id: "1", name: "Cash", balance: 100, currency: "THB" as const };
const expense = (description: string, date: Date): Transaction => ({
    id: description,
    type: "EXPENSE",
    fromAccount: cash,
    toAccount: null,
    amount: 10,
    convertedAmount: null,
    category: null,
    description,
    date,
});

const lunch = expense("Lunch", new Date(2026, 1, 3));
const rent = expense("Rent", new Date(2026, 0, 1));

function renderList() {
    return renderWithProviders(
        <MemoryRouter initialEntries={["/account/1/transactionList"]}>
            <Routes>
                <Route path="/account/:accountId/transactionList" element={<TransactionList />} />
            </Routes>
        </MemoryRouter>
    );
}

describe("TransactionList", () => {
    beforeEach(() => {
        jest.mocked(getTransactionMonthYearList).mockResolvedValue({
            monthYears: ["2026-02", "2026-01"],
        });
        jest.mocked(listTransactions).mockImplementation(async ({ fromDate }) => ({
            items: fromDate.getMonth() === 1 ? [lunch] : [rent],
        }));
    });

    it("shows the newest month's transactions", async () => {
        renderList();

        expect(await screen.findByText("Lunch")).toBeInTheDocument();
        expect(screen.getByText("February 2026")).toBeInTheDocument();
        expect(listTransactions).toHaveBeenCalledWith({
            accountId: "1",
            fromDate: new Date(2026, 1, 1),
            toDate: new Date(2026, 1, 28, 23, 59, 59, 999),
        });
    });

    it("shows another month's transactions after sliding to it", async () => {
        renderList();
        await screen.findByText("Lunch");

        fireEvent.click(screen.getByRole("button", { name: "Previous month" }));

        expect(await screen.findByText("Rent")).toBeInTheDocument();
        expect(screen.queryByText("Lunch")).not.toBeInTheDocument();
    });
});
