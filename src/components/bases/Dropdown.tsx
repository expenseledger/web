import React from "react";
import { combineClassName } from "../../common/uils";

interface DropdownProps {
    options: string[];
    updateSelectedValue: (value: string) => void;
    className?: string;
    default?: string;
}

const Dropdown: React.FC<DropdownProps> = (props) => {
    const onChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        props.updateSelectedValue(e.target.value);
    };

    const classNames = combineClassName(
        "field",
        !!props.className ? props.className : ""
    );

    const renderOptions = (options: string[]): JSX.Element[] => {
        return options.map((option, idx) => {
            if (props.default && props.default === option) {
                return <option key={idx}>{option}</option>;
            }

            return <option key={idx}>{option}</option>;
        });
    };

    return (
        <div className={classNames}>
            <div className="control select">
                <select
                    defaultValue={
                        !!props.default ? props.default : props.options[0]
                    }
                    onChange={onChangeHandler}
                >
                    {renderOptions(props.options)}
                </select>
            </div>
        </div>
    );
};

export default Dropdown;
