import * as React from "react";
import { combineClassName } from "../../service/Utils";

export interface NotificationProps {
    text: React.ReactNode | string;
    type: NotificationType;
    className?: string;
}

export interface NotificationPropsWithOnclose extends NotificationProps {
    onClose?: () => Promise<void> | void;
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
    const className = combineClassName([
        "notification",
        mapTypeToClassname(props.type),
        props.className
    ]);

    const onCloseHandler = () => {
        props.onClose && props.onClose();
    };

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            props.onClose && props.onClose();
        }, 3000);

        return () => clearTimeout(timeout);
    }, [props]);

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
