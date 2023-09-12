import { Flex, Switch as RadixSwitch, Text } from "@radix-ui/themes";

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
                <Flex align="center">
                    {props.isRtl && (
                        <Text mr="2" id={props.name}>
                            {props.label}
                        </Text>
                    )}
                    <RadixSwitch
                        id={props.name}
                        checked={props.isOn}
                        size={getSize()}
                        radius={rounded}
                        name={props.name}
                        onCheckedChange={props.onChange}
                    />
                    {!props.isRtl && (
                        <Text ml="2" id={props.name}>
                            {props.label}
                        </Text>
                    )}
                </Flex>
            </label>
        </Text>
    );
};

export default Switch;
