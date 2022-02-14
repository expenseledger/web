import * as R from "ramda";
import React from "react";
import { useRecoilState } from "recoil";
import { categoriesState, toastState } from "../common/shareState";
import { createCategory, deleteCategory, updateCategory } from "../service/categoryService";
import { CategoryType } from "../service/constants";
import { mapNotificationProps } from "../service/helper/notificationHelper";
import Dropdown from "./bases/Dropdown";
import Modal from "./bases/Modal";
import SettingBox from "./bases/SettingBox";
import TextBox from "./bases/TextBox";

interface ModifyModalProps {
    id: number;
    onCancel: () => void;
}

const allCategoryTypes: CategoryType[] = ["ANY", "EXPENSE", "INCOME", "TRANSFER"];

const ModifyModal: React.FC<ModifyModalProps> = (props) => {
    const [categories, setCategories] = useRecoilState(categoriesState);
    const [, setNotificationList] = useRecoilState(toastState);
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
            setNotificationList((prevNotiList) =>
                prevNotiList.concat(mapNotificationProps("Update category success", "success"))
            );
        } else {
            setNotificationList((prevNotiList) =>
                prevNotiList.concat(mapNotificationProps("Update category failed", "danger"))
            );
        }

        props.onCancel();
    };
    const categoryNameHandler = (value: string) => {
        setName(value);
    };
    const categoryTypeHandler = (value: string) => {
        setType(value as CategoryType);
    };

    React.useEffect(() => {
        const category = categories.find((x) => x.id === props.id);

        setName(category.name);
        setType(category.type);
    }, [categories, props.id]);

    return (
        <Modal
            title="Modigy Category"
            onCancelHandler={props.onCancel}
            onConfirmHandler={modifyCategory}
            cancelBtnTxt="Cancel"
            confirmBtnTxt="Confirm">
            <div className="columns is-mobile is-vcentered">
                <div className="column is-2">
                    <span>Name</span>
                </div>
                <TextBox
                    className="column"
                    name="category-modify"
                    updateValue={categoryNameHandler}
                    value={name}
                />
            </div>
            <div className="columns is-mobile is-vcentered">
                <div className="column is-2">
                    <span>Type</span>
                </div>
                <Dropdown
                    className="column"
                    value={type}
                    options={allCategoryTypes}
                    updateSelectedValue={categoryTypeHandler}
                />
            </div>
        </Modal>
    );
};

const CategorySetting: React.FC = () => {
    const [categories, setCategories] = useRecoilState(categoriesState);
    const [, setNotificationList] = useRecoilState(toastState);

    const addCategoryHandler = async (name: string, type: string) => {
        const response = await createCategory({
            name,
            type: type as CategoryType,
        });

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

    return (
        <>
            <SettingBox
                createFuncHandler={addCategoryHandler}
                deleteFuncHandler={removeCategoryHandler}
                modifyModal={(id, onCancel) => <ModifyModal id={id} onCancel={onCancel} />}
                items={categories.map((x) => {
                    return { id: x.id, name: x.name };
                })}
                dropdowns={allCategoryTypes}
            />
        </>
    );
};

export default CategorySetting;
