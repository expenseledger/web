import React from "react";
import styled from "styled-components";
import { TransactionType } from "../service/constants";
import AmountTxt from "./bases/AmountTxt";
import MessageBox from "./bases/MessageBox";
import Modal from "./bases/Modal";

interface TransactionCardMessageProps {
    amount: number;
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

const TransactionCardMessage: React.FC<TransactionCardMessageProps> = (props) => {
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
                <Modal
                    title="Delete Transaction"
                    onCancelHandler={onCancelHandler}
                    onConfirmHandler={onConfirmHandler}
                    cancelBtnTxt="Cancel"
                    cancelBtnType="default"
                    confirmBtnTxt="Delete"
                    confirmBtnType="danger">
                    <div className="has-text-black">Are you sure?</div>
                </Modal>
            );
        }

        return (
            <DeleteBox onClick={onDeleteHandler}>
                <span className="icon">
                    <i className="fas fa-lg fa-times has-text-danger" aria-hidden="true"></i>
                </span>
            </DeleteBox>
        );
    };

    return (
        <MessageBox type={props.amount < 0 ? "dark" : "success"}>
            {renderDelete()}
            <div className="columns is-mobile is-gapless is-multiline">
                <div className="column is-half">
                    <span className="has-text-weight-bold">Type:</span>
                </div>
                <div className="column is-half">{props.type}</div>
                <div className="column is-half">
                    <span className="has-text-weight-bold">Amount:</span>
                </div>
                <div className="column is-half">
                    <AmountTxt amount={props.amount} />
                </div>
                <div className="column is-half">
                    <span className="has-text-weight-bold">Category:</span>
                </div>
                <div className="column is-half">{props.category}</div>
                <div className="column is-half">
                    <span className="has-text-weight-bold">Description:</span>
                </div>
                <div className="column is-half">
                    {!props.description || props.description === "" ? "-" : props.description}
                </div>
            </div>
        </MessageBox>
    );
};

export default TransactionCardMessage;
