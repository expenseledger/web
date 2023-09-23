import { Box, Callout, Flex } from "@radix-ui/themes";
import React from "react";

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
            case "primary":
                return "grass";
            case "warning":
                return "yellow";
            case "dark":
                return "gray";
            default:
                return "indigo";
        }
    };
    return (
        <Callout.Root color={getColor()} style={{ position: "relative", display: "block" }}>
            {props.children}
        </Callout.Root>
    );
};

export default MessageBox;
