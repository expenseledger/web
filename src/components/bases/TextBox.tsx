import * as React from 'react';

interface ITextBoxProps {
    name: string;
    placeholder?: string;
    updateValue: (value: string) => void;
}

const textBox = (props: ITextBoxProps) => {
    const [value, setValue] = React.useState('');

    function onChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
        setValue(e.target.value);
        props.updateValue(value);
    }

    return (
        <div className="field">
            <div className="control">
                <input
                    className="input is-rounded"
                    name={props.name}
                    type="text"
                    placeholder={props.placeholder}
                    onChange={onChangeHandler}
                />
            </div>
        </div>
    );
}

export default textBox;