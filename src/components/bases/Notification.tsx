import React from "react";
import { motion } from "motion/react";
import { Text } from "@radix-ui/themes";
import { Cross2Icon } from "@radix-ui/react-icons";
import { color } from "../../common/constants";

export interface NotificationProps {
    id: string;
    text: React.ReactNode | string;
    type: NotificationType;
    showClassName?: string;
    hideClassName?: string;
}

export interface NotificationPropsWithOnclose extends NotificationProps {
    onClose?: (id: string) => Promise<void> | void;
}

function mapColor(type: NotificationType): string {
    switch (type) {
        case "primary":
            return `var(--${color.primary}-9)`;
        case "danger":
            return "var(--red-9)";
        case "info":
        case "link":
            return "var(--sky-9)";
        case "success":
            return "var(--grass-9)";
        case "warning":
            return "var(--yellow-9)";
        case "none":
            return null;
    }
}

function getAnimationVariants(showClassName?: string, hideClassName?: string) {
    const isLeft = showClassName?.includes("-left");
    const isRight = showClassName?.includes("-right");

    return {
        initial: {
            x: isLeft ? -100 : isRight ? 100 : 0,
            opacity: 0,
        },
        animate: {
            x: 0,
            opacity: 1,
            transition: { duration: 0.7 },
        },
        exit: {
            x: isLeft ? -100 : isRight ? 100 : 0,
            opacity: 0,
            transition: { duration: 0.7 },
        },
    };
}

const Notification: React.FC<NotificationPropsWithOnclose> = (props) => {
    const [isHiding, setIsHiding] = React.useState(false);
    const variants = getAnimationVariants(props.showClassName, props.hideClassName);

    const onCloseHandler = () => {
        setIsHiding(true);
        setTimeout(() => props.onClose && props.onClose(props.id), 1000);
    };

    React.useEffect(() => {
        const hideTimer = setTimeout(() => {
            setIsHiding(true);
        }, 3000);
        let closeTimer: ReturnType<typeof setTimeout>;
        if (isHiding) {
            closeTimer = setTimeout(() => props.onClose && props.onClose(props.id), 1000);
        }

        return () => {
            clearTimeout(hideTimer);
            clearTimeout(closeTimer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isHiding]);

    return (
        <motion.div
            initial={variants.initial}
            animate={isHiding ? variants.exit : variants.animate}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "12px",
                padding: "12px",
                backgroundColor: mapColor(props.type),
                borderRadius: "4px",
            }}>
            <Text style={{ color: "white", marginTop: "4px", cursor: "pointer" }}>
                <Cross2Icon onClick={onCloseHandler} />
            </Text>
            <Text style={{ color: "white" }}>{props.text}</Text>
        </motion.div>
    );
};

export type NotificationType =
    | "primary"
    | "info"
    | "success"
    | "link"
    | "warning"
    | "danger"
    | "none";

export default Notification;
