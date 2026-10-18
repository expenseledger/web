import React from "react";
import { accountsState, currencyState } from "../../common/shareState";
import { createAccount, deleteAccount } from "../../service/accountService";
import { Currency } from "../../service/constants";
import { allCurrencies } from "../../service/helper/accountHelper";
import { useNotification } from "../../service/helper/notificationHelper";
import Dropdown from "../bases/Dropdown";
import EditAndDeleteSetting from "../bases/EditAndDeleteSetting";
import TextBoxWithButton from "../bases/TextBoxWithButton";
import { Card, Flex, Text } from "@radix-ui/themes";
import { useAtom } from "jotai";

const AccountSetting: React.FC = () => {
    const [accounts, setAccounts] = useAtom(accountsState);
    const [currency, setCurrency] = useAtom(currencyState);
    const { addNotification } = useNotification();
    const currencyHandler = (currency: string) => {
        setCurrency(currency as Currency);
    };
    const createAccountHandler = async (accountName: string) => {
        const response = await createAccount({
            name: accountName,
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

    const deleteAccountHandler = async (id: string | number) => {
        const isSuccess = await deleteAccount({
            id: +id,
        });

        if (!isSuccess) {
            addNotification("Delete account failed", "danger");
            return;
        }

        setAccounts(accounts.filter((x) => x.id !== id));
        addNotification("Delete account success", "success");
    };
    const renderCurrencySelectionPanel = (
        <Card>
            <Flex align="center" justify="between">
                <Text>Currency</Text>
                <Dropdown
                    options={allCurrencies}
                    updateSelectedValue={currencyHandler}
                    variant="ghost"
                    defaultValue={currency}
                />
            </Flex>
        </Card>
    );

    return (
        <Flex direction="column" gap="3">
            <EditAndDeleteSetting
                deleteFuncHandler={deleteAccountHandler}
                items={accounts.map((x) => {
                    return { id: x.id, name: x.name };
                })}
            />
            {renderCurrencySelectionPanel}
            <TextBoxWithButton
                name="add"
                type="text"
                buttonType="primary"
                buttonText="Create"
                onClick={createAccountHandler}
            />
        </Flex>
    );
};

export default AccountSetting;
