import dayjs from "dayjs";
import React from "react";
import { TransactionType } from "../service/Constants";
import { formatNumber } from "../service/Utils";
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

export const TransactionCard: React.FC<TransactionCardProps> = (
    props: TransactionCardProps
) => {
    const title = dayjs(props.date).format("DD MMM YYYY");

    const renderBody = () => {
        const formatItems = props.items.map((x) => {
            return {
                cateogry: x.category,
                description: x.description ?? "-",
                amount:
                    x.type === "INCOME"
                        ? formatNumber(x.amount)
                        : "-" + formatNumber(x.amount),
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
            <h1 className="title is-4">{title}</h1>
            {renderBody()}
        </div>
    );
};
