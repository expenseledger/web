import * as React from "react";
import { combineClassName } from "../../service/Utils";

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

function mapTypeToClassname(type: NotificationType): string | null {
    switch (type) {
        case "primary":
            return "is-primary";
        case "danger":
            return "is-danger";
        case "info":
            return "is-info";
        case "link":
            return "is-link";
        case "success":
            return "is-success";
        case "warning":
            return "is-warning";
        case "none":
            return null;
    }
}

function Notification(props: NotificationPropsWithOnclose) {
    const showNotificationClassName = combineClassName([
        "notification",
        "notification--show",
        mapTypeToClassname(props.type),
        props.showClassName
    ]);
    const hideNotificationClassName = combineClassName([
        "notification",
        "notification--hide",
        mapTypeToClassname(props.type),
        props.hideClassName
    ]);
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
        <div className={className}>
            <button onClick={onCloseHandler} className="delete"></button>
            {props.text}
        </div>
    );
}

export type NotificationType =
    | "primary"
    | "info"
    | "success"
    | "link"
    | "warning"
    | "danger"
    | "none";

export default Notification;
