import dayjs from "dayjs";
import React from "react";
import styled from "styled-components";
import { formatNumber } from "../common/utils";
import { TransactionType } from "../service/constants";
import TransactionCardMessage from "./TransactionCardMessage";

interface TransactoinCardItem {
    amount: number;
    type: TransactionType;
    category: string;
    description?: string;
    onDelete: () => Promise<void>;
}

interface TransactionCardProps {
    date: Date;
    items: TransactoinCardItem[];
}

const Title = styled.h1`
    display: inline;
`;
const SumAmountBox = styled.div`
    display: inline-block;
`;
const MiddleSpan = styled.span`
    vertical-align: middle;
`;

export const TransactionCard: React.FC<TransactionCardProps> = (
    props: TransactionCardProps
) => {
    const title = dayjs(props.date).format("DD MMM YYYY");

    const renderBody = () => {
        const formatItems = props.items.map((x) => {
            return {
                cateogry: x.category,
                description: x.description ?? "-",
                amount: formatNumber(x.amount),
                type: x.type,
                onDelete: x.onDelete,
            };
        });

        return formatItems.map((x, idx) => (
            <TransactionCardMessage
                key={idx}
                category={x.cateogry}
                description={x.description}
                amount={x.amount}
                type={x.type}
                onDelete={x.onDelete}
            />
        ));
    };

    return (
        <div className="box">
            <div className="is-flex is-flex-direction-row is-justify-content-space-between">
                <Title className="title is-4">{title}</Title>
                <SumAmountBox>
                    <MiddleSpan className="ml-2">฿</MiddleSpan>
                    <MiddleSpan>
                        {formatNumber(
                            props.items.reduce(
                                (acc, cur) => acc + cur.amount,
                                0
                            )
                        )}
                    </MiddleSpan>
                </SumAmountBox>
            </div>
            {renderBody()}
        </div>
    );
};
