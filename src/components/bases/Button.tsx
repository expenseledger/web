import React from "react";
import { Button as RadixButton } from "@radix-ui/themes";
import "./Button.scss";

interface ButtonProps {
    value: string;
    type?: ButtonType;
    variant?: ButtonVariant;
    onClickHandler?: (e: React.MouseEvent) => void;
    className?: string;
    size?: ButtonSize;
    isLoading?: boolean;
}

export type ButtonVariant = "classic" | "solid" | "soft" | "surface" | "outline" | "ghost";

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
                return "indigo";
            default:
                return "gray";
        }
    };

    return (
        <RadixButton
            className={props.className}
            onClick={props.onClickHandler}
            size={getSize()}
            color={getColor()}
            variant={props.variant ?? "solid"}>
            {props.isLoading ? <LoadingRing /> : props.value}
        </RadixButton>
    );
};

const LoadingRing: React.FC = () => {
    return (
        <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
};

export default Button;
