import * as React from "react";
import { combineClassName } from "../../service/Utils";
import Notification, { NotificationProps } from "./Notification";
import "./Toast.scss";

interface ToastProps {
    toastList: NotificationProps[];
    position: Position;
    onNotificationRemove: (idx: number) => Promise<void> | void;
}

function getNotificationList(props: ToastProps) {
    switch (props.position) {
        case "top-left":
        case "top-right":
            return props.toastList.map((t, idx) => (
                <Notification
                    key={idx}
                    text={t.text}
                    className={combineClassName([
                        t.className,
                        "notification",
                        `notification--${props.position}`
                    ])}
                    type={t.type}
                    onClose={() => props.onNotificationRemove(idx)}
                />
            ));
        case "bottom-left":
        case "bottom-right":
            return props.toastList
                .reverse()
                .map((t, idx) => (
                    <Notification
                        key={idx}
                        text={t.text}
                        className={combineClassName([
                            t.className,
                            "notification",
                            `notification--${props.position}`
                        ])}
                        type={t.type}
                        onClose={() => props.onNotificationRemove(idx)}
                    />
                ));
    }
}

function Toast(props: ToastProps) {
    const notifications = getNotificationList(props);
    const className = combineClassName(["toast", `toast--${props.position}`]);

    return <div className={className}>{notifications}</div>;
}

type Position = "top-right" | "top-left" | "bottom-left" | "bottom-right";

export default Toast;
