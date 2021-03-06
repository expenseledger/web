import React from "react";
import { combineClassName, useInput } from "../../common/utils";

interface TextFieldProps {
    name: string;
    placeholder?: string;
    updateValue: (value: string) => void;
    className?: string;
    value?: string;
}

const TextField: React.FC<TextFieldProps> = (props) => {
    const { bind, setValue } = useInput("", props.updateValue);
    const inputClass = !!props.className ? props.className : "";
    const classNames = combineClassName("field", inputClass);

    const textAreaClassName = combineClassName("input", inputClass);

    React.useEffect(() => {
        setValue(props.value);
    }, [props.value, setValue]);

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
