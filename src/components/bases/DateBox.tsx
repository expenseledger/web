import moment from "moment";
import * as React from "react";
import { combineClassName, useInput } from "../../service/Utils";

interface IDateBoxProps {
    name: string;
    value?: string;
    updateValue: (value: string) => void;
    className?: string;
}

const DateBox = (props: IDateBoxProps) => {
    const { bind } = useInput(moment().format("YYYY-MM-DD"), props.updateValue);
    const classNames = combineClassName([
        "field",
        !!props.className ? props.className : null,
    ]);

    return (
        <div className={classNames}>
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