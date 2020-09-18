import * as R from "ramda";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { useRecoilState } from "recoil";
import {
    categoriesState,
    toastState,
    walletsState,
} from "../common/shareState";
import { TransactionType } from "../service/Constants";
import { mapNotificationProps } from "../service/Mapper";
import Category from "../service/model/Category";
import {
    AddExpenseRequest,
    AddIncomeRequest,
    AddTransferRequest,
} from "../service/model/Requests";
import Wallet from "../service/model/Wallet";
import {
    addExpense,
    addIncome,
    addTransfer,
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
    fromWallet?: Wallet;
    toWallet?: Wallet;
    category?: Category;
    amount: number;
    date: string;
    description: string;
    [key: string]: any;
}

function More(props: RouteComponentProps) {
    const [wallets, setWallets] = useRecoilState(walletsState);
    const [categories] = useRecoilState(categoriesState);
    const [, setNotificationList] = useRecoilState(toastState);
    const [currentValue, setCurrentValue] = React.useState<CurrentValue>({
        fromWallet: (props.location.state as any).wallet,
        toWallet: (props.location.state as any).wallet,
        category: (props.location.state as any).category,
        amount: (props.location.state as any).amount,
        date: (props.location.state as any).date,
        description: "",
    });
    const [
        transactionTypeTabActive,
        setTransactionTypeTabActive,
    ] = React.useState([true, false, false]);
    let transactionType: TransactionType = "EXPENSE";

    const transactionTypeTabOnClickHandler = (e: any) => {
        const currentTabActive = [...transactionTypeTabActive];
        const currentTarget = e.currentTarget;
        const currentTabIdx = Number.parseInt(currentTarget.dataset.id, 10);
        const tabActive = currentTabActive.map(
            (t, idx) => idx === currentTabIdx
        );

        setTransactionTypeTabActive(tabActive);
        switch (currentTabIdx) {
            case 0:
                transactionType = "EXPENSE";
                break;
            case 1:
                transactionType = "INCOME";
                break;
            case 2:
                transactionType = "TRANSFER";
                break;
        }
    };

    const updateSelectedCategory = (value: string) => {
        const tCurrentValue = R.clone(currentValue);

        tCurrentValue.category = categories.find((x) => x.name === value);
        setCurrentValue(tCurrentValue);
    };

    const updateSelectedFromWallet = (value: string) => {
        const tCurrentValue = R.clone(currentValue);

        tCurrentValue.fromWallet = wallets.find((x) => x.name === value);
        setCurrentValue(tCurrentValue);
    };

    const updateSelectedToWallet = (value: string) => {
        const tCurrentValue = R.clone(currentValue);

        tCurrentValue.toWallet = wallets.find((x) => x.name === value);
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
            fromWallet,
            category,
            amount,
            date,
            description,
        } = currentValue;

        const request: AddExpenseRequest = {
            amount,
            category: category?.name ?? "",
            date,
            description,
            from: fromWallet?.name ?? "",
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
            fromWallet,
            category,
            amount,
            date,
            description,
        } = currentValue;

        const request: AddIncomeRequest = {
            amount,
            category: category?.name ?? "",
            date,
            description,
            to: fromWallet?.name ?? "",
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
            fromWallet,
            toWallet,
            category,
            amount,
            date,
            description,
        } = currentValue;

        const request: AddTransferRequest = {
            amount,
            category: category?.name ?? "",
            date,
            description,
            to: toWallet?.name ?? "",
            from: fromWallet?.name ?? "",
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
        switch (transactionType) {
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
                        default={currentValue.fromWallet?.name}
                        options={wallets.map((x) => x.name)}
                        updateSelectedValue={updateSelectedFromWallet}
                    />
                    <span className="more__content__transaction__from__balance">
                        {currentValue.fromWallet?.balance ?? 0} THB
                    </span>
                </div>
                {isTransfer ? (
                    <div className="more__content__transaction__to">
                        <span className="more__content__transaction__to__title">
                            To
                        </span>
                        <Dropdown
                            className="more__content__transaction__to__dropdown"
                            default={currentValue.toWallet?.name}
                            options={wallets.map((x) => x.name)}
                            updateSelectedValue={updateSelectedToWallet}
                        />
                        <span className="more__content__transaction__to__balance">
                            {currentValue.toWallet?.balance ?? 0} THB
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
                        default={currentValue.category?.name}
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
}

const MoreWithAuthProtection = withAuthProtection()(More);

export default MoreWithAuthProtection;
