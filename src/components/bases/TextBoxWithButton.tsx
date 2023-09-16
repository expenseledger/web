import React from "react";
import { useInput } from "../../common/utils";
import Button, { ButtonType } from "./Button";
import { Box, Separator, TextField } from "@radix-ui/themes";
import Dropdown from "./Dropdown";

interface TextBoxWithButtonProps {
    className?: string;
    onClick?: (value: string, dropdownValue?: string) => Promise<void>;
    dropdown?: string[];
    name: string;
    placeholder?: string;
    type?: string;
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
        <>
            <TextField.Root size="3">
                <TextField.Slot>
                    {renderDropdown()}
                    <Separator orientation="vertical" />
                </TextField.Slot>
                <Box py="1">
                    <TextField.Input
                        name={props.name}
                        type={props.type ?? "text"}
                        placeholder={props.placeholder ?? ""}
                        style={{ paddingLeft: "0" }}
                        {...bind}
                    />
                </Box>
                <TextField.Slot>
                    <Button
                        className={`${isLoading ? "is-loading" : ""}`}
                        type={props.buttonType}
                        value={props.buttonText}
                        onClickHandler={onClickHandler}
                        variant="ghost"
                    />
                </TextField.Slot>
            </TextField.Root>
        </>
    );
};

export default TextBoxWithButton;
