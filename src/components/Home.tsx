import * as R from "ramda";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { accountsState, categoriesState, currencyState } from "../common/shareState";
import { toNumber } from "../common/utils";
import dayjs from "../lib/dayjs";
import { useNotification } from "../service/helper/notificationHelper";
import { AddExpenseRequest } from "../service/model/Requests";
import { addExpense } from "../service/transactionService";
import AccountCard from "./AccountCard";
import "./Home.scss";
import Button from "./bases/Button";
import DateBox from "./bases/DateBox";
import Dropdown from "./bases/Dropdown";
import TextBox from "./bases/TextBox";
import { Box, Flex, Grid, Text } from "@radix-ui/themes";
import { FileIcon, ListBulletIcon } from "@radix-ui/react-icons";

interface CurrentValue {
    accountIdx: number;
    categoryIdx: number;
    amount: string;
    date: string;
    description: string;
}

const LinkText = styled.span`
    vertical-align: middle;
`;
const InputBox = styled(Box)`
    grid-column: 2 / span 2;
`;

const Home: React.FC = () => {
    const initialState: CurrentValue = {
        accountIdx: 0,
        categoryIdx: 0,
        amount: "",
        date: dayjs().format("YYYY-MM-DD"),
        description: "",
    };
    const [accounts, setAccounts] = useRecoilState(accountsState);
    const [categories] = useRecoilState(categoriesState);
    const { addNotification } = useNotification();
    const [currentValue, setCurrentValue] = React.useState<CurrentValue>(initialState);
    const [isLoading, setIsLoading] = React.useState(false);
    const navigate = useNavigate();
    const currency = useRecoilValue(currencyState);

    const updateDescription = (value: string) => {
        setCurrentValue({
            ...currentValue,
            description: value,
        });
    };

    const updateSelectedDate = (value: string) => {
        setCurrentValue({
            ...currentValue,
            date: value,
        });
    };

    const updateSelectedAccount = (idx: number) => {
        setCurrentValue({
            ...currentValue,
            accountIdx: idx,
        });
    };

    const updateSelectedCategory = (value: string) => {
        const idx = categories.findIndex((x) => x.name === value);

        setCurrentValue({
            ...currentValue,
            categoryIdx: idx,
        });
    };

    const updateExpense = (value: string) => {
        setCurrentValue({
            ...currentValue,
            amount: value,
        });
    };

    const addTransaction = async () => {
        const { accountIdx, amount, date, categoryIdx, description } = currentValue;

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
                description: description === "" ? "-" : description,
                date: dayjs(date).toDate(),
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
                    description: "",
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
            <Box width="100%">{renderAccountCards()}</Box>
            <Flex gap="4" my="4">
                <Text weight="bold">
                    <Link
                        to={{
                            pathname: `account/${
                                accounts[currentValue.accountIdx]?.id ?? 0
                            }/transactionList`,
                        }}>
                        <Flex align="center" gap="1">
                            <ListBulletIcon />
                            <LinkText>Transactions</LinkText>
                        </Flex>
                    </Link>
                </Text>
                <Text weight="bold">
                    <Link
                        to="/report"
                        state={{ accountId: accounts[currentValue.accountIdx]?.id ?? 0 }}>
                        <Flex align="center" gap="1">
                            <FileIcon />
                            <LinkText>Report</LinkText>
                        </Flex>
                    </Link>
                </Text>
            </Flex>
            <Grid columns="3" gap="4" align="center">
                <Box>
                    <Text weight="bold">Amount</Text>
                </Box>
                <InputBox>
                    <TextBox
                        updateValue={updateExpense}
                        name="expense"
                        type="number"
                        value={currentValue.amount}
                        addOn={{ text: currency, position: "front" }}
                    />
                </InputBox>
                <Box>
                    <Text weight="bold">Date</Text>
                </Box>
                <InputBox>
                    <DateBox
                        name="date"
                        updateValue={updateSelectedDate}
                        value={currentValue.date}
                    />
                </InputBox>
                <Box>
                    <Text weight="bold">Category</Text>
                </Box>
                <InputBox>
                    <Dropdown
                        options={categories
                            .filter((c) => c.type === "ANY" || c.type === "EXPENSE")
                            .map((c) => c.name)}
                        updateSelectedValue={updateSelectedCategory}
                    />
                </InputBox>
                <Box>
                    <Text weight="bold">Description</Text>
                </Box>
                <InputBox>
                    <TextBox
                        name="description"
                        updateValue={updateDescription}
                        value={currentValue.description}
                        placeholder="Optional"
                    />
                </InputBox>
                <Flex mt="2">
                    <Box>
                        <Button
                            className="content__button--add"
                            onClickHandler={addTransaction}
                            value="Add"
                            type="primary"
                            isLoading={isLoading}
                        />
                    </Box>
                    <Box ml="4">
                        <Button
                            className="content__button--more"
                            onClickHandler={toMorePage}
                            value="More"
                        />
                    </Box>
                </Flex>
            </Grid>
        </>
    );
};

export default Home;
