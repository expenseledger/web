import React from "react";
import styled, { keyframes, css } from "styled-components";
import { pageSettingState } from "../../common/shareState";
import { useAtomValue } from "jotai";
import { motion } from "framer-motion";
import { Box } from "@radix-ui/themes";

interface BackgroundStyledProps {
    $isShow: boolean;
    $backdropOpacity?: number;
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
    children?: React.ReactNode;
}

interface Panel {
    children?: React.ReactNode;
    isDarkTheme?: boolean;
}

const animationDuration = 0.5;
const zIndex = 1000;

const Panel = (props: Panel) => (
    <motion.div>
        <Box
            z-index={zIndex}
            bottom="80px"
            left="50%"
            overflowY="auto"
            p="4"
            maxHeight="65vh"
            position="fixed"
            width="min(420px, calc(100vw - 24px))"
            style={{
                backgroundColor: props.isDarkTheme ? "var(--gray-1)" : "var(--gray-2)",
                borderRadius: "16px",
                transform: "translateX(-50%)",
            }}>
            {props.children}
        </Box>
    </motion.div>
);

const BackgroundMotion = (props: BackgroundStyledProps) => (
    <motion.div
        z-index="inherit"
        animate={{
            opacity: 1,
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
                    onClick={closePanelHandler}
                    $backdropOpacity={props.backdropOpacity}>
                    <Panel isDarkTheme={isDarkTheme}>{props.children}</Panel>
                </Background>
            )}
        </>
    );
};

export default Drawer;
