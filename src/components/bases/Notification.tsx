import React from "react";
import { combineClassName } from "../../common/utils";
import { Callout } from "@radix-ui/themes";
import { Cross2Icon } from "@radix-ui/react-icons";

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

function mapColor(type: NotificationType): any {
    switch (type) {
        case "primary":
            return "grass";
        case "danger":
            return "red";
        case "info":
        case "link":
            return "sky";
        case "success":
            return "green";
        case "warning":
            return "yellow";
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
        <Callout.Root className={className} color={mapColor(props.type)} variant="outline">
            <Callout.Icon>
                <Cross2Icon onClick={onCloseHandler} />
            </Callout.Icon>
            <Callout.Text>{props.text}</Callout.Text>
        </Callout.Root>
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
