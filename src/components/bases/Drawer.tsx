import React from "react";
import styled, { keyframes } from "styled-components";

interface StyledProps {
    isShow: boolean;
}

const animationDuration = 0.5;
const zIndex = 1000;
const slideIn = keyframes`
    0%   {left: -100%}
    100% {left: 0;}
`;
const fadeIn = keyframes`
    0%   {background-color: rgba(0, 0, 0, 0);}
    100% {background-color: rgba(0, 0, 0, 0.8);}
`;
const slideOut = keyframes`
    100% {left: -100%;}
`;
const fadeOut = keyframes`
    100% {background-color: rgba(0, 0, 0, 0);}
`;

const Panel = styled.div`
    z-index: ${zIndex};
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 30%;
    min-width: 350px;
    background-color: white;
    animation: ${(props: StyledProps) => (props.isShow ? slideIn : slideOut)} ${animationDuration}s
        forwards;
`;

const Background = styled.div`
    z-index: ${zIndex - 1};
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    animation: ${(props: StyledProps) => (props.isShow ? fadeIn : fadeOut)} ${animationDuration}s
        forwards;
`;

const Drawer: React.FC = (props) => {
    const [isShowPanel, setIsShowPanel] = React.useState(false);
    const [isAnimationUnmount, setIsAnimationUnmount] = React.useState(false);
    const btnClickHandler = () => {
        setIsShowPanel(true);
    };
    const closePanelHandler = () => {
        setIsAnimationUnmount(true);
        setTimeout(() => {
            setIsShowPanel(false);
            setIsAnimationUnmount(false);
        }, animationDuration * 1000);
    };

    return (
        <>
            <span className="icon" onClick={btnClickHandler}>
                <i className="fas fa-lg fa-ellipsis-h"></i>
            </span>
            {isShowPanel ? (
                <Background isShow={!isAnimationUnmount && isShowPanel} onClick={closePanelHandler}>
                    <Panel isShow={!isAnimationUnmount && isShowPanel}>{props.children}</Panel>
                </Background>
            ) : null}
        </>
    );
};

export default Drawer;
