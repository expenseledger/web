import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useRecoilState } from "recoil";
import { toastState } from "../common/shareState";
import Loading from "../components/bases/Loading";
import Layout from "../components/Layout";
import { mapNotificationProps } from "../service/helper/notificationHelper";
import { Transaction } from "../service/model/Transaction";
import {
    deleteTransaction,
    listTransactions,
} from "../service/transactionService";
import { withAuthProtection } from "./hoc/WithAuthProtection";
import { TransactionCard } from "./TransactionCard";
import "./TransactionList.scss";

interface TransactionListProps extends RouteComponentProps {
    wallet: string;
}

interface TransactionListParam {
    walletName: string;
}

export const TransactionList: React.FC<TransactionListProps> = (props) => {
    const [transactions, setTransactions] = useState<Transaction[]>(null);
    const [notificationList, setNotificationList] = useRecoilState(toastState);
    const [isLoading, setIsLoading] = useState(true);
    const walletName =
        props.wallet ?? (props.match.params as TransactionListParam).walletName;

    useEffect(() => {
        listTransactions({
            wallet: walletName,
        }).then((response) => {
            const sortedItems = response.items.reverse();

            setTransactions(sortedItems);
            setIsLoading(false);
        });
    }, [walletName]);

    const removeTransaction = async (id: string) => {
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
                    return tx.dstWallet === walletName ? tx.amount : -tx.amount;
                case "INCOME":
                default:
                    return tx.amount;
            }
        };

        dateSet.forEach((x) =>
            toReturn.push(
                <TransactionCard
                    date={new Date(x)}
                    items={transactions
                        .filter((y) => x === y.date.toString())
                        .map((y) => {
                            return {
                                amount: getAmount(y),
                                type: y.type,
                                description: y.description,
                                category: y.category,
                                onDelete: () => removeTransaction(y.id),
                            };
                        })}
                />
            )
        );

        return toReturn;
    };

    return isLoading ? <Loading /> : <Layout>{getCards()}</Layout>;
};

const TransactionListWithAuthProctection = withAuthProtection()(
    TransactionList
);

export default TransactionListWithAuthProctection;
