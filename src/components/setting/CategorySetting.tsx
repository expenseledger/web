import React from "react";
import { categoriesState } from "../../common/shareState";
import { createCategory, deleteCategory, patchCategory } from "../../service/categoryService";
import { useNotification } from "../../service/helper/notificationHelper";
import EditAndDeleteSetting from "../bases/EditAndDeleteSetting";
import TextBoxWithButton from "../bases/TextBoxWithButton";
import { Flex } from "@radix-ui/themes";
import { useAtom } from "jotai";
import AnimatedPage from "../AnimatedPage";
import RenameCategoryModal from "./RenameCategoryModal";

const CategorySetting: React.FC = () => {
    const [categories, setCategories] = useAtom(categoriesState);
    const { addNotification } = useNotification();

    const addCategoryHandler = async (name: string) => {
        const response = await createCategory({
            name,
        });

        if (!response.addedCategory) {
            addNotification("Create category failed", "danger");

            return;
        }

        const newCategories = categories
            .concat(response.addedCategory)
            .sort((a, b) => a.name.localeCompare(b.name));

        setCategories(newCategories);
        addNotification("Create category successful", "success");
    };

    const renameCategoryHandler = async (id: string, name: string) => {
        const response = await patchCategory({ id, name });

        if (!response.category) {
            addNotification("Rename category failed", "danger");

            return;
        }

        const newCategories = categories
            .map((c) => (c.id === id ? response.category : c))
            .sort((a, b) => a.name.localeCompare(b.name));

        setCategories(newCategories);
        addNotification("Rename category successful", "success");
    };
    const renameCategoryModal = (id: string, triggerer: React.ReactElement) => {
        const category = categories.find((c) => c.id === id);

        return (
            <RenameCategoryModal
                key={category.name}
                name={category.name}
                onSave={(name) => renameCategoryHandler(id, name)}
                triggerer={triggerer}
            />
        );
    };

    const removeCategoryHandler = async (id: string) => {
        const response = await deleteCategory({ id });

        if (!response.isSuccess) {
            addNotification("Delete category failed", "danger");

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
                    modifyModal={renameCategoryModal}
                    items={categories.map((x) => {
                        // v3 refuses to delete or rename "None" (CATEGORY_PROTECTED).
                        const isNone = x.name === "None";

                        return { id: x.id, name: x.name, undeletable: isNone, uneditable: isNone };
                    })}
                />
                <TextBoxWithButton
                    name="add"
                    type="text"
                    buttonType="primary"
                    buttonText="Create"
                    onClick={addCategoryHandler}
                />
            </Flex>
        </AnimatedPage>
    );
};

export default CategorySetting;
