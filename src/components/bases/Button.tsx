import * as React from "react";
import { combineClassName } from "../../service/Utils";

interface ButtonProps {
    value: string;
    type?: ButtonType;
    outlined?: boolean;
    onClickHandler?: (e: React.MouseEvent) => void;
    className?: string;
}

export type ButtonType =
    | "primary"
    | "info"
    | "link"
    | "success"
    | "danger"
    | "default";

const Button: React.FC<ButtonProps> = (props) => {
    const classNames = combineClassName([
        "button",
        props.type ? `is-${props.type}` : "",
        props.outlined ? "is-outlined" : "",
        props.className ? props.className : "",
    ]);

    return (
        <button className={classNames} onClick={props.onClickHandler}>
            {props.value}
        </button>
    );
};

export default Button;
