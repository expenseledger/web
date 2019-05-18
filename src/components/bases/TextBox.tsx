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
        "field",
        !!props.className ? props.className : "",
    ]);

    return (
        <div className={classNames}>
            <div className="control">
                <input
                    className="input"
                    name={props.name}
                    type="text"
                    placeholder={props.placeholder}
                    {...bind}
                />
            </div>
        </div>
    );
};

export default TextBox;