import { Switch as RadixSwitch, Text, Flex } from "@radix-ui/themes";

interface SwitchProps {
    name: string;
    label?: string;
    isOn: boolean;
    onChange: () => void;
    isRounded?: boolean;
    isRtl?: boolean;
    size?: Size;
}

type Size = "default" | "small" | "medium" | "large";

const Switch: React.FC<SwitchProps> = (props) => {
    const getSize = () => {
        switch (props.size) {
            case "small":
                return "1";
            case "medium":
                return "2";
            case "large":
                return "3";
            default:
                return "2";
        }
    };
    const rounded = props.isRounded ? "full" : "medium";

    return (
        <Text size={getSize()}>
            <label>
                {props.isRtl && <Text mr="2">{props.label}</Text>}
                <RadixSwitch
                    checked={props.isOn}
                    size={getSize()}
                    radius={rounded}
                    name={props.name}
                    onChange={props.onChange}
                />
                {!props.isRtl && <Text ml="2">{props.label}</Text>}
            </label>
        </Text>
    );
};

export default Switch;
