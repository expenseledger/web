import React from "react";
import styled from "styled-components";
import BalanceWithCurrency from "./BalanceWithCurrency";

type TextAlign = "center" | "left" | "right";
interface AmountTxtProps {
    amount: number;
    className?: string;
    textAlign?: TextAlign;
}

interface AmountBoxProps {
    textAlign?: TextAlign;
}

const AmountBox = styled.div<AmountBoxProps>`
    display: inline-block;
    text-align: ${(props) => props.textAlign ?? "left"};
`;

const AmountTxt: React.FC<AmountTxtProps> = (props) => (
    <AmountBox className={props.className} textAlign={props.textAlign}>
        <BalanceWithCurrency balance={props.amount} />
    </AmountBox>
);

export default AmountTxt;
