import * as React from "react";
import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import Loading from "../components/bases/Loading";
import { NotificationProps } from "../components/bases/Notification";
import Toast from "../components/bases/Toast";
import { withAuthProtection } from "../components/hoc/WithAuthProtection";
import Layout from "../components/Layout";
import { TransactionCard } from "../components/TransactionCard";
import { mapNotificationProps } from "../service/Mapper";
import { Transaction } from "../service/model/Transaction";
import {
    deleteTransaction,
    listTransactions
} from "../service/TransactionService";
import "./TransactionList.scss";

interface TransactionListProps extends RouteComponentProps {
    wallet: string;
}

interface TransactionListParam {
    walletName: string;
}

export function TransactionList(props: TransactionListProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [notificationList, setNotificationList] = useState<
        NotificationProps[]
    >([]);
    const [isLoading, setIsLoading] = useState(true);
    const wallet =
        props.wallet ?? (props.match.params as TransactionListParam).walletName;

    useEffect(() => {
        listTransactions({
            wallet
        }).then(response => {
            const sortedItems = response.items.reverse();
            setTransactions(sortedItems);
            setIsLoading(false);
        });
    }, [wallet]);

    const removeTransaction = async (id: string) => {
        const response = await deleteTransaction({
            id
        });

        if (!response.isSuccess) {
            alert("Delete transaction failed");
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
        setTransactions(transactions.filter(tx => tx.id !== id));
    };

    const onNotificationRemove = (id: string) => {
        const newNotificationList = notificationList.filter(n => n.id !== id);
        setNotificationList(newNotificationList);
    };

    const cards = transactions.map((tx, index) => {
        const { id, date, amount, type, category, description } = tx;
        return (
            <>
                <Toast
                    toastList={notificationList}
                    position="top-right"
                    onNotificationRemove={onNotificationRemove}
                />
                <TransactionCard
                    date={date}
                    amount={amount}
                    type={type}
                    category={category}
                    description={description}
                    key={index}
                    onDelete={() => removeTransaction(id)}
                />
            </>
        );
    });

    return isLoading ? (
        <Loading />
    ) : (
        <Layout isShowBackwardIcon={true}>
            <div>{cards}</div>
        </Layout>
    );
}

const TransactionListWithAuthProctection = withAuthProtection()(
    TransactionList
);

export default TransactionListWithAuthProctection;
