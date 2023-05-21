interface SwitchProps {
    name: string;
    label?: string;
    isOn: boolean;
    onChange: () => void;
    isRounded?: boolean;
    isOutlined?: boolean;
    isRtl?: boolean;
    size?: Size;
}

type Size = "default" | "small" | "mediem" | "large";

const Switch: React.FC<SwitchProps> = (props) => {
    const size = props.size && props.size !== "default" ? `is-${props.size}` : "";
    const rounded = props.isRounded ? "is-rounded" : "";
    const outlined = props.isOutlined ? "is-outlined" : "";
    const rtl = props.isRtl ? "is-rtl" : "";
    const className = `switch ${size} ${rounded} ${outlined} ${rtl}`.trim();

    return (
        <>
            <input
                id={props.name}
                type="checkbox"
                name={props.name}
                className={className}
                checked={props.isOn}
                onChange={props.onChange}
            />
            <label id={props.name} htmlFor={props.name}>
                {props.label ?? " "}
            </label>
        </>
    );
};

export default Switch;
