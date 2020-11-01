import React from "react";
import styled from "styled-components";
import TextBox from "./TextBox";

export interface Item {
    id: number;
    name: string;
}

export interface AddOrRemoveProps {
    createFuncHandler: (value: string) => Promise<void>;
    deleteFuncHandler: (value: string) => Promise<void>;
    items: Item[];
}

interface ItemBoxProps {
    deleteFuncHandler: (value: string) => Promise<void>;
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

        await props.deleteFuncHandler(props.item.name);
        setIsClickedDelete(false);
    };

    const renderDelete = () => {
        if (isClickedDelete) {
            return (
                <div className="columns">
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
            <a onClick={onDeleteHandler} style={{ float: "right" }}>
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
        <div className="panel-block is-active is-primary">
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

const AddOrRemove: React.FC<AddOrRemoveProps> = (props) => {
    const [input, setInput] = React.useState("");

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
            <div className="columns is-gapless is-centered is-mobile">
                <TextBox
                    name="adding"
                    updateValue={setInput}
                    className="input column is-four-fifths"
                    type="text"
                    placeholder="Category's name"
                    defaultValue=""
                />
                <div className="column control">
                    <button
                        onClick={() => props.createFuncHandler(input)}
                        className="button is-link"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddOrRemove;
