import React from "react";
import { categoriesState } from "../../common/shareState";
import { createCategory, deleteCategory } from "../../service/categoryService";
import { useNotification } from "../../service/helper/notificationHelper";
import EditAndDeleteSetting from "../bases/EditAndDeleteSetting";
import TextBoxWithButton from "../bases/TextBoxWithButton";
import { Flex } from "@radix-ui/themes";
import { useAtom } from "jotai";
import AnimatedPage from "../AnimatedPage";

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
                    items={categories.map((x) => {
                        return { id: x.id, name: x.name, undeletable: x.name === "None" };
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
