import React from "react";
import Layout from "./Layout";

export interface Item {
    id: number;
    name: string;
}

export interface AddOrRemoveProps {
    addFunc?: (id: number) => Promise<void>;
    removeFunc?: (id: number) => Promise<void>;
    currentItems?: Item[];
}

const AddOrRemove: React.FC<AddOrRemoveProps> = () => {
    const i = Array.from(Array(100).keys());
    const renderItemList = () => (
        <nav
            className="panel"
            style={{
                overflowY: "scroll",
                maxHeight: "80vh",
                backgroundColor: "white",
            }}
        >
            {i.map((i) => (
                <a className="panel-block is-active is-primary" key={i}>
                    <span className="panel-icon">
                        <i className="fas fa-book" aria-hidden="true"></i>
                    </span>
                    bulma
                </a>
            ))}
        </nav>
    );

    return (
        <Layout>
            <div className="columns is-mobile is-centered is-multiline">
                <div className="column is-full">{renderItemList()}</div>
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
