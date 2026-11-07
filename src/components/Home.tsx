import React, { useCallback, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { accountsState, categoriesState } from "../common/shareState";
import { toNumber } from "../common/utils";
import dayjs from "../lib/dayjs";
import { currencySymbols } from "../service/constants";
import { replaceAccounts } from "../service/helper/accountHelper";
import { categoriesFor } from "../service/helper/categoryHelper";
import { useNotification } from "../service/helper/notificationHelper";
import { AddExpenseRequest } from "../service/model/Requests";
import { addExpense } from "../service/transactionService";
import AccountCard from "./AccountCard";
import Button from "./bases/Button";
import DateBox from "./bases/DateBox";
import Dropdown from "./bases/Dropdown";
import TextBox from "./bases/TextBox";
import { Box, Flex, Grid, Text } from "@radix-ui/themes";
import { FileIcon, ListBulletIcon } from "@radix-ui/react-icons";
import { color } from "../common/constants";
import { BackToHomeParam, useBackToHome } from "./Layout";
import { useAtom } from "jotai";
import AnimatedPage from "./AnimatedPage";
import { Navigation, Pagination } from "swiper/modules";
import { describeError } from "../service/helper/errorHelper";

interface CurrentValue {
    accountIdx: number;
    categoryId: string;
    amount: string;
    date: string;
    description: string;
}

const LinkText = styled.span`
    vertical-align: middle;
`;

const StyledAddButton = styled(Button)`
    width: 100px;
`;

const StyledMoreButton = styled(Button)`
    width: 100px;
`;

const Home: React.FC = () => {
    const initialState: CurrentValue = {
        accountIdx: 0,
        categoryId: undefined,
        amount: "",
        date: dayjs().format("YYYY-MM-DD"),
        description: "",
    };
    const [accounts, setAccounts] = useAtom(accountsState);
    const [categories] = useAtom(categoriesState);
    const categoryOptions = categoriesFor(categories, "EXPENSE");
    const { addNotification } = useNotification();
    const [currentValue, setCurrentValue] = React.useState<CurrentValue>(initialState);
    const [isLoading, setIsLoading] = React.useState(false);
    const navigate = useNavigate();
    const backToHomeParam = useLocation().state as BackToHomeParam;
    const { setBackToHomeParam } = useBackToHome();

    const updateField = useCallback((field: keyof CurrentValue, value: any) => {
        setCurrentValue((prev) => ({
            ...prev,
            [field]: value,
        }));
    }, []);
    const updateDescription = (value: string) => updateField("description", value);
    const updateSelectedDate = (value: string) => updateField("date", value);
    const updateSelectedAccount = useCallback(
        (idx: number) => updateField("accountIdx", idx),
        [updateField]
    );
    const selectedCategory =
        categoryOptions.find((x) => x.id === currentValue.categoryId) ?? categoryOptions[0];
    const updateSelectedCategory = (value: string) => {
        const category = categoryOptions.find((x) => x.name === value);

        updateField("categoryId", category?.id);
    };
    const updateExpense = (value: string) => updateField("amount", value);

    const addTransaction = async () => {
        const { accountIdx, amount, date, description } = currentValue;

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
            const account = accounts[accountIdx];
            const request: AddExpenseRequest = {
                amount: { amount: numberedAmount, currency: account.currency },
                categoryId: selectedCategory?.id,
                fromAccountId: account.id,
                description,
                date: dayjs(date).toDate(),
            };

            const response = await addExpense(request);

            if (response.transaction) {
                setAccounts(replaceAccounts(accounts, [response.transaction.fromAccount]));
                addNotification("AddExpense sucess", "success");

                setCurrentValue({
                    ...currentValue,
                    description: "",
                    amount: "",
                });
                setIsLoading(false);
                return;
            }

            addNotification(describeError(response.errorCode, "AddExpense failed"), "danger");
            setIsLoading(false);
        } catch {
            addNotification("Please add amount", "danger");
            setIsLoading(false);
        }
    };

    const toMorePage = () => {
        navigate("/more", { state: { ...currentValue, categoryId: selectedCategory?.id } });
    };

    const renderAccountCards = () => {
        const accountCards = accounts.map((x, idx) => (
            <SwiperSlide key={idx}>
                <AccountCard
                    key={idx}
                    id={idx}
                    balance={currentValue.accountIdx === idx ? x.balance : 0}
                    currency={currencySymbols[x.currency]}
                    name={x.name}
                />
            </SwiperSlide>
        ));
        const initialSlideIdx = accounts.findIndex((x) => x.id === backToHomeParam?.accountId);

        return (
            <Swiper
                modules={[Navigation, Pagination]}
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
    }, [backToHomeParam, accounts, setBackToHomeParam, updateSelectedAccount]);

    return (
        <AnimatedPage>
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
                            ariaLabel="Amount"
                            type="number"
                            value={currentValue.amount}
                            addOn={{
                                text: currencySymbols[accounts[currentValue.accountIdx]?.currency],
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
                <Flex direction="column">
                    <Box>
                        <Text weight="bold" size="1">
                            Category
                        </Text>
                    </Box>
                    <Box>
                        <Dropdown
                            options={categoryOptions.map((c) => c.name)}
                            defaultValue={selectedCategory?.name}
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
                <Flex mt="2" gap="4">
                    <StyledAddButton
                        onClickHandler={addTransaction}
                        value="Add"
                        type="primary"
                        isLoading={isLoading}
                    />
                    <StyledMoreButton
                        onClickHandler={toMorePage}
                        value="More"
                        type="primary"
                        variant="soft"
                    />
                </Flex>
            </Grid>
        </AnimatedPage>
    );
};

export default Home;
