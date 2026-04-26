import { useAtom } from "jotai";
import { pageSettingState } from "../../common/shareState";
import Switch from "../bases/Switch";
import { Card, Flex, Separator, Text } from "@radix-ui/themes";
import AnimatedPage from "../AnimatedPage";

const PageSetting: React.FC = () => {
    const [pageSetting, setPageSetting] = useAtom(pageSettingState);
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
                <Flex justify="between" align="center">
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
