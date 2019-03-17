import * as React from 'react';

interface IDropdownProps {
    options: string[];
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const dropdown = (props: IDropdownProps) => {
    if (props.options.length === 0) {
        return null;
    }

    return (
        <div className="field">
            <div className="control select">
                <select onChange={props.onChange}>
                    {
                        props.options.map((option, idx) => <option key={idx}>{option}</option>)
                    }
                </select>
            </div>
        </div>
    )
}

export default dropdown;