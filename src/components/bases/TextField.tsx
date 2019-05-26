import * as React from "react";
import { combineClassName, useInput } from "../../service/Utils";

interface TextFieldProps {
    name: string;
    placeholder?: string;
    updateValue: (value: string) => void;
    className?: string;
}

const TextField = (props: TextFieldProps) => {
    const { bind } = useInput("", props.updateValue);
    const classNames = combineClassName([
        "field",
        !!props.className ? props.className : "",
    ]);

    return (
        <div className={classNames}>
            <div className="control">
                <textarea
                    className="input"
                    name={props.name}
                    placeholder={props.placeholder}
                    {...bind}
                />
            </div>
        </div>
    );
};

export default TextField;