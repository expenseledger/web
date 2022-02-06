import React from "react";
import { combineClassName } from "../../common/utils";

interface DropdownProps {
    options: string[];
    updateSelectedValue: (value: string) => void;
    className?: string;
    defaultValue: string;
}

const Dropdown: React.FC<DropdownProps> = (props) => {
    const onChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        props.updateSelectedValue(e.target.value);
    };

    const classNames = combineClassName("field", !!props.className ? props.className : "");

    const renderOptions = (options: string[]): JSX.Element[] =>
        options.map((option, idx) => <option key={idx}>{option}</option>);

    return (
        <div className={classNames}>
            <div className="control select">
                <select onChange={onChangeHandler} value={props.defaultValue}>
                    {renderOptions(props.options)}
                </select>
            </div>
        </div>
    );
};

export default Dropdown;
