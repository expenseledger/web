import * as React from "react";
import Button, { ButtonType } from "./Button";
import { Dialog, Flex } from "@radix-ui/themes";

interface Props {
    title: string;
    confirmBtnTxt: string;
    confirmBtnType: ButtonType;
    cancelBtnTxt: string;
    cancelBtnType: ButtonType;
    onConfirmHandler: () => Promise<void>;
    triggerer: React.ReactElement;
}

type ModalProps = React.PropsWithChildren<Props>;

const Modal: React.FC<ModalProps> = (props) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const onConfirmHandler = async () => {
        setIsLoading(true);
        await props.onConfirmHandler();
        setIsLoading(false);
        setIsOpen(false);
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
            <Dialog.Trigger>{props.triggerer}</Dialog.Trigger>
            <Dialog.Content style={{ maxWidth: "450px" }}>
                <Dialog.Title>{props.title}</Dialog.Title>
                <Flex>{props.children}</Flex>
                <Flex mt="3" gap="2" justify="end">
                    <Button
                        className={`${isLoading ? "is-loading" : ""}`}
                        value={props.confirmBtnTxt}
                        onClickHandler={onConfirmHandler}
                        type={props.confirmBtnType}
                    />
                    <Button
                        value={props.cancelBtnTxt}
                        onClickHandler={() => setIsOpen(false)}
                        type={props.cancelBtnType}
                    />
                </Flex>
            </Dialog.Content>
            {/* <div className="modal-background" onClick={props.onCancelHandler}></div>
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
            </div> */}
        </Dialog.Root>
    );
};

export default Modal;
