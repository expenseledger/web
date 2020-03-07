import * as moment from "moment";
import * as React from "react";
import { TransactionType } from "../service/Constants";
import "./TransactionCard.scss";

interface TransactionItemProps {
    id: string;
    date: Date;
    amount: number;
    type: TransactionType;
    category: string;
    description?: string;
    onDelete?: () => void;
}

export function TransactionCard(props: TransactionItemProps) {
    const date = moment.default(props.date);
    const title = `${date.format("DD/MM/YYYY")} - ${props.type}`;
    const amount = `: ${props.amount} THB`;
    const category = `: ${props.category}`;
    const description = `: ${props.description}`;

    return (
        <div className="card card__box">
            <header className="card-header">
                <span className="card-header-title">{title}</span>
                <a onClick={props.onDelete} className="card-header-icon">
                    <span className="icon">
                        <i
                            className="fas fa-lg fa-times has-text-danger"
                            aria-hidden="true"
                        ></i>
                    </span>
                </a>
            </header>
            <div className="card-content">
                <p className="content">
                    <span className="card__content">
                        <span className="card__content--bold">Amount</span>
                        {amount}
                    </span>
                    <span className="card__content">
                        <span className="card__content--bold">Category</span>
                        {category}
                    </span>
                    <span className="card__content">
                        <span className="card__content--bold">Description</span>
                        {description}
                    </span>
                </p>
            </div>
        </div>
    );
}
