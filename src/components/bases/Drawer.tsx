import React from "react";
import { useRecoilValue } from "recoil";
import styled, { keyframes } from "styled-components";
import { pageSettingState } from "../../common/shareState";

interface StyledProps {
    isMenuOnRightSide: boolean;
    isShow: boolean;
}

interface DrawStyledProps {
    isMenuOnRightSide: boolean;
    isDarkMenu: boolean;
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
const fadeOut = keyframes`
    100% {background-color: rgba(0, 0, 0, 0);}
`;

const Panel = styled.div`
    z-index: ${zIndex};
    position: fixed;
    top: 0;
    left: ${(props: StyledProps) => (props.isMenuOnRightSide ? "initial" : 0)};
    right: ${(props: StyledProps) => (props.isMenuOnRightSide ? 0 : "initial")};
    height: 100%;
    width: 30%;
    min-width: 350px;
    background-color: white;
    animation: ${(props: StyledProps) =>
            props.isShow
                ? props.isMenuOnRightSide
                    ? slideInRtl
                    : slideIn
                : props.isMenuOnRightSide
                ? slideOutRtl
                : slideOut}
        ${animationDuration}s forwards;
`;

const Background = styled.div`
    z-index: ${zIndex - 1};
    position: fixed;
    top: 0;
    left: ${(props: StyledProps) => (props.isMenuOnRightSide ? "initial" : 0)};
    right: ${(props: StyledProps) => (props.isMenuOnRightSide ? 0 : "initial")};
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    animation: ${(props: StyledProps) => (props.isShow ? fadeIn : fadeOut)} ${animationDuration}s
        forwards;
`;

const Draw = styled.div`
    position: fixed;
    cursor: pointer;
    top: 40%;
    width: 24px;
    height: 100px;
    background-color: ${(props: DrawStyledProps) => (props.isDarkMenu ? "#363636" : "white")};
    color: ${(props: DrawStyledProps) => (props.isDarkMenu ? "white" : "black")};
    border-radius: ${(props: DrawStyledProps) =>
        props.isMenuOnRightSide ? "8px 0 0 8px" : "0 8px 8px 0"};
    z-index: 10;
    right: ${(props: DrawStyledProps) => (props.isMenuOnRightSide ? "0" : "initial")};
`;
const Icon = styled.span`
    margin-top: 38px;
`;

interface OwnProps {
    preventCloseIdOrClassList?: string[];
}

type DrawerProps = React.PropsWithChildren<OwnProps>;

const Drawer: React.FC<DrawerProps> = (props) => {
    const { isMenuOnRightSide, isDarkMenu } = useRecoilValue(pageSettingState);
    const [isShowPanel, setIsShowPanel] = React.useState(false);
    const [isAnimationUnmount, setIsAnimationUnmount] = React.useState(false);
    const btnClickHandler = () => {
        setIsShowPanel(true);
    };
    const closePanelHandler = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;
        const shouldPrevent =
            props.preventCloseIdOrClassList?.some(
                (x) => x === target.id || x === target.className
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
                isMenuOnRightSide={isMenuOnRightSide}
                isDarkMenu={isDarkMenu}>
                <Icon className="icon">
                    <i className="fas fa-ellipsis-vertical"></i>
                </Icon>
            </Draw>
            {isShowPanel ? (
                <Background
                    isShow={!isAnimationUnmount && isShowPanel}
                    onClick={closePanelHandler}
                    isMenuOnRightSide={isMenuOnRightSide}>
                    <Panel
                        isShow={!isAnimationUnmount && isShowPanel}
                        isMenuOnRightSide={isMenuOnRightSide}>
                        {props.children}
                    </Panel>
                </Background>
            ) : null}
        </>
    );
};

export default Drawer;
