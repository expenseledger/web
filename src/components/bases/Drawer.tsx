import React from "react";
import styled, { keyframes } from "styled-components";

interface StyledProps {
    isShow: boolean;
}

const zIndex = 101;
const slideIn = keyframes`
    from {
        left: -30%;
    }

    to {
        left: 0;
    }
`;
const fadeIn = keyframes`
    from {
        background-color: rgba(0, 0, 0, 0);
    }
    to {
        background-color: rgba(0, 0, 0, 0.8);
    }
`;
const slideOut = keyframes`
    from {
        left: 0;
    }

    to {
        left: -30%;
    }
`;
const fadeOut = keyframes`
    from {
        background-color: rgba(0, 0, 0, 0.8);
    }
    to {
        background-color: rgba(0, 0, 0, 0);
    }
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
    left: 0%;
    height: 100%;
    width: 100%;
    animation: ${(props: StyledProps) => (props.isShow ? fadeIn : fadeOut)} 0.5s
        forwards;
`;

const Drawer: React.FC = (props) => {
    const [isShowPanel, setIsShowPanel] = React.useState(false);
    const btnClickHandler = () => {
        setIsShowPanel(true);
    };
    const closePanelHandler = () => {
        setIsShowPanel(false);
    };

    return (
        <>
            <span className="icon" onClick={btnClickHandler}>
                <i className="fas fa-lg fa-bars"></i>
            </span>
            <Background isShow={isShowPanel} onClick={closePanelHandler}>
                <Panel isShow={isShowPanel}>{props.children}</Panel>
            </Background>
        </>
    );
};

export default Drawer;
