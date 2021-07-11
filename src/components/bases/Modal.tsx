import React from "react";

interface ModalProps {
    onCancleHandler: () => void;
    onConfirmHandler: () => void;
    isConfirmLoading: boolean;
    title: string;
}

const Modal: React.FC<ModalProps> = (props) => {
    return (
        <div className="modal is-active">
            <div
                className="modal-background"
                onClick={props.onCancleHandler}
            ></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">{props.title}</p>
                    <button
                        className="delete"
                        onClick={props.onCancleHandler}
                    ></button>
                </header>
                <section className="modal-card-body has-text-black">
                    {props.children}
                </section>
                <footer className="modal-card-foot">
                    <button
                        className={`button is-success ${
                            props.isConfirmLoading ? "is-loading" : ""
                        }`}
                        onClick={props.onConfirmHandler}
                    >
                        Save
                    </button>
                    <button className="button" onClick={props.onCancleHandler}>
                        Cancel
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default Modal;
