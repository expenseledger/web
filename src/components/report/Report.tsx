import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import Transaction from "../../service/model/Transaction";
import { getTransactionMonthYearList, listTransactions } from "../../service/transactionService";
import Loading from "../bases/Loading";
import MonthYearSwiper from "../bases/MonthYearSwiper";
import BarChartReport from "./BarChartReport";
import PieChartReport from "./PieChartReport";

const Report: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [monthYearIdx, setMonthYearIdx] = useState<number>(0);
    const [monthYearList, setMonthYearList] = useState<string[]>([]);
    const location = useLocation();
    const initialAccountId: number | null = location.state?.accountId;

    useEffect(() => {
        if (!initialAccountId || monthYearList.length != 0) {
            return;
        }

        getTransactionMonthYearList({ accountId: initialAccountId }).then((response) => {
            setMonthYearList(response.monthYears);
        });
    }, [initialAccountId, monthYearList.length]);

    useEffect(() => {
        if (monthYearList.length == 0) {
            return;
        }

        const from = dayjs(monthYearList[monthYearIdx]);
        const until = from.add(1, "M");

        listTransactions({
            accountId: initialAccountId,
            from: from.toDate(),
            until: until.toDate(),
        }).then((response) => {
            setTransactions(response.items.reverse());
            setIsLoading(false);
        });
    }, [initialAccountId, monthYearIdx, monthYearList]);

    return isLoading ? (
        <Loading />
    ) : (
        <>
            <MonthYearSwiper
                monthYearList={monthYearList}
                onSlideChange={(swiper) => setMonthYearIdx(swiper.realIndex)}
            />
            <div className="box mb-5">
                <BarChartReport transactions={transactions} accountIds={[initialAccountId]} />
            </div>
            <div className="columns is-half-desktop is-half-tablet my-5 mx-0 px-0 box">
                <div className="column px-0">
                    <PieChartReport
                        transactions={transactions}
                        accountIds={[initialAccountId]}
                        isExpense={false}
                    />
                </div>
                <div className="column px-0">
                    <PieChartReport
                        transactions={transactions}
                        accountIds={[initialAccountId]}
                        isExpense={true}
                    />
                </div>
            </div>
        </>
    );
};

export default Report;
