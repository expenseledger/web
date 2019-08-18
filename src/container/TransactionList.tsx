import * as React from "react";
import { useEffect, useState } from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import { TransactionCard } from "../components/TransactionCard";
import { Transaction } from "../service/model/Transaction";
import { listTransactions } from "../service/TransactionService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import "./TransactionList.scss";
import Loading from "../components/bases/Loading";
import { withAuthProtection } from "../components/hoc/WithAuthProtection";
import Layout from "../components/Layout";

interface TransactionListProps extends RouteComponentProps {
    wallet: string;
}

interface TransactionListParam {
    walletName: string;
}

export function TransactionList(props: TransactionListProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        listTransactions({
            wallet: !!props.wallet
                ? props.wallet
                : (props.match.params as TransactionListParam).walletName
        }).then(response => {
            var sortedItems = response.items.reverse();
            setTransactions(sortedItems);
            setIsLoading(false);
        });
    }, []);

    const cards = transactions.map((tx, index) => {
        const { date, amount, type, category, description } = tx;
        return (
            <TransactionCard
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
