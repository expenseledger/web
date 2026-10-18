import React from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { accountsState, categoriesState } from "../common/shareState";
import { toNumber } from "../common/utils";
import dayjs from "../lib/dayjs";
import { currencySymbols, TransactionType } from "../service/constants";
import { replaceAccounts } from "../service/helper/accountHelper";
import { useNotification } from "../service/helper/notificationHelper";
import Account from "../service/model/Account";
import { AddExpenseRequest, AddIncomeRequest, AddTransferRequest } from "../service/model/Requests";
import { addExpense, addIncome, addTransfer } from "../service/transactionService";
import BalanceWithCurrency from "./bases/BalanceWithCurrency";
import Button from "./bases/Button";
import DateBox from "./bases/DateBox";
import Dropdown from "./bases/Dropdown";
import TextBox from "./bases/TextBox";
import { Box, Flex, Grid, Tabs, Text } from "@radix-ui/themes";
import { useBackToHome } from "./Layout";
import { useAtom } from "jotai";
import AnimatedPage from "./AnimatedPage";
import { describeError } from "../service/helper/errorHelper";
interface CurrentValue {
    fromAccountIdx: number;
    toAccountIdx: number;
    categoryIdx: number;
    amount: string;
    /** What the to account receives when the transfer crosses currencies. */
    convertedAmount: string;
    date: string;
    description: string;
}

interface HomeProps {
    accountIdx: number;
    categoryIdx: number;
    amount: string;
    date: string;
}

const StyledAddButton = styled(Button)`
    width: 100px;
`;

