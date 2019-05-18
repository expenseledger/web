import * as React from "react";
import { combineClassName } from "../../service/Utils";

interface IButtonProps {
    value: string;
    outlined?: boolean;
    onClickHandler?: (e: React.MouseEvent) => void;
    className?: string;
}

const button = (props: IButtonProps) => {
    const classNames = combineClassName([
        "button",
        "is-primary",
        !!props.outlined ? "is-outlined" : "",
        !!props.className ? props.className : "",
    ]);

    return (
        <button className={classNames} onClick={props.onClickHandler}>{props.value}</button>
    );
};

export default button;