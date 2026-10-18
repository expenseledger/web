import React, { ReactNode, useCallback, useEffect, useRef, useState } from "react";
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
    listTransactionsPage,
    updateTransaction,
} from "../../service/transactionService";
import AmountTxt from "../bases/AmountTxt";
import Button from "../bases/Button";
import { TransactionCard } from "./TransactionCard";
import { Box, Card, Flex, Text } from "@radix-ui/themes";
import Switch from "../bases/Switch";
import { useBackToHome } from "../Layout";
import { useAtom } from "jotai";
import AnimatedPage from "../AnimatedPage";
import { describeError } from "../../service/helper/errorHelper";

const PAGE_SIZE = 50;

const NoData = styled.div`
    font-weight: bold;
    text-align: center;
    margin-top: 30px;
`;

const Root = styled.div`
    text-align: center;
`;

/** Merges pages by id (a later copy wins) and keeps newest-first order. */
function mergeTransactions(current: Transaction[], incoming: Transaction[]): Transaction[] {
    const byId = new Map(current.map((tx) => [tx.id, tx]));
    incoming.forEach((tx) => byId.set(tx.id, tx));

    return [...byId.values()].sort(compareTransactionsDesc);
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
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [endCursor, setEndCursor] = useState<string>(null);
    const [hasNextPage, setHasNextPage] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const { addNotification } = useNotification();
    const [accounts, setAccounts] = useAtom(accountsState);
    const { accountId } = useParams();
    const [isPaidOnly, setIsPaidOnly] = useState<boolean>(false);
    const navigate = useNavigate();
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const { setBackToHomeParam } = useBackToHome();
    const currency = accounts.find((a) => a.id === accountId)?.currency ?? "THB";

    const isShown = useCallback(
        (tx: Transaction) =>
            !isPaidOnly ||
            tx.type == "EXPENSE" ||
            (tx.type == "TRANSFER" && tx.fromAccount?.id === accountId),
        [accountId, isPaidOnly]
    );

    useEffect(() => {
        let ignore = false;

        setBackToHomeParam({ accountId });
        setIsLoading(true);
        listTransactionsPage({ accountId, first: PAGE_SIZE }).then((response) => {
            if (ignore) {
                return;
            }

            if (!response) {
                navigate("/");
                return;
            }

            setTransactions(mergeTransactions([], response.items));
            setEndCursor(response.endCursor);
            setHasNextPage(response.hasNextPage);
            setIsLoading(false);
        });

        return () => {
            ignore = true;
        };
    }, [accountId, navigate, setBackToHomeParam]);

    const loadMore = useCallback(async () => {
        if (!hasNextPage || isFetchingMore) {
            return;
        }

        setIsFetchingMore(true);
        const response = await listTransactionsPage({
            accountId,
            first: PAGE_SIZE,
            after: endCursor,
        });
        setIsFetchingMore(false);

        if (!response) {
            addNotification("Load transactions failed", "danger");
            return;
        }

        setTransactions((prevState) => mergeTransactions(prevState, response.items));
        setEndCursor(response.endCursor);
        setHasNextPage(response.hasNextPage);
    }, [accountId, addNotification, endCursor, hasNextPage, isFetchingMore]);

    useEffect(() => {
        const target = loadMoreRef.current;

        if (!target || typeof IntersectionObserver === "undefined") {
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
                loadMore();
            }
        });
        observer.observe(target);

        return () => observer.disconnect();
    }, [loadMore]);

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
        setTransactions(mergeTransactions(transactions, [updated]));
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
    const renderTransactionCards = (monthTransactions: Transaction[]) => {
        const toReturn: ReactNode[] = [];

        groupBy(monthTransactions, "YYYY-MM-DD").forEach((dayTransactions, day) =>
            toReturn.push(
                <Box key={day} mt="3">
                    <TransactionCard
                        date={new Date(day)}
                        currency={currency}
                        items={dayTransactions.map((y) => {
                            return {
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
            )
        );

        return toReturn;
    };
    const renderMonths = () => {
        const months = groupBy(transactions.filter(isShown), "YYYY-MM");

        if (months.size === 0 && !hasNextPage) {
            return (
                <NoData>
                    <Text color="red" size="7">
                        No data
                    </Text>
                </NoData>
            );
        }

        const lastMonth = [...months.keys()].pop();

        return [...months.entries()].map(([month, monthTransactions]) => {
            // The last loaded month may continue on the next page.
            const isComplete = month !== lastMonth || !hasNextPage;

            return (
                <Box key={month} mt="5">
                    <Card size="2">
                        <Flex justify="between" align="center">
                            <Text weight="bold" size="6">
                                {dayjs(month).format("MMMM YYYY")}
                            </Text>
                            {isComplete && (
                                <AmountTxt
                                    currency={currency}
                                    amount={monthTransactions
                                        .map(getAmount)
                                        .reduce((prev, cur) => prev + cur, 0)}
                                />
                            )}
                        </Flex>
                    </Card>
                    {renderTransactionCards(monthTransactions)}
                </Box>
            );
        });
    };
    const renderPaidOnlyCard = () => {
        return (
            <Card my="3" size="2">
                <Flex justify="end">
                    <Switch
                        name="isPaidOnly"
                        isRounded={true}
                        label="Paid only"
                        isOn={isPaidOnly}
                        onChange={paidOnlyOnChangeHandler}
                        size="small"
                    />
                </Flex>
            </Card>
        );
    };

    const renderLoadMore = () => {
        if (!hasNextPage) {
            return null;
        }

        return (
            <Box my="3" ref={loadMoreRef}>
                <Button
                    value="Load more"
                    onClickHandler={loadMore}
                    isLoading={isFetchingMore}
                    type="default"
                />
            </Box>
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
                {renderPaidOnlyCard()}
                {renderMonths()}
                {renderLoadMore()}
                {renderScrollToTop()}
            </Root>
        </AnimatedPage>
    );
};

export default TransactionList;
