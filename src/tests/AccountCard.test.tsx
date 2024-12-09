import AccountCard from "../components/AccountCard";
import { render, screen } from "@testing-library/react";

describe("<AccountCard>", () => {
    it("renders without crashing", () => {
        const { container } = render(
            <AccountCard id={1} balance={12.34} name="test" currency="฿" />
        );

        expect(container).toMatchSnapshot();
    });
});
