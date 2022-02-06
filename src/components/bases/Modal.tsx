import * as React from "react";

interface ModalProps {
    title: string;
    confirmBtnTxt: string;
    cancelBtnTxt: string;
    onConfirmHandler: () => Promise<void>;
    onCancelHandler: () => void;
}

const Modal: React.FC<ModalProps> = (props) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const onConfirmHandler = async () => {
        setIsLoading(true);
        await props.onConfirmHandler();
        setIsLoading(false);
    };

    return (
        <div className="modal is-active">
            <div className="modal-background" onClick={props.onCancelHandler}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Delete transaction</p>
                    <button className="delete" onClick={props.onCancelHandler}></button>
                </header>
                <section className="modal-card-body">{props.children}</section>
                <footer className="modal-card-foot">
                    <button
                        className={`button is-danger ${isLoading ? "is-loading" : ""}`}
                        onClick={onConfirmHandler}>
                        {props.confirmBtnTxt}
                    </button>
                    <button className="button" onClick={props.onCancelHandler}>
                        {props.cancelBtnTxt}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default Modal;
