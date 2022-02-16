import React from "react";
import styled from "styled-components";

interface MessageBoxProps {
    type: MessageBoxType;
}

type MessageBoxType =
    | "default"
    | "dark"
    | "primary"
    | "link"
    | "info"
    | "success"
    | "warning"
    | "danger";

const Body = styled.div`
    position: relative;
`;

const MessageBox: React.FC<MessageBoxProps> = (props) => {
    return (
        <article className={`message ${props.type !== "default" ? `is-${props.type}` : ""}`}>
            <Body className="message-body">{props.children}</Body>
        </article>
    );
};

export default MessageBox;
