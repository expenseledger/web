import * as React from "react";
import Button, { ButtonType } from "./Button";
import { Dialog, Flex } from "@radix-ui/themes";
import AnimatedPage from "../AnimatedPage";
import { AnimatePresence } from "framer-motion";

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
            <AnimatePresence>
                {isOpen && (
                    <AnimatedPage>
                        <Dialog.Content
                            style={{ maxWidth: "450px" }}
                            onOpenAutoFocus={(event) => {
                                event.preventDefault();
                            }}>
                            <Dialog.Title>{props.title}</Dialog.Title>
                            <Flex>{props.children}</Flex>
                            <Flex mt="3" gap="2" justify="end">
                                <Button
                                    value={props.confirmBtnTxt}
                                    onClickHandler={onConfirmHandler}
                                    type={props.confirmBtnType}
                                    isLoading={isLoading}
                                />
                                <Button
                                    value={props.cancelBtnTxt}
                                    onClickHandler={() => setIsOpen(false)}
                                    type={props.cancelBtnType}
                                    variant="soft"
                                />
                            </Flex>
                        </Dialog.Content>
                    </AnimatedPage>
                )}
            </AnimatePresence>
        </Dialog.Root>
    );
};

export default Modal;
