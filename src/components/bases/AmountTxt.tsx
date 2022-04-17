import React from "react";
import styled from "styled-components";
import { formatNumber } from "../../common/utils";

type TextAlign = "center" | "left" | "right";
interface AmountTxtProps {
    amount: number;
    className?: string;
    textAlign?: TextAlign;
}

interface AmountBoxProps {
    textAlign?: TextAlign;
}

const AmountBox = styled.div`
    display: inline-block;
    text-align: ${(props: AmountBoxProps) => props.textAlign ?? "left"};
`;
const MiddleSpan = styled.span`
    vertical-align: middle;
`;

const AmountTxt: React.FC<AmountTxtProps> = (props) => (
    <AmountBox className={props.className} textAlign={props.textAlign}>
        <MiddleSpan className="mr-1">฿</MiddleSpan>
        <MiddleSpan>{formatNumber(props.amount)}</MiddleSpan>
    </AmountBox>
);

export default AmountTxt;
