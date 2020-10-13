import React from "react";
import { combineClassName, useInput } from "../../service/Utils";

interface TextBoxWithButtonProps {
    className?: string;
    onClick?: (value: string) => Promise<void> | void;
}

const TextBoxWithButton: React.FC<TextBoxWithButtonProps> = (props) => {
    const { bind, value } = useInput("");
    const className = combineClassName("field", "has-addons", props.className);

    return (
        <div className={className}>
            <div className="control">
                <input
                    className="input"
                    type="text"
                    placeholder="Category's name"
                    {...bind}
                />
            </div>
            <div className="control">
                <button
                    onClick={() => props.onClick && props.onClick(value)}
                    className="button is-info"
                >
                    Create
                </button>
            </div>
        </div>
    );
};

export default TextBoxWithButton;
