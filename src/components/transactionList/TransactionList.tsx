import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { accountsState } from "../../common/shareState";
import Loading from "../../components/bases/Loading";
import dayjs from "../../lib/dayjs";
import { getAllAccount } from "../../service/accountService";
import { replaceAccounts } from "../../service/helper/accountHelper";
import {
    amountFor,
    buildTransactionPatch,
    compareTransactionsDesc,
    EditedTransaction,
} from "../../service/helper/transactoinHelper";
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
import AnimatedPage from "../AnimatedPage";
import { describeError } from "../../service/helper/errorHelper";

const NoData = styled.div`
    font-weight: bold;
    text-align: center;
    margin-top: 30px;
`;

const Root = styled.div`
    text-align: center;
`;

/** Replaces `updated` in place, dropping it if it was re-dated out of `monthYear`. */
function replaceTransaction(
    transactions: Transaction[],
    updated: Transaction,
    monthYear: string
): Transaction[] {
    const others = transactions.filter((tx) => tx.id !== updated.id);

    if (dayjs(updated.date).format("YYYY-MM") !== monthYear) {
        return others;
    }

    return [...others, updated].sort(compareTransactionsDesc);
}

/** Groups newest-first transactions by key, keeping group order. */
function groupBy(transactions: Transaction[], format: string): Map<string, Transaction[]> {
    const groups = new Map<string, Transaction[]>();
    transactions.forEach((tx) => {
        const key = dayjs(tx.date).format(format);
        groups.set(key, [...(groups.get(key) ?? []), tx]);
    });

    return groups;
}

export const TransactionList: React.FC = () => {
    const [monthYearIdx, setMonthYearIdx] = useState<number>(0);
    const [monthYearList, setMonthYearList] = useState<string[]>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { addNotification } = useNotification();
    const [accounts, setAccounts] = useAtom(accountsState);
    const { accountId } = useParams();
    const [isPaidOnly, setIsPaidOnly] = useState<boolean>(false);
    const navigate = useNavigate();
    const { setBackToHomeParam } = useBackToHome();
    const currency = accounts.find((a) => a.id === accountId)?.currency ?? "THB";

    const isShown = useCallback(
        (tx: Transaction) =>
            !isPaidOnly ||
            tx.type == "EXPENSE" ||
            (tx.type == "TRANSFER" && tx.fromAccount?.id === accountId),
        [accountId, isPaidOnly]
    );
    const backToHome = useCallback(() => {
        navigate("/");
    }, [navigate]);

    useEffect(() => {
        setBackToHomeParam({ accountId });
        getTransactionMonthYearList({ accountId })
            .then((response) => {
                setMonthYearList(response.monthYears);
            })
            .catch(backToHome);
    }, [accountId, backToHome, setBackToHomeParam]);

    useEffect(() => {
        if (!monthYearList) {
            return;
        }

        let ignore = false;
        const from = dayjs(monthYearList[monthYearIdx]);

        listTransactions({
            accountId,
            fromDate: from.toDate(),
            toDate: from.endOf("month").toDate(),
        }).then((response) => {
            if (ignore) {
                return;
            }

            setTransactions(response.items);
            setIsLoading(false);
        });

        return () => {
            ignore = true;
        };
    }, [accountId, monthYearIdx, monthYearList]);

    const removeTransactionHandler = async (id: string) => {
        const response = await deleteTransaction({
            id,
        });

        if (!response.isSuccess) {
            addNotification(
                describeError(response.errorCode, "Delete transaction failed"),
                "danger"
            );
            return;
        }

        addNotification("Delete transaction succes", "success");
        setTransactions(transactions.filter((x) => x.id !== id));

        // deleteTransaction returns only the id, so reload the balances.
        const { accounts: refreshed } = await getAllAccount();
        if (refreshed.length !== 0) {
            setAccounts(refreshed);
        }
    };
    const updateTransactionHandler = async (tx: Transaction, edited: EditedTransaction) => {
        const patch = buildTransactionPatch(tx, accountId, edited);
        const result = await updateTransaction(patch);

        if (!result.updatedTransaction) {
            addNotification(describeError(result.errorCode, "Update transaction failed"), "danger");
            return;
        }

        const updated = result.updatedTransaction;
        setTransactions(replaceTransaction(transactions, updated, monthYearList[monthYearIdx]));
        setAccounts(replaceAccounts(accounts, [updated.fromAccount, updated.toAccount]));
        addNotification("Update transaction success", "success");
    };
    const getAmount = (tx: Transaction) => {
        switch (tx.type) {
            case "EXPENSE":
                return -tx.amount;
            case "TRANSFER":
                return tx.toAccount.id === accountId ? amountFor(tx, accountId) : -tx.amount;
            case "INCOME":
            default:
                return tx.amount;
        }
    };

    const paidOnlyOnChangeHandler = () => {
        setIsPaidOnly((prevState) => !prevState);
    };
    const renderTransactionCards = () => {
        const days = groupBy(transactions.filter(isShown), "YYYY-MM-DD");

        if (days.size === 0) {
            return (
                <NoData>
                    <Text color="red" size="7">
                        No data
                    </Text>
                </NoData>
            );
        }

        return [...days.entries()].map(([day, dayTransactions], idx) => (
            <Box key={day} mt={idx > 0 ? "3" : "0"}>
                <TransactionCard
                    date={new Date(day)}
                    currency={currency}
                    items={dayTransactions.map((y) => {
                        return {
                            id: y.id,
                            amount: getAmount(y),
                            type: y.type,
                            description: y.description,
                            category: y.category,
                            date: y.date,
                            onDelete: () => removeTransactionHandler(y.id),
                            onUpdate: (amount, categoryId, description, occurredAt) =>
                                updateTransactionHandler(y, {
                                    amount,
                                    categoryId,
                                    description,
                                    occurredAt,
                                }),
                        };
                    })}
                />
            </Box>
        ));
    };
    const renderSummaryCard = () => {
        const totalAmount = transactions
            .filter(isShown)
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
                    <AmountTxt currency={currency} amount={totalAmount} />
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
        <AnimatedPage>
            <Root className="mb-5">
                {renderMonthYear()}
                {renderSummaryCard()}
                {renderTransactionCards()}
                {renderScrollToTop()}
            </Root>
        </AnimatedPage>
    );
};

export default TransactionList;
