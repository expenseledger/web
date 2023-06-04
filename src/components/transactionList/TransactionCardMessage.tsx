import dayjs from "dayjs";
import React from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { categoriesState, currencyState } from "../../common/shareState";
import { toNumber } from "../../common/utils";
import { TransactionType } from "../../service/constants";
import Category from "../../service/model/Category";
import AmountTxt from "../bases/AmountTxt";
import DateBox from "../bases/DateBox";
import Dropdown from "../bases/Dropdown";
import MessageBox from "../bases/MessageBox";
import Modal from "../bases/Modal";
import TextBox from "../bases/TextBox";

interface UpdateTransactionModalProps {
    amount: number;
    category: Category;
    description: string;
    occuredAt: Date;
    onCancel: () => void;
    onConfirm: (
        amount: number,
        categoryId: number,
        description: string,
        occuredAt: Date
    ) => Promise<void>;
}

interface TransactionCardMessageProps {
    amount: number;
    type: TransactionType;
    category: Category;
    description: string;
    onDelete: () => Promise<void>;
    onUpdate: (
        amount: number,
        categoryId: number,
        description: string,
        occuredAt: Date
    ) => Promise<void>;
    occuredAt: Date;
}

const DeleteBox = styled.div`
    position: absolute;
    right: 5px;
    top: 5px;
`;
const UpdateBox = styled.div`
    position: absolute;
    right: 5px;
    top: 30px;
`;

const Content = styled.div`
    text-align: left;
`;

const UpdateTransactionModal: React.FC<UpdateTransactionModalProps> = (props) => {
    const categoryOptions = useRecoilValue(categoriesState);
    const currency = useRecoilValue(currencyState);
    const [updatedAmountText, setUpdatedAmountText] = React.useState(props.amount.toString());
    const [updateCategory, setUpdatCategory] = React.useState(props.category);
    const [updatedDescription, setUpdatedDescription] = React.useState(props.description);
    const [updatedOccuredAt, setUpdatedOccuredAt] = React.useState(props.occuredAt.toString());
    const updateCategoryHandler = (value: string) => {
        const category = categoryOptions.find((c) => c.name === value);
        if (!category) return;

        setUpdatCategory(category);
    };

    return (
        <Modal
            title="Update Transaction"
            onCancelHandler={props.onCancel}
            onConfirmHandler={() =>
                props.onConfirm(
                    toNumber(updatedAmountText),
                    updateCategory.id,
                    updatedDescription,
                    dayjs(updatedOccuredAt).toDate()
                )
            }
            cancelBtnTxt="Cancel"
            cancelBtnType="default"
            confirmBtnTxt="Confirm"
            confirmBtnType="primary">
            <div className="columns is-mobile is-vcentered">
                <div className="column is-3">
                    <span>Amount</span>
                </div>
                <TextBox
                    addOn={{ position: "front", text: currency }}
                    className="column"
                    name="category-modify"
                    updateValue={setUpdatedAmountText}
                    type="number"
                    value={updatedAmountText}
                />
            </div>
            <div className="columns is-mobile is-vcentered">
                <div className="column is-3">
                    <span>Category</span>
                </div>
                <Dropdown
                    className="column"
                    value={updateCategory.name}
                    options={categoryOptions.map((c) => c.name)}
                    updateSelectedValue={updateCategoryHandler}
                />
            </div>
            <div className="columns is-mobile is-vcentered">
                <div className="column is-3">
                    <span>Description</span>
                </div>
                <TextBox
                    className="column"
                    name="description-modify"
                    updateValue={setUpdatedDescription}
                    value={updatedDescription}
                />
            </div>
            <div className="columns is-mobile is-vcentered">
                <div className="column is-3">
                    <span>Description</span>
                </div>
                <DateBox
                    className="column is-4-desktop is-4-tablet is-2-widescreen"
                    name="date"
                    updateValue={setUpdatedOccuredAt}
                    value={updatedOccuredAt}
                />
            </div>
        </Modal>
    );
};

const TransactionCardMessageComponent: React.FC<TransactionCardMessageProps> = (props) => {
    const [isClickedDelete, setIsClickedDelete] = React.useState(false);
    const [isClickedUpdate, setIsClickedUpdate] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const onDeleteHandler = () => {
        setIsClickedDelete(true);
    };
    const onUpdateHandler = () => {
        setIsClickedUpdate(true);
    };
    const onCancelDeleteHandler = () => {
        if (isLoading) return;

        setIsClickedDelete(false);
    };
    const onCancelUpdateHandler = () => {
        if (isLoading) return;

        setIsClickedUpdate(false);
    };
    const onConfirmDeleteHandler = async () => {
        if (!props.onDelete) {
            return;
        }

        setIsLoading(true);

        await props.onDelete();

        setIsLoading(false);
        setIsClickedDelete(false);
    };
    const onConfirmUpdateHandler = async (
        amount: number,
        categoryId: number,
        description: string,
        occuredAt: Date
    ) => {
        if (!props.onUpdate) {
            return;
        }

        setIsLoading(true);

        await props.onUpdate(amount, categoryId, description, occuredAt);

        setIsLoading(false);
        setIsClickedUpdate(false);
    };
    const renderDelete = () => {
        if (isClickedDelete) {
            return (
                <Modal
                    title="Delete Transaction"
                    onCancelHandler={onCancelDeleteHandler}
                    onConfirmHandler={onConfirmDeleteHandler}
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
    const renderUpdate = () => {
        if (isClickedUpdate) {
            return (
                <UpdateTransactionModal
                    amount={props.amount}
                    category={props.category}
                    description={props.description}
                    occuredAt={props.occuredAt}
                    onCancel={onCancelUpdateHandler}
                    onConfirm={onConfirmUpdateHandler}
                />
            );
        }

        return (
            <UpdateBox onClick={onUpdateHandler}>
                <span className="icon">
                    <i className="fas fa-lg fa-edit has-text-link" aria-hidden="true"></i>
                </span>
            </UpdateBox>
        );
    };

    return (
        <MessageBox type={props.amount < 0 ? "dark" : "success"}>
            {renderDelete()}
            {renderUpdate()}
            <Content className="columns is-mobile is-gapless is-multiline">
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
                <div className="column is-half">{props.category?.name ?? "-"}</div>
                <div className="column is-half">
                    <span className="has-text-weight-bold">Description:</span>
                </div>
                <div className="column is-half">
                    {!props.description || props.description === "" ? "-" : props.description}
                </div>
            </Content>
        </MessageBox>
    );
};

const TransactionCardMessage = React.memo(TransactionCardMessageComponent);

export default TransactionCardMessage;
