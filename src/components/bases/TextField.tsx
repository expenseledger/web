import * as React from "react";
import { combineClassName, useInput } from "../../service/Utils";

interface ITextFieldProps {
    name: string;
    placeholder?: string;
    updateValue: (value: string) => void;
    className?: string;
}

const TextField = (props: ITextFieldProps) => {
    const { bind } = useInput("", props.updateValue);
    const classNames = combineClassName([
        "field",
        !!props.className ? props.className : "",
    ]);

    return (
        <div className={classNames}>
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
};

export default TextField;