import * as uuid from "uuid";
import {
    NotificationProps,
    NotificationType,
} from "../components/bases/Notification";

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
