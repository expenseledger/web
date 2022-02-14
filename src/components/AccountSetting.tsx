import React from "react";
import { useRecoilState } from "recoil";
import { accountsState, categoriesState, toastState } from "../common/shareState";
import { createAccount, deleteAccount } from "../service/accountService";
import { AccountType } from "../service/constants";
import { mapAccountTypeToString, mapStringToAccountType } from "../service/helper/accountHelper";
import { mapNotificationProps } from "../service/helper/notificationHelper";
import Dropdown from "./bases/Dropdown";
import Modal from "./bases/Modal";
import SettingBox from "./bases/SettingBox";
import TextBox from "./bases/TextBox";

interface ModifyModalProps {
    id: number;
    onCancel: () => void;
}

const allAccountTypes: AccountType[] = ["BANK_ACCOUNT", "CASH", "CREDIT"];

const ModifyModal: React.FC<ModifyModalProps> = (props) => {
    const [categories, _] = useRecoilState(categoriesState);
    const [accounts, setAccounts] = useRecoilState(accountsState);
    const [, setNotificationList] = useRecoilState(toastState);
    const [name, setName] = React.useState("");
    const [balance, setBalance] = React.useState(0);
    const [type, setType] = React.useState<AccountType>("CASH");
    const modifyAccount = async () => {
        // const response = await updateCategory({
        //     id: props.id,
        //     name,
        //     type,
        // });

        // if (response.updatedCategory) {
        //     // setCategories(
        //     //     categories
        //     //         .filter((x) => x.id !== props.id)
        //     //         .concat(response.updatedCategory)
        //     //         .sort((a, b) => (a.name < b.name ? -1 : 1))
        //     // );
        //     setNotificationList((prevNotiList) =>
        //         prevNotiList.concat(mapNotificationProps("Update category success", "success"))
        //     );
        // } else {
        //     setNotificationList((prevNotiList) =>
        //         prevNotiList.concat(mapNotificationProps("Update category failed", "danger"))
        //     );
        // }

        props.onCancel();
    };
    const accountNameHandler = (value: string) => {
        setName(value);
    };
    const accountTypeHandler = (value: string) => {
        setType(value as AccountType);
    };
    const accountBalanceHandler = (value: string) => {
        setBalance(Number.parseFloat(value));
    };

    React.useEffect(() => {
        const account = accounts.find((x) => x.id === props.id);

        setName(account.name);
        setType(account.type);
        setBalance(account.balance);
    }, [accounts, props.id]);

    return (
        <Modal
            title="Modigy Category"
            onCancelHandler={props.onCancel}
            onConfirmHandler={modifyAccount}
            cancelBtnTxt="Cancel"
            confirmBtnTxt="Confirm">
            <div className="columns is-mobile is-vcentered">
                <div className="column is-2">
                    <span>Name</span>
                </div>
                <TextBox
                    className="column"
                    name="category-modify"
                    updateValue={accountNameHandler}
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
                    options={allAccountTypes}
                    updateSelectedValue={accountTypeHandler}
                />
            </div>
            <div className="columns is-mobile is-vcentered">
                <div className="column is-2">
                    <span>Balance</span>
                </div>
                <TextBox
                    className="column"
                    name="category-modify"
                    updateValue={accountBalanceHandler}
                    type="number"
                    value={balance.toString()}
                />
            </div>
        </Modal>
    );
};

const AccountSetting: React.FC = () => {
    const [accounts, setAccounts] = useRecoilState(accountsState);
    const [, setNotificationList] = useRecoilState(toastState);
    const createAccountHandler = async (accountName: string, accountType: string) => {
        const response = await createAccount({
            name: accountName,
            type: mapStringToAccountType(accountType),
        });

        if (!response.account) {
            setNotificationList((prevNotiList) =>
                prevNotiList.concat(mapNotificationProps("Create account failed", "danger"))
            );
            return;
        }

        setAccounts(
            accounts.concat({
                id: response.account.id,
                name: response.account.name,
                type: response.account.type,
                balance: response.account.balance,
            })
        );
        setNotificationList((prevNotiList) =>
            prevNotiList.concat(mapNotificationProps("Create account success", "success"))
        );
    };

    const deleteAccountHandler = async (id: string | number) => {
        const isSuccess = await deleteAccount({
            id: +id,
        });

        if (!isSuccess) {
            setNotificationList((prevNotiList) =>
                prevNotiList.concat(mapNotificationProps("Delete account failed", "danger"))
            );
            return;
        }

        setAccounts(accounts.filter((x) => x.id !== id));
        setNotificationList((prevNotiList) =>
            prevNotiList.concat(mapNotificationProps("Delete account success", "success"))
        );
    };

    return (
        <>
            <SettingBox
                createFuncHandler={createAccountHandler}
                deleteFuncHandler={deleteAccountHandler}
                items={accounts.map((x) => {
                    return { id: x.id, name: x.name };
                })}
                dropdowns={allAccountTypes.map((x) => mapAccountTypeToString(x))}
                modifyModal={(id, onCancel) => <ModifyModal id={id} onCancel={onCancel} />}
            />
        </>
    );
};

export default AccountSetting;
