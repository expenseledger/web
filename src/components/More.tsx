import * as R from "ramda";
import React from "react";
import { RouteComponentProps } from "react-router";
import { useRecoilState } from "recoil";
import {
    categoriesState,
    toastState,
    walletsState,
} from "../common/shareState";
import { formatNumber } from "../common/uils";
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
import { withAuthProtection } from "./hoc/WithAuthProtection";
import Layout from "./Layout";
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
    const [wallets, setWallets] = useRecoilState(walletsState);
    const [categories] = useRecoilState(categoriesState);
    const [, setNotificationList] = useRecoilState(toastState);
    const [isLoading, setIsLoading] = React.useState(false);
    const [currentValue, setCurrentValue] = React.useState<CurrentValue>({
        fromWalletIdx: (props.location.state as any).walletIdx ?? 0,
        toWalletIdx: (props.location.state as any).walletIdx ?? 0,
        categoryIdx: (props.location.state as any).categoryIdx ?? 0,
        amount: (props.location.state as any).amount ?? 0,
        date: (props.location.state as any).date ?? Date.now.toString(),
        description: "",
    });
    const [
        transactionTypeTabActive,
        setTransactionTypeTabActive,
    ] = React.useState([true, false, false]);
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
        const {
            fromWalletIdx,
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

        const request: AddExpenseRequest = {
            amount,
            category: categories[categoryIdx]?.name ?? "",
            date,
            description,
            from: wallets[fromWalletIdx]?.name ?? "",
        };

        const response = await addExpense(request);

        if (response) {
            const tWallets = R.clone(wallets);
            const selectedWalletIdx = wallets.findIndex(
                (x) => x.name === response.srcWallet.name
            );

            tWallets[selectedWalletIdx].balance = response.srcWallet.balance;
            setWallets(tWallets);
            setNotificationList((prev) =>
                prev.concat(
                    mapNotificationProps("AddExpense sucess", "success")
                )
            );

            return;
        }

        setNotificationList((prev) =>
            prev.concat(mapNotificationProps("AddExpense failed", "danger"))
        );
    };

    const doAddIncome = async () => {
        const {
            fromWalletIdx,
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

        const request: AddIncomeRequest = {
            amount,
            category: categories[categoryIdx]?.name ?? "",
            date,
            description,
            to: wallets[fromWalletIdx]?.name ?? "",
        };

        const response = await addIncome(request);

        if (response) {
            const tWallets = R.clone(wallets);
            const selectedWalletIdx = wallets.findIndex(
                (x) => x.name === response.dstWallet.name
            );

            tWallets[selectedWalletIdx].balance = response.dstWallet.balance;
            setWallets(tWallets);
            setNotificationList((prev) =>
                prev.concat(mapNotificationProps("AddIncome sucess", "success"))
            );

            return;
        }

        setNotificationList((prev) =>
            prev.concat(mapNotificationProps("AddIncome failed", "danger"))
        );
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
            category: categories[categoryIdx]?.name ?? "",
            date,
            description,
            to: wallets[toWalletIdx]?.name ?? "",
            from: wallets[fromWalletIdx]?.name ?? "",
        };

        const response = await addTransfer(request);

        if (response) {
            const tWallets = R.clone(wallets);
            const fromWalletIdx = wallets.findIndex(
                (x) => x.name === response.srcWallet.name
            );
            const toWalletIdx = wallets.findIndex(
                (x) => x.name === response.dstWallet.name
            );

            tWallets[fromWalletIdx].balance = response.srcWallet.balance;
            tWallets[toWalletIdx].balance = response.dstWallet.balance;

            setWallets(tWallets);
            setNotificationList((prev) =>
                prev.concat(
                    mapNotificationProps("AddTransfer success", "success")
                )
            );

            return;
        }

        setNotificationList((prev) =>
            prev.concat(mapNotificationProps("AddTransfer failed", "danger"))
        );
    };

    const addTransaction = () => {
        const transactionTypeIdx = transactionTypeTabActive.findIndex(
            (x) => x === true
        );

        setIsLoading(true);

        switch (transactionTypes[transactionTypeIdx]) {
            case "EXPENSE":
                doAddExpense();
                break;
            case "INCOME":
                doAddIncome();
                break;
            case "TRANSFER":
                doAddTransfer();
                break;
        }

        setIsLoading(false);
    };

    const renderWalletSection = () => {
        const isTransfer = transactionTypeTabActive[2];
        const render = (
            title: string,
            walletName: string,
            balance: number,
            updateWallet: (value: string) => void
        ) => (
            <div className="columns is-mobile is-vcentered">
                <span className="column is-4 has-text-weight-bold">
                    {title}
                </span>
                <Dropdown
                    className="column is-4 is-narrow"
                    default={walletName}
                    options={wallets.map((x) => x.name)}
                    updateSelectedValue={updateWallet}
                />
                <span className="column is-3 is-narrow">
                    {formatNumber(balance)}
                </span>
                <span className="column is-1 is-narrow">THB</span>
            </div>
        );

        return isTransfer ? (
            <>
                {render(
                    "From",
                    wallets[currentValue.fromWalletIdx]?.name,
                    wallets[currentValue.fromWalletIdx]?.balance ?? 0,
                    updateSelectedFromWallet
                )}
                {render(
                    "To",
                    wallets[currentValue.toWalletIdx]?.name,
                    wallets[currentValue.toWalletIdx]?.balance ?? 0,
                    updateSelectedToWallet
                )}
            </>
        ) : (
            render(
                "Wallet",
                wallets[currentValue.fromWalletIdx]?.name,
                wallets[currentValue.fromWalletIdx]?.balance ?? 0,
                updateSelectedFromWallet
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
        <Layout>
            <div className="mt-5 more">
                <div className="tabs is-toggle">
                    {renderTransactionTypeTab()}
                </div>
                <div className="columns is-mobile is-vcentered">
                    <span className="column is-4 has-text-weight-bold">
                        Category
                    </span>
                    <Dropdown
                        className="column is-8"
                        default={categories[currentValue.categoryIdx]?.name}
                        options={categories.map((x) => x.name)}
                        updateSelectedValue={updateSelectedCategory}
                    />
                </div>
                {renderWalletSection()}
                <div className="columns is-mobile is-vcentered">
                    <span className="column is-4 has-text-weight-bold">
                        Date
                    </span>
                    <DateBox
                        className="column is-8"
                        name="date"
                        updateValue={updateSelectedDate}
                    />
                </div>
                <div className="columns is-mobile is-vcentered">
                    <span className="column is-4 has-text-weight-bold">
                        Amount
                    </span>
                    <TextBox
                        className="column is-8"
                        updateValue={updateExpense}
                        name="expnese"
                        type="number"
                        defaultValue="0"
                    />
                </div>
                <div className="columns is-mobile is-vcentered">
                    <span className="column is-4 has-text-weight-bold">
                        Description
                    </span>
                    <TextField
                        className="column is-8 more__textArea"
                        name="description"
                        updateValue={updateDescription}
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
        </Layout>
    );
};

const MoreWithAuthProtection = withAuthProtection()(More);

export default MoreWithAuthProtection;
