import styled from "styled-components";
import Account from "../../service/model/Account";
import { Text, Checkbox, Flex, Box, Grid } from "@radix-ui/themes";
import React from "react";

export interface SelectableAccount extends Account {
    isSelected: boolean;
}

interface AccountSelectionProps {
    accounts: SelectableAccount[];
    onChangeHanlder: (accounts: SelectableAccount[]) => void;
}

const AccountSelection: React.FC<AccountSelectionProps> = (props) => {
    const onChangeHandler = (accountId: number, checked: boolean) => {
        const newAccounts: SelectableAccount[] = props.accounts.map((account) => {
            if (account.id === accountId) {
                return {
                    ...account,
                    isSelected: checked,
                };
            }
            return account;
        });

        if (!newAccounts.some((a) => a.isSelected)) {
            return;
        }

        props.onChangeHanlder(newAccounts);
    };

    const listOfCheckbox = props.accounts.map((account) => {
        return (
            <React.Fragment key={account.id}>
                <label>
                    <Flex align="center">
                        <Checkbox
                            checked={account.isSelected}
                            onCheckedChange={(checked) =>
                                onChangeHandler(account.id, checked.valueOf() as boolean)
                            }
                        />
                        <Text ml="1">{account.name}</Text>
                    </Flex>
                </label>
            </React.Fragment>
        );
    });

    const renderCheckbox = () => {
        return (
            <Grid columns="2" gap="3">
                {listOfCheckbox}
            </Grid>
        );
    };

    return (
        <>
            <Flex justify="center" pb="3">
                <Text weight="bold" size="5">
                    Accounts
                </Text>
            </Flex>
            <div>{renderCheckbox()}</div>
        </>
    );
};

export default AccountSelection;
