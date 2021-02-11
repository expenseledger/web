import dayjs from "dayjs";
import React from "react";
import { combineClassName, useInput } from "../../common/uils";

interface DateBoxProps {
    name: string;
    value?: string;
    updateValue: (value: string) => void;
    className?: string;
}

const DateBox: React.FC<DateBoxProps> = (props) => {
    const { bind } = useInput(dayjs().format("YYYY-MM-DD"), props.updateValue);
    const classNames = combineClassName(
        "field",
        !!props.className ? props.className : ""
    );

    return (
        <div className={classNames}>
            <div className="control">
                <input
                    className="input"
                    name={props.name}
                    type="date"
                    {...bind}
                />
            </div>
        </div>
    );
};

export default DateBox;
