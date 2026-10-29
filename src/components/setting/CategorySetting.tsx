import React from "react";
import { categoriesState } from "../../common/shareState";
import { createCategory, deleteCategory, patchCategory } from "../../service/categoryService";
import { CategoryType } from "../../service/constants";
import { allCategoryTypeLabels, categoryTypeFromLabel } from "../../service/helper/categoryHelper";
import { useNotification } from "../../service/helper/notificationHelper";
import EditAndDeleteSetting from "../bases/EditAndDeleteSetting";
import TextBoxWithButton from "../bases/TextBoxWithButton";
import { Flex } from "@radix-ui/themes";
import { useAtom } from "jotai";
import AnimatedPage from "../AnimatedPage";
import EditCategoryModal from "./EditCategoryModal";
import { describeError } from "../../service/helper/errorHelper";

const CategorySetting: React.FC = () => {
    const [categories, setCategories] = useAtom(categoriesState);
    const { addNotification } = useNotification();

    const addCategoryHandler = async (name: string, typeLabel: string) => {
        const response = await createCategory({
            name,
            type: categoryTypeFromLabel(typeLabel),
        });

        if (!response.addedCategory) {
            addNotification(describeError(response.errorCode, "Create category failed"), "danger");

            return;
        }

        const newCategories = categories
            .concat(response.addedCategory)
            .sort((a, b) => a.name.localeCompare(b.name));

        setCategories(newCategories);
        addNotification("Create category successful", "success");
    };

    const editCategoryHandler = async (id: string, name: string, type: CategoryType) => {
        const response = await patchCategory({ id, name, type });

        if (!response.category) {
            addNotification(describeError(response.errorCode, "Edit category failed"), "danger");

            return;
        }

        const newCategories = categories
            .map((c) => (c.id === id ? response.category : c))
            .sort((a, b) => a.name.localeCompare(b.name));

        setCategories(newCategories);
        addNotification("Edit category successful", "success");
    };
    const editCategoryModal = (id: string, triggerer: React.ReactElement) => {
        const category = categories.find((c) => c.id === id);

        return (
            <EditCategoryModal
                key={`${category.name}-${category.type}`}
                name={category.name}
                type={category.type}
                onSave={(name, type) => editCategoryHandler(id, name, type)}
                triggerer={triggerer}
            />
        );
    };

    const removeCategoryHandler = async (id: string) => {
        const response = await deleteCategory({ id });

        if (!response.isSuccess) {
            addNotification(describeError(response.errorCode, "Delete category failed"), "danger");

            return;
        }

        const newCategories = categories.filter((x) => x.id !== id);

        setCategories(newCategories);
        addNotification("Delete category successful", "success");
    };

    return (
        <AnimatedPage>
            <Flex direction="column" gap="3" mb="3">
                <EditAndDeleteSetting
                    deleteFuncHandler={removeCategoryHandler}
                    modifyModal={editCategoryModal}
                    items={categories.map((x) => {
                        const isOther = x.name === "Other";

                        return {
                            id: x.id,
                            name: x.name,
                            undeletable: isOther,
                            uneditable: isOther,
                        };
                    })}
                />
                <TextBoxWithButton
                    name="add"
                    type="text"
                    buttonType="primary"
                    buttonText="Create"
                    dropdown={allCategoryTypeLabels}
                    onClick={addCategoryHandler}
                />
            </Flex>
        </AnimatedPage>
    );
};

export default CategorySetting;
