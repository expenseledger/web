import React from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

interface BackgroundStyledProps {
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const animationDuration = 0.25;
const zIndex = 1000;

const PanelContainer = styled(motion.div)`
    box-sizing: border-box;
    z-index: ${zIndex};
    bottom: 80px;
    position: fixed;
    overflow-y: auto;
    max-height: 65vh;
    padding: var(--space-4);
    background-color: var(--gray-2);
    border-radius: 16px;
    left: 50%;
    width: min(420px, calc(100vw - 24px));

    @media (max-width: 768px) {
        width: calc(100vw - 16px);
    }
`;

const panelMotion = {
    initial: { y: "100%", x: "-50%", opacity: 0 },
    animate: { y: 0, x: "-50%", opacity: 1 },
    exit: { y: "100%", x: "-50%", opacity: 0 },
};

const backdropMotion = {
    initial: { opacity: 0, backdropFilter: "blur(0px)" },
    animate: { opacity: 1, backdropFilter: "blur(8px)" },
    exit: { opacity: 0, backdropFilter: "blur(0px)" },
};

const Background = styled(motion.div)<BackgroundStyledProps>`
    z-index: ${zIndex - 1};
    position: fixed;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    will-change: opacity, backdrop-filter;
    -webkit-backdrop-filter: blur(0px);
    pointer-events: auto;
`;

interface OwnProps {
    preventCloseIdOrClassList?: string[];
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

type DrawerProps = React.PropsWithChildren<OwnProps>;

const Drawer: React.FC<DrawerProps> = (props) => {
    const { open, onOpenChange, preventCloseIdOrClassList, children } = props;
    const isControlled = open !== undefined && onOpenChange !== undefined;
    const [internalIsShow, setInternalIsShow] = React.useState(false);
    const isShowPanel = isControlled ? open : internalIsShow;

    const closePanelHandler = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;
        const targetClassName = typeof target.className === "string" ? target.className : "";
        const shouldPrevent =
            preventCloseIdOrClassList?.some(
                (x) => x === target.id || targetClassName.includes(x)
            ) ?? false;

        if (shouldPrevent) {
            return;
        }

        if (isControlled) {
            onOpenChange(false);
        } else {
            setInternalIsShow(false);
        }
    };

    return (
        <AnimatePresence>
            {isShowPanel && (
                <>
                    <Background
                        onClick={closePanelHandler}
                        initial={backdropMotion.initial}
                        animate={backdropMotion.animate}
                        exit={backdropMotion.exit}
                        transition={{ duration: animationDuration, ease: "easeInOut" }}
                    />
                    <PanelContainer
                        initial={panelMotion.initial}
                        animate={panelMotion.animate}
                        exit={panelMotion.exit}
                        transition={{ duration: animationDuration, ease: "easeInOut" }}>
                        {children}
                    </PanelContainer>
                </>
            )}
        </AnimatePresence>
    );
};

export default Drawer;
