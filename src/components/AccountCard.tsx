import React from "react";
import { animated, config, useSpring } from "react-spring";

interface AccountCardProps {
    name: string;
    balance: number;
}

const AccountCard: React.FC<AccountCardProps> = (props) => {
    const { number } = useSpring({
        reset: false,
        from: { number: 0 },
        number: props.balance,
        delay: 200,
        config: config.default,
    });

    return (
        <div className="card">
            <div className="card-content">
                <div className="content">
                    <div>{props.name}</div>
                    <animated.div>
                        {number.to((x) => x.toFixed(2))}
                    </animated.div>
                    <span>bath</span>
                </div>
            </div>
        </div>
    );
};

export default AccountCard;
