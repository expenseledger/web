import * as React from "react";
import Button, { ButtonType } from "./Button";

interface Props {
    title: string;
    confirmBtnTxt: string;
    confirmBtnType: ButtonType;
    cancelBtnTxt: string;
    cancelBtnType: ButtonType;
    onConfirmHandler: () => Promise<void>;
    onCancelHandler: () => void;
}

type ModalProps = React.PropsWithChildren<Props>;

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
                    <p className="modal-card-title">{props.title}</p>
                    <button className="delete" onClick={props.onCancelHandler}></button>
                </header>
                <section className="modal-card-body">{props.children}</section>
                <footer className="modal-card-foot">
                    <Button
                        className={`${isLoading ? "is-loading" : ""}`}
                        value={props.confirmBtnTxt}
                        onClickHandler={onConfirmHandler}
                        type={props.confirmBtnType}
                    />
                    <Button
                        value={props.cancelBtnTxt}
                        onClickHandler={props.onCancelHandler}
                        type={props.cancelBtnType}
                    />
                </footer>
            </div>
        </div>
    );
};

export default Modal;
