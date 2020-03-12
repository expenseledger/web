import {
    NotificationProps,
    NotificationType
} from "../components/bases/Notification";

export function mapNotificationProps(
    text: React.ReactNode,
    type: NotificationType
): NotificationProps {
    return {
        text,
        type
    };
}
