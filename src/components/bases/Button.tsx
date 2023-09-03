import React from "react";
import { Button as RadixButton } from "@radix-ui/themes";

interface ButtonProps {
    value: string;
    type?: ButtonType;
    outlined?: boolean;
    onClickHandler?: (e: React.MouseEvent) => void;
    className?: string;
    size?: ButtonSize;
}

export type ButtonType = "primary" | "info" | "link" | "success" | "danger" | "default";

export type ButtonSize = "small" | "normal" | "medium" | "large";

const Button: React.FC<ButtonProps> = (props) => {
    const getSize = () => {
        switch (props.size) {
            case "small":
                return "1";
            case "normal":
                return "2";
            case "medium":
                return "3";
            case "large":
                return "4";
            default:
                return "2";
        }
    };

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
            default:
                return "indigo";
        }
    };

    return (
        <RadixButton
            onClick={props.onClickHandler}
            size={getSize()}
            color={getColor()}
            variant={props.outlined ? "outline" : "solid"}>
            {props.value}
        </RadixButton>
    );
};

export default Button;
