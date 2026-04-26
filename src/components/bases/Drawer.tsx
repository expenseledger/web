import React from "react";
import styled from "styled-components";
import { pageSettingState } from "../../common/shareState";
import { useAtomValue } from "jotai";
import { motion, AnimatePresence } from "framer-motion";

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

const PanelContainer = styled(motion.div)`
    box-sizing: border-box;
    left: 50%;
    width: min(420px, calc(100vw - 24px));

    @media (max-width: 768px) {
        width: calc(100vw - 16px);
    }
`;

const Panel = (props: Panel) => (
    <PanelContainer
        initial={{ y: "100%", x: "-50%", opacity: 0 }}
        animate={{ y: 0, x: "-50%", opacity: 1 }}
        exit={{ y: "100%", x: "-50%", opacity: 0 }}
        transition={{ duration: animationDuration, ease: "easeInOut" }}
        style={{
            zIndex,
            bottom: "80px",
            position: "fixed",
            overflowY: "auto",
            maxHeight: "65vh",
            padding: "var(--space-4)",
            backgroundColor: props.isDarkTheme ? "var(--gray-1)" : "var(--gray-2)",
            borderRadius: "16px",
        }}>
        {props.children}
    </PanelContainer>
);

const BackgroundMotion = (props: BackgroundStyledProps) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{
            opacity: 1,
        }}
        exit={{ opacity: 0 }}
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
            <AnimatePresence>
                {isShowPanel && (
                    <>
                        <Background
                            $isShow={isShowPanel}
                            onClick={closePanelHandler}
                            $backdropOpacity={props.backdropOpacity}
                        />
                        <Panel isDarkTheme={isDarkTheme}>{props.children}</Panel>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Drawer;
