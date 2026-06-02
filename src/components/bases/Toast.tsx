import React from "react";
import { toastState } from "../../common/shareState";
import { combineClassName } from "../../common/utils";
import Notification, { NotificationProps } from "./Notification";
import styled from "styled-components";
import { useAtom } from "jotai";

interface ToastProps {
    position: Position;
}

const ToastContainer = styled.div<{ position: Position }>`
    position: fixed;
    z-index: 11;
    ${(props) => {
        switch (props.position) {
            case "top-right":
                return `top: 10px; right: 10px;`;
            case "top-left":
                return `top: 10px; left: 10px;`;
            case "bottom-right":
                return `bottom: 10px; right: 10px;`;
            case "bottom-left":
                return `bottom: 10px; left: 10px;`;
        }
    }}
`;

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
        setNotificationList((prev) => prev.filter((x) => x.id !== id));
    });

    return <ToastContainer position={props.position}>{notifications}</ToastContainer>;
};

type Position = "top-right" | "top-left" | "bottom-left" | "bottom-right";

export default Toast;
