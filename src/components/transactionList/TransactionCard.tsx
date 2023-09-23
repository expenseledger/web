import React from "react";
import dayjs from "../../lib/dayjs";
import { TransactionType } from "../../service/constants";
import Category from "../../service/model/Category";
import AmountTxt from "../bases/AmountTxt";
import TransactionCardMessage from "./TransactionCardMessage";
import { Box, Card, Flex, Text } from "@radix-ui/themes";

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
            <Box key={idx} mt={idx > 0 ? "3" : "0"}>
                <TransactionCardMessage
                    category={x.cateogry}
                    description={x.description}
                    amount={x.amount}
                    type={x.type}
                    onDelete={x.onDelete}
                    occurredAt={x.date}
                    onUpdate={x.onUpdate}
                />
            </Box>
        ));
    };

    return (
        <Card>
            <Flex justify="between" align="center" mb="3">
                <Text weight="bold" size="6">
                    {title}
                </Text>
                <AmountTxt amount={props.items.reduce((acc, cur) => acc + cur.amount, 0)} />
            </Flex>
            {renderBody()}
        </Card>
    );
};
