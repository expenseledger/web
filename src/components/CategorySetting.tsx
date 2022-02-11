import React from "react";
import { useRecoilState } from "recoil";
import { categoriesState, toastState } from "../common/shareState";
import { createCategory, deleteCategory, updateCategory } from "../service/categoryService";
import { mapNotificationProps } from "../service/helper/notificationHelper";
import Dropdown from "./bases/Dropdown";
import Modal from "./bases/Modal";
import SettingBox from "./bases/SettingBox";
import TextBox from "./bases/TextBox";

const CategorySetting: React.FC = () => {
    const [categories, setCategories] = useRecoilState(categoriesState);
    const [, setNotificationList] = useRecoilState(toastState);

    const addCategoryHandler = async (name: string) => {
        const response = await createCategory({ name });

        if (!response.addedCategory) {
            setNotificationList((prevNotiList) =>
                prevNotiList.concat(mapNotificationProps("Create category failed", "danger"))
            );

            return;
        }

        const newCategories = categories.concat(response.addedCategory);

        setCategories(newCategories);
        setNotificationList((prevNotiList) =>
            prevNotiList.concat(mapNotificationProps("Create category successful", "success"))
        );
    };

    const removeCategoryHandler = async (id: string | number) => {
        const response = await deleteCategory({ id: id as number });

        if (!response.isSuccess) {
            setNotificationList((prevNotiList) =>
                prevNotiList.concat(mapNotificationProps("Delete category failed", "danger"))
            );

            return;
        }

        const newCategories = categories.filter((x) => x.id !== id);

        setCategories(newCategories);
        setNotificationList((prevNotiList) =>
            prevNotiList.concat(mapNotificationProps("Delete category successful", "success"))
        );
    };
    const renderModal = (id: number, onCancel: () => void) => {
        const category = categories.find((x) => x.id === id);
        let newCategoryName = category.name;
        let newCategoryType = category.type;
        const modifyCategory = async () => {
            const response = await updateCategory({
                id: id,
                name: newCategoryName,
                type: newCategoryType,
            });

            if (response.updatedCategory) {
                setCategories(
                    categories.filter((x) => x.id !== id).concat(response.updatedCategory)
                );
                setNotificationList((prevNotiList) =>
                    prevNotiList.concat(mapNotificationProps("Update category success", "success"))
                );
            } else {
                setNotificationList((prevNotiList) =>
                    prevNotiList.concat(mapNotificationProps("Update category failed", "danger"))
                );
            }
        };
        const categoryNameHandler = (value: string) => {
            newCategoryName = value;
        };
        const categoryTypeHandler = (value: string) => {
            newCategoryType = value;
        };

        return (
            <Modal
                title="Modigy Category"
                onCancelHandler={onCancel}
                onConfirmHandler={modifyCategory}
                cancelBtnTxt="Cancel"
                confirmBtnTxt="Confirm">
                <div className="is-columns">
                    <div className="is-column">
                        <span>Name</span>
                    </div>
                    <div className="is-column">
                        <TextBox
                            name="category-modify"
                            updateValue={categoryNameHandler}
                            defaultValue={category.name}
                        />
                    </div>
                </div>
                <div className="is-columns">
                    <div className="is-column">
                        <span>Type</span>
                    </div>
                    <div className="is-column">
                        <Dropdown
                            defaultValue={category.type}
                            options={["ANY", "EXPENSE", "INCOME", "TRANSFER"]}
                            updateSelectedValue={categoryTypeHandler}
                        />
                    </div>
                </div>
            </Modal>
        );
    };

    return (
        <>
            <SettingBox
                createFuncHandler={addCategoryHandler}
                deleteFuncHandler={removeCategoryHandler}
                modifyModal={renderModal}
                items={categories.map((x) => {
                    return { id: x.id, name: x.name };
                })}
            />
        </>
    );
};

export default CategorySetting;
