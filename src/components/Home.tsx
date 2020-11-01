import dayjs from "dayjs";
import * as R from "ramda";
import React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { useRecoilState } from "recoil";
import {
    categoriesState,
    toastState,
    walletsState,
} from "../common/shareState";
import { mapNotificationProps } from "../service/Mapper";
import { AddExpenseRequest } from "../service/model/Requests";
import { addExpense } from "../service/TransactionService";
import { formatNumber } from "../service/Utils";
import Button from "./bases/Button";
import DateBox from "./bases/DateBox";
import Dropdown from "./bases/Dropdown";
import TextBox from "./bases/TextBox";
import { withAuthProtection } from "./hoc/WithAuthProtection";
import "./Home.scss";
import Layout from "./Layout";

interface CurrentValue {
    walletIdx: number;
    categoryIdx: number;
    amount: number;
    date: string;
}

const Home: React.FC<RouteComponentProps> = (props) => {
    const [wallets, setWallets] = useRecoilState(walletsState);
    const [categories] = useRecoilState(categoriesState);
    const [, setNotificationList] = useRecoilState(toastState);
    const [currentValue, setCurrentValue] = React.useState<CurrentValue>({
        walletIdx: 0,
        categoryIdx: 0,
        amount: 0,
        date: dayjs().format("YYYY-MM-DD"),
    });
    const [isLoading, setIsLoading] = React.useState(false);

    const updateSelectedDate = (value: string) => {
        const tCurrentValue = R.clone(currentValue);

        tCurrentValue.date = value;
        setCurrentValue(tCurrentValue);
    };

    const updateSelectedWallet = (value: string) => {
        const tCurrentValue = R.clone(currentValue);

        tCurrentValue.walletIdx = wallets.findIndex((x) => x.name === value);
        setCurrentValue(tCurrentValue);
    };

    const updateSelectedCategory = (value: string) => {
        const tCurrentValue = R.clone(currentValue);

        tCurrentValue.categoryIdx = categories.findIndex(
            (x) => x.name === value
        );
        setCurrentValue(tCurrentValue);
    };

    const updateExpense = (value: string) => {
        const tCurrentValue = R.clone(currentValue);

        tCurrentValue.amount = Number.parseFloat(value);
        setCurrentValue(tCurrentValue);
    };

    const addTransaction = async () => {
        const { walletIdx, amount, date, categoryIdx } = currentValue;
        setIsLoading(true);

        if (amount === 0) {
            setNotificationList((prev) =>
                prev.concat(
                    mapNotificationProps(
                        "AddExpense failed: Please add amount",
                        "danger"
                    )
                )
            );
            setIsLoading(false);
            return;
        }

        const request: AddExpenseRequest = {
            amount,
            category: categories[categoryIdx]?.name ?? "",
            from: wallets[walletIdx]?.name ?? "",
            description: "quick add appense",
            date,
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

            setIsLoading(false);
            return;
        }

        setNotificationList((prev) =>
            prev.concat(mapNotificationProps("AddExpense is failed", "danger"))
        );
        setIsLoading(false);
    };

    const toMorePage = () => {
        props.history.push("/more", { ...currentValue });
    };

    return (
        <Layout>
            <section className="hero content__hero">
                <div className="hero-body">
                    <div className="container">
                        <h1 className="title inline">Balance:</h1>
                        <h1 className="subtitle inline has-text-weight-bold ml-3">
                            {formatNumber(
                                wallets[currentValue.walletIdx]?.balance ?? 0
                            )}
                        </h1>
                        <h1 className="subtitle inline has-text-weight-bold ml-3">
                            THB
                        </h1>
                    </div>
                </div>
            </section>
            <div className="columns is-mobile is-vcentered">
                <div className="column is-5">
                    <Dropdown
                        className="content__balance__dropdown"
                        options={wallets.map((wallet) => wallet.name)}
                        updateSelectedValue={updateSelectedWallet}
                    />
                </div>
                <div className="column is-7">
                    <Link
                        className="has-text-weight-bold"
                        to={{
                            pathname: `/transactionList/${
                                wallets[currentValue.walletIdx]?.name ?? ""
                            }`,
                        }}
                    >
                        Transaction
                    </Link>
                </div>
            </div>
            <div className="columns is-mobile is-vcentered">
                <span className="column is-5 has-text-weight-bold">Date</span>
                <DateBox
                    className="column is-7"
                    name="date"
                    updateValue={updateSelectedDate}
                />
            </div>
            <div className="columns is-mobile is-vcentered">
                <span className="column is-5 has-text-weight-bold">
                    Amount(THB)
                </span>
                <TextBox
                    className="column is-7"
                    updateValue={updateExpense}
                    name="expnese"
                    type="number"
                />
            </div>
            <div className="columns is-mobile is-vcentered">
                <span className="column is-5 has-text-weight-bold">
                    Category
                </span>
                <Dropdown
                    className="column is-7"
                    options={categories.map((category) => category.name)}
                    updateSelectedValue={updateSelectedCategory}
                />
            </div>
            <div className="columns is-mobile">
                <div className="column is-narrow">
                    <Button
                        className={`content__button--add ${
                            isLoading ? "is-loading" : ""
                        }`}
                        onClickHandler={addTransaction}
                        value="Add"
                        type="primary"
                    />
                </div>
                <div className="column">
                    <Button
                        className="content__button--more is-dark is-narrow"
                        onClickHandler={toMorePage}
                        value="More"
                    />
                </div>
            </div>
        </Layout>
    );
};

const HomeWithAuthProtection = withAuthProtection()(Home);

export default withRouter(HomeWithAuthProtection);
