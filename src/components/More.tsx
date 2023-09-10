import * as R from "ramda";
import React from "react";
import { useLocation } from "react-router";
import { useRecoilState, useRecoilValue } from "recoil";
import { accountsState, categoriesState, currencyState } from "../common/shareState";
import { toNumber } from "../common/utils";
import dayjs from "../lib/dayjs";
import { TransactionType } from "../service/constants";
import { useNotification } from "../service/helper/notificationHelper";
import Account from "../service/model/Account";
import { AddExpenseRequest, AddIncomeRequest, AddTransferRequest } from "../service/model/Requests";
import { addExpense, addIncome, addTransfer } from "../service/transactionService";
import "./More.scss";
import BalanceWithCurrency from "./bases/BalanceWithCurrency";
import Button from "./bases/Button";
import DateBox from "./bases/DateBox";
import Dropdown from "./bases/Dropdown";
import TextBox from "./bases/TextBox";
import { Box, Flex, Grid, Tabs, Text } from "@radix-ui/themes";
import { get } from "http";

interface CurrentValue {
    fromAccountIdx: number;
    toAccountIdx: number;
    categoryIdx: number;
    amount: string;
    date: string;
    description: string;

    [key: string]: any;
}

interface HomeProps {
    accountIdx: number;
    categoryIdx: number;
    amount: string;
    date: string;
}

