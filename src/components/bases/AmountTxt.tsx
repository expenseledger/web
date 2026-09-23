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

const AmountBox = styled.div`
    display: inline-block;
    text-align: ${(props) => (props as AmountBoxProps).textAlign ?? "left"};
` as unknown as React.ComponentType<
    React.PropsWithChildren<AmountBoxProps & React.HTMLAttributes<HTMLDivElement>>
>;

const AmountTxt: React.FC<AmountTxtProps> = (props) => (
    <AmountBox className={props.className} textAlign={props.textAlign}>
        <BalanceWithCurrency balance={props.amount} />
    </AmountBox>
);

export default AmountTxt;
