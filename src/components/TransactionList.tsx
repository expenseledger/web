import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
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
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [notificationList, setNotificationList] = useRecoilState(toastState);
    const [isLoading, setIsLoading] = useState(true);
    const wallet =
        props.wallet ?? (props.match.params as TransactionListParam).walletName;

    useEffect(() => {
        listTransactions({
            wallet,
        }).then((response) => {
            const sortedItems = response.items.reverse();
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

    const MultilineDiv = styled.div`
        word-wrap: break-word;
    `;

    return isLoading ? (
        <Loading />
    ) : (
        <Layout>
            {/* <div>{cards}</div> */}
            <div className="box">
                <h1 className="title is-4">25 Nov 2020</h1>
                <article className="message is-success">
                    <div className="message-body">
                        <div className="columns is-mobile is-gapless is-multiline">
                            <div className="column is-half">
                                <span className="has-text-weight-bold">
                                    Amount:
                                </span>
                            </div>
                            <div className="column is-half">123</div>
                            <div className="column is-half">
                                <span className="has-text-weight-bold">
                                    Category:
                                </span>
                            </div>
                            <div className="column is-half">Good</div>
                            <div className="column is-half">
                                <span className="has-text-weight-bold">
                                    Description:
                                </span>
                            </div>
                            <div className="column is-half">
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry. Lorem Ipsum has been
                                the industrys standard dummy text ever since the
                                1500s,
                            </div>
                        </div>
                    </div>
                </article>
                <article className="message">
                    <div className="message-body">
                        <p>
                            <strong>Amount:</strong> 123
                        </p>
                        <p>
                            <strong>Category:</strong> Food
                        </p>
                        <p>
                            <strong>Description:</strong> expasdlkfjlaksdjf
                        </p>
                    </div>
                </article>
                <article className="message is-danger">
                    <div className="message-body">
                        <p>
                            <strong>Amount:</strong> 123
                        </p>
                        <p>
                            <strong>Category:</strong> Food
                        </p>
                        <p>
                            <strong>Description:</strong> expasdlkfjlaksdjf
                        </p>
                    </div>
                </article>
                <article className="message is-success">
                    <div className="message-body">
                        <p>
                            <strong>Amount:</strong> 123
                        </p>
                        <p>
                            <strong>Category:</strong> Food
                        </p>
                        <p>
                            <strong>Description:</strong> expasdlkfjlaksdjf
                        </p>
                    </div>
                </article>
            </div>
            <div className="box">
                <h1 className="title is-4">25 Nov 2020</h1>
                <article className="message is-success">
                    <div className="message-body">
                        <p>Amount: 123</p>
                        <p>Category: Food</p>
                        <p>Description: expasdlkfjlaksdjf</p>
                    </div>
                </article>
                <article className="message is-success">
                    <div className="message-body">
                        <p>Amount: 123</p>
                        <p>Category: Food</p>
                        <p>Description: expasdlkfjlaksdjf</p>
                    </div>
                </article>
                <article className="message is-danger">
                    <div className="message-body">
                        <p>Amount: 123</p>
                        <p>Category: Food</p>
                        <p>Description: expasdlkfjlaksdjf</p>
                    </div>
                </article>
                <article className="message is-success">
                    <div className="message-body">
                        <p>Amount: 123</p>
                        <p>Category: Food</p>
                        <p>Description: expasdlkfjlaksdjf</p>
                    </div>
                </article>
            </div>
            <div className="box">
                <h1 className="title is-4">25 Nov 2020</h1>
                <article className="message is-success">
                    <div className="message-body">
                        <p>Amount: 123</p>
                        <p>Category: Food</p>
                        <p>Description: expasdlkfjlaksdjf</p>
                    </div>
                </article>
                <article className="message is-success">
                    <div className="message-body">
                        <p>Amount: 123</p>
                        <p>Category: Food</p>
                        <p>Description: expasdlkfjlaksdjf</p>
                    </div>
                </article>
                <article className="message is-danger">
                    <div className="message-body">
                        <p>Amount: 123</p>
                        <p>Category: Food</p>
                        <p>Description: expasdlkfjlaksdjf</p>
                    </div>
                </article>
                <article className="message is-success">
                    <div className="message-body">
                        <p>Amount: 123</p>
                        <p>Category: Food</p>
                        <p>Description: expasdlkfjlaksdjf</p>
                    </div>
                </article>
            </div>
        </Layout>
    );
};

const TransactionListWithAuthProctection = withAuthProtection()(
    TransactionList
);

export default TransactionListWithAuthProctection;
