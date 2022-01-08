import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

// describe("<App>", () => {
//     it("renders without crashing", () => {
//         const wrapper = shallow(<App />);
//         expect(toJson(wrapper)).toMatchSnapshot();
//     });
// });
