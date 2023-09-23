import React from "react";
import { animated, config, useSpring } from "react-spring";
import styled from "styled-components";
import { formatNumber } from "../common/utils";
import { Box, Text } from "@radix-ui/themes";

interface AccountCardProps {
    id: number;
    name: string;
    balance: number;
    currency: string;
}

interface CardProps {
    $backgroundColor: string;
    $backgroundImage: string;
}

const Card = styled.div<CardProps>`
    background-color: ${(props) => props.$backgroundColor};
    background-image: ${(props) => props.$backgroundImage};
    border-radius: 4px;
    padding: 24px;
    color: white;
    text-align: right;
`;

const colors = [
    ["#bdd4e7", "linear-gradient(315deg, #bdd4e7 0%, #8693ab 74%)"],
    ["#c7e9fb", "linear-gradient(315deg, #c7e9fb 0%, #e61d8c 74%)"],
    ["#89d4cf", "linear-gradient(315deg, #89d4cf 0%, #6e45e1 74%)"],
    ["#f9d29d", "linear-gradient(315deg, #f9d29d 0%, #ffd8cb 74%)"],
    ["#537895", "linear-gradient(315deg, #537895 0%, #09203f 74%)"],
    ["#89d8d3", "linear-gradient(315deg, #89d8d3 0%, #03c8a8 74%)"],
];

const AccountCardComponent: React.FC<AccountCardProps> = (props) => {
    const { number } = useSpring({
        reset: false,
        from: { number: 0 },
        number: props.balance,
        delay: 200,
        config: config.default,
    });
    const [backgroundColor, backgroundImage] = colors[props.id % colors.length];

    return (
        <Card $backgroundColor={backgroundColor} $backgroundImage={backgroundImage}>
            <Text weight="bold" size="7">
                {props.name}
            </Text>
            <Box>
                <Text>{props.currency}</Text>
                <animated.span>{number.to((x) => formatNumber(x))}</animated.span>
            </Box>
        </Card>
    );
};

const AccountCard = React.memo(AccountCardComponent);

export default AccountCard;
