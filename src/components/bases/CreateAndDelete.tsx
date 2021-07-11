import React from "react";
import styled from "styled-components";
import Button from "./Button";
import Modal from "./Modal";

export interface Item {
    id: number;
    name: string;
}

interface ModalProps {
    title: string;
    content: React.ReactElement;
}

export interface CreateAndDeleteProps {
    createFuncHandler: (value: string, dropdownValue?: string) => Promise<void>;
    deleteFuncHandler: (value: number) => Promise<void>;
    items: Item[];
    dropdowns?: string[];
    modal?: ModalProps;
}

interface ItemBoxProps {
    deleteFuncHandler: (value: number) => Promise<void>;
    item: Item;
    modal?: ModalProps;
}

const Icon = styled.span`
    cursor: pointer;
`;

const ItemBox: React.FC<ItemBoxProps> = (props) => {
    const [isClickedDelete, setIsClickedDelete] = React.useState(false);
    const [isClickedEdit, setIsClickedEdit] = React.useState(false);
    const [isSaveLoading, setIsSaveLoading] = React.useState(false);
    const onDeleteHandler = () => {
        setIsClickedDelete(true);
    };
    const onDeleteCancelHandler = () => {
        setIsClickedDelete(false);
    };
    const onDeleteConfirmHandler = async () => {
        if (!props.deleteFuncHandler) {
            return;
        }

        await props.deleteFuncHandler(props.item.id);
        setIsClickedDelete(false);
    };
    const onEditHandler = () => {
        setIsClickedEdit(true);
    };
    const onEditCancelHandler = () => {
        setIsClickedEdit(false);
    };
    const onEditConfirmHandler = () => {
        setIsClickedEdit(false);
    };
    const renderDelete = () => {
        if (isClickedDelete) {
            return (
                <div className="columns is-mobile is-variable is-1">
                    <div className="column">
                        <Button
                            onClickHandler={onDeleteCancelHandler}
                            size="small"
                            outlined
                            type="primary"
                            value="Cancel"
                        />
                    </div>
                    <div className="column">
                        <Button
                            onClickHandler={onDeleteConfirmHandler}
                            size="small"
                            type="danger"
                            value="Confirm"
                        />
                    </div>
                </div>
            );
        }

        return (
            <Icon className="icon" onClick={onDeleteHandler}>
                <i
                    className="fas fa-lg fa-times has-text-danger"
                    aria-hidden="true"
                ></i>
            </Icon>
        );
    };
    const renderEdit = () => {
        return !isClickedDelete ? (
            <>
                <Icon className="icon" onClick={onEditHandler}>
                    <i className="far fa-lg fa-edit"></i>
                </Icon>
                {isClickedEdit && props.modal && (
                    <Modal
                        title={props.modal.title}
                        isConfirmLoading={isSaveLoading}
                        onCancleHandler={onEditCancelHandler}
                        onConfirmHandler={onEditConfirmHandler}
                    >
                        {props.modal.content}
                    </Modal>
                )}
            </>
        ) : null;
    };

    return (
        <div className="panel-block is-active is-primary is-flex-direction-row is-justify-content-space-between">
            <span>{props.item.name}</span>
            <div>
                {renderEdit()}
                {renderDelete()}
            </div>
        </div>
    );
};

const ItemContainer = styled.nav`
    overflow-y: scroll;
    max-height: 80vh;
    background-color: white;
`;

const CreateAndDelete: React.FC<CreateAndDeleteProps> = (props) => {
    return (
        <div className="columns is-mobile is-centered is-multiline">
            <div className="column is-full">
                <ItemContainer className="panel">
                    {props.items.map((i) => (
                        <ItemBox
                            deleteFuncHandler={props.deleteFuncHandler}
                            key={i.id}
                            item={i}
                        />
                    ))}
                </ItemContainer>
            </div>
            {props.children}
            {/* <TextBoxWithButton
                name="add"
                type="text"
                buttonType="link"
                buttonText="Create"
                onClick={props.createFuncHandler}
                dropdown={props.dropdowns}
            /> */}
        </div>
    );
};

export default CreateAndDelete;
