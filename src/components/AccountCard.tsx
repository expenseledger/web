import React from "react";
import { animated, config, useSpring } from "react-spring";
import styled from "styled-components";
import { formatNumber } from "../common/utils";

interface AccountCardProps {
    name: string;
    balance: number;
}

const Card = styled.div`
    background: linear-gradient(
        320deg,
        rgba(255, 255, 255, 1) 60%,
        rgba(255, 179, 26, 1) 70%,
        rgba(255, 100, 34, 1) 80%,
        rgba(245, 0, 143, 1) 100%
    );
`;

const AccountCard: React.FC<AccountCardProps> = (props) => {
    const { number } = useSpring({
        reset: false,
        from: { number: 0 },
        number: props.balance,
        delay: 200,
        config: config.default,
    });

    return (
        <Card className="card">
            <div className="card-content">
                <div className="content has-text-right">
                    <div className="is-size-3 has-text-weight-bold">
                        {props.name}
                    </div>
                    <div className="is-size-5">
                        <span>฿</span>
                        <animated.span>
                            {number.to((x) => formatNumber(x))}
                        </animated.span>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default AccountCard;