const More: React.FC = () => {
    const [accounts, setAccounts] = useAtom(accountsState);
    const [categories] = useAtom(categoriesState);
    const { addNotification } = useNotification();
    const [isLoading, setIsLoading] = React.useState(false);
    const location = useLocation();
    const homeProps = location.state as HomeProps;
    const fromAccountIdx = homeProps?.accountIdx ?? 0;
    const initialCurrentValue: CurrentValue = {
        fromAccountIdx,
        // The account after From, wrapping around; none when there's only one.
        toAccountIdx: accounts.length > 1 ? (fromAccountIdx + 1) % accounts.length : undefined,
        categoryIdx: homeProps?.categoryIdx ?? 0,
        amount: homeProps?.amount ?? "",
        convertedAmount: "",
        date: homeProps?.date ?? dayjs().format("YYYY-MM-DD"),
        description: "",
    };
    const [currentValue, setCurrentValue] = React.useState<CurrentValue>(initialCurrentValue);
    const [transactionTypeTabActive, setTransactionTypeTabActive] = React.useState([
        true,
        false,
        false,
    ]);
    const transactionTypes: TransactionType[] = ["EXPENSE", "INCOME", "TRANSFER"];
    const { setBackToHomeParam } = useBackToHome();

    const transactionTypeTabOnClickHandler = (e: any) => {
        const previousTabActive = [...transactionTypeTabActive];
        const currentTarget = e.currentTarget;
        const currentTabIdx = Number.parseInt(currentTarget.dataset.id, 10);
        const tabActive = previousTabActive.map((_, idx) => idx === currentTabIdx);

        setTransactionTypeTabActive(tabActive);
    };

    const updateField = (field: keyof CurrentValue, value: any) => {
        setCurrentValue({
            ...currentValue,
            [field]: value,
        });
    };
    const updateSelectedCategory = (value: string) => {
        const idx = categories.findIndex((x) => x.name === value);
        updateField("categoryIdx", idx);
    };
    const updateSelectedFromAccount = (value: string) => {
        const idx = accounts.findIndex((x) => x.name === value);
        setBackToHomeParam({
            accountId: accounts[idx].id,
        });

        updateField("fromAccountIdx", idx);
    };
    const updateSelectedToAccount = (value: string) => {
        const idx = accounts.findIndex((x) => x.name === value);
        updateField("toAccountIdx", idx);
    };
    const updateSelectedDate = (value: string) => updateField("date", value);
    const updateExpense = (value: string) => updateField("amount", value);
    const updateConvertedAmount = (value: string) => updateField("convertedAmount", value);
    const updateDescription = (value: string) => updateField("description", value);

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
    const validateTransferAccount = (fromAcccountId: string, toAccountId: string) => {
        if (!toAccountId) {
            addNotification("Please add another account to transfer to", "danger");

            return false;
        }

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

            const account = accounts[fromAccountIdx];
            const request: AddExpenseRequest = {
                amount: { amount: numberedAmount, currency: account.currency },
                categoryId: categories[categoryIdx]?.id,
                date: dayjs(date).toDate(),
                description,
                fromAccountId: account.id,
            };

            const response = await addExpense(request);

            if (response.transaction) {
                setAccounts(replaceAccounts(accounts, [response.transaction.fromAccount]));
                addNotification("AddExpense sucess", "success");

                return true;
            }

            addNotification(describeError(response.errorCode, "AddExpense failed"), "danger");
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

            const account = accounts[fromAccountIdx];
            const request: AddIncomeRequest = {
                amount: { amount: numberedAmount, currency: account.currency },
                categoryId: categories[categoryIdx]?.id,
                date: dayjs(date).toDate(),
                description,
                toAccountId: account.id,
            };

            const response = await addIncome(request);

            if (response.transaction) {
                setAccounts(replaceAccounts(accounts, [response.transaction.toAccount]));
                addNotification("AddIncome sucess", "success");

                return true;
            }

            addNotification(describeError(response.errorCode, "AddIncome failed"), "danger");
        } catch {
            addNotification("AddIncome failed", "danger");
        }

        return false;
    };

    const doAddTransfer = async () => {
        const {
            fromAccountIdx,
            toAccountIdx,
            categoryIdx,
            amount,
            convertedAmount,
            date,
            description,
        } = currentValue;

        try {
            const fromAccount = accounts[fromAccountIdx];
            const toAccount = accounts[toAccountIdx];
            const isCrossCurrency = fromAccount?.currency !== toAccount?.currency;
            const numberedAmount = toNumber(amount);
            const numberedConvertedAmount = toNumber(convertedAmount);
            const isValid =
                validateAmount(numberedAmount) &&
                (!isCrossCurrency || validateAmount(numberedConvertedAmount)) &&
                validateTransferAccount(fromAccount?.id, toAccount?.id);

            if (!isValid) {
                setIsLoading(false);
                return false;
            }

            const request: AddTransferRequest = {
                amount: { amount: numberedAmount, currency: fromAccount.currency },
                convertedAmount: isCrossCurrency
                    ? { amount: numberedConvertedAmount, currency: toAccount.currency }
                    : undefined,
                categoryId: categories[categoryIdx]?.id,
                date: dayjs(date).toDate(),
                description,
                toAccountId: toAccount?.id,
                fromAccountId: fromAccount.id,
            };

            const response = await addTransfer(request);

            if (response.transaction) {
                setAccounts(
                    replaceAccounts(accounts, [
                        response.transaction.fromAccount,
                        response.transaction.toAccount,
                    ])
                );
                addNotification("AddTransfer success", "success");

                return true;
            }

            addNotification(describeError(response.errorCode, "AddTransfer failed"), "danger");
        } catch {
            addNotification("AddTransfer failed", "danger");
        }

        return false;
    };

    const addTransaction = async () => {
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

        const isSuccess = await doTransaction();

        if (isSuccess) {
            setCurrentValue({
                ...currentValue,
                description: "",
                amount: "",
                convertedAmount: "",
            });
        }

        setIsLoading(false);
    };

    const renderAccountSection = () => {
        const isTransfer = transactionTypeTabActive[2];
        const render = (
            title: string,
            account: Account,
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
                            defaultValue={value}
                            updateSelectedValue={updateAccount}
                        />
                    </Box>
                    <Box>
                        <BalanceWithCurrency
                            balance={account?.balance ?? 0}
                            currency={account?.currency ?? "THB"}
                        />
                    </Box>
                </Flex>
            </Flex>
        );

        return isTransfer ? (
            <>
                {render(
                    "From",
                    accounts[currentValue.fromAccountIdx],
                    updateSelectedFromAccount,
                    accounts[currentValue.fromAccountIdx]?.name,
                    accounts.filter((x) => x.id !== accounts[currentValue.toAccountIdx]?.id)
                )}
                {render(
                    "To",
                    accounts[currentValue.toAccountIdx],
                    updateSelectedToAccount,
                    accounts[currentValue.toAccountIdx]?.name,
                    accounts.filter((x) => x.id !== accounts[currentValue.fromAccountIdx]?.id)
                )}
                {renderConvertedAmount()}
            </>
        ) : (
            render(
                "Account",
                accounts[currentValue.fromAccountIdx],
                updateSelectedFromAccount,
                accounts[currentValue.fromAccountIdx]?.name,
                null
            )
        );
    };

    const renderConvertedAmount = () => {
        const toCurrency = accounts[currentValue.toAccountIdx]?.currency;

        if (toCurrency === accounts[currentValue.fromAccountIdx]?.currency) {
            return null;
        }

        return (
            <Flex direction="column">
                <Box>
                    <Text weight="bold" size="1">
                        Converted amount
                    </Text>
                </Box>
                <Box>
                    <TextBox
                        updateValue={updateConvertedAmount}
                        name="converted-amount"
                        ariaLabel="Converted amount"
                        type="number"
                        value={currentValue.convertedAmount}
                        addOn={{ text: currencySymbols[toCurrency], position: "front" }}
                    />
                </Box>
            </Flex>
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
                <Text size="3">{t}</Text>
            </Tabs.Trigger>
        ));

        return (
            <Tabs.Root defaultValue="Expense">
                <Tabs.List style={{ justifyContent: "center" }}>{renderTabsTrigger}</Tabs.List>
            </Tabs.Root>
        );
    };

    return (
        <AnimatedPage>
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
                            ariaLabel="Amount"
                            type="number"
                            value={currentValue.amount}
                            addOn={{
                                text: currencySymbols[
                                    accounts[currentValue.fromAccountIdx]?.currency
                                ],
                                position: "front",
                            }}
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
                            options={categories.map((x) => x.name)}
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
                    <StyledAddButton
                        onClickHandler={addTransaction}
                        value="Add"
                        type="primary"
                        isLoading={isLoading}
                    />
                </Flex>
            </Grid>
        </AnimatedPage>
    );
};

export default More;
