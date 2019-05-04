import * as React from "react";
import { useInput } from "../../service/Utils";

interface ITextFieldProps {
    name: string;
    placeholder?: string;
    updateValue: (value: string) => void;
}

const textField = (props: ITextFieldProps) => {
    const { bind } = useInput("", props.updateValue);

    return (
        <div className="field">
            <div className="control">
                <textarea
                    className="input is-rounded"
                    name={props.name}
                    placeholder={props.placeholder}
                    {...bind}
                />
            </div>
        </div>
    );
}

export default textField;