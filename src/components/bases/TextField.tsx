import * as React from 'react';

interface ITextFieldProps {
    name: string;
    placeholder?: string;
    updateValue: (value: string) => void;
}

const textField = (props: ITextFieldProps) => {
    const [value, setValue] = React.useState('');

    function onChangeHandler(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setValue(e.target.value);
        props.updateValue(value);
    }

    return (
        <div className="field">
            <div className="control">
                <textarea
                    className="input is-rounded"
                    name={props.name}
                    placeholder={props.placeholder}
                    onChange={onChangeHandler}
                />
            </div>
        </div>
    );
}

export default textField;