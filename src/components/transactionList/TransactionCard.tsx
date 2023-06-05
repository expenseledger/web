import dayjs from "dayjs";
import React from "react";
import styled from "styled-components";
import { TransactionType } from "../../service/constants";
import Category from "../../service/model/Category";
import AmountTxt from "../bases/AmountTxt";
import TransactionCardMessage from "./TransactionCardMessage";

interface TransactionCardItem {
    amount: number;
    type: TransactionType;
    category?: Category;
    description?: string;
    date: Date;
    onDelete: () => Promise<void>;
    onUpdate: (
        amount: number,
        categoryId: number,
        description: string,
        occuredAt: Date
    ) => Promise<void>;
}

interface TransactionCardProps {
    date: Date;
    items: TransactionCardItem[];
}

const Title = styled.h1`
    display: inline;
`;

export const TransactionCard: React.FC<TransactionCardProps> = (props: TransactionCardProps) => {
    const title = dayjs(props.date).format("DD MMM YYYY");

    const renderBody = () => {
        const formatItems = props.items.map((x) => {
            return {
                cateogry: x.category,
                description: x.description ?? "-",
                amount: x.amount,
                type: x.type,
                date: x.date,
                onDelete: x.onDelete,
                onUpdate: x.onUpdate,
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
                occurredAt={x.date}
                onUpdate={x.onUpdate}
            />
        ));
    };

    return (
        <div className="box">
            <div className="is-flex is-flex-direction-row is-justify-content-space-between">
                <Title className="title is-4">{title}</Title>
                <AmountTxt amount={props.items.reduce((acc, cur) => acc + cur.amount, 0)} />
            </div>
            {renderBody()}
        </div>
    );
};
