import * as React from "react";
import { combineClassName } from "../../service/Utils";
import PropTypes from "prop-types";

interface DropdownProps {
    options: string[];
    updateSelectedValue: (value: string) => void;
    className?: string;
    default?: string;
}

const dropdown = (props: DropdownProps) => {
    function onChangeHandler(e: React.ChangeEvent<HTMLSelectElement>) {
        props.updateSelectedValue(e.target.value);
    }

    const classNames = combineClassName([
        "field",
        !!props.className ? props.className : ""
    ]);

    function renderOptions(options: string[]): JSX.Element[] {
        return options.map((option, idx) => {
            if (props.default && props.default === option) {
                return <option key={idx}>{option}</option>;
            }

            return <option key={idx}>{option}</option>;
        });
    }

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

dropdown.propType = {
    options: PropTypes.arrayOf(PropTypes.string),
    updateSelectedValue: PropTypes.func
};

export default dropdown;
