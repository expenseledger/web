import React from "react";
import styled from "styled-components";
import Button from "./Button";
import TextBoxWithButton from "./TextBoxWithButton";

export interface Item {
    id: number;
    name: string;
}

export interface CreateAndDeleteProps {
    createFuncHandler: (value: string, dropdownValue?: string) => Promise<void>;
    deleteFuncHandler: (value: number) => Promise<void>;
    items: Item[];
    dropdowns?: string[];
}

interface ItemBoxProps {
    deleteFuncHandler: (value: number) => Promise<void>;
    item: Item;
}

const ItemBox: React.FC<ItemBoxProps> = (props) => {
    const [isClickedDelete, setIsClickedDelete] = React.useState(false);
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

    const renderDelete = () => {
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
            <a onClick={onDeleteHandler}>
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
        <div className="panel-block is-active is-primary is-flex-direction-row is-justify-content-space-between">
            <span>{props.item.name}</span>
            {renderDelete()}
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

export default CreateAndDelete;
