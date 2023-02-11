import renderer from "react-test-renderer";
import AccountCard from "../components/AccountCard";

describe("<AccountCard>", () => {
    it("renders without crashing", () => {
        const component = renderer.create(
            <AccountCard id={1} balance={12.34} name="test" currency="฿" />
        );
        expect(component.toJSON()).toMatchSnapshot();
    });
});
