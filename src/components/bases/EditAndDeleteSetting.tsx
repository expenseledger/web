import React from "react";
import styled from "styled-components";
import Button from "./Button";

export interface Item {
    id: number;
    name: string;
}

export interface EditAndDelteSettingProps {
    deleteFuncHandler: (value: number) => Promise<void>;
    modifyModal: (id: number, onCancel: () => void) => React.ReactElement;
    items: Item[];
}

interface ItemBoxProps {
    deleteFuncHandler: (value: number) => Promise<void>;
    modifyModal: (id: number, onCancel: () => void) => React.ReactElement;
    item: Item;
}

const ItemBox: React.FC<ItemBoxProps> = (props) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [isClickedDelete, setIsClickedDelete] = React.useState(false);
    const [isModifyClick, setIsModifyClick] = React.useState(false);
    const onDeleteHandler = () => {
        setIsClickedDelete(true);
    };
    const onCancelHandler = () => {
        setIsClickedDelete(false);
    };
    const onConfirmHandler = async () => {
        if (!props.deleteFuncHandler) {
            return;
        }

        setIsLoading(true);

        await props.deleteFuncHandler(props.item.id);

        setIsLoading(false);
        setIsClickedDelete(false);
    };
    const onModifyClick = () => {
        setIsModifyClick(true);
    };
    const onModifyCancel = () => {
        setIsModifyClick(false);
    };
    const renderButtonGroup = () => {
        if (isClickedDelete) {
            return (
                <div className="columns is-mobile is-variable is-1">
                    <div className="column">
                        <Button
                            onClickHandler={onCancelHandler}
                            size="small"
                            outlined
                            type="primary"
                            value="Cancel"
                        />
                    </div>
                    <div className="column">
                        <Button
                            className={`${isLoading ? "is-loading" : ""}`}
                            onClickHandler={onConfirmHandler}
                            size="small"
                            type="danger"
                            value="Confirm"
                        />
                    </div>
                </div>
            );
        }

        return (
            <div>
                <a>
                    <span className="icon" onClick={onModifyClick}>
                        <i className="fas fa-lg fa-edit" aria-hidden="true"></i>
                    </span>
                </a>
                <a onClick={onDeleteHandler}>
                    <span className="icon">
                        <i className="fas fa-lg fa-times has-text-danger" aria-hidden="true"></i>
                    </span>
                </a>
            </div>
        );
    };

    return (
        <>
            {isModifyClick ? props.modifyModal(props.item.id, onModifyCancel) : null}
            <div className="panel-block is-active is-primary is-flex-direction-row is-justify-content-space-between">
                <span>{props.item.name}</span>
                {renderButtonGroup()}
            </div>
        </>
    );
};

const ItemContainer = styled.nav`
    overflow-y: scroll;
    max-height: 80vh;
    background-color: white;
`;

const EditAndDeleteSetting: React.FC<EditAndDelteSettingProps> = (props) => {
    return (
        <div className="column is-full">
            <ItemContainer className="panel">
                {props.items.map((i) => (
                    <ItemBox
                        deleteFuncHandler={props.deleteFuncHandler}
                        key={i.id}
                        item={i}
                        modifyModal={props.modifyModal}
                    />
                ))}
            </ItemContainer>
        </div>
    );
};

export default EditAndDeleteSetting;
