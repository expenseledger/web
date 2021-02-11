import React from "react";
import { combineClassName, useInput } from "../../common/uils";

interface TextBoxProps {
    name: string;
    placeholder?: string;
    updateValue: (value: string) => void;
    className?: string;
    type?: string;
    defaultValue?: string;
}

const TextBox: React.FC<TextBoxProps> = (props) => {
    const { bind } = useInput(props.defaultValue ?? "", props.updateValue);
    const classNames = combineClassName(
        "field",
        !!props.className ? props.className : ""
    );

    return (
        <div className={classNames}>
            <div className="control">
                <input
                    className="input"
                    name={props.name}
                    type={props.type ?? "text"}
                    placeholder={props.placeholder}
                    {...bind}
                />
            </div>
        </div>
    );
};

export default TextBox;
