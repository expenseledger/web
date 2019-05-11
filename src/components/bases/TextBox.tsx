import React from "react";
import { useInput } from "../../service/Utils";

interface ITextBoxProps {
    name: string;
    placeholder?: string;
    updateValue: (value: string) => void;
}

const TextBox = (props: ITextBoxProps) => {
    const { bind } = useInput("", props.updateValue);

    return (
        <div className="field">
            <div className="control">
                <input
                    className="input is-rounded"
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