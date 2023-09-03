import React from "react";
import { Select } from "@radix-ui/themes";

interface DropdownProps {
    options: string[];
    updateSelectedValue: (value: string) => void;
    className?: string;
    value: string;
}

const Dropdown: React.FC<DropdownProps> = (props) => {
    const onChangeHandler = (value: string) => {
        props.updateSelectedValue(value);
    };

    const renderOptions = (options: string[]): JSX.Element[] =>
        options.map((option, idx) => (
            <Select.Item key={idx} value={option}>
                {option}
            </Select.Item>
        ));

    return (
        <Select.Root onValueChange={onChangeHandler} defaultValue={props.options[0]} size="3">
            <Select.Trigger />
            <Select.Content className={props.className}>
                {renderOptions(props.options)}
            </Select.Content>
        </Select.Root>
    );
};

export default Dropdown;
