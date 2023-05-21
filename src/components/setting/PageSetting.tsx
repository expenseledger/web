import { useEffect } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { pageSettingState } from "../../common/shareState";
import Switch from "../bases/Switch";

const Block = styled.div`
    border-radius: 6px; // remove when we have more than 1 option
    background-color: white;
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

    useEffect(() => {
        console.log(pageSetting);
    }, [pageSetting]);

    return (
        <div className="panel">
            <Block className="panel-block is-justify-content-space-between">
                <span>Move menu to the right</span>
                <div>
                    <Switch
                        name="moveMenuToRightSide"
                        isOn={pageSetting.isMenuOnRightSide}
                        size="small"
                        isRounded
                        isOutlined
                        onChange={onMoveMenuToRightSideChangeHandler}
                    />
                </div>
            </Block>
        </div>
    );
};

export default PageSetting;
