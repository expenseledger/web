import React from "react";
import styled from "styled-components";

interface Props {
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

type MessageBoxProps = React.PropsWithChildren<Props>;

const MessageBox: React.FC<MessageBoxProps> = (props) => {
    return (
        <article className={`message ${props.type !== "default" ? `is-${props.type}` : ""}`}>
            <Body className="message-body">{props.children}</Body>
        </article>
    );
};

export default MessageBox;
