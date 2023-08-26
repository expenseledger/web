import { useRecoilState } from "recoil";
import styled from "styled-components";
import { pageSettingState } from "../../common/shareState";
import Switch from "../bases/Switch";

const Block = styled.div<{ isFirst: boolean }>`
    border-radius: ${(props) => (props.isFirst ? "6px 6px 0 0" : "0 0 6px 6px")};
    background-color: white;
`;
const SwtichContainer = styled.div`
    height: 29px;
`;

const PageSetting: React.FC = () => {
    const [pageSetting, setPageSetting] = useRecoilState(pageSettingState);
    const onMoveMenuToRightSideChangeHandler = () => {
        setPageSetting((prevState) => {
            const nextState = {
                ...prevState,
                isMenuOnRightSide: !prevState.isMenuOnRightSide,
            };
            window.localStorage.setItem(
                "isMenuOnRightSide",
                nextState.isMenuOnRightSide.toString()
            );

            return nextState;
        });
    };
    const onMenuColorChangeHandler = () => {
        setPageSetting((prevState) => {
            const nextState = {
                ...prevState,
                isLightMenu: !prevState.isLightMenu,
            };
            window.localStorage.setItem("isLightMenu", nextState.isLightMenu.toString());

            return nextState;
        });
    };

    return (
        <div className="panel">
            <Block className="panel-block is-justify-content-space-between" isFirst={true}>
                <span>Move menu to the right</span>
                <SwtichContainer>
                    <Switch
                        name="moveMenuToRightSide"
                        isOn={pageSetting.isMenuOnRightSide}
                        size="small"
                        isRounded
                        isOutlined
                        onChange={onMoveMenuToRightSideChangeHandler}
                    />
                </SwtichContainer>
            </Block>
            <Block className="panel-block is-justify-content-space-between" isFirst={false}>
                <span>Change menu to light color</span>
                <SwtichContainer>
                    <Switch
                        name="changeMenuColor"
                        isOn={pageSetting.isLightMenu}
                        size="small"
                        isRounded
                        isOutlined
                        onChange={onMenuColorChangeHandler}
                    />
                </SwtichContainer>
            </Block>
        </div>
    );
};

export default PageSetting;
