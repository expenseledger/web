import dayjs from "dayjs";
import React from "react";
import { TransactionType } from "../service/Constants";
import { formatNumber } from "../service/Utils";
import "./TransactionCard.scss";

interface Item {
    amount: number;
    type: TransactionType;
    category: string;
    description?: string;
    onDelete: () => Promise<void>;
}

interface TransactionItemProps {
    date: Date;
    items: Item[];
}

export const TransactionCard: React.FC<TransactionItemProps> = (
    props: TransactionItemProps
) => {
    // const [isClickedDelete, setIsClickedDelete] = React.useState(false);
    const title = dayjs(props.date).format("DD MMM YYYY");
    // const onDeleteHandler = () => {
    //     setIsClickedDelete(true);
    // };
    // const onCancelHandler = () => {
    //     setIsClickedDelete(false);
    // };
    // const onConfirmHandler = async () => {
    //     if (!props.onDelete) {
    //         return;
    //     }
    //     await props.onDelete();
    //     setIsClickedDelete(false);
    // };
    // const renderDelete = () => {
    //     if (isClickedDelete) {
    //         return (
    //             <div className="columns is-variable is-1 card-header-icon">
    //                 <div className="column">
    //                     <button
    //                         onClick={onCancelHandler}
    //                         className="button is-primary is-small is-outlined"
    //                     >
    //                         Cancel
    //                     </button>
    //                 </div>
    //                 <div className="column">
    //                     <button
    //                         onClick={onConfirmHandler}
    //                         className="button is-danger is-small is-primary"
    //                     >
    //                         Confirm
    //                     </button>
    //                 </div>
    //             </div>
    //         );
    //     }

    //     return (
    //         <a onClick={onDeleteHandler} className="card-header-icon">
    //             <span className="icon">
    //                 <i
    //                     className="fas fa-lg fa-times has-text-danger"
    //                     aria-hidden="true"
    //                 ></i>
    //             </span>
    //         </a>
    //     );
    // };

    const renderBody = () => {
        const formatItems = props.items.map((x) => {
            return {
                cateogry: x.category,
                description: x.description ?? "-",
                amount:
                    x.type === "INCOME"
                        ? formatNumber(x.amount)
                        : "-" + formatNumber(x.amount),
                type: x.type,
            };
        });

        return (
            <>
                {formatItems.map((x, idx) => (
                    <article
                        className={`message ${
                            x.type === "INCOME" ? "success" : ""
                        }`}
                        key={idx}
                    >
                        <div className="message-body">
                            <div className="columns is-mobile is-gapless is-multiline">
                                <div className="column is-half">
                                    <span className="has-text-weight-bold">
                                        Type:
                                    </span>
                                </div>
                                <div className="column is-half">{x.type}</div>
                                <div className="column is-half">
                                    <span className="has-text-weight-bold">
                                        Amount:
                                    </span>
                                </div>
                                <div className="column is-half">{x.amount}</div>
                                <div className="column is-half">
                                    <span className="has-text-weight-bold">
                                        Category:
                                    </span>
                                </div>
                                <div className="column is-half">
                                    {x.cateogry}
                                </div>
                                <div className="column is-half">
                                    <span className="has-text-weight-bold">
                                        Description:
                                    </span>
                                </div>
                                <div className="column is-half">
                                    {x.description}
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </>
        );
    };

    return (
        <div className="box">
            <h1 className="title is-4">{title}</h1>
            {renderBody()}
        </div>
    );
};
