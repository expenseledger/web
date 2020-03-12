import * as React from "react";
import { combineClassName } from "../../service/Utils";
import Notification, { NotificationProps } from "./Notification";
import "./Toast.scss";

interface ToastProps {
    toastList: NotificationProps[];
    position: Position;
}

function getNotificationList(
    notiList: NotificationProps[],
    position: Position
) {
    switch (position) {
        case "top-left":
        case "top-right":
            return notiList.map((t, idx) => (
                <Notification
                    key={idx}
                    text={t.text}
                    className={combineClassName([
                        t.className,
                        "notification",
                        `notification--${position}`
                    ])}
                    type={t.type}
                    onClose={t.onClose}
                />
            ));
        case "bottom-left":
        case "bottom-right":
            return notiList
                .reverse()
                .map((t, idx) => (
                    <Notification
                        key={idx}
                        text={t.text}
                        className={combineClassName([
                            t.className,
                            "notification",
                            `notification--${position}`
                        ])}
                        type={t.type}
                        onClose={t.onClose}
                    />
                ));
    }
}

function Toast(props: ToastProps) {
    const notifications = getNotificationList(props.toastList, props.position);
    const className = combineClassName(["toast", `toast--${props.position}`]);

    return <div className={className}>{notifications}</div>;
}

type Position = "top-right" | "top-left" | "bottom-left" | "bottom-right";

export default Toast;
