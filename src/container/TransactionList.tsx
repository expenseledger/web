import * as React from "react";
import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import Loading from "../components/bases/Loading";
import { withAuthProtection } from "../components/hoc/WithAuthProtection";
import Layout from "../components/Layout";
import { TransactionCard } from "../components/TransactionCard";
import { Transaction } from "../service/model/Transaction";
import { listTransactions } from "../service/TransactionService";
import "./TransactionList.scss";

interface TransactionListProps extends RouteComponentProps {
    wallet: string;
}

interface TransactionListParam {
    walletName: string;
}

export function TransactionList(props: TransactionListProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
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

    const cards = transactions.map((tx, index) => {
        const { id, date, amount, type, category, description } = tx;
        return (
            <TransactionCard
                id={id}
                date={date}
                amount={amount}
                type={type}
                category={category}
                description={description}
                key={index}
            />
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
