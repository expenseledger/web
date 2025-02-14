import React from "react";
import { toastState } from "../../common/shareState";
import { combineClassName } from "../../common/utils";
import Notification, { NotificationProps } from "./Notification";
import "./Toast.scss";
import { useAtom } from "jotai";

interface ToastProps {
    position: Position;
}

function getNotificationList(
    notiList: NotificationProps[],
    position: Position,
    onNotificationRemove: (idx: string) => void
) {
    switch (position) {
        case "top-left":
        case "top-right":
            return notiList.map((t) => (
                <Notification
                    key={t.id}
                    id={t.id}
                    text={t.text}
                    showClassName={combineClassName(
                        t.showClassName,
                        `notification--show-${position}`
                    )}
                    hideClassName={combineClassName(
                        t.showClassName,
                        `notification--hide-${position}`
                    )}
                    type={t.type}
                    onClose={onNotificationRemove}
                />
            ));
        case "bottom-left":
        case "bottom-right":
            return notiList
                .reverse()
                .map((t) => (
                    <Notification
                        key={t.id}
                        id={t.id}
                        text={t.text}
                        showClassName={combineClassName(
                            t.showClassName,
                            `notification--show-${position}`
                        )}
                        hideClassName={combineClassName(
                            t.showClassName,
                            `notification--hide-${position}`
                        )}
                        type={t.type}
                        onClose={onNotificationRemove}
                    />
                ));
    }
}

const Toast: React.FC<ToastProps> = (props) => {
    const [notificationList, setNotificationList] = useAtom(toastState);
    const notifications = getNotificationList(notificationList, props.position, (id) => {
        setNotificationList(notificationList.filter((x) => x.id !== id));
    });
    const className = combineClassName("toast", `toast--${props.position}`);

    return <div className={className}>{notifications}</div>;
};

type Position = "top-right" | "top-left" | "bottom-left" | "bottom-right";

export default Toast;
