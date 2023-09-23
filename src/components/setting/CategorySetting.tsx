import * as R from "ramda";
import React from "react";
import { useRecoilState } from "recoil";
import { categoriesState } from "../../common/shareState";
import { createCategory, deleteCategory, updateCategory } from "../../service/categoryService";
import { CategoryType } from "../../service/constants";
import {
    allCategoryTypesString,
    mapStringToCategoryType,
} from "../../service/helper/categoryHelper";
import { useNotification } from "../../service/helper/notificationHelper";
import Dropdown from "../bases/Dropdown";
import EditAndDeleteSetting from "../bases/EditAndDeleteSetting";
import Modal from "../bases/Modal";
import TextBox from "../bases/TextBox";
import TextBoxWithButton from "../bases/TextBoxWithButton";
import { Box, Flex, Grid, Text } from "@radix-ui/themes";

interface ModifyModalProps {
    id: number;
    triggerer: React.ReactElement;
}

const ModifyModal: React.FC<ModifyModalProps> = (props) => {
    const [categories, setCategories] = useRecoilState(categoriesState);
    const { addNotification } = useNotification();
    const [name, setName] = React.useState("");
    const [type, setType] = React.useState<CategoryType>("ANY");
    const modifyCategory = async () => {
        const response = await updateCategory({
            id: props.id,
            name,
            type,
        });

        if (response.updatedCategory) {
            const tCategories = R.clone(categories);
            const idx = tCategories.findIndex((x) => x.id === props.id);

            tCategories[idx].name = response.updatedCategory.name;
            tCategories[idx].type = response.updatedCategory.type;

            setCategories(tCategories);
            addNotification("Update category success", "success");
        } else {
            addNotification("Update category failed", "danger");
        }
    };
    const categoryNameHandler = (value: string) => {
        setName(value);
    };
    const categoryTypeHandler = (value: string) => {
        setType(mapStringToCategoryType(value));
    };

    React.useEffect(() => {
        const category = categories.find((x) => x.id === props.id);

        setName(category.name);
        setType(category.type);
    }, [categories, props.id]);

    return (
        <Modal
            title="Update Category"
            onConfirmHandler={modifyCategory}
            cancelBtnTxt="Cancel"
            cancelBtnType="default"
            confirmBtnTxt="Confirm"
            confirmBtnType="primary"
            triggerer={props.triggerer}>
            <Grid columns="2" gap="3" py="3">
                <Box>
                    <Text>Name</Text>
                </Box>
                <Box>
                    <TextBox
                        className="column"
                        name="category-modify"
                        updateValue={categoryNameHandler}
                        value={name}
                    />
                </Box>
                <Box>
                    <Text>Type</Text>
                </Box>
                <Box>
                    <Dropdown
                        className="column"
                        options={allCategoryTypesString}
                        updateSelectedValue={categoryTypeHandler}
                    />
                </Box>
            </Grid>
        </Modal>
    );
};

const CategorySetting: React.FC = () => {
    const [categories, setCategories] = useRecoilState(categoriesState);
    const { addNotification } = useNotification();

    const addCategoryHandler = async (name: string, type: string) => {
        const response = await createCategory({
            name,
            type: mapStringToCategoryType(type),
        });

        if (!response.addedCategory) {
            addNotification("Create category failed", "danger");

            return;
        }

        const newCategories = categories.concat(response.addedCategory);

        setCategories(newCategories);
        addNotification("Create category successful", "success");
    };

    const removeCategoryHandler = async (id: string | number) => {
        const response = await deleteCategory({ id: id as number });

        if (!response.isSuccess) {
            addNotification("Delete category failed", "danger");

            return;
        }

        const newCategories = categories.filter((x) => x.id !== id);

        setCategories(newCategories);
        addNotification("Delete category successful", "success");
    };

    return (
        <Flex direction="column" gap="3" mb="3">
            <EditAndDeleteSetting
                deleteFuncHandler={removeCategoryHandler}
                modifyModal={(id, triggerer) => <ModifyModal id={id} triggerer={triggerer} />}
                items={categories.map((x) => {
                    return { id: x.id, name: x.name };
                })}
            />
            <TextBoxWithButton
                name="add"
                type="text"
                buttonType="link"
                buttonText="Create"
                onClick={addCategoryHandler}
                dropdown={allCategoryTypesString}
            />
        </Flex>
    );
};

export default CategorySetting;
