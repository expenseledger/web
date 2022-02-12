import React from "react";
import { combineClassName } from "../../common/utils";

interface DropdownProps {
    options: string[];
    updateSelectedValue: (value: string) => void;
    className?: string;
    value: string;
}

const Dropdown: React.FC<DropdownProps> = (props) => {
    const [value, setValue] = React.useState(props.value);
    const onChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        props.updateSelectedValue(e.target.value);
        setValue(e.target.value);
    };

    const classNames = combineClassName("field", !!props.className ? props.className : "");

    const renderOptions = (options: string[]): JSX.Element[] =>
        options.map((option, idx) => <option key={idx}>{option}</option>);

    return (
        <div className={classNames}>
            <div className="control select">
                <select onChange={onChangeHandler} value={value}>
                    {renderOptions(props.options)}
                </select>
            </div>
        </div>
    );
};

export default Dropdown;
