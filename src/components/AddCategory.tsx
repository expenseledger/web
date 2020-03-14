import * as React from "react";

interface AddCategoryProps {
    isHide?: boolean;
    onAddCategory: (name: string) => Promise<void>;
}

function AddCategory(props: AddCategoryProps) {
    if (props.isHide) {
        return null;
    }

    return (
        <div className="field has-addons">
            <div className="control">
                <input
                    className="input"
                    type="text"
                    placeholder="Category's name"
                />
            </div>
            <div className="control">
                <button
                    onClick={() => props.onAddCategory}
                    className="button is-info"
                >
                    Create
                </button>
            </div>
        </div>
    );
}

export default AddCategory;
