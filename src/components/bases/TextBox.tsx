import React from "react";
import { combineClassName, useInput } from "../../common/utils";

interface TextBoxProps {
    name: string;
    placeholder?: string;
    updateValue: (value: string) => void;
    className?: string;
    type?: string;
    defaultValue?: string;
    value?: string;
    addOn?: string;
}

const TextBox: React.FC<TextBoxProps> = (props) => {
    const { bind, setValue } = useInput(
        props.defaultValue ?? "",
        props.updateValue
    );
    const classNames = combineClassName(
        "field",
        props.addOn && "has-addons",
        props.className
    );

    React.useEffect(() => {
        setValue(props.value);
    }, [props.value, setValue]);

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
