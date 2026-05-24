import { screen } from "@testing-library/react";
import BalanceWithCurrency from "../../components/bases/BalanceWithCurrency";
import { renderWithProviders } from "./testUtils";

describe("BalanceWithCurrency", () => {
    it("renders currency and formatted balance", () => {
        renderWithProviders(<BalanceWithCurrency balance={1234.5} />);

        expect(screen.getByText("฿")).toBeInTheDocument();
        expect(screen.getByText("1,234.50")).toBeInTheDocument();
    });

    it("hides balance when isHideBalance is true", () => {
        renderWithProviders(<BalanceWithCurrency balance={1234.5} isHideBalance />);

        expect(screen.getByText("XXXX.XX")).toBeInTheDocument();
        expect(screen.queryByText("1,234.50")).not.toBeInTheDocument();
    });
});
