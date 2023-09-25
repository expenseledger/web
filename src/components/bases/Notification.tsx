import React from "react";
import { combineClassName } from "../../common/utils";
import { Flex, Text } from "@radix-ui/themes";
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

const Notification: React.FC<NotificationPropsWithOnclose> = (props) => {
    const showNotificationClassName = combineClassName(
        "notification",
        "notification--show",
        props.showClassName
    );
    const hideNotificationClassName = combineClassName(
        "notification",
        "notification--hide",
        props.hideClassName
    );
    const [className, SetClassName] = React.useState(showNotificationClassName);

    const onCloseHandler = () => {
        SetClassName(hideNotificationClassName);
        setTimeout(() => props.onClose && props.onClose(props.id), 1000);
    };

    React.useEffect(() => {
        setTimeout(() => {
            SetClassName(hideNotificationClassName);
            setTimeout(() => props.onClose && props.onClose(props.id), 1000);
        }, 3000);
    }, [hideNotificationClassName, props]);

    return (
        <Flex
            className={className}
            mb="3"
            p="3"
            align="center"
            gap="3"
            style={{ backgroundColor: mapColor(props.type), borderRadius: "4px" }}>
            <Text style={{ color: "white", marginTop: "4px" }}>
                <Cross2Icon onClick={onCloseHandler} />
            </Text>
            <Text style={{ color: "white" }}>{props.text}</Text>
        </Flex>
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
