import * as React from "react";
import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { TransactionCard } from "../components/TransactionCard";
import { Transaction } from "../service/Model/Transaction";
import { listTransactions } from "../service/TransactionService";

interface ITransactionListProps extends RouteComponentProps {
  wallet: string;
}

export function TransactionList(props: ITransactionListProps) {
  const [transactions, setTransactions] = useState([] as Transaction[]);
  useEffect(() => {
    listTransactions({ wallet: !!props.wallet ? props.wallet : (props.match.params as any) }).then(response => {
      setTransactions(response.items);
    });
  });

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

  return <div>{cards}</div>;
}