const More: React.FC = () => {
    const [accounts, setAccounts] = useRecoilState(accountsState);
    const [categories] = useRecoilState(categoriesState);
    const { addNotification } = useNotification();
    const [isLoading, setIsLoading] = React.useState(false);
    const locatoin = useLocation();
    const currency = useRecoilValue(currencyState);
    const homeProps = locatoin.state as HomeProps;
    const initialCurrentValue: CurrentValue = {
        fromAccountIdx: homeProps?.accountIdx ?? 0,
        toAccountIdx:
            (homeProps?.accountIdx ?? 0) == 0
                ? 1
                : homeProps.accountIdx + 1 >= accounts.length
                ? accounts.length - homeProps.accountIdx + 1
                : homeProps.accountIdx + 1,
        categoryIdx: homeProps?.categoryIdx ?? 0,
        amount: homeProps?.amount ?? "",
        date: homeProps?.date ?? Date.now.toString(),
        description: "",
    };
    const [currentValue, setCurrentValue] = React.useState<CurrentValue>(initialCurrentValue);
    const [transactionTypeTabActive, setTransactionTypeTabActive] = React.useState([
        true,
        false,
        false,
    ]);
    const transactionTypes: TransactionType[] = ["EXPENSE", "INCOME", "TRANSFER"];

    const transactionTypeTabOnClickHandler = (e: any) => {
        const previousTabActive = [...transactionTypeTabActive];
        const currentTarget = e.currentTarget;
        const currentTabIdx = Number.parseInt(currentTarget.dataset.id, 10);
        const tabActive = previousTabActive.map((_, idx) => idx === currentTabIdx);

        setTransactionTypeTabActive(tabActive);
    };

    const updateSelectedCategory = (value: string) => {
        const idx = categories.findIndex((x) => x.name === value);
        setCurrentValue({
            ...currentValue,
            categoryIdx: idx,
        });
    };

    const updateSelectedFromAccount = (value: string) => {
        const idx = accounts.findIndex((x) => x.name === value);

        setCurrentValue({
            ...currentValue,
            fromAccountIdx: idx,
        });
    };

    const updateSelectedToAccount = (value: string) => {
        const idx = accounts.findIndex((x) => x.name === value);

        setCurrentValue({
            ...currentValue,
            toAccountIdx: idx,
        });
    };

    const updateSelectedDate = (value: string) => {
        setCurrentValue({
            ...currentValue,
            date: value,
        });
    };

    const updateExpense = (value: string) => {
        setCurrentValue({
            ...currentValue,
            amount: value,
        });
    };

    const updateDescription = (value: string) => {
        setCurrentValue({
            ...currentValue,
            description: value,
        });
    };

    const validateAmount = (amount: number) => {
        if (!amount || amount === 0) {
            addNotification("Please add amount", "danger");

            return false;
        } else if (!amount || amount < 0) {
            addNotification("Amount should be more than 0", "danger");

            return false;
        }

        return true;
    };
    const validateTransferAccount = (fromAcccountId: number, toAccountId: number) => {
        if (fromAcccountId === toAccountId) {
            addNotification("Please select different destination account", "danger");

            return false;
        }

        return true;
    };

    const doAddExpense = async () => {
        const { fromAccountIdx, categoryIdx, amount, date, description } = currentValue;

        try {
            const numberedAmount = toNumber(amount);
            const isValid = validateAmount(numberedAmount);

            if (!isValid) {
                setIsLoading(false);
                return false;
            }

            const request: AddExpenseRequest = {
                amount: numberedAmount,
                categoryId: categories[categoryIdx]?.id ?? 0,
                date: dayjs(date).toDate(),
                description: description === "" ? "-" : description,
                fromAccountId: accounts[fromAccountIdx]?.id ?? 0,
            };

            const response = await addExpense(request);

            if (response) {
                const tAccounts = R.clone(accounts);
                const selectedAccountIdx = accounts.findIndex(
                    (x) => x.name === response.transaction.fromAccount.name
                );

                tAccounts[selectedAccountIdx].balance = response.transaction.fromAccount.balance;
                setAccounts(tAccounts);
                addNotification("AddExpense sucess", "success");

                return true;
            }
        } catch {
            addNotification("AddExpense failed", "danger");
        }

        return false;
    };

    const doAddIncome = async () => {
        const { fromAccountIdx, categoryIdx, amount, date, description } = currentValue;

        try {
            const numberedAmount = toNumber(amount);
            const isValid = validateAmount(numberedAmount);

            if (!isValid) {
                setIsLoading(false);
                return false;
            }

            const request: AddIncomeRequest = {
                amount: numberedAmount,
                categoryId: categories[categoryIdx]?.id ?? 0,
                date: dayjs(date).toDate(),
                description: description === "" ? "-" : description,
                toAccountId: accounts[fromAccountIdx]?.id ?? 0,
            };

            const response = await addIncome(request);

            if (response) {
                const tAccounts = R.clone(accounts);
                const selectedAccountIdx = accounts.findIndex(
                    (x) => x.name === response.transaction.toAccount.name
                );

                tAccounts[selectedAccountIdx].balance = response.transaction.toAccount.balance;
                setAccounts(tAccounts);
                addNotification("AddIncome sucess", "success");

                return true;
            }

            addNotification("AddIncome failed", "danger");
        } catch {
            addNotification("AddIncome failed", "danger");
        }

        return false;
    };

    const doAddTransfer = async () => {
        const { fromAccountIdx, toAccountIdx, categoryIdx, amount, date, description } =
            currentValue;

        try {
            const numberedAmount = toNumber(amount);
            const isValid =
                validateAmount(numberedAmount) &&
                validateTransferAccount(fromAccountIdx, toAccountIdx);

            if (!isValid) {
                setIsLoading(false);
                return false;
            }

            const request: AddTransferRequest = {
                amount: numberedAmount,
                categoryId: categories[categoryIdx]?.id ?? 0,
                date: dayjs(date).toDate(),
                description: description === "" ? "-" : description,
                toAccountId: accounts[toAccountIdx]?.id ?? 0,
                fromAccountId: accounts[fromAccountIdx]?.id ?? 0,
            };

            const response = await addTransfer(request);

            if (response) {
                const tAccounts = R.clone(accounts);
                const fromAccountIdx = accounts.findIndex(
                    (x) => x.id === response.transaction.fromAccount.id
                );
                const toAccountIdx = accounts.findIndex(
                    (x) => x.id === response.transaction.toAccount.id
                );

                tAccounts[fromAccountIdx].balance = response.transaction.fromAccount.balance;
                tAccounts[toAccountIdx].balance = response.transaction.toAccount.balance;

                setAccounts(tAccounts);
                addNotification("AddTransfer success", "success");

                return true;
            }
        } catch {
            addNotification("AddTransfer failed", "danger");
        }

        return false;
    };

    const addTransaction = () => {
        const doTransaction = () => {
            const transactionTypeIdx = transactionTypeTabActive.findIndex((x) => x === true);

            switch (transactionTypes[transactionTypeIdx]) {
                case "EXPENSE":
                    return doAddExpense();
                case "INCOME":
                    return doAddIncome();
                case "TRANSFER":
                    return doAddTransfer();
            }
        };

        setIsLoading(true);

        const result = doTransaction();

        if (result) {
            setCurrentValue({
                ...currentValue,
                description: "",
                amount: "",
            });
        }

        setIsLoading(false);
    };

    const getCategoriesByTransactionType = () => {
        const transactionTypeIdx = transactionTypeTabActive.findIndex((x) => x === true);

        switch (transactionTypes[transactionTypeIdx]) {
            case "EXPENSE":
                return categories.filter((c) => c.type === "ANY" || c.type === "EXPENSE");
            case "INCOME":
                return categories.filter((c) => c.type === "ANY" || c.type === "INCOME");
            case "TRANSFER":
                return categories.filter((c) => c.type === "ANY" || c.type === "TRANSFER");
        }
    };

    const renderAccountSection = () => {
        const isTransfer = transactionTypeTabActive[2];
        const render = (
            title: string,
            balance: number,
            updateAccount: (value: string) => void,
            value: string,
            overrideOptions: Account[]
        ) => (
            <Flex direction="column">
                <Box>
                    <Text weight="bold" size="1">
                        {title}
                    </Text>
                </Box>
                <Flex align="center" gap="3">
                    <Box>
                        <Dropdown
                            options={
                                overrideOptions?.map((x) => x.name) ?? accounts.map((x) => x.name)
                            }
                            updateSelectedValue={updateAccount}
                        />
                    </Box>
                    <Box>
                        <BalanceWithCurrency balance={balance} />
                    </Box>
                </Flex>
            </Flex>
        );

        return isTransfer ? (
            <>
                {render(
                    "From",
                    accounts[currentValue.fromAccountIdx]?.balance ?? 0,
                    updateSelectedFromAccount,
                    accounts[currentValue.fromAccountIdx]?.name,
                    accounts.filter((x) => x.id !== accounts[currentValue.toAccountIdx].id)
                )}
                {render(
                    "To",
                    accounts[currentValue.toAccountIdx]?.balance ?? 0,
                    updateSelectedToAccount,
                    accounts[currentValue.toAccountIdx]?.name,
                    accounts.filter((x) => x.id !== accounts[currentValue.fromAccountIdx].id)
                )}
            </>
        ) : (
            render(
                "Account",
                accounts[currentValue.fromAccountIdx]?.balance ?? 0,
                updateSelectedFromAccount,
                accounts[currentValue.fromAccountIdx]?.name,
                null
            )
        );
    };

    const renderTransactionTypeTab = () => {
        const transactionTypes = ["Expense", "Income", "Transfer"];
        const renderTabsTrigger = transactionTypes.map((t, idx) => (
            <Tabs.Trigger
                key={t}
                data-id={idx}
                onClick={transactionTypeTabOnClickHandler}
                value={t}>
                <Text>{t}</Text>
            </Tabs.Trigger>
        ));

        return (
            <Tabs.Root defaultValue="Expense">
                <Tabs.List style={{ justifyContent: "center" }}>{renderTabsTrigger}</Tabs.List>
            </Tabs.Root>
        );
    };

    return (
        <>
            {renderTransactionTypeTab()}
            <Grid rows="5" gap="3" mt="3">
                <Flex direction="column">
                    <Box>
                        <Text weight="bold" size="1">
                            Amount
                        </Text>
                    </Box>
                    <Box>
                        <TextBox
                            updateValue={updateExpense}
                            name="expnese"
                            type="number"
                            value={currentValue.amount}
                            addOn={{ text: currency, position: "front" }}
                        />
                    </Box>
                </Flex>
                <Flex direction="column">
                    <Box>
                        <Text weight="bold" size="1">
                            Date
                        </Text>
                    </Box>
                    <Box>
                        <DateBox
                            name="date"
                            updateValue={updateSelectedDate}
                            value={currentValue.date}
                        />
                    </Box>
                </Flex>
                {renderAccountSection()}
                <Flex direction="column">
                    <Box>
                        <Text weight="bold" size="1">
                            Category
                        </Text>
                    </Box>
                    <Box>
                        <Dropdown
                            options={getCategoriesByTransactionType().map((x) => x.name)}
                            updateSelectedValue={updateSelectedCategory}
                        />
                    </Box>
                </Flex>
                <Flex direction="column">
                    <Box>
                        <Text weight="bold" size="1">
                            Description
                        </Text>
                    </Box>
                    <Box>
                        <TextBox
                            name="description"
                            updateValue={updateDescription}
                            value={currentValue.description}
                            placeholder="Optional"
                        />
                    </Box>
                </Flex>
                <Flex mt="2">
                    <Button
                        className="more__button--add"
                        onClickHandler={addTransaction}
                        value="Add"
                        type="primary"
                        isLoading={isLoading}
                    />
                </Flex>
            </Grid>
        </>
    );
};

export default More;
