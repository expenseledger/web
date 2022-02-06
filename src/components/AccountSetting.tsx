import React from "react";
import { useRecoilState } from "recoil";
import { accountsState, toastState } from "../common/shareState";
import { createAccount, deleteAccount } from "../service/accountService";
import { AccountType } from "../service/constants";
import { mapAccountTypeToString, mapStringToAccountType } from "../service/helper/accountHelper";
import { mapNotificationProps } from "../service/helper/notificationHelper";
import Modal from "./bases/Modal";
import SettingBox from "./bases/SettingBox";

const AccountSetting: React.FC = () => {
    const [accounts, setAccounts] = useRecoilState(accountsState);
    const [, setNotificationList] = useRecoilState(toastState);
    const accountTypes: AccountType[] = ["BANK_ACCOUNT", "CASH", "CREDIT"];
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
    const renderModal = (id: number, onCancel: () => void) => {
        const account = accounts.find((x) => x.id === id);

        return (
            <Modal
                title="Account Category"
                onCancelHandler={onCancel}
                onConfirmHandler={() => {
                    return new Promise((resolve, _) => resolve());
                }}
                cancelBtnTxt="Cancel"
                confirmBtnTxt="Confirm">
                <div>{account.name}</div>
            </Modal>
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
                dropdowns={accountTypes.map((x) => mapAccountTypeToString(x))}
                modifyModal={renderModal}
            />
        </>
    );
};

export default AccountSetting;
