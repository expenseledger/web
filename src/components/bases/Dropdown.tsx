import * as React from "react";
import { combineClassName } from "../../service/Utils";

interface IDropdownProps {
    options: string[];
    updateSelectedValue: (value: string) => void;
    className?: string;
}

const dropdown = (props: IDropdownProps) => {
    function onChangeHandler(e: React.ChangeEvent<HTMLSelectElement>) {
        props.updateSelectedValue(e.target.value);
    }

    const classNames = combineClassName([
        "field",
        !!props.className ? props.className : null,
    ]);

    return (
        <div className={classNames}>
            <div className="control select">
                <select onChange={onChangeHandler}>
                    {
                        props.options.map((option, idx) => <option key={idx}>{option}</option>)
                    }
                </select>
            </div>
        </div>
    )
}

export default dropdown;