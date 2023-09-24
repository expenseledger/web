import { useRecoilState } from "recoil";
import { pageSettingState } from "../../common/shareState";
import Switch from "../bases/Switch";
import { Card, Flex, Separator, Text } from "@radix-ui/themes";

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
        <Card>
            <Flex justify="between" align="center" mb="3">
                <Text>Move menu to the right</Text>
                <Switch
                    name="moveMenuToRightSide"
                    isOn={pageSetting.isMenuOnRightSide}
                    size="small"
                    isRounded
                    onChange={onMoveMenuToRightSideChangeHandler}
                />
            </Flex>
            <Separator size="4" />
            <Flex justify="between" align="center" mt="3">
                <Text>Change menu to light color</Text>
                <Switch
                    name="changeMenuColor"
                    isOn={pageSetting.isLightMenu}
                    size="small"
                    isRounded
                    onChange={onMenuColorChangeHandler}
                />
            </Flex>
        </Card>
    );
};

export default PageSetting;
