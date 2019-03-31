import * as React from 'react';

interface IDropdownProps {
    options: string[];
    updateSelectedValue: (value: string) => void;
}

const dropdown = (props: IDropdownProps) => {
    const [value, setValue] = React.useState(props.options[0]);

    if (props.options.length !== 0) {
        props.updateSelectedValue(props.options[0]);
    }

    function onChangeHandler(e: React.ChangeEvent<HTMLSelectElement>) {
        setValue(e.target.value);
        props.updateSelectedValue(value);
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