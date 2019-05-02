import moment from "moment";
import * as React from "react";

interface IDateBoxProps {
    name: string;
    value?: string;
    updateValue: (value: string) => void;
}

const dateBox = (props: IDateBoxProps) => {
    const [value, setValue] = React.useState(moment().format('YYYY-MM-DD'));

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
                    type="date"
                    onChange={onChangeHandler}
                    value={value}
                />
            </div>
        </div>
    );
}

export default dateBox;