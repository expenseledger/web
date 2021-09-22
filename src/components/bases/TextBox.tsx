import React from "react";
import { combineClassName, useInput } from "../../common/utils";

type Position = "front" | "back" | "none";

interface AddOn {
    text: string;
    position: Position;
}

interface TextBoxProps {
    name: string;
    placeholder?: string;
    updateValue: (value: string) => void;
    className?: string;
    type?: string;
    defaultValue?: string;
    value?: string;
    addOn?: AddOn;
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
    const addonPosition = props.addOn?.position ?? "none";

    React.useEffect(() => {
        setValue(props.value);
    }, [props.value, setValue]);

    return (
        <div className={classNames}>
            {addonPosition === "front" && (
                <p className="control">
                    <a className="button is-static">{props.addOn.text}</a>
                </p>
            )}
            <div className="control">
                <input
                    className="input"
                    name={props.name}
                    type={props.type ?? "text"}
                    placeholder={props.placeholder}
                    {...(props.type === "number"
                        ? { inputMode: "decimal" }
                        : null)}
                    {...bind}
                />
            </div>
            {addonPosition === "back" && (
                <p className="control">
                    <a className="button is-static">{props.addOn.text}</a>
                </p>
            )}
        </div>
    );
};

export default TextBox;
