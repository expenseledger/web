import React from "react";
import styled from "styled-components";
import { formatNumber } from "../../common/utils";

interface AmountTxtProps {
    amount: number;
}

const AmountBox = styled.div`
    display: inline-block;
`;
const MiddleSpan = styled.span`
    vertical-align: middle;
`;

const AmountTxt: React.FC<AmountTxtProps> = (props) => (
    <AmountBox>
        <MiddleSpan className="mr-1">฿</MiddleSpan>
        <MiddleSpan>{formatNumber(props.amount)}</MiddleSpan>
    </AmountBox>
);

export default AmountTxt;
