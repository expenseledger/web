import React, { useState } from "react";
import { combineClassName, useInput } from "../../service/uils";
import Button, { ButtonType } from "./Button";

interface TextBoxWithButtonProps {
    className?: string;
    onClick?: (value: string, dropdownValue?: string) => Promise<void> | void;
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
    const [dropdownValue, setDropdownValue] = useState(
        props.dropdown && props.dropdown.length !== 0 ? props.dropdown[0] : ""
    );
    const className = combineClassName("field", "has-addons", props.className);
    const renderDropdown = () =>
        props.dropdown && props.dropdown.length !== 0 ? (
            <div className="control">
                <span className="select">
                    <select
                        defaultValue={dropdownValue}
                        onChange={(x) => setDropdownValue(x.target.value)}
                    >
                        {props.dropdown.map((x, idx) => (
                            <option key={idx} value={x}>
                                {x}
                            </option>
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
                    onClickHandler={() =>
                        props.onClick && props.onClick(value, dropdownValue)
                    }
                />
            </div>
        </div>
    );
};

export default TextBoxWithButton;
