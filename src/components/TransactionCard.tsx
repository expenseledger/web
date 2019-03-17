import * as moment from "moment";
import * as React from "react";

import { TransactionType } from "../service/Constants";

interface ITransactionItemProps {
  date: Date;
  amount: number;
  type: TransactionType;
  category: string;
  description?: string;
}

export function TransactionCard(props: ITransactionItemProps) {
  const date = moment(props.date);
  return (
    <div>
      <p>{props.type}</p>
      <p>
        {date.format("DD/MM/YYYY")}: {props.amount} THB
      </p>
      <p>
        {props.category} | {props.description}
      </p>
    </div>
  );
}
