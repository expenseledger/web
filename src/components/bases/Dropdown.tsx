import React, { ReactNode } from "react";
import { Select } from "@radix-ui/themes";

interface DropdownProps {
    options: string[];
    updateSelectedValue: (value: string) => void;
    className?: string;
    variant?: DropdownVariant;
    defaultValue?: string;
}

type DropdownVariant = "classic" | "surface" | "soft" | "ghost";

const Dropdown: React.FC<DropdownProps> = (props) => {
    const [value, setValue] = React.useState(props.defaultValue ?? props.options[0]);
    const onChangeHandler = (value: string) => {
        props.updateSelectedValue(value);
        setValue(value);
    };

    const renderOptions = (options: string[]): ReactNode[] =>
        options.map((option, idx) => (
            <Select.Item key={idx} value={option}>
                {option}
            </Select.Item>
        ));

    React.useEffect(() => {
        const isExist = props.options.includes(value);

        if (!isExist) {
            setValue(props.options[0]);
            props.updateSelectedValue(props.options[0]);
        }
    }, [props, value]);

    return (
        <Select.Root
            onValueChange={onChangeHandler}
            defaultValue={props.defaultValue ?? props.options[0]}
            size="3"
            value={value}>
            <Select.Trigger variant={props.variant ?? "surface"} />
            <Select.Content className={props.className} position="popper" side="bottom">
                {renderOptions(props.options)}
            </Select.Content>
        </Select.Root>
    );
};

export default Dropdown;
