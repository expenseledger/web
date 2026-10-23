import React from "react";
import { CategoryType } from "../../service/constants";
import {
    allCategoryTypeLabels,
    categoryTypeFromLabel,
    categoryTypeLabels,
} from "../../service/helper/categoryHelper";
import Dropdown from "../bases/Dropdown";
import Modal from "../bases/Modal";
import TextBox from "../bases/TextBox";
import { Box, Grid, Text } from "@radix-ui/themes";

interface EditCategoryModalProps {
    name: string;
    type: CategoryType;
    onSave: (name: string, type: CategoryType) => Promise<void>;
    triggerer: React.ReactElement;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = (props) => {
    const [name, setName] = React.useState(props.name);
    const [type, setType] = React.useState(props.type);

    return (
        <Modal
            title="Edit Category"
            onConfirmHandler={() => props.onSave(name, type)}
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
                <Box>
                    <Text>Type</Text>
                </Box>
                <Box gridColumn="2 / span 2">
                    <Dropdown
                        ariaLabel="Type"
                        options={allCategoryTypeLabels}
                        defaultValue={categoryTypeLabels[type]}
                        updateSelectedValue={(label) => setType(categoryTypeFromLabel(label))}
                    />
                </Box>
            </Grid>
        </Modal>
    );
};

export default EditCategoryModal;
