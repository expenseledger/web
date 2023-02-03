import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import toJson from "enzyme-to-json";
import AccountCard from "../components/AccountCard";

Enzyme.configure({ adapter: new Adapter() });

describe("<AccountCard>", () => {
    it("renders without crashing", () => {
        const wrapper = shallow(<AccountCard id={1} balance={12.34} name="test" currency="฿" />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
