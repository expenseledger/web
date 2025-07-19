import React from "react";
import { useInput } from "../../common/utils";
import Button, { ButtonType } from "./Button";
import { Separator, TextField } from "@radix-ui/themes";
import { RootProps } from "@radix-ui/themes/dist/cjs/components/text-field";
import Dropdown from "./Dropdown";

interface TextBoxWithButtonProps {
    className?: string;
    onClick?: (value: string, dropdownValue?: string) => Promise<void>;
    dropdown?: string[];
    name: string;
    placeholder?: string;
    type?: RootProps["type"];
    defaultValue?: string;
    buttonText: string;
    buttonType: ButtonType;
    value?: string;
}

const TextBoxWithButton: React.FC<TextBoxWithButtonProps> = (props) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const { bind, value, setValue } = useInput(props.defaultValue ?? "");
    const [dropdownValue, setDropdownValue] = React.useState(
        props.dropdown && props.dropdown.length !== 0 ? props.dropdown[0] : ""
    );
    const renderDropdown = () =>
        props.dropdown && props.dropdown.length !== 0 ? (
            <Dropdown
                options={props.dropdown}
                updateSelectedValue={(x) => setDropdownValue(x)}
                variant="ghost"
            />
        ) : null;
    const onClickHandler = async () => {
        if (!props.onClick) {
            return;
        }

        setIsLoading(true);

        await props.onClick(value, dropdownValue);

        setIsLoading(false);
        setValue("");
    };

    React.useEffect(() => {
        props.value && setValue(props.value);
    }, [props.value, setValue]);

    return (
        <TextField.Root
            name={props.name}
            type={props.type ?? "text"}
            placeholder={props.placeholder ?? ""}
            size="3"
            {...bind}>
            <TextField.Slot pl="3">
                {renderDropdown()}
                <Separator orientation="vertical" />
            </TextField.Slot>
            <TextField.Slot px="4">
                <Button
                    type={props.buttonType}
                    value={props.buttonText}
                    onClickHandler={onClickHandler}
                    variant="ghost"
                    isLoading={isLoading}
                />
            </TextField.Slot>
        </TextField.Root>
    );
};

export default TextBoxWithButton;
