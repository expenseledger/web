import React from "react";
import { combineClassName, useInput } from "../../service/Utils";

interface ITextBoxProps {
    name: string;
    placeholder?: string;
    updateValue: (value: string) => void;
    className?: string;
}

const TextBox = (props: ITextBoxProps) => {
    const { bind } = useInput("", props.updateValue);
    const classNames = combineClassName([
        "input",
        "is-rounded",
        !!props.className ? props.className : null,
    ]);

    return (
        <div className="field">
            <div className="control">
                <input
                    className={classNames}
                    name={props.name}
                    type="text"
                    placeholder={props.placeholder}
                    {...bind}
                />
            </div>
        </div>
    );
}

export default TextBox;