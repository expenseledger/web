import dayjs from "dayjs";
import React from "react";
import { combineClassName, useInput } from "../../common/utils";

interface DateBoxProps {
    name: string;
    value?: string;
    updateValue: (value: string) => void;
    className?: string;
}

const DateBox: React.FC<DateBoxProps> = (props) => {
    const { bind, setValue } = useInput(
        dayjs().format("YYYY-MM-DD"),
        props.updateValue
    );
    const classNames = combineClassName(
        "field",
        !!props.className ? props.className : ""
    );

    React.useEffect(() => {
        props.value && setValue(props.value);
    }, [props.value, setValue]);

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
