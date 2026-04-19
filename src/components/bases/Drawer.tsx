import React from "react";
import styled, { keyframes, css } from "styled-components";
import { pageSettingState } from "../../common/shareState";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { useAtomValue } from "jotai";

interface StyledProps {
    $isMenuOnRightSide: boolean;
    $isShow: boolean;
    $isDarkTheme: boolean;
    $position: "side" | "bottom";
    $backdropOpacity?: number;
}

interface DrawStyledProps {
    $isMenuOnRightSide: boolean;
    $isLightMenu: boolean;
    $position: "side" | "bottom";
}

const animationDuration = 0.5;
const zIndex = 1000;
const slideIn = keyframes`
    0%   {left: -100%}
    100% {left: 0;}
`;
const slideInRtl = keyframes`
    0%   {right: -100%}
    100% {right: 0;}
`;
const fadeIn = keyframes`
    0%   {background-color: rgba(0, 0, 0, 0);}
    100% {background-color: rgba(0, 0, 0, 0.8);}
`;
const slideOut = keyframes`
    100% {left: -100%;}
`;
const slideOutRtl = keyframes`
    100% {right: -100%;}
`;
const slideInBottom = keyframes`
    0%   {
        opacity: 0;
        transform: translateX(-50%) translateY(40px);
    }
    100% {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
`;
const slideOutBottom = keyframes`
    0% {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
    100% {
        opacity: 0;
        transform: translateX(-50%) translateY(40px);
    }
`;
const fadeOut = keyframes`
    100% {background-color: rgba(0, 0, 0, 0);}
`;

const Panel = styled.div<StyledProps>`
    z-index: ${zIndex};
    position: fixed;
    background-color: ${(props) =>
        props.$position === "bottom" ? "var(--gray-1)" : props.$isDarkTheme ? "#363636" : "white"};

    ${(props) => {
        if (props.$position === "side") {
            return css`
                top: 0;
                left: ${props.$isMenuOnRightSide ? "initial" : 0};
                right: ${props.$isMenuOnRightSide ? 0 : "initial"};
                border-radius: ${props.$isMenuOnRightSide ? "8px 0 0 8px" : "0 8px 8px 0"};
                height: 100%;
                width: 30%;
                min-width: 350px;
                animation: ${props.$isShow
                        ? props.$isMenuOnRightSide
                            ? slideInRtl
                            : slideIn
                        : props.$isMenuOnRightSide
                          ? slideOutRtl
                          : slideOut}
                    ${animationDuration}s forwards;
            `;
        } else {
            return css`
                bottom: 90px;
                left: 50%;
                width: min(420px, calc(100vw - 24px));
                max-height: 65vh;
                overflow-y: auto;
                border-radius: 18px 18px 0 0;
                padding: 16px;
                animation: ${props.$isShow ? slideInBottom : slideOutBottom} ${animationDuration}s
                    forwards;
                @media (max-width: 768px) {
                    bottom: 74px;
                    width: 100vw;
                    border-radius: 16px 16px 0 0;
                }
            `;
        }
    }}
`;

const Background = styled.div<StyledProps>`
    z-index: ${zIndex - 1};
    position: fixed;
    top: 0;
    left: ${(props) => (props.$isMenuOnRightSide ? "initial" : 0)};
    right: ${(props) => (props.$isMenuOnRightSide ? 0 : "initial")};
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, ${(props) => props.$backdropOpacity || 0.8});
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
    display: ${(props) => (props.$position === "side" ? "block" : "none")};
`;
const Icon = styled(DotsVerticalIcon)`
    margin-top: 38px;
    width: 24px;
    height: 24px;
`;

interface OwnProps {
    preventCloseIdOrClassList?: string[];
    position?: "side" | "bottom";
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    backdropOpacity?: number;
}

type DrawerProps = React.PropsWithChildren<OwnProps>;

const Drawer: React.FC<DrawerProps> = (props) => {
    const { isMenuOnRightSide, isLightMenu, isDarkTheme } = useAtomValue(pageSettingState);
    const position = props.position || "side";
    const isControlled = props.open !== undefined && props.onOpenChange !== undefined;
    const [internalIsShow, setInternalIsShow] = React.useState(false);
    const [isAnimationUnmount, setIsAnimationUnmount] = React.useState(false);
    const isShowPanel = isControlled ? props.open : internalIsShow;

    const btnClickHandler = () => {
        if (isControlled) {
            props.onOpenChange(true);
        } else {
            setInternalIsShow(true);
        }
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
            if (isControlled) {
                props.onOpenChange(false);
            } else {
                setInternalIsShow(false);
            }
            setIsAnimationUnmount(false);
        }, animationDuration * 1000);
    };

    return (
        <>
            {position === "side" && (
                <Draw
                    onClick={btnClickHandler}
                    $isMenuOnRightSide={isMenuOnRightSide}
                    $isLightMenu={isLightMenu}
                    $position={position}>
                    <Icon />
                </Draw>
            )}
            {isShowPanel || isAnimationUnmount ? (
                <Background
                    $isShow={!isAnimationUnmount && isShowPanel}
                    onClick={closePanelHandler}
                    $isMenuOnRightSide={isMenuOnRightSide}
                    $isDarkTheme={isDarkTheme}
                    $position={position}
                    $backdropOpacity={props.backdropOpacity}>
                    <Panel
                        $isShow={!isAnimationUnmount && isShowPanel}
                        $isMenuOnRightSide={isMenuOnRightSide}
                        $isDarkTheme={isDarkTheme}
                        $position={position}
                        $backdropOpacity={props.backdropOpacity}>
                        {props.children}
                    </Panel>
                </Background>
            ) : null}
        </>
    );
};

export default Drawer;
