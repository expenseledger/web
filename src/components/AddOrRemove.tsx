import React from "react";
import Layout from "./Layout";

export interface Item {
    id: number;
    name: string;
}

export interface AddOrRemoveProps {
    addFunc?: (id: number) => Promise<void>;
    removeFunc?: (id: number) => Promise<void>;
    currentItems?: () => Item[];
}

interface ItemBoxProps {
    removeFunc: (id: number) => Promise<void>;
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
        if (!props.removeFunc) {
            return;
        }

        await props.removeFunc(1);
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
        <a className="panel-block is-active is-primary">
            <span className="panel-icon">
                <i className="fas fa-book" aria-hidden="true"></i>
            </span>
            bulma
            {renderDelete()}
        </a>
    );
};

const AddOrRemove: React.FC<AddOrRemoveProps> = (props) => {
    const i = Array.from(Array(100).keys());

    return (
        <Layout>
            <div className="columns is-mobile is-centered is-multiline">
                <div className="column is-full">
                    <nav
                        className="panel"
                        style={{
                            overflowY: "scroll",
                            maxHeight: "80vh",
                            backgroundColor: "white",
                        }}
                    >
                        {i.map((i) => (
                            <ItemBox removeFunc={props.removeFunc} key={i} />
                        ))}
                    </nav>
                </div>
                <div className="columns is-gapless is-centered is-mobile">
                    <div className="column is-four-fifths control">
                        <input
                            className="input"
                            type="text"
                            placeholder="Category's name"
                        />
                    </div>
                    <div className="column control">
                        <button
                            // onClick={() => props.onAddCategory}
                            className="button is-link"
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AddOrRemove;
