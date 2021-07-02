import dayjs from "dayjs";
import * as R from "ramda";
import React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import Slider from "react-slick";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import {
    categoriesState,
    toastState,
    walletsState,
} from "../common/shareState";
import { mapNotificationProps } from "../service/helper/notificationHelper";
import { AddExpenseRequest } from "../service/model/Requests";
import { addExpense } from "../service/transactionService";
import AccountCard from "./AccountCard";
import Button from "./bases/Button";
import DateBox from "./bases/DateBox";
import Dropdown from "./bases/Dropdown";
import TextBox from "./bases/TextBox";
import "./Home.scss";

interface CurrentValue {
    walletIdx: number;
    categoryIdx: number;
    amount: number;
    date: string;
}

const Icon = styled.span`
    vertical-align: middle;
`;

const Home: React.FC<RouteComponentProps> = (props) => {
    const initialState = {
        walletIdx: 0,
        categoryIdx: 0,
        amount: 0,
        date: dayjs().format("YYYY-MM-DD"),
    };
    const [wallets, setWallets] = useRecoilState(walletsState);
    const [categories] = useRecoilState(categoriesState);
    const [, setNotificationList] = useRecoilState(toastState);
    const [currentValue, setCurrentValue] =
        React.useState<CurrentValue>(initialState);
    const [isLoading, setIsLoading] = React.useState(false);

    const updateSelectedDate = (value: string) => {
        const tCurrentValue = R.clone(currentValue);

        tCurrentValue.date = value;
        setCurrentValue(tCurrentValue);
    };

    const updateSelectedWallet = (idx: number) => {
        const tCurrentValue = R.clone(currentValue);

        tCurrentValue.walletIdx = idx;
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

        if (!amount || amount === 0) {
            setNotificationList((prev) =>
                prev.concat(mapNotificationProps("Please add amount", "danger"))
            );
            setIsLoading(false);
            return;
        }

        const request: AddExpenseRequest = {
            amount,
            categoryId: categories[categoryIdx]?.id ?? 0,
            fromAccountId: wallets[walletIdx]?.id ?? 0,
            description: "-",
            date,
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

            setCurrentValue({
                ...initialState,
                walletIdx: currentValue.walletIdx,
            });
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

    const renderAccountCards = () => {
        const accountCards = wallets.map((x, idx) => (
            <AccountCard
                key={idx}
                id={idx}
                balance={currentValue.walletIdx === idx ? x.balance : 0}
                name={x.name}
            />
        ));
        const settings = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
        };
        const afterChangeHandler = (idx: number) => {
            updateSelectedWallet(idx);
        };

        return (
            <Slider {...settings} afterChange={afterChangeHandler}>
                {accountCards}
            </Slider>
        );
    };

    return (
        <>
            <section className="section">
                <div className="columns is-mobile is-vcentered">
                    <div className="column is-12">{renderAccountCards()}</div>
                </div>
            </section>
            <div className="columns is-mobile is-vcentered">
                <div className="column is-7">
                    <Link
                        className="has-text-weight-bold"
                        to={{
                            pathname: `wallet/${
                                wallets[currentValue.walletIdx]?.id ?? 0
                            }/transactionList`,
                        }}
                    >
                        <span>Transactions</span>
                        <Icon className="icon">
                            <i
                                className="fas fa-chevron-right"
                                aria-hidden="true"
                            ></i>
                        </Icon>
                    </Link>
                </div>
            </div>
            <div className="columns is-mobile is-vcentered">
                <span className="column is-4 has-text-weight-bold">Date</span>
                <DateBox
                    className="column"
                    name="date"
                    updateValue={updateSelectedDate}
                    value={currentValue.date}
                />
            </div>
            <div className="columns is-mobile is-vcentered">
                <span className="column is-4 has-text-weight-bold">Amount</span>
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
                    Category
                </span>
                <Dropdown
                    className="column"
                    options={categories.map((category) => category.name)}
                    updateSelectedValue={updateSelectedCategory}
                    value={categories[currentValue.categoryIdx].name}
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
        </>
    );
};

export default withRouter(Home);
