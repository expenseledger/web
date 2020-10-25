import dayjs from "dayjs";
import React from "react";
import { TransactionType } from "../service/Constants";
import { combineClassName, formatNumber } from "../service/Utils";
import "./TransactionCard.scss";

interface TransactionItemProps {
    date: Date;
    amount: number;
    type: TransactionType;
    category: string;
    description?: string;
    onDelete: () => Promise<void>;
}

export const TransactionCard: React.FC<TransactionItemProps> = (
    props: TransactionItemProps
) => {
    const [isClickedDelete, setIsClickedDelete] = React.useState(false);
    const date = dayjs(props.date);
    const title = `${date.format("DD MMM YYYY")} - ${props.type}`;
    const amount = `: ${props.type !== "INCOME" ? "-" : ""}${formatNumber(
        props.amount
    )} THB`;
    const category = `: ${props.category}`;
    const description = `: ${props.description}`;
    const onDeleteHandler = () => {
        setIsClickedDelete(true);
    };
    const onCancelHandler = () => {
        setIsClickedDelete(false);
    };
    const onConfirmHandler = async () => {
        if (!props.onDelete) {
            return;
        }
        await props.onDelete();
        setIsClickedDelete(false);
    };
    const renderDelete = () => {
        if (isClickedDelete) {
            return (
                <div className="columns is-variable is-1 card-header-icon">
                    <div className="column">
                        <button
                            onClick={onCancelHandler}
                            className="button is-primary is-small is-outlined"
                        >
                            Cancel
                        </button>
                    </div>
                    <div className="column">
                        <button
                            onClick={onConfirmHandler}
                            className="button is-danger is-small is-primary"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <a onClick={onDeleteHandler} className="card-header-icon">
                <span className="icon">
                    <i
                        className="fas fa-lg fa-times has-text-danger"
                        aria-hidden="true"
                    ></i>
                </span>
            </a>
        );
    };

    return (
        <div className="card card__box">
            <header className="card-header">
                <span
                    className={combineClassName(
                        "card-header-title",
                        props.type !== "INCOME"
                            ? "has-text-danger"
                            : "has-text-success"
                    )}
                >
                    {title}
                </span>
                {renderDelete()}
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
};
