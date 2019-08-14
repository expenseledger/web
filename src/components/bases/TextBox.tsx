import React from "react";
import { combineClassName, useInput } from "../../service/Utils";

interface TextBoxProps {
    name: string;
    placeholder?: string;
    updateValue: (value: string) => void;
    className?: string;
    type?: string;
}

const TextBox = (props: TextBoxProps) => {
    const { bind } = useInput("", props.updateValue);
    const classNames = combineClassName([
        "field",
        !!props.className ? props.className : ""
    ]);

    return (
        <div className={classNames}>
            <div className="control">
                <input
                    className="input"
                    name={props.name}
                    type={props.type ? props.type : "text"}
                    placeholder={props.placeholder}
                    {...bind}
                />
            </div>
        </div>
    );
};

export default TextBox;
