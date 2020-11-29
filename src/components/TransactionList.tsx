import * as R from "ramda";
import { Dictionary } from "ramda";
import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useRecoilState } from "recoil";
import { toastState } from "../common/shareState";
import Loading from "../components/bases/Loading";
import Layout from "../components/Layout";
import { TransactionCard } from "../components/TransactionCard";
import { mapNotificationProps } from "../service/Mapper";
import { Transaction } from "../service/model/Transaction";
import {
    deleteTransaction,
    listTransactions,
} from "../service/TransactionService";
import { withAuthProtection } from "./hoc/WithAuthProtection";
import "./TransactionList.scss";

interface TransactionListProps extends RouteComponentProps {
    wallet: string;
}

interface TransactionListParam {
    walletName: string;
}

export const TransactionList: React.FC<TransactionListProps> = (props) => {
    const [transactions, setTransactions] = useState<Dictionary<Transaction[]>>(
        null
    );
    const [notificationList, setNotificationList] = useRecoilState(toastState);
    const [isLoading, setIsLoading] = useState(true);
    const wallet =
        props.wallet ?? (props.match.params as TransactionListParam).walletName;

    useEffect(() => {
        listTransactions({
            wallet,
        }).then((response) => {
            const sortedItems: Dictionary<
                Transaction[]
            > = R.groupBy<Transaction>((x) => x.date.toString())(
                response.items.reverse()
            );

            setTransactions(sortedItems);
            setIsLoading(false);
        });
    }, [wallet]);

    const removeTransaction = async (id: string) => {
        const response = await deleteTransaction({
            id,
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
        setTransactions(transactions.filter((tx) => tx.id !== id));
    };

    const cards = transactions.map((tx) => {
        const { id, date, amount, type, category, description } = tx;
        return (
            <TransactionCard
                date={date}
                amount={amount}
                type={type}
                category={category}
                description={description}
                key={id}
                onDelete={() => removeTransaction(id)}
            />
        );
    });

    return isLoading ? (
        <Loading />
    ) : (
        <Layout>{/* <div>{cards}</div> */}</Layout>
    );
};

const TransactionListWithAuthProctection = withAuthProtection()(
    TransactionList
);

export default TransactionListWithAuthProctection;
