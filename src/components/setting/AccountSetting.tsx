import React from "react";
import { accountsState } from "../../common/shareState";
import { createAccount, deleteAccount, patchAccount } from "../../service/accountService";
import { allCurrencies, Currency } from "../../service/constants";
import { replaceAccounts } from "../../service/helper/accountHelper";
import { useNotification } from "../../service/helper/notificationHelper";
import Account from "../../service/model/Account";
import EditAndDeleteSetting from "../bases/EditAndDeleteSetting";
import TextBoxWithButton from "../bases/TextBoxWithButton";
import EditAccountModal from "./EditAccountModal";
import { Flex } from "@radix-ui/themes";
import { useAtom } from "jotai";
import { describeError } from "../../service/helper/errorHelper";

const AccountSetting: React.FC = () => {
    const [accounts, setAccounts] = useAtom(accountsState);
    const { addNotification } = useNotification();
    const createAccountHandler = async (accountName: string, currency: string) => {
        const response = await createAccount({
            name: accountName,
            currency: currency as Currency,
        });

        if (!response.account) {
            addNotification(describeError(response.errorCode, "Create account failed"), "danger");
            return;
        }

        const newAccounts = accounts
            .concat(response.account)
            .sort((a, b) => a.name.localeCompare(b.name));

        setAccounts(newAccounts);
        addNotification("Create account success", "success");
    };

    const editAccountHandler = async (account: Account, name: string, balance: number) => {
        if (Number.isNaN(balance)) {
            addNotification("Balance should be a number", "danger");
            return;
        }

        const response = await patchAccount({
            id: account.id,
            name: name !== account.name ? name : undefined,
            balance:
                balance !== account.balance
                    ? { amount: balance, currency: account.currency }
                    : undefined,
        });

        if (!response.account) {
            addNotification(describeError(response.errorCode, "Edit account failed"), "danger");
            return;
        }

        setAccounts(
            replaceAccounts(accounts, [response.account]).sort((a, b) =>
                a.name.localeCompare(b.name)
            )
        );
        addNotification("Edit account success", "success");
    };
    const editAccountModal = (id: string, triggerer: React.ReactElement) => {
        const account = accounts.find((a) => a.id === id);

        return (
            <EditAccountModal
                // Remount after a save so the fields start from the saved values.
                key={`${account.name}-${account.balance}`}
                account={account}
                onSave={(name, balance) => editAccountHandler(account, name, balance)}
                triggerer={triggerer}
            />
        );
    };

    const deleteAccountHandler = async (id: string) => {
        const response = await deleteAccount({
            id,
        });

        if (!response.isSuccess) {
            addNotification(describeError(response.errorCode, "Delete account failed"), "danger");
            return;
        }

        setAccounts(accounts.filter((x) => x.id !== id));
        addNotification("Delete account success", "success");
    };

    return (
        <Flex direction="column" gap="3">
            <EditAndDeleteSetting
                deleteFuncHandler={deleteAccountHandler}
                modifyModal={editAccountModal}
                items={accounts.map((x) => {
                    return { id: x.id, name: x.name };
                })}
            />
            <TextBoxWithButton
                name="add"
                type="text"
                buttonType="primary"
                buttonText="Create"
                dropdown={allCurrencies}
                onClick={createAccountHandler}
            />
        </Flex>
    );
};

export default AccountSetting;
