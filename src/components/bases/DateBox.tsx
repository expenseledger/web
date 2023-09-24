import React from "react";
import { useInput } from "../../common/utils";
import dayjs from "../../lib/dayjs";
import { TextField } from "@radix-ui/themes";
import { styled } from "styled-components";

interface DateBoxProps {
    name: string;
    value?: string;
    updateValue: (value: string) => void;
    className?: string;
}

const Input = styled(TextField.Input)`
    padding: 7px;
`;

const DateBox: React.FC<DateBoxProps> = (props) => {
    const { bind, setValue } = useInput(dayjs().format("YYYY-MM-DD"), props.updateValue);

    React.useEffect(() => {
        props.value && setValue(props.value);
    }, [props.value, setValue]);

    return (
        <TextField.Root>
            <Input className={props.className} type="date" name={props.name} {...bind} size="3" />
        </TextField.Root>
    );
};

export default DateBox;
