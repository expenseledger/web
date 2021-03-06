import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toastState } from "../common/shareState";
import Loading from "../components/bases/Loading";
import { mapNotificationProps } from "../service/helper/notificationHelper";
import { Transaction } from "../service/model/Transaction";
import {
    deleteTransaction,
    listTransactions,
} from "../service/transactionService";
import { TransactionCard } from "./TransactionCard";
import "./TransactionList.scss";

interface PathParams {
    accountId: string;
}

const NoData = styled.div`
    font-weight: bold;
    text-align: center;
    margin-top: 30px;
`;

export const TransactionList: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>(null);
    const [notificationList, setNotificationList] = useRecoilState(toastState);
    const [isLoading, setIsLoading] = useState(true);
    const { accountId } = useParams<PathParams>();

    useEffect(() => {
        listTransactions({ accountId: +accountId }).then((response) => {
            setTransactions(response.items);
            setIsLoading(false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const removeTransaction = async (id: number) => {
        const response = await deleteTransaction({
            id,
        });

        if (!response.isSuccess) {
            setNotificationList(
                notificationList.concat(
                    mapNotificationProps("Delete transaction failed", "danger")
                )
            );
            return;
        }

        setNotificationList(
            notificationList.concat(
                mapNotificationProps("Delete transaction succes", "success")
            )
        );

        setTransactions(transactions.filter((x) => x.id !== id));
    };

    const getCards = () => {
        const dateSet: Set<string> = new Set();
        const toReturn: JSX.Element[] = [];
        transactions.forEach((x) => dateSet.add(x.date.toString()));
        const getAmount = (tx: Transaction) => {
            switch (tx.type) {
                case "EXPENSE":
                    return -tx.amount;
                case "TRANSFER":
                    return tx.toAccount.id === +accountId
                        ? tx.amount
                        : -tx.amount;
                case "INCOME":
                default:
                    return tx.amount;
            }
        };

        dateSet.forEach((x, idx) =>
            toReturn.push(
                <TransactionCard
                    key={idx}
                    date={new Date(x)}
                    items={transactions
                        .filter((y) => x === y.date.toString())
                        .map((y) => {
                            return {
                                amount: getAmount(y),
                                type: y.type,
                                description: y.description,
                                category: y.category?.name ?? "-",
                                onDelete: () => removeTransaction(y.id),
                            };
                        })}
                />
            )
        );

        return toReturn;
    };
    const renderCards = () => {
        const cards = getCards();

        if (cards.length > 0) {
            return <>{cards}</>;
        }

        return <NoData className="notification is-danger">No data</NoData>;
    };

    return isLoading ? <Loading /> : <>{renderCards()}</>;
};

export default TransactionList;
