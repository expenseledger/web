import * as R from "ramda";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { useRecoilState } from "recoil";
import { useMutation } from "@apollo/client";

import {
    categoriesState,
    toastState,
    walletsState,
} from "../common/shareState";
import { TransactionType } from "../service/Constants";
import { mapNotificationProps } from "../service/Mapper";
import {
    ADD_EXPENSE,
    ADD_INCOME,
    ADD_TRANSFER,
} from "../service/TransactionService";
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

    const [addExpense] = useMutation(ADD_EXPENSE);
    const [addIncome] = useMutation(ADD_INCOME);
    const [addTransfer] = useMutation(ADD_TRANSFER);

    const transactionTypes: TransactionType[] = [
        "expense",
        "income",
        "transfer",
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

    const doAddExpense = async () => {
        const {
            fromWalletIdx,
            categoryIdx,
            amount,
            date,
            description,
        } = currentValue;

        const { data, errors } = await addExpense({
            variables: {
                amount,
                description,
                date,
                categoryId: categories[categoryIdx]?.id ?? 0,
                fromAccountId: wallets[fromWalletIdx]?.id ?? 0,
            },
        });

        if (!errors) {
            const tWallets = R.clone(wallets);
            const fromAccount = data.spend.transaction.fromAccount;
            const selectedWalletIdx = wallets.findIndex(
                (x) => x.id === fromAccount.id
            );

            tWallets[selectedWalletIdx].balance = fromAccount.balance;
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
            toWalletIdx,
            categoryIdx,
            amount,
            date,
            description,
        } = currentValue;

        const {data, errors} = await addIncome({
            variables: {
                amount,
                description,
                date,
                categoryId: categories[categoryIdx]?.id ?? 0,
                toAccountId: wallets[toWalletIdx]?.id ?? 0,
            },
        });

        if (!errors) {
            const tWallets = R.clone(wallets);
            const toAccount = data.spend.transaction.toAccount;
            const selectedWalletIdx = wallets.findIndex(
                (x) => x.id === toAccount.id
            );

            tWallets[selectedWalletIdx].balance = toAccount.balance;
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
            amount,
            date,
            description,
        } = currentValue;

        const {data, errors} = await addTransfer({
            variables: {
                amount,
                description,
                date,
                fromAccountId: wallets[fromWalletIdx]?.id ?? 0,
                toAccountId: wallets[toWalletIdx]?.id ?? 0,
            },
        });

        if (!errors) {
            const tWallets = R.clone(wallets);
            const fromAccount = data.spend.transaction.fromAccount;
            const fromWalletIdx = wallets.findIndex(
                (x) => x.id === fromAccount.id
            );
            const toAccount = data.spend.transaction.toAccount;
            const toWalletIdx = wallets.findIndex(
                (x) => x.id === toAccount.id
            );

            tWallets[fromWalletIdx].balance = fromAccount.balance;
            tWallets[toWalletIdx].balance = toAccount.balance;

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
        switch (transactionTypes[transactionTypeIdx]) {
            case "expense":
                doAddExpense();
                break;
            case "income":
                doAddIncome();
                break;
            case "transfer":
                doAddTransfer();
                break;
        }
    };

    const renderTransaction = () => {
        const isTransfer = transactionTypeTabActive[2];

        return (
            <>
                <div className="more__content__transaction__from">
                    <span className="more__content__transaction__from__title">
                        {isTransfer ? "From" : "Wallet"}
                    </span>
                    <Dropdown
                        className="more__content__transaction__from__dropdown"
                        default={wallets[currentValue.fromWalletIdx]?.name}
                        options={wallets.map((x) => x.name)}
                        updateSelectedValue={updateSelectedFromWallet}
                    />
                    <span className="more__content__transaction__from__balance">
                        {wallets[currentValue.fromWalletIdx]?.balance ?? 0} THB
                    </span>
                </div>
                {isTransfer ? (
                    <div className="more__content__transaction__to">
                        <span className="more__content__transaction__to__title">
                            To
                        </span>
                        <Dropdown
                            className="more__content__transaction__to__dropdown"
                            default={wallets[currentValue.toWalletIdx]?.name}
                            options={wallets.map((x) => x.name)}
                            updateSelectedValue={updateSelectedToWallet}
                        />
                        <span className="more__content__transaction__to__balance">
                            {wallets[currentValue.toWalletIdx]?.balance ?? 0}{" "}
                            THB
                        </span>
                    </div>
                ) : null}
            </>
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
        <Layout isShowBackwardIcon={true}>
            <div className="more__content">
                <div className="tabs is-toggle">
                    {renderTransactionTypeTab()}
                </div>
                <div className="more__content__category">
                    <span className="more__content__category__title">
                        Category{" "}
                    </span>
                    <Dropdown
                        className="more__content__category__dropdown"
                        default={categories[currentValue.categoryIdx]?.name}
                        options={categories.map((x) => x.name)}
                        updateSelectedValue={updateSelectedCategory}
                    />
                </div>
                <div className="more__content__transaction">
                    {renderTransaction()}
                </div>
                <div className="more__content__date">
                    <span className="more__content__date__title">Date</span>
                    <DateBox
                        className="more__content__date__box"
                        name="date"
                        updateValue={updateSelectedDate}
                    />
                </div>
                <div className="more__content__amount">
                    <span className="more__content__amount__title">Amount</span>
                    <TextBox
                        className="more__content__amount__box"
                        updateValue={updateExpense}
                        name="expnese"
                        type="number"
                    />
                </div>
                <div className="more__content__description">
                    <span className="more__content__description__title">
                        Description
                    </span>
                    <TextField
                        className="more__content__description__box"
                        name="description"
                        updateValue={updateDescription}
                    />
                </div>
                <div>
                    <Button onClickHandler={addTransaction} value="Add" />
                </div>
            </div>
        </Layout>
    );
};

const MoreWithAuthProtection = withAuthProtection()(More);

export default MoreWithAuthProtection;
