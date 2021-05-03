import React from "react";
import styled from "styled-components";
import { TransactionType } from "../service/constants";

interface TransactionCardMessageProps {
    amount: string;
    type: TransactionType;
    category: string;
    description?: string;
    onDelete: () => Promise<void>;
}

const DeleteBox = styled.div`
    position: absolute;
    right: 5px;
    top: 5px;
`;

const MessageBox = styled.div`
    position: relative;
`;

const TransactionCardMessage: React.FC<TransactionCardMessageProps> = (
    props
) => {
    const [isClickedDelete, setIsClickedDelete] = React.useState(false);
    const [isDeleteLoading, setIsDeleteLoading] = React.useState(false);
    const onDeleteHandler = () => {
        setIsClickedDelete(true);
    };
    const onCancelHandler = () => {
        if (isDeleteLoading) return;
        setIsClickedDelete(false);
    };
    const onConfirmHandler = async () => {
        if (!props.onDelete) {
            return;
        }
        setIsDeleteLoading(true);
        await props.onDelete();
        setIsDeleteLoading(false);
        setIsClickedDelete(false);
    };
    const renderDelete = () => {
        if (isClickedDelete) {
            return (
                <div className="modal is-active">
                    <div
                        className="modal-background"
                        onClick={onCancelHandler}
                    ></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">
                                Delete transaction
                            </p>
                            <button
                                className="delete"
                                onClick={onCancelHandler}
                            ></button>
                        </header>
                        <section className="modal-card-body has-text-black">
                            Are you sure?
                        </section>
                        <footer className="modal-card-foot">
                            <button
                                className={`button is-danger ${
                                    isDeleteLoading ? "is-loading" : ""
                                }`}
                                onClick={onConfirmHandler}
                            >
                                Delete
                            </button>
                            <button
                                className="button"
                                onClick={onCancelHandler}
                            >
                                Cancel
                            </button>
                        </footer>
                    </div>
                </div>
            );
        }

        return (
            <DeleteBox onClick={onDeleteHandler}>
                <span className="icon">
                    <i
                        className="fas fa-lg fa-times has-text-danger"
                        aria-hidden="true"
                    ></i>
                </span>
            </DeleteBox>
        );
    };

    return (
        <article
            className={`message ${
                props.amount.startsWith("-") ? "is-dark" : "is-success"
            }`}
        >
            <MessageBox className="message-body">
                {renderDelete()}
                <div className="columns is-mobile is-gapless is-multiline">
                    <div className="column is-half">
                        <span className="has-text-weight-bold">Type:</span>
                    </div>
                    <div className="column is-half">{props.type}</div>
                    <div className="column is-half">
                        <span className="has-text-weight-bold">Amount:</span>
                    </div>
                    <div className="column is-half">{props.amount}</div>
                    <div className="column is-half">
                        <span className="has-text-weight-bold">Category:</span>
                    </div>
                    <div className="column is-half">{props.category}</div>
                    <div className="column is-half">
                        <span className="has-text-weight-bold">
                            Description:
                        </span>
                    </div>
                    <div className="column is-half">
                        {!props.description || props.description === ""
                            ? "-"
                            : props.description}
                    </div>
                </div>
            </MessageBox>
        </article>
    );
};

export default TransactionCardMessage;
