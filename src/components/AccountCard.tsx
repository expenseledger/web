import React from "react";
import { animated, config, useSpring } from "react-spring";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { currencyState } from "../common/shareState";
import { formatNumber } from "../common/utils";

interface AccountCardProps {
    id: number;
    name: string;
    balance: number;
}

const Cards = [
    styled.div`
        background-color: #bdd4e7;
        background-image: linear-gradient(315deg, #bdd4e7 0%, #8693ab 74%);
    `,
    styled.div`
        background-color: #c7e9fb;
        background-image: linear-gradient(315deg, #c7e9fb 0%, #e61d8c 74%);
    `,
    styled.div`
        background-color: #89d4cf;
        background-image: linear-gradient(315deg, #89d4cf 0%, #6e45e1 74%);
    `,
    styled.div`
        background-color: #f9d29d;
        background-image: linear-gradient(315deg, #f9d29d 0%, #ffd8cb 74%);
    `,
    styled.div`
        background-color: #537895;
        background-image: linear-gradient(315deg, #537895 0%, #09203f 74%);
    `,
    styled.div`
        background-color: #89d8d3;
        background-image: linear-gradient(315deg, #89d8d3 0%, #03c8a8 74%);
    `,
];

const AccountCardComponent: React.FC<AccountCardProps> = (props) => {
    const { number } = useSpring({
        reset: false,
        from: { number: 0 },
        number: props.balance,
        delay: 200,
        config: config.default,
    });
    const currency = useRecoilValue(currencyState);
    const Card = Cards[props.id % Cards.length];

    return (
        <Card className="box has-text-right has-text-white p-5">
            <div className="is-size-3 has-text-weight-bold">{props.name}</div>
            <div className="is-size-5">
                <span>{currency}</span>
                <animated.span>{number.to((x) => formatNumber(x))}</animated.span>
            </div>
        </Card>
    );
};

const AccountCard = React.memo(AccountCardComponent);

export default AccountCard;
