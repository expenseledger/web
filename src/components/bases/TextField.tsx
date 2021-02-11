import React from "react";
import { combineClassName, useInput } from "../../common/uils";

interface TextFieldProps {
    name: string;
    placeholder?: string;
    updateValue: (value: string) => void;
    className?: string;
}

const TextField: React.FC<TextFieldProps> = (props) => {
    const { bind } = useInput("", props.updateValue);
    const inputClass = !!props.className ? props.className : "";
    const classNames = combineClassName("field", inputClass);

    const textAreaClassName = combineClassName("input", inputClass);

    return (
        <div className={classNames}>
            <div className="control">
                <textarea
                    className={textAreaClassName}
                    name={props.name}
                    placeholder={props.placeholder}
                    {...bind}
                />
            </div>
        </div>
    );
};

export default TextField;
