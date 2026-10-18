import React from "react";
import Modal from "../bases/Modal";
import TextBox from "../bases/TextBox";
import { Box, Grid, Text } from "@radix-ui/themes";

interface RenameCategoryModalProps {
    name: string;
    onSave: (name: string) => Promise<void>;
    triggerer: React.ReactElement;
}

const RenameCategoryModal: React.FC<RenameCategoryModalProps> = (props) => {
    const [name, setName] = React.useState(props.name);

    return (
        <Modal
            title="Rename Category"
            onConfirmHandler={() => props.onSave(name)}
            cancelBtnTxt="Cancel"
            cancelBtnType="default"
            confirmBtnTxt="Save"
            confirmBtnType="primary"
            triggerer={props.triggerer}>
            <Grid columns="3" gap="3" align="center" width="100%">
                <Box>
                    <Text>Name</Text>
                </Box>
                <Box gridColumn="2 / span 2">
                    <TextBox
                        name="category-name"
                        ariaLabel="Name"
                        updateValue={setName}
                        value={name}
                    />
                </Box>
            </Grid>
        </Modal>
    );
};

export default RenameCategoryModal;
