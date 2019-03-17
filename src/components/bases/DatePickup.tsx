import moment from "moment";
import * as React from "react";

interface IDatePickupProps {
    name: string;
    value?: string;
    updateValue: (value: string) => void;
}

const datePickup = (props: IDatePickupProps) => {
    const [value, setValue] = React.useState(moment().format('L'));

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
                    value={props.value ? props.value : new Date().toISOString().slice(0, 10)}
                />
            </div>
        </div>
    );
}

export default datePickup;