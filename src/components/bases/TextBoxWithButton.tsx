import React from "react";
import { combineClassName, useInput } from "../../common/utils";
import Button, { ButtonType } from "./Button";

interface TextBoxWithButtonProps {
    className?: string;
    onClick?: (value: string, dropdownValue?: string) => Promise<void>;
    dropdown?: string[];
    name: string;
    placeholder?: string;
    type?: string;
    defaultValue?: string;
    buttonText: string;
    buttonType: ButtonType;
    value?: string;
}

const TextBoxWithButton: React.FC<TextBoxWithButtonProps> = (props) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const { bind, value, setValue } = useInput(props.defaultValue ?? "");
    const [dropdownValue, setDropdownValue] = React.useState(
        props.dropdown && props.dropdown.length !== 0 ? props.dropdown[0] : ""
    );
    const className = combineClassName("field", "has-addons", props.className);
    const renderDropdown = () =>
        props.dropdown && props.dropdown.length !== 0 ? (
            <div className="control">
                <span className="select">
                    <select
                        defaultValue={dropdownValue}
                        onChange={(x) => setDropdownValue(x.target.value)}>
                        {props.dropdown.map((x, idx) => (
                            <option key={idx} value={x}>
                                {x}
                            </option>
                        ))}
                    </select>
                </span>
            </div>
        ) : null;
    const onClickHandler = async () => {
        if (!props.onClick) {
            return;
        }

        setIsLoading(true);

        await props.onClick(value, dropdownValue);

        setIsLoading(false);
        setValue("");
    };

    React.useEffect(() => {
        props.value && setValue(props.value);
    }, [props.value, setValue]);

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
                    className={`${isLoading ? "is-loading" : ""}`}
                    type={props.buttonType}
                    value={props.buttonText}
                    onClickHandler={onClickHandler}
                />
            </div>
        </div>
    );
};

export default TextBoxWithButton;
