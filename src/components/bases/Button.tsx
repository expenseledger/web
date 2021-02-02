import React from "react";
import { combineClassName } from "../../service/uils";

interface ButtonProps {
    value: string;
    type?: ButtonType;
    outlined?: boolean;
    onClickHandler?: (e: React.MouseEvent) => void;
    className?: string;
    size?: ButtonSize;
}

export type ButtonType =
    | "primary"
    | "info"
    | "link"
    | "success"
    | "danger"
    | "default";

export type ButtonSize = "small" | "normal" | "medium" | "large";

const Button: React.FC<ButtonProps> = (props) => {
    const classNames = combineClassName(
        "button",
        props.type ? `is-${props.type}` : "",
        props.outlined ? "is-outlined" : "",
        props.className ?? "",
        props.size ? `is-${props.size}` : ""
    );

    return (
        <button className={classNames} onClick={props.onClickHandler}>
            {props.value}
        </button>
    );
};

export default Button;
