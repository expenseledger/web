import React from "react";
import { combineClassName, useInput } from "../../common/utils";
import { TextField } from "@radix-ui/themes";
import { styled } from "styled-components";

type Position = "front" | "back" | "none";

interface AddOn {
    text: string;
    position: Position;
}

interface TextBoxProps {
    name: string;
    placeholder?: string;
    updateValue: (value: string) => void;
    className?: string;
    type?: string;
    defaultValue?: string;
    value?: string;
    addOn?: AddOn;
}

const Input = styled(TextField.Input)`
    padding-right: var(--space-3);
`;

const TextBox: React.FC<TextBoxProps> = (props) => {
    const { bind, setValue } = useInput(props.defaultValue ?? "", props.updateValue);
    const addonPosition = props.addOn?.position ?? "none";

    React.useEffect(() => {
        setValue(props.value);
    }, [props.value, setValue]);

    return (
        <TextField.Root>
            {addonPosition === "front" && (
                <TextField.Slot>
                    <span>{props.addOn.text}</span>
                </TextField.Slot>
            )}
            <Input
                className={props.className}
                placeholder={props.placeholder}
                size="3"
                type={props.type ?? "text"}
                name={props.name}
                {...(props.type === "number" ? { inputMode: "decimal" } : null)}
                {...bind}
            />
            {addonPosition === "back" && (
                <TextField.Slot>
                    <span>{props.addOn.text}</span>
                </TextField.Slot>
            )}
        </TextField.Root>
    );
};

export default TextBox;
