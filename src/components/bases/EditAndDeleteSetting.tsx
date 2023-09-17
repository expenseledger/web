import React from "react";
import Button from "./Button";
import { Cross2Icon, Pencil1Icon } from "@radix-ui/react-icons";
import { Text, Card, Flex, Separator, Box, ScrollArea } from "@radix-ui/themes";

export interface Item {
    id: number;
    name: string;
}

export interface EditAndDelteSettingProps {
    deleteFuncHandler: (value: number) => Promise<void>;
    modifyModal: (id: number, triggerer: React.ReactElement) => React.ReactElement;
    items: Item[];
}

interface ItemBoxProps {
    deleteFuncHandler: (value: number) => Promise<void>;
    modifyModal: (id: number, triggerer: React.ReactElement) => React.ReactElement;
    item: Item;
}

const ItemBox: React.FC<ItemBoxProps> = (props) => {
    const [isLoading, setIsLoading] = React.useState(false);
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

        setIsLoading(true);

        await props.deleteFuncHandler(props.item.id);

        setIsLoading(false);
        setIsClickedDelete(false);
    };
    const renderButtonGroup = () => {
        if (isClickedDelete) {
            return (
                <div className="columns is-mobile is-variable is-1">
                    <div className="column">
                        <Button
                            onClickHandler={onCancelHandler}
                            size="small"
                            type="primary"
                            value="Cancel"
                            variant="outline"
                        />
                    </div>
                    <div className="column">
                        <Button
                            className={`${isLoading ? "is-loading" : ""}`}
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
            <Box>
                <Text mr="1" color="blue">
                    {props.modifyModal(
                        props.item.id,
                        <Text mr="1" color="blue">
                            <Pencil1Icon />
                        </Text>
                    )}
                </Text>
                <Text color="red">
                    <Cross2Icon onClick={onDeleteHandler} />
                </Text>
            </Box>
        );
    };

    return (
        <>
            <Flex width="100%" justify="between">
                <Text>{props.item.name}</Text>
                {renderButtonGroup()}
            </Flex>
        </>
    );
};

const EditAndDeleteSetting: React.FC<EditAndDelteSettingProps> = (props) => {
    return (
        <Card>
            <ScrollArea scrollbars="vertical" style={{ maxHeight: "80vh" }}>
                {props.items.map((i, idx) => (
                    <React.Fragment key={idx}>
                        <ItemBox
                            deleteFuncHandler={props.deleteFuncHandler}
                            key={i.id}
                            item={i}
                            modifyModal={props.modifyModal}
                        />
                        {idx == props.items.length - 1 ? null : (
                            <Box py="3">
                                <Separator size="4" />
                            </Box>
                        )}
                    </React.Fragment>
                ))}
            </ScrollArea>
        </Card>
    );
};

export default EditAndDeleteSetting;
