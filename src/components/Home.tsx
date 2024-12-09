import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { color } from "../common/constants";
import { BackToHomeParam, useBackToHome } from "./Layout";
import { useAtom, useAtomValue } from "jotai";

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

const Home: React.FC = () => {
    const initialState: CurrentValue = {
        accountIdx: 0,
        categoryIdx: 0,
        amount: "",
        date: dayjs().format("YYYY-MM-DD"),
        description: "",
    };
    const [accounts, setAccounts] = useAtom(accountsState);
    const [categories] = useAtom(categoriesState);
    const { addNotification } = useNotification();
    const [currentValue, setCurrentValue] = React.useState<CurrentValue>(initialState);
    const [isLoading, setIsLoading] = React.useState(false);
    const navigate = useNavigate();
    const currency = useAtomValue(currencyState);
    const backToHomeParam = useLocation().state as BackToHomeParam;
    const { setBackToHomeParam } = useBackToHome();

    const updateField = (field: keyof CurrentValue, value: any) => {
        setCurrentValue({
            ...currentValue,
            [field]: value,
        });
    };

    const updateDescription = (value: string) => updateField("description", value);
    const updateSelectedDate = (value: string) => updateField("date", value);
    const updateSelectedAccount = (idx: number) => updateField("accountIdx", idx);
    const updateSelectedCategory = (value: string) => {
        const idx = categories.findIndex((x) => x.name === value);

        updateField("categoryIdx", idx);
    };
    const updateExpense = (value: string) => updateField("amount", value);

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
                const tAccounts = accounts.map((a) => {
                    if (a.name === response.transaction.fromAccount.name) {
                        return {
                            ...a,
                            balance: response.transaction.fromAccount.balance,
                        };
                    }

                    return a;
                });
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
        const initialSlideIdx = accounts.findIndex((x) => x.id === backToHomeParam?.accountId);

        return (
            <Swiper
                loop
                spaceBetween={10}
                pagination={true}
                centeredSlides={true}
                onSlideChange={(swipe) => updateSelectedAccount(swipe.realIndex)}
                initialSlide={initialSlideIdx}>
                {accountCards}
            </Swiper>
        );
    };

    useEffect(() => {
        if (backToHomeParam) {
            const idx = accounts.findIndex((x) => x.id === backToHomeParam?.accountId);
            updateSelectedAccount(idx);
            setBackToHomeParam(null);
        }
    }, [backToHomeParam]);

    return (
        <>
            <Box width="100%">{renderAccountCards()}</Box>
            <Flex gap="4" my="4">
                <Text weight="bold" color={color.primary as any}>
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
                <Text weight="bold" color={color.primary as any}>
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
            <Grid rows="3" gap="3">
                <Flex direction="column">
                    <Box>
                        <Text weight="bold" size="1">
                            Amount
                        </Text>
                    </Box>
                    <Box>
                        <TextBox
                            updateValue={updateExpense}
                            name="expense"
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
                <Flex direction="column">
                    <Box>
                        <Text weight="bold" size="1">
                            Category
                        </Text>
                    </Box>
                    <Box>
                        <Dropdown
                            options={categories
                                .filter((c) => c.type === "ANY" || c.type === "EXPENSE")
                                .map((c) => c.name)}
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
                            type="primary"
                            variant="soft"
                        />
                    </Box>
                </Flex>
            </Grid>
        </>
    );
};

export default Home;
