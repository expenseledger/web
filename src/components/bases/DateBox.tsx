import moment from "moment";
import * as React from "react";
import { useInput } from "../../service/Utils";

interface IDateBoxProps {
    name: string;
    value?: string;
    updateValue: (value: string) => void;
}

const DateBox = (props: IDateBoxProps) => {
    const { bind } = useInput(moment().format("YYYY-MM-DD"), props.updateValue);

    return (
        <div className="field">
            <div className="control">
                <input
                    className="input is-rounded"
                    name={props.name}
                    type="date"
                    {...bind}
                />
            </div>
        </div>
    );
}

export default DateBox;