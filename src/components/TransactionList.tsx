import dayjs from "dayjs";
import * as R from "ramda";
import React, { useEffect, useState } from "react";
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

export const TransactionList: React.FC = () => {
    const [monthYearIdx, setMonthYearIdx] = useState<number>(0);
    const [monthYearList, setMonthYearList] = useState<string[]>(null);
    const [transactions, setTransactions] = useState<Transaction[]>(null);
    const { addNotification } = useNotification();
    const [isLoading, setIsLoading] = useState(true);
    const [accounts, setAccounts] = useRecoilState(accountsState);
    const params = useParams();
    const { accountId } = params;

    useEffect(() => {
        if (!monthYearList) {
            getTransactionMonthYearList({ accountId: +accountId }).then((response) => {
                setMonthYearList(response.monthYears);
            });
        } else {
            const from = dayjs(monthYearList[monthYearIdx]);
            const until = from.add(1, "M");

            listTransactions({
                accountId: +accountId,
                from: from.toDate(),
                until: until.toDate(),
            }).then((response) => {
                setTransactions(response.items);
                setIsLoading(false);
            });
        }
    }, [accountId, monthYearIdx, monthYearList]);

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
    const getAmount = (tx: Transaction) => {
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
    const getTransactionCards = () => {
        const dateSet: Set<string> = new Set();
        const toReturn: JSX.Element[] = [];
        transactions.forEach((x) => dateSet.add(x.date.toString()));

        dateSet.forEach((x, idx) =>
            toReturn.push(
                <TransactionCard
                    key={idx}
                    date={new Date(x)}
                    items={transactions
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
        const totalAmount = transactions.map(getAmount).reduce((prev, cur) => prev + cur, 0);

        return (
            <div className="box">
                <div className="is-flex is-flex-direction-row is-justify-content-space-between">
                    <div className="has-text-weight-bold">Total</div>
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
