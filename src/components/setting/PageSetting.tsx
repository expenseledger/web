import { useAtom } from "jotai";
import { pageSettingState } from "../../common/shareState";
import Switch from "../bases/Switch";
import { Card, Flex, Separator, Text } from "@radix-ui/themes";
import AnimatedPage from "../AnimatedPage";

const PageSetting: React.FC = () => {
    const [pageSetting, setPageSetting] = useAtom(pageSettingState);
    const onMoveMenuToRightSideChangeHandler = () => {
        setPageSetting((prevState) => {
            const nextState = {
                ...prevState,
                isMenuOnRightSide: !prevState.isMenuOnRightSide,
            };

            return nextState;
        });
    };
    const onMenuColorChangeHandler = () => {
        setPageSetting((prevState) => {
            const nextState = {
                ...prevState,
                isLightMenu: !prevState.isLightMenu,
            };

            return nextState;
        });
    };
    const onThemeChangeHandler = () => {
        setPageSetting((prevState) => {
            const nextState = {
                ...prevState,
                isDarkTheme: !prevState.isDarkTheme,
            };

            return nextState;
        });
    };

    return (
        <AnimatedPage>
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
                <Separator size="4" />
                <Flex justify="between" align="center" mt="3">
                    <Text>Change to dark theme</Text>
                    <Switch
                        name="changeMenuColor"
                        isOn={pageSetting.isDarkTheme}
                        size="small"
                        isRounded
                        onChange={onThemeChangeHandler}
                    />
                </Flex>
            </Card>
        </AnimatedPage>
    );
};

export default PageSetting;
