import React from "react";
import { useRecoilState } from "recoil";
import { categoriesState, toastState } from "../common/shareState";
import { createCategory, deleteCategory } from "../service/categoryService";
import { CategoryType } from "../service/constants";
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
        let newType = category.type;

        return (
            <Modal
                title="Modigy Category"
                onCancelHandler={onCancel}
                onConfirmHandler={() => {
                    return new Promise((resolve, _) => resolve());
                }}
                cancelBtnTxt="Cancel"
                confirmBtnTxt="Confirm">
                <div className="is-columns">
                    <div className="is-column">
                        <span>Name</span>
                    </div>
                    <div className="is-column">
                        <TextBox
                            name="category-modify"
                            updateValue={(value) => {
                                newCategoryName = value;
                                console.log(newCategoryName);
                            }}
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
                            updateSelectedValue={(value) => {
                                newType = value as CategoryType;
                                console.log(newType);
                            }}
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
