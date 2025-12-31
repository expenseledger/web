import React from "react";
import { pageSettingState } from "../../common/shareState";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { useAtomValue } from "jotai";
import { styled } from "@linaria/react";
import { css } from "@linaria/core";

interface StyledProps {
    $isMenuOnRightSide: boolean;
    $isShow: boolean;
    $isDarkTheme: boolean;
}

interface DrawStyledProps {
    $isMenuOnRightSide: boolean;
    $isLightMenu: boolean;
}

const animationDuration = 0.5;
const zIndex = 1000;
const slideIn = css`
    @keyframes slideIn {
        0% {
            left: -100%;
        }
        100% {
            left: 0;
        }
    }
`;
const slideInRtl = css`
    @keyframes slideInRtl {
        0% {
            right: -100%;
        }
        100% {
            right: 0;
        }
    }
`;
const fadeIn = css`
    @keyframes fadeIn {
        0% {
            background-color: rgba(0, 0, 0, 0);
        }
        100% {
            background-color: rgba(0, 0, 0, 0.8);
        }
    }
`;
const slideOut = css`
    @keyframes slideOut {
        0% {
            left: 0;
        }
        100% {
            left: -100%;
        }
    }
`;
const slideOutRtl = css`
    @keyframes slideOutRtl {
        100% {
            right: -100%;
        }
    }
`;
const fadeOut = css`
    @keyframes fadeOut {
        100% {
            background-color: rgba(0, 0, 0, 0);
        }
    }
`;

const Panel = styled.div<StyledProps>`
    z-index: ${zIndex};
    position: fixed;
    top: 0;
    left: ${(props) => (props.$isMenuOnRightSide ? "initial" : 0)};
    right: ${(props) => (props.$isMenuOnRightSide ? 0 : "initial")};
    border-radius: ${(props) => (props.$isMenuOnRightSide ? "8px 0 0 8px" : "0 8px 8px 0")};
    height: 100%;
    width: 30%;
    min-width: 350px;
    background-color: ${(props) => (props.$isDarkTheme ? "#363636" : "white")};
    animation: ${(props) =>
            props.$isShow
                ? props.$isMenuOnRightSide
                    ? slideInRtl
                    : slideIn
                : props.$isMenuOnRightSide
                  ? slideOutRtl
                  : slideOut}
        ${animationDuration}s forwards;
`;

const Background = styled.div<StyledProps>`
    z-index: ${zIndex - 1};
    position: fixed;
    top: 0;
    left: ${(props) => (props.$isMenuOnRightSide ? "initial" : 0)};
    right: ${(props) => (props.$isMenuOnRightSide ? 0 : "initial")};
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    animation: ${(props) => (props.$isShow ? fadeIn : fadeOut)} ${animationDuration}s forwards;
`;

const Draw = styled.div<DrawStyledProps>`
    position: fixed;
    cursor: pointer;
    top: 40%;
    width: 24px;
    height: 100px;
    background-color: ${(props) => (props.$isLightMenu ? "white" : "#363636")};
    color: ${(props) => (props.$isLightMenu ? "black" : "white")};
    border-radius: ${(props) => (props.$isMenuOnRightSide ? "8px 0 0 8px" : "0 8px 8px 0")};
    z-index: 10;
    right: ${(props) => (props.$isMenuOnRightSide ? "0" : "initial")};
`;
const Icon = styled(DotsVerticalIcon)`
    margin-top: 38px;
    width: 24px;
    height: 24px;
`;

interface OwnProps {
    preventCloseIdOrClassList?: string[];
}

type DrawerProps = React.PropsWithChildren<OwnProps>;

const Drawer: React.FC<DrawerProps> = (props) => {
    const { isMenuOnRightSide, isLightMenu, isDarkTheme } = useAtomValue(pageSettingState);
    const [isShowPanel, setIsShowPanel] = React.useState(false);
    const [isAnimationUnmount, setIsAnimationUnmount] = React.useState(false);
    const btnClickHandler = () => {
        setIsShowPanel(true);
    };
    const closePanelHandler = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;
        const shouldPrevent =
            props.preventCloseIdOrClassList?.some(
                (x) => x === target.id || target.className.includes(x)
            ) ?? false;

        if (shouldPrevent) {
            return;
        }

        setIsAnimationUnmount(true);
        setTimeout(() => {
            setIsShowPanel(false);
            setIsAnimationUnmount(false);
        }, animationDuration * 1000);
    };

    return (
        <>
            <Draw
                onClick={btnClickHandler}
                $isMenuOnRightSide={isMenuOnRightSide}
                $isLightMenu={isLightMenu}>
                <Icon />
            </Draw>
            {isShowPanel ? (
                <Background
                    $isShow={!isAnimationUnmount && isShowPanel}
                    onClick={closePanelHandler}
                    $isMenuOnRightSide={isMenuOnRightSide}
                    $isDarkTheme={isDarkTheme}>
                    <Panel
                        $isShow={!isAnimationUnmount && isShowPanel}
                        $isMenuOnRightSide={isMenuOnRightSide}
                        $isDarkTheme={isDarkTheme}>
                        {props.children}
                    </Panel>
                </Background>
            ) : null}
        </>
    );
};

export default Drawer;
