import * as R from "ramda";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { useRecoilState } from "recoil";
import {
    categoriesState,
    toastState,
    walletsState,
} from "../common/shareState";
import { formatNumber } from "../common/utils";
import { TransactionType } from "../service/constants";
import { mapNotificationProps } from "../service/helper/notificationHelper";
import {
    AddExpenseRequest,
    AddIncomeRequest,
    AddTransferRequest,
} from "../service/model/Requests";
import {
    addExpense,
    addIncome,
    addTransfer,
} from "../service/transactionService";
import Button from "./bases/Button";
import DateBox from "./bases/DateBox";
import Dropdown from "./bases/Dropdown";
import TextBox from "./bases/TextBox";
import TextField from "./bases/TextField";
import "./More.scss";

interface CurrentValue {
    fromWalletIdx: number;
    toWalletIdx: number;
    categoryIdx: number;
    amount: number;
    date: string;
    description: string;
    [key: string]: any;
}

const More: React.FC<RouteComponentProps> = (props) => {
    const initialState = {
        fromWalletIdx: (props.location.state as any).walletIdx ?? 0,
        toWalletIdx: (props.location.state as any).walletIdx ?? 0,
        categoryIdx: (props.location.state as any).categoryIdx ?? 0,
        amount: (props.location.state as any).amount ?? 0,
        date: (props.location.state as any).date ?? Date.now.toString(),
        description: "",
    };
    const [wallets, setWallets] = useRecoilState(walletsState);
    const [categories] = useRecoilState(categoriesState);
    const [, setNotificationList] = useRecoilState(toastState);
    const [isLoading, setIsLoading] = React.useState(false);
    const [currentValue, setCurrentValue] =
        React.useState<CurrentValue>(initialState);
    const [transactionTypeTabActive, setTransactionTypeTabActive] =
        React.useState([true, false, false]);
    const transactionTypes: TransactionType[] = [
        "EXPENSE",
        "INCOME",
        "TRANSFER",
    ];

    const transactionTypeTabOnClickHandler = (e: any) => {
        const currentTabActive = [...transactionTypeTabActive];
        const currentTarget = e.currentTarget;
        const currentTabIdx = Number.parseInt(currentTarget.dataset.id, 10);
        const tabActive = currentTabActive.map(
            (_, idx) => idx === currentTabIdx
        );

        setTransactionTypeTabActive(tabActive);
    };

    const updateSelectedCategory = (value: string) => {
        const tCurrentValue = R.clone(currentValue);

        tCurrentValue.categoryIdx = categories.findIndex(
            (x) => x.name === value
        );
        setCurrentValue(tCurrentValue);
    };

    const updateSelectedFromWallet = (value: string) => {
        const tCurrentValue = R.clone(currentValue);

        tCurrentValue.fromWalletIdx = wallets.findIndex(
            (x) => x.name === value
        );
        setCurrentValue(tCurrentValue);
    };

    const updateSelectedToWallet = (value: string) => {
        const tCurrentValue = R.clone(currentValue);

        tCurrentValue.toWalletIdx = wallets.findIndex((x) => x.name === value);
        setCurrentValue(tCurrentValue);
    };

    const updateSelectedDate = (value: string) => {
        const tCurrentValue = R.clone(currentValue);

        tCurrentValue.date = value;
        setCurrentValue(tCurrentValue);
    };

    const updateExpense = (value: string) => {
        const tCurrentValue = R.clone(currentValue);

        tCurrentValue.amount = Number.parseFloat(value);
        setCurrentValue(tCurrentValue);
    };

    const updateDescription = (value: string) => {
        const tCurrentValue = R.clone(currentValue);

        tCurrentValue.description = value;
        setCurrentValue(tCurrentValue);
    };

    const validateAmount = (amount: number) => {
        if (!amount || amount === 0) {
            setNotificationList((prev) =>
                prev.concat(mapNotificationProps("Please add amount", "danger"))
            );
            return false;
        }
        return true;
    };

    const doAddExpense = async () => {
        const { fromWalletIdx, categoryIdx, amount, date, description } =
            currentValue;

        const isValid = validateAmount(amount);

        if (!isValid) {
            setIsLoading(false);
            return;
        }

        const request: AddExpenseRequest = {
            amount,
            categoryId: categories[categoryIdx]?.id ?? 0,
            date,
            description,
            fromAccountId: wallets[fromWalletIdx]?.id ?? 0,
        };

        const response = await addExpense(request);

        if (response) {
            const tWallets = R.clone(wallets);
            const selectedWalletIdx = wallets.findIndex(
                (x) => x.name === response.transaction.fromAccount.name
            );

            tWallets[selectedWalletIdx].balance =
                response.transaction.fromAccount.balance;
            setWallets(tWallets);
            setNotificationList((prev) =>
                prev.concat(
                    mapNotificationProps("AddExpense sucess", "success")
                )
            );

            return true;
        }

        setNotificationList((prev) =>
            prev.concat(mapNotificationProps("AddExpense failed", "danger"))
        );

        return false;
    };

    const doAddIncome = async () => {
        const { fromWalletIdx, categoryIdx, amount, date, description } =
            currentValue;

        const isValid = validateAmount(amount);

        if (!isValid) {
            setIsLoading(false);
            return;
        }

        const request: AddIncomeRequest = {
            amount,
            categoryId: categories[categoryIdx]?.id ?? 0,
            date,
            description,
            toAccountId: wallets[fromWalletIdx]?.id ?? 0,
        };

        const response = await addIncome(request);

        if (response) {
            const tWallets = R.clone(wallets);
            const selectedWalletIdx = wallets.findIndex(
                (x) => x.name === response.transaction.toAccount.name
            );

            tWallets[selectedWalletIdx].balance =
                response.transaction.toAccount.balance;
            setWallets(tWallets);
            setNotificationList((prev) =>
                prev.concat(mapNotificationProps("AddIncome sucess", "success"))
            );

            return true;
        }

        setNotificationList((prev) =>
            prev.concat(mapNotificationProps("AddIncome failed", "danger"))
        );

        return false;
    };

    const doAddTransfer = async () => {
        const {
            fromWalletIdx,
            toWalletIdx,
            categoryIdx,
            amount,
            date,
            description,
        } = currentValue;

        const isValid = validateAmount(amount);

        if (!isValid) {
            setIsLoading(false);
            return;
        }

        const request: AddTransferRequest = {
            amount,
            categoryId: categories[categoryIdx]?.id ?? 0,
            date,
            description,
            toAccountId: wallets[toWalletIdx]?.id ?? 0,
            fromAccountId: wallets[fromWalletIdx]?.id ?? 0,
        };

        const response = await addTransfer(request);

        if (response) {
            const tWallets = R.clone(wallets);
            const fromWalletIdx = wallets.findIndex(
                (x) => x.name === response.transaction.fromAccount.name
            );
            const toWalletIdx = wallets.findIndex(
                (x) => x.name === response.transaction.toAccount.name
            );

            tWallets[fromWalletIdx].balance =
                response.transaction.fromAccount.balance;
            tWallets[toWalletIdx].balance =
                response.transaction.toAccount.balance;

            setWallets(tWallets);
            setNotificationList((prev) =>
                prev.concat(
                    mapNotificationProps("AddTransfer success", "success")
                )
            );

            return true;
        }

        setNotificationList((prev) =>
            prev.concat(mapNotificationProps("AddTransfer failed", "danger"))
        );

        return false;
    };

    const addTransaction = () => {
        const doTransaction = () => {
            const transactionTypeIdx = transactionTypeTabActive.findIndex(
                (x) => x === true
            );

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
                ...initialState,
                toWalletIdx: currentValue.toWalletIdx,
                fromWalletIdx: currentValue.fromWalletIdx,
            });
        }

        setIsLoading(false);
    };

    const renderWalletSection = () => {
        const isTransfer = transactionTypeTabActive[2];
        const render = (
            title: string,
            balance: number,
            updateWallet: (value: string) => void,
            value: string
        ) => (
            <div className="columns is-mobile is-vcentered">
                <span className="column is-4 has-text-weight-bold">
                    {title}
                </span>
                <Dropdown
                    className="column is-4 is-narrow"
                    options={wallets.map((x) => x.name)}
                    updateSelectedValue={updateWallet}
                    value={value}
                />
                <span className="column is-narrow">
                    ฿ {formatNumber(balance)}
                </span>
            </div>
        );

        return isTransfer ? (
            <>
                {render(
                    "From",
                    wallets[currentValue.fromWalletIdx]?.balance ?? 0,
                    updateSelectedFromWallet,
                    wallets[currentValue.fromWalletIdx]?.name
                )}
                {render(
                    "To",
                    wallets[currentValue.toWalletIdx]?.balance ?? 0,
                    updateSelectedToWallet,
                    wallets[currentValue.toWalletIdx]?.name
                )}
            </>
        ) : (
            render(
                "Wallet",
                wallets[currentValue.fromWalletIdx]?.balance ?? 0,
                updateSelectedFromWallet,
                wallets[currentValue.fromWalletIdx]?.name
            )
        );
    };

    const renderTransactionTypeTab = () => {
        const transactionTypes = ["Expense", "Income", "Transfer"];

        return (
            <ul>
                {transactionTypes.map((t, idx) => (
                    <li
                        className={
                            transactionTypeTabActive[idx] ? "is-active" : ""
                        }
                        key={t}
                        data-id={idx}
                        onClick={transactionTypeTabOnClickHandler}
                    >
                        <a>{t}</a>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <>
            <div className="mt-5 more">
                <div className="tabs is-toggle is-fullwidth">
                    {renderTransactionTypeTab()}
                </div>
                <div className="columns is-mobile is-vcentered">
                    <span className="column is-4 has-text-weight-bold">
                        Category
                    </span>
                    <Dropdown
                        className="column"
                        options={categories.map((x) => x.name)}
                        updateSelectedValue={updateSelectedCategory}
                        value={categories[currentValue.categoryIdx].name}
                    />
                </div>
                {renderWalletSection()}
                <div className="columns is-mobile is-vcentered">
                    <span className="column is-4 has-text-weight-bold">
                        Date
                    </span>
                    <DateBox
                        className="column"
                        name="date"
                        updateValue={updateSelectedDate}
                        value={currentValue.date}
                    />
                </div>
                <div className="columns is-mobile is-vcentered">
                    <span className="column is-4 has-text-weight-bold">
                        Amount
                    </span>
                    <TextBox
                        className="column"
                        updateValue={updateExpense}
                        name="expnese"
                        type="number"
                        defaultValue="0"
                        value={currentValue.amount.toString()}
                        addOn={{ text: "฿", position: "front" }}
                    />
                </div>
                <div className="columns is-mobile is-vcentered">
                    <span className="column is-4 has-text-weight-bold">
                        Description
                    </span>
                    <TextField
                        className="column more__textArea"
                        name="description"
                        updateValue={updateDescription}
                        value={currentValue.description}
                    />
                </div>
                <div className="columns is-mobile is-vcentered">
                    <div className="column">
                        <Button
                            className={`more__button--add ${
                                isLoading ? "is-loading" : ""
                            }`}
                            onClickHandler={addTransaction}
                            value="Add"
                            type="primary"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default withRouter(More);
