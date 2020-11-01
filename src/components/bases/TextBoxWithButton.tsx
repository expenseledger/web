import React from "react";
import { combineClassName, useInput } from "../../service/Utils";
import Button, { ButtonType } from "./Button";

interface TextBoxWithButtonProps {
    className?: string;
    onClick?: (value: string) => Promise<void> | void;
    dropdown?: string[];
    name: string;
    placeholder?: string;
    type?: string;
    defaultValue?: string;
    buttonText: string;
    buttonType: ButtonType;
}

const TextBoxWithButton: React.FC<TextBoxWithButtonProps> = (props) => {
    const { bind, value } = useInput(props.defaultValue ?? "");
    const className = combineClassName("field", "has-addons", props.className);
    const renderDropdown = () =>
        props.dropdown && props.dropdown.length !== 0 ? (
            <div className="control">
                <span className="select">
                    <select>
                        {props.dropdown.map((x, idx) => (
                            <option key={idx}>{x}</option>
                        ))}
                    </select>
                </span>
            </div>
        ) : null;

    return (
        <div className={className}>
            {renderDropdown()}
            <div className="control">
                <input
                    name={props.name}
                    className="input"
                    type={props.type ?? "text"}
                    placeholder={props.placeholder ?? ""}
                    {...bind}
                />
            </div>
            <div className="control">
                <Button
                    type={props.buttonType}
                    value={props.buttonText}
                    onClickHandler={() => props.onClick && props.onClick(value)}
                />
            </div>
        </div>
    );
};

export default TextBoxWithButton;
