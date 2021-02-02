import React from "react";
import { useRecoilState } from "recoil";
import { categoriesState, toastState } from "../common/shareState";
import { createCategory, deleteCategory } from "../service/categoryService";
import { mapNotificationProps } from "../service/mapper";
import CreateAndDelete from "./bases/CreateAndDelete";
import { withAuthProtection } from "./hoc/WithAuthProtection";
import Layout from "./Layout";

const CategorySetting: React.FC = () => {
    const [categories, setCategories] = useRecoilState(categoriesState);
    const [, setNotificationList] = useRecoilState(toastState);

    const addCategoryHandler = async (name: string) => {
        const response = await createCategory({ name });

        if (!response.isSuccess) {
            setNotificationList((prevNotiList) =>
                prevNotiList.concat(
                    mapNotificationProps("Create category failed", "danger")
                )
            );

            return;
        }

        // const newCategories = categories.concat({ name });

        // setCategories(newCategories);
        setNotificationList((prevNotiList) =>
            prevNotiList.concat(
                mapNotificationProps("Create category successful", "success")
            )
        );
    };

    const removeCategoryHandler = async (id: string | number) => {
        const response = await deleteCategory({ id: id as number });

        if (!response.isSuccess) {
            setNotificationList((prevNotiList) =>
                prevNotiList.concat(
                    mapNotificationProps("Delete category failed", "danger")
                )
            );

            return;
        }

        const newCategories = categories.filter((x) => x.id !== id);

        setCategories(newCategories);
        setNotificationList((prevNotiList) =>
            prevNotiList.concat(
                mapNotificationProps("Delete category successful", "success")
            )
        );
    };

    return (
        <Layout>
            <CreateAndDelete
                createFuncHandler={addCategoryHandler}
                deleteFuncHandler={removeCategoryHandler}
                items={categories.map((x) => {
                    return { id: x.id, name: x.name };
                })}
            />
        </Layout>
    );
};

export default withAuthProtection()(CategorySetting);
