import dayjs from "dayjs";
import * as R from "ramda";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { accountsState, categoriesState, currencyState } from "../common/shareState";
import { toNumber } from "../common/utils";
import { useNotification } from "../service/helper/notificationHelper";
import { AddExpenseRequest } from "../service/model/Requests";
import { addExpense } from "../service/transactionService";
import Button from "./bases/Button";
import DateBox from "./bases/DateBox";
import Dropdown from "./bases/Dropdown";
import TextBox from "./bases/TextBox";
import "./Home.scss";
import AccountCard from "./setting/AccountCard";

interface CurrentValue {
    accountIdx: number;
    categoryIdx: number;
    amount: string;
    date: string;
    title: string;
}

const Icon = styled.span`
    vertical-align: middle;
`;
const LinkText = styled.span`
    vertical-align: middle;
`;

const Home: React.FC = () => {
    const initialState: CurrentValue = {
        accountIdx: 0,
        categoryIdx: 0,
        amount: "",
        date: dayjs().format("YYYY-MM-DD"),
        title: "",
    };
    const [accounts, setAccounts] = useRecoilState(accountsState);
    const [categories] = useRecoilState(categoriesState);
    const { addNotification } = useNotification();
    const [currentValue, setCurrentValue] = React.useState<CurrentValue>(initialState);
    const [isLoading, setIsLoading] = React.useState(false);
    const navigate = useNavigate();
    const currency = useRecoilValue(currencyState);

    const updateTitle = (value: string) => {
        const tCurrentValue = R.clone(currentValue);

        tCurrentValue.title = value;
        setCurrentValue(tCurrentValue);
    };

    const updateSelectedDate = (value: string) => {
        const tCurrentValue = R.clone(currentValue);

        tCurrentValue.date = value;
        setCurrentValue(tCurrentValue);
    };

    const updateSelectedAccount = (idx: number) => {
        const tCurrentValue = R.clone(currentValue);

        tCurrentValue.accountIdx = idx;
        setCurrentValue(tCurrentValue);
    };

    const updateSelectedCategory = (value: string) => {
        const tCurrentValue = R.clone(currentValue);

        tCurrentValue.categoryIdx = categories.findIndex((x) => x.name === value);
        setCurrentValue(tCurrentValue);
    };

    const updateExpense = (value: string) => {
        const tCurrentValue = R.clone(currentValue);

        tCurrentValue.amount = value;
        setCurrentValue(tCurrentValue);
    };

    const addTransaction = async () => {
        const { accountIdx, amount, date, categoryIdx, title } = currentValue;

        setIsLoading(true);

        try {
            const numberedAmount = toNumber(amount);

            if (!numberedAmount || numberedAmount === 0) {
                addNotification("Please add amount", "danger");
                setIsLoading(false);
                return;
            } else if (!numberedAmount || numberedAmount < 0) {
                addNotification("Amount should be more than 0", "danger");
                setIsLoading(false);
                return;
            }
            const request: AddExpenseRequest = {
                amount: numberedAmount,
                categoryId: categories[categoryIdx]?.id ?? 0,
                fromAccountId: accounts[accountIdx]?.id ?? 0,
                description: title,
                date,
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

                setCurrentValue({
                    ...currentValue,
                    title: "",
                    amount: "",
                });
                setIsLoading(false);
                return;
            }

            addNotification("AddExpense is failed", "danger");
            setIsLoading(false);
        } catch {
            addNotification("Please add amount", "danger");
            setIsLoading(false);
        }
    };

    const toMorePage = () => {
        navigate("/more", { state: { ...currentValue } });
    };

    const renderAccountCards = () => {
        const accountCards = accounts.map((x, idx) => (
            <SwiperSlide key={idx}>
                <AccountCard
                    key={idx}
                    id={idx}
                    balance={currentValue.accountIdx === idx ? x.balance : 0}
                    currency={currency}
                    name={x.name}
                />
            </SwiperSlide>
        ));

        return (
            <Swiper
                loop={true}
                spaceBetween={10}
                pagination={true}
                slidesPerView={"auto"}
                centeredSlides={true}
                onSlideChange={(swipe) => updateSelectedAccount(swipe.realIndex)}>
                {accountCards}
            </Swiper>
        );
    };

    return (
        <>
            <div className="columns is-mobile is-vcentered">
                <div className="column is-12">{renderAccountCards()}</div>
            </div>

            <div className="columns is-mobile is-vcentered">
                <div className="column">
                    <Link
                        className="has-text-weight-bold"
                        to={{
                            pathname: `account/${
                                accounts[currentValue.accountIdx]?.id ?? 0
                            }/transactionList`,
                        }}>
                        <Icon className="icon">
                            <i className="fas fa-list-ul" aria-hidden="true"></i>
                        </Icon>
                        <LinkText>Transactions</LinkText>
                    </Link>
                    <Link
                        className="has-text-weight-bold ml-5"
                        to="/report"
                        state={{ accountId: accounts[currentValue.accountIdx]?.id ?? 0 }}>
                        <Icon className="icon">
                            <i className="fas fa-file" aria-hidden="true"></i>
                        </Icon>
                        <LinkText>Report</LinkText>
                    </Link>
                </div>
            </div>
            <div className="columns is-mobile is-vcentered">
                <span className="column is-4 has-text-weight-bold">Title</span>
                <TextBox
                    className="column pt-0"
                    name="title"
                    updateValue={updateTitle}
                    value={currentValue.title}
                />
            </div>
            <div className="columns is-mobile is-vcentered">
                <span className="column is-4 has-text-weight-bold">Date</span>
                <DateBox
                    className="column is-4-desktop is-4-tablet is-2-widescreen"
                    name="date"
                    updateValue={updateSelectedDate}
                    value={currentValue.date}
                />
            </div>
            <div className="columns is-mobile is-vcentered">
                <span className="column is-4 has-text-weight-bold">Amount</span>
                <TextBox
                    className="column is-4-desktop is-4-tablet is-2-widescreen amount__box"
                    updateValue={updateExpense}
                    name="expense"
                    type="number"
                    value={currentValue.amount}
                    addOn={{ text: currency, position: "front" }}
                />
            </div>
            <div className="columns is-mobile is-vcentered">
                <span className="column is-4 has-text-weight-bold">Category</span>
                <Dropdown
                    className="column is-4-desktop is-4-tablet is-2-widescreen category__dropdown"
                    options={categories
                        .filter((c) => c.type === "ANY" || c.type === "EXPENSE")
                        .map((c) => c.name)}
                    updateSelectedValue={updateSelectedCategory}
                    value={categories[currentValue.categoryIdx].name}
                />
            </div>
            <div className="columns is-mobile">
                <div className="column is-narrow">
                    <Button
                        className={`content__button--add ${isLoading ? "is-loading" : ""}`}
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

export default Home;
