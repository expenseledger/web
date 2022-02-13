import React from "react";
import styled from "styled-components";
import Button from "./Button";
import TextBoxWithButton from "./TextBoxWithButton";

export interface Item {
    id: number;
    name: string;
}

export interface SettingBoxProps {
    createFuncHandler: (value: string, dropdownValue?: string) => Promise<void>;
    deleteFuncHandler: (value: number) => Promise<void>;
    modifyModal: (id: number, onCancel: () => void) => React.ReactElement;
    items: Item[];
    dropdowns?: string[];
}

interface ItemBoxProps {
    deleteFuncHandler: (value: number) => Promise<void>;
    modifyModal: (id: number, onCancel: () => void) => React.ReactElement;
    item: Item;
}

const ItemBox: React.FC<ItemBoxProps> = (props) => {
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

        await props.deleteFuncHandler(props.item.id);
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

const SettingBox: React.FC<SettingBoxProps> = (props) => {
    return (
        <div className="columns is-mobile is-centered is-multiline">
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
            <TextBoxWithButton
                name="add"
                type="text"
                buttonType="link"
                buttonText="Create"
                onClick={props.createFuncHandler}
                dropdown={props.dropdowns}
            />
        </div>
    );
};

export default SettingBox;