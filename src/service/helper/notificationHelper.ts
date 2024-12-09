import * as uuid from "uuid";
import { toastState } from "../../common/shareState";
import { NotificationProps, NotificationType } from "../../components/bases/Notification";
import { useAtom } from "jotai";

export function mapNotificationProps(
    text: React.ReactNode,
    type: NotificationType,
    id?: string
): NotificationProps {
    return {
        text,
        type,
        id: id ?? uuid.v4(),
    };
}

export function useNotification(): {
    addNotification: (message: string, type: NotificationType) => void;
} {
    const [, setNotificationList] = useAtom(toastState);

    return {
        addNotification: (message: string, type: NotificationType) => {
            setNotificationList((prev) => prev.concat(mapNotificationProps(message, type)));
        },
    };
}
