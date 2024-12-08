import React, { startTransition, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { accountsState } from "../../common/shareState";
import Loading from "../../components/bases/Loading";
import dayjs from "../../lib/dayjs";
import { useNotification } from "../../service/helper/notificationHelper";
import { Transaction } from "../../service/model/Transaction";
import {
    deleteTransaction,
    getTransactionMonthYearList,
    listTransactions,
    updateTransaction,
} from "../../service/transactionService";
import AmountTxt from "../bases/AmountTxt";
import Button from "../bases/Button";
import MonthYearSwiper from "../bases/MonthYearSwiper";
import { TransactionCard } from "./TransactionCard";
import { Box, Card, Flex, Text } from "@radix-ui/themes";
import Switch from "../bases/Switch";
import { useBackToHome } from "../Layout";
import { useAtom } from "jotai";

const NoData = styled.div`
    font-weight: bold;
    text-align: center;
    margin-top: 30px;
`;

const Root = styled.div`
    text-align: center;
`;

interface HideAbleTransaction extends Transaction {
    isHide: boolean;
}

export const TransactionList: React.FC = () => {
    const [monthYearIdx, setMonthYearIdx] = useState<number>(0);
    const [monthYearList, setMonthYearList] = useState<string[]>(null);
    const [transactions, setTransactions] = useState<HideAbleTransaction[]>(null);
    const { addNotification } = useNotification();
    const [isLoading, setIsLoading] = useState(true);
    const [accounts, setAccounts] = useAtom(accountsState);
    const { accountId } = useParams();
    const [isPaidOnly, setIsPaidOnly] = useState<boolean>(false);
    const navigate = useNavigate();
    const mapPaidOnly = useCallback(
        (tx: HideAbleTransaction | Transaction) => {
            if (
                !isPaidOnly ||
                tx.type == "EXPENSE" ||
                (tx.type == "TRANSFER" && tx.fromAccount?.id === +accountId)
            ) {
                return {
                    ...tx,
                    isHide: false,
                };
            }

            return {
                ...tx,
                isHide: true,
            };
        },
        [accountId, isPaidOnly]
    );
    const backToHome = useCallback(() => {
        navigate("/");
    }, [navigate]);
    const { setBackToHomeParam } = useBackToHome();

    useEffect(() => {
        setBackToHomeParam({ accountId: +accountId });
        getTransactionMonthYearList({ accountId: +accountId })
            .then((response) => {
                setMonthYearList(response.monthYears);
            })
            .catch(backToHome);
    }, [accountId, backToHome]);

    useEffect(() => {
        if (!monthYearList) {
            return;
        }

        const from = dayjs(monthYearList[monthYearIdx]);
        const until = from.add(1, "M");

        listTransactions({
            accountId: +accountId,
            from: from.toDate(),
            until: until.toDate(),
        }).then((response) => {
            const hideAbleTransactions: HideAbleTransaction[] = response.items.map(mapPaidOnly);
            setTransactions(hideAbleTransactions);
            setIsLoading(false);
        });
    }, [accountId, mapPaidOnly, monthYearIdx, monthYearList]);

    useEffect(() => {
        startTransition(() => {
            setTransactions((prevState) => prevState && prevState.map(mapPaidOnly));
        });
    }, [mapPaidOnly, isPaidOnly]);

    const removeTransactionHandler = async (id: number) => {
        const response = await deleteTransaction({
            id,
        });

        if (!response.isSuccess) {
            addNotification("Delete transaction failed", "danger");
            return;
        }

        addNotification("Delete transaction succes", "success");

        const updatedAccounts = accounts.map((ac) => {
            if (ac.id === Number.parseInt(accountId)) {
                const tx = transactions.find((t) => t.id === id);

                return {
                    ...ac,
                    balance: tx.type === "INCOME" ? ac.balance - tx.amount : ac.balance + tx.amount,
                };
            }

            return ac;
        });
        setTransactions(transactions.filter((x) => x.id !== id));
        setAccounts(updatedAccounts);
    };
    const updateTransactionHandler = async (
        id: number,
        amount: number,
        categoryId: number,
        description: string,
        occurredAt: Date
    ) => {
        const result = await updateTransaction({
            id,
            amount,
            categoryId,
            description,
            occurredAt,
        });

        if (!result.updatedTransaction) {
            addNotification("Update transaction failed", "danger");
            return;
        }

        const updatedTransactions = transactions.map((tx) => {
            if (tx.id === id) {
                return {
                    ...tx,
                    ...result.updatedTransaction,
                };
            }

            return tx;
        });

        setTransactions(updatedTransactions);
        addNotification("Update transaction success", "success");
    };
    const getAmount = (tx: HideAbleTransaction) => {
        switch (tx.type) {
            case "EXPENSE":
                return -tx.amount;
            case "TRANSFER":
                return tx.toAccount.id === +accountId ? tx.amount : -tx.amount;
            case "INCOME":
            default:
                return tx.amount;
        }
    };

    const paidOnlyOnChangeHandler = () => {
        setIsPaidOnly((prevState) => !prevState);
    };
    const getTransactionCards = () => {
        const dateSet: Set<string> = new Set();
        const toReturn: JSX.Element[] = [];
        transactions
            .filter((x) => !x.isHide)
            .forEach((x) => dateSet.add(dayjs(x.date).format("YYYY-MM-DD")));

        dateSet.forEach((x, idx) =>
            toReturn.push(
                <TransactionCard
                    key={idx}
                    date={new Date(x)}
                    items={transactions
                        .filter((x) => !x.isHide)
                        .filter((y) => x === dayjs(y.date).format("YYYY-MM-DD"))
                        .map((y) => {
                            return {
                                amount: getAmount(y),
                                type: y.type,
                                description: y.description,
                                category: y.category,
                                date: y.date,
                                onDelete: () => removeTransactionHandler(y.id),
                                onUpdate: (amount, categoryId, description, occurredAt) =>
                                    updateTransactionHandler(
                                        y.id,
                                        amount,
                                        categoryId,
                                        description,
                                        occurredAt
                                    ),
                            };
                        })}
                />
            )
        );

        return toReturn;
    };
    const renderTransactionCards = () => {
        const cards = getTransactionCards();

        if (cards.length > 0) {
            return cards.map((c, idx) => {
                return (
                    <Box key={idx} mt={idx > 0 ? "3" : "0"}>
                        {c}
                    </Box>
                );
            });
        }

        return (
            <NoData>
                <Text color="red" size="7">
                    No data
                </Text>
            </NoData>
        );
    };
    const renderSummaryCard = () => {
        const totalAmount = transactions
            .filter((x) => !x.isHide)
            .map(getAmount)
            .reduce((prev, cur) => prev + cur, 0);

        return (
            <Card my="3" size="2">
                <Flex justify="between">
                    <Box>
                        <Text weight="bold" mr="3">
                            Total
                        </Text>
                        <Switch
                            name="isPaidOnly"
                            isRounded={true}
                            label="Paid only"
                            isOn={isPaidOnly}
                            onChange={paidOnlyOnChangeHandler}
                            size="small"
                        />
                    </Box>
                    <AmountTxt amount={totalAmount} />
                </Flex>
            </Card>
        );
    };

    const renderMonthYear = () => {
        return (
            <MonthYearSwiper
                monthYearList={monthYearList}
                onSlideChange={(swiper) => setMonthYearIdx(swiper.realIndex)}
            />
        );
    };

    const renderScrollToTop = () => {
        return (
            <Box my="3">
                <Button
                    value="To Top"
                    onClickHandler={() => {
                        document.body.scrollTop = 0; // For Safari
                        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
                    }}
                    type="primary"
                />
            </Box>
        );
    };

    return isLoading ? (
        <Loading />
    ) : (
        <Root className="mb-5">
            {renderMonthYear()}
            {renderSummaryCard()}
            {renderTransactionCards()}
            {renderScrollToTop()}
        </Root>
    );
};

export default TransactionList;
