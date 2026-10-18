import React from "react";
import { accountsState } from "../../common/shareState";
import { createAccount, deleteAccount } from "../../service/accountService";
import { allCurrencies, Currency } from "../../service/constants";
import { useNotification } from "../../service/helper/notificationHelper";
import EditAndDeleteSetting from "../bases/EditAndDeleteSetting";
import TextBoxWithButton from "../bases/TextBoxWithButton";
import { Flex } from "@radix-ui/themes";
import { useAtom } from "jotai";

const AccountSetting: React.FC = () => {
    const [accounts, setAccounts] = useAtom(accountsState);
    const { addNotification } = useNotification();
    const createAccountHandler = async (accountName: string, currency: string) => {
        const response = await createAccount({
            name: accountName,
            currency: currency as Currency,
        });

        if (!response.account) {
            addNotification("Create account failed", "danger");
            return;
        }

        const newAccounts = accounts
            .concat(response.account)
            .sort((a, b) => a.name.localeCompare(b.name));

        setAccounts(newAccounts);
        addNotification("Create account success", "success");
    };

    const deleteAccountHandler = async (id: string) => {
        const response = await deleteAccount({
            id,
        });

        if (!response.isSuccess) {
            addNotification("Delete account failed", "danger");
            return;
        }

        setAccounts(accounts.filter((x) => x.id !== id));
        addNotification("Delete account success", "success");
    };

    return (
        <Flex direction="column" gap="3">
            <EditAndDeleteSetting
                deleteFuncHandler={deleteAccountHandler}
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
