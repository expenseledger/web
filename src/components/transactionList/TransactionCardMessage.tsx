import React from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { categoriesState, currencyState } from "../../common/shareState";
import { toNumber } from "../../common/utils";
import dayjs from "../../lib/dayjs";
import { TransactionType } from "../../service/constants";
import Category from "../../service/model/Category";
import AmountTxt from "../bases/AmountTxt";
import DateBox from "../bases/DateBox";
import Dropdown from "../bases/Dropdown";
import MessageBox from "../bases/MessageBox";
import Modal from "../bases/Modal";
import TextBox from "../bases/TextBox";
import { Cross2Icon, Pencil1Icon } from "@radix-ui/react-icons";
import { Text } from "@radix-ui/themes";

interface UpdateTransactionModalProps {
    amount: number;
    category: Category;
    description: string;
    occurredAt: Date;
    transactionType: TransactionType;
    onCancel: () => void;
    onConfirm: (
        amount: number,
        categoryId: number,
        description: string,
        occuredAt: Date
    ) => Promise<void>;
    triggerer: React.ReactElement;
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
    occurredAt: Date;
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
    const [updatedAmountText, setUpdatedAmountText] = React.useState(
        Math.abs(props.amount).toString()
    );
    const [updateCategory, setUpdatCategory] = React.useState(props.category);
    const [updatedDescription, setUpdatedDescription] = React.useState(props.description);
    const [updatedOccuredAt, setUpdatedOccuredAt] = React.useState(
        dayjs(props.occurredAt).format("YYYY-MM-DD")
    );
    const updateCategoryHandler = (value: string) => {
        const category = categoryOptions.find((c) => c.name === value);
        if (!category) return;

        setUpdatCategory(category);
    };

    return (
        <Modal
            title="Update Transaction"
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
            confirmBtnType="primary"
            triggerer={props.triggerer}>
            <div className="columns is-mobile is-vcentered has-text-left">
                <div className="column is-4">
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
            <div className="columns is-mobile is-vcentered has-text-left">
                <div className="column is-4">
                    <span>Category</span>
                </div>
                <Dropdown
                    className="column"
                    options={categoryOptions
                        .filter((c) => c.type === props.transactionType || c.type === "ANY")
                        .map((c) => c.name)}
                    updateSelectedValue={updateCategoryHandler}
                />
            </div>
            <div className="columns is-mobile is-vcentered has-text-left">
                <div className="column is-4">
                    <span>Description</span>
                </div>
                <TextBox
                    className="column"
                    name="description-modify"
                    updateValue={setUpdatedDescription}
                    value={updatedDescription}
                />
            </div>
            <div className="columns is-mobile is-vcentered has-text-left">
                <div className="column is-4">
                    <span>Date</span>
                </div>
                <DateBox
                    className="column"
                    name="date"
                    updateValue={setUpdatedOccuredAt}
                    value={updatedOccuredAt}
                />
            </div>
        </Modal>
    );
};

const TransactionCardMessageComponent: React.FC<TransactionCardMessageProps> = (props) => {
    const onCancelUpdateHandler = () => {
        return;
    };
    const onConfirmDeleteHandler = async () => {
        if (!props.onDelete) {
            return;
        }

        await props.onDelete();
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

        await props.onUpdate(amount, categoryId, description, occuredAt);
    };
    const renderDelete = () => {
        return (
            <DeleteBox>
                <Modal
                    title="Delete Transaction"
                    onConfirmHandler={onConfirmDeleteHandler}
                    cancelBtnTxt="Cancel"
                    cancelBtnType="default"
                    confirmBtnTxt="Delete"
                    confirmBtnType="danger"
                    triggerer={
                        <Text color="red">
                            <Cross2Icon />
                        </Text>
                    }>
                    <div className="has-text-black">Are you sure?</div>
                </Modal>
            </DeleteBox>
        );
    };
    const renderUpdate = () => {
        return (
            <UpdateBox>
                <UpdateTransactionModal
                    amount={props.amount}
                    category={props.category}
                    description={props.description}
                    occurredAt={props.occurredAt}
                    transactionType={props.type}
                    onCancel={onCancelUpdateHandler}
                    onConfirm={onConfirmUpdateHandler}
                    triggerer={
                        <Text color="blue">
                            <Pencil1Icon />
                        </Text>
                    }
                />
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
