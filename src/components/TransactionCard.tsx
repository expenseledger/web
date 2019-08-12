import * as moment from "moment";
import * as React from "react";

import "./TransactionCard.scss";
import { TransactionType } from "../service/Constants";

interface TransactionItemProps {
    date: Date;
    amount: number;
    type: TransactionType;
    category: string;
    description?: string;
}

export function TransactionCard(props: TransactionItemProps) {
    const date = moment.default(props.date);
    return (
        <div className="card card__box">
            <header className="card-header">
                <p className="card-header-title">{props.type}</p>
            </header>
            <div className="card-content">
                <p className="content">
                    <span className="card__content">
                        {date.format("DD/MM/YYYY")}: {props.amount} THB
                    </span>
                    <span className="card__content">
                        <span className="card__content--bold">Category</span>:{" "}
                        {props.category}
                    </span>
                    <span className="card__content">
                        <span className="card__content--bold">Description</span>
                        : {props.description}
                    </span>
                </p>
            </div>
        </div>
    );
}
