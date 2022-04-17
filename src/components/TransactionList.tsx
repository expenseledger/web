import dayjs from "dayjs";
import * as R from "ramda";
import React, { startTransition, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { accountsState } from "../common/shareState";
import Loading from "../components/bases/Loading";
import { useNotification } from "../service/helper/notificationHelper";
import { Transaction } from "../service/model/Transaction";
import {
    deleteTransaction,
    getTransactionMonthYearList,
    listTransactions,
} from "../service/transactionService";
import AmountTxt from "./bases/AmountTxt";
import { TransactionCard } from "./TransactionCard";
import "./TransactionList.scss";

const NoData = styled.div`
    font-weight: bold;
    text-align: center;
    margin-top: 30px;
`;
const MonthYear = styled.h4`
    text-align: center;
`;
const SwitchContainer = styled.div`
    display: inline-block;
`;
const TotalText = styled.div`
    display: inline-block;
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
    const [accounts, setAccounts] = useRecoilState(accountsState);
    const params = useParams();
    const { accountId } = params;
    const [isPaidOnly, setIsPaidOnly] = useState<boolean>(false);
    const mapPaidOnly = useCallback(
        (tx: HideAbleTransaction) => {
            if (!isPaidOnly || tx.type == "EXPENSE" || tx.type == "TRANSFER") {
                tx.isHide = false;
                return tx;
            }

            tx.isHide = true;
            return tx;
        },
        [isPaidOnly]
    );

    useEffect(() => {
        getTransactionMonthYearList({ accountId: +accountId }).then((response) => {
            setMonthYearList(response.monthYears);
        });
    }, [accountId]);

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
            const hideAbleTransactions: HideAbleTransaction[] = response.items.map((x) => {
                return {
                    ...x,
                    isHide: false,
                };
            });
            setTransactions(hideAbleTransactions);
            setIsLoading(false);
        });
    }, [accountId, monthYearIdx, monthYearList]);

    useEffect(() => {
        startTransition(() => {
            setTransactions((prevState) => prevState && prevState.map(mapPaidOnly));
        });
    }, [mapPaidOnly, isPaidOnly]);

    const removeTransaction = async (id: number) => {
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
                const tAc = R.clone(ac);
                const tx = transactions.find((t) => t.id === id);

                tAc.balance =
                    tx.type === "INCOME" ? tAc.balance - tx.amount : tAc.balance + tx.amount;

                return tAc;
            }

            return ac;
        });
        setTransactions(transactions.filter((x) => x.id !== id));
        setAccounts(updatedAccounts);
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
        transactions.filter((x) => !x.isHide).forEach((x) => dateSet.add(x.date.toString()));

        dateSet.forEach((x, idx) =>
            toReturn.push(
                <TransactionCard
                    key={idx}
                    date={new Date(x)}
                    items={transactions
                        .filter((x) => !x.isHide)
                        .filter((y) => x === y.date.toString())
                        .map((y) => {
                            return {
                                amount: getAmount(y),
                                type: y.type,
                                description: y.description,
                                category: y.category?.name ?? "-",
                                onDelete: () => removeTransaction(y.id),
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
            return <>{cards}</>;
        }

        return <NoData className="notification is-danger">No data</NoData>;
    };
    const renderSummaryCard = () => {
        const totalAmount = transactions
            .filter((x) => !x.isHide)
            .map(getAmount)
            .reduce((prev, cur) => prev + cur, 0);

        return (
            <div className="box mt-3">
                <div className="is-flex is-flex-direction-row is-justify-content-space-between">
                    <div>
                        <TotalText className="has-text-weight-bold">Total</TotalText>
                        <SwitchContainer className="field ml-3">
                            <input
                                id="switchRoundedOutlinedDefault"
                                type="checkbox"
                                name="switchRoundedOutlinedDefault"
                                className="switch is-rounded is-outlined is-small"
                                checked={isPaidOnly}
                                onChange={paidOnlyOnChangeHandler}
                            />
                            <label htmlFor="switchRoundedOutlinedDefault">Paid only</label>
                        </SwitchContainer>
                    </div>
                    <AmountTxt amount={totalAmount} />
                </div>
            </div>
        );
    };

    const renderMonthYear = () => {
        return (
            <Swiper
                dir="rtl"
                spaceBetween={10}
                slidesPerView={"auto"}
                centeredSlides={true}
                navigation={true}
                onSlideChange={(swipe) => setMonthYearIdx(swipe.realIndex)}>
                {monthYearList.map((x) => (
                    <SwiperSlide key={x}>
                        <MonthYear key={x} className="title is-4 px-5 py-5">
                            {dayjs(x).format("MMMM YYYY")}
                        </MonthYear>
                    </SwiperSlide>
                ))}
            </Swiper>
        );
    };

    return isLoading ? (
        <Loading />
    ) : (
        <div className="mb-5">
            {renderMonthYear()}
            {renderSummaryCard()}
            {renderTransactionCards()}
        </div>
    );
};

export default TransactionList;
