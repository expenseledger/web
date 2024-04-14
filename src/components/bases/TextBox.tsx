import React from "react";
import { useInput } from "../../common/utils";
import { TextField } from "@radix-ui/themes";
import { RootProps } from "@radix-ui/themes/dist/cjs/components/text-field.d";
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
    type?: RootProps["type"];
    defaultValue?: string;
    value?: string;
    addOn?: AddOn;
}

const TextBox: React.FC<TextBoxProps> = (props) => {
    const { bind, setValue } = useInput(props.defaultValue ?? "", props.updateValue);
    const addonPosition = props.addOn?.position ?? "none";

    React.useEffect(() => {
        setValue(props.value);
    }, [props.value, setValue]);

    return (
        <TextField.Root  
            className={props.className}
            placeholder={props.placeholder}
            size="3"
            type={props.type ?? "text"}
            name={props.name}
            {...(props.type === "number" ? { inputMode: "decimal" } : null)}
            {...bind}
        >
            {addonPosition === "front" && (
                <TextField.Slot>
                    <span>{props.addOn.text}</span>
                </TextField.Slot>
            )}
        
            {addonPosition === "back" && (
                <TextField.Slot>
                    <span>{props.addOn.text}</span>
                </TextField.Slot>
            )}
        </TextField.Root>
    );
};

export default TextBox;
