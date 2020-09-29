import React from "react";
import styled, { keyframes } from "styled-components";

interface StyledProps {
    isShow: boolean;
}

const zIndex = 101;
const slideIn = keyframes`
    0%   {left: -30%}
    100% {left: 0;}
`;
const fadeIn = keyframes`
    0%   {background-color: rgba(0, 0, 0, 0);}
    100% {background-color: rgba(0, 0, 0, 0.8);}
`;
const slideOut = keyframes`
    100% {left: -30%;}
`;
const fadeOut = keyframes`
    100% {background-color: rgba(0, 0, 0, 0);z-index: -1;}
`;

const Panel = styled.div`
    z-index: ${zIndex};
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 30%;
    min-width: 200px;
    background-color: white;
    animation: ${(props: StyledProps) => (props.isShow ? slideIn : slideOut)}
        0.5s forwards;
`;

const Background = styled.div`
    z-index: ${zIndex - 1};
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    animation: ${(props: StyledProps) => (props.isShow ? fadeIn : fadeOut)} 0.5s
        forwards;
`;

const Drawer: React.FC = (props) => {
    const [isShowPanel, setIsShowPanel] = React.useState(false);
    const [isFirstRender, setIsFirstRender] = React.useState(true);
    const btnClickHandler = () => {
        setIsShowPanel(true);
        setIsFirstRender(false);
    };
    const closePanelHandler = () => {
        setIsShowPanel(false);
    };

    return (
        <>
            <span className="icon" onClick={btnClickHandler}>
                <i className="fas fa-lg fa-bars"></i>
            </span>
            {!isFirstRender || isShowPanel ? (
                <Background isShow={isShowPanel} onClick={closePanelHandler}>
                    <Panel isShow={isShowPanel}>{props.children}</Panel>
                </Background>
            ) : null}
        </>
    );
};

export default Drawer;
