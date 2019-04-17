import * as React from 'react';

interface IDropdownProps {
    options: string[];
    updateSelectedValue: (value: string) => void;
}

const dropdown = (props: IDropdownProps) => {
    function onChangeHandler(e: React.ChangeEvent<HTMLSelectElement>) {
        props.updateSelectedValue(e.target.value);
    }

    return (
        <div className="field">
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