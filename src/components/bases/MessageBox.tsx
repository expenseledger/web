import { Callout } from "@radix-ui/themes";
import React from "react";
import { color } from "../../common/constants";

interface Props {
    type: MessageBoxType;
}

type MessageBoxType =
    | "default"
    | "dark"
    | "primary"
    | "link"
    | "info"
    | "success"
    | "warning"
    | "danger";

type MessageBoxProps = React.PropsWithChildren<Props>;

const MessageBox: React.FC<MessageBoxProps> = (props) => {
    const getColor = () => {
        switch (props.type) {
            case "info":
                return "sky";
            case "link":
                return "blue";
            case "success":
                return "green";
            case "danger":
                return "red";
            case "warning":
                return "yellow";
            case "dark":
                return "gray";
            default:
                return color.primary;
        }
    };
    return (
        <Callout.Root color={getColor() as any} style={{ position: "relative", display: "block" }}>
            {props.children}
        </Callout.Root>
    );
};

export default MessageBox;
