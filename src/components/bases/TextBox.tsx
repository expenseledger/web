import * as React from 'react';

interface ITextBoxProps {
    name: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const textBox = (props: ITextBoxProps) => {
    return (
        <div className="field">
            <div className="control">
                <input
                    className="input is-rounded"
                    name={props.name}
                    type="text"
                    placeholder={props.placeholder}
                    onChange={props.onChange}
                    value={props.value}
                />
            </div>
        </div>
    );
}

export default textBox;