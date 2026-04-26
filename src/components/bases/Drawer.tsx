import React from "react";
import styled, { keyframes, css } from "styled-components";
import { pageSettingState } from "../../common/shareState";
import { useAtomValue } from "jotai";
import { motion } from "framer-motion";

interface BackgroundStyledProps {
    $isShow: boolean;
    $backdropOpacity?: number;
    children?: React.ReactNode;
}

interface PanelStyledProps {
    $isShow: boolean;
    $isDarkTheme: boolean;
    $position: "side" | "bottom";
    $bottomOffset?: string;
    $padding?: string;
    $margin?: string;
}

interface DrawStyledProps {
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
const slideOut = keyframes`
    100% {left: -100%;}
`;
const slideOutRtl = keyframes`
    100% {right: -100%;}
`;
const slideUp = keyframes`
    0%   {
        opacity: 0;
        transform: translateX(-50%) translateY(40px);
    }
    100% {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
`;
const slideDown = keyframes`
    0% {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
    100% {
        opacity: 0;
        transform: translateX(-50%) translateY(40px);
    }
`;
const Panel = styled.div<PanelStyledProps>`
    z-index: ${zIndex};
    position: fixed;
    background-color: ${(props) =>
        props.$position === "bottom" ? "var(--gray-1)" : props.$isDarkTheme ? "#363636" : "white"};

    ${(props) => {
        if (props.$position === "side") {
            return css`
                top: 0;
                height: 100%;
                width: 30%;
                min-width: 350px;
            `;
        } else {
            const bottomDesktop = props.$bottomOffset ?? "90px";
            const bottomMobile = props.$bottomOffset !== undefined ? props.$bottomOffset : "74px";
            const padding = props.$padding ?? "16px";

            return css`
                bottom: ${bottomDesktop};
                left: 50%;
                width: min(420px, calc(100vw - 24px));
                max-height: 65vh;
                overflow-y: auto;
                border-radius: 18px 18px 0 0;
                padding: ${padding};
                ${props.$margin !== undefined
                    ? css`
                          margin: ${props.$margin};
                      `
                    : css``}
                animation: ${props.$isShow ? slideUp : slideDown} ${animationDuration}s
                    forwards;
                @media (max-width: 768px) {
                    bottom: ${bottomMobile};
                    width: 100vw;
                    border-radius: 16px 16px 0 0;
                }
            `;
        }
    }}
`;
const BackgroundMotion = (props: BackgroundStyledProps) => (
    <motion.div
        z-index="inherit"
        animate={{
            opacity: props.$isShow ? 1 : 0,
        }}
        transition={{ duration: animationDuration, ease: "easeInOut" }}>
        {props.children}
    </motion.div>
);
const Background = styled(BackgroundMotion)<BackgroundStyledProps>`
    z-index: ${zIndex - 1};
    position: fixed;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, ${(props) => props.$backdropOpacity || 0.8});
    pointer-events: ${(props) => (props.$isShow ? "auto" : "none")};
`;

interface OwnProps {
    preventCloseIdOrClassList?: string[];
    position?: "side" | "bottom";
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    backdropOpacity?: number;
    bottomOffset?: string;
    padding?: string;
    margin?: string;
}

type DrawerProps = React.PropsWithChildren<OwnProps>;

const Drawer: React.FC<DrawerProps> = (props) => {
    const { isDarkTheme } = useAtomValue(pageSettingState);
    const position = props.position || "side";
    const isControlled = props.open !== undefined && props.onOpenChange !== undefined;
    const [internalIsShow, setInternalIsShow] = React.useState(false);
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

        if (isControlled) {
            props.onOpenChange(false);
        } else {
            setInternalIsShow(false);
        }
    };

    return (
        <>
            {isShowPanel && (
                <Background
                    $isShow={isShowPanel}
                    // onClick={closePanelHandler}
                    $backdropOpacity={props.backdropOpacity}>
                    <Panel
                        $isShow={isShowPanel}
                        $isDarkTheme={isDarkTheme}
                        $position={position}
                        $bottomOffset={props.bottomOffset}
                        $padding={props.padding}
                        $margin={props.margin}>
                        {props.children}
                    </Panel>
                </Background>
            )}
        </>
    );
};

export default Drawer;
