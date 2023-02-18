import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useRecoilValue } from "recoil";
import { accountsState } from "../../common/shareState";
import Transaction from "../../service/model/Transaction";
import { getTransactionMonthYearList, listTransactions } from "../../service/transactionService";
import Loading from "../bases/Loading";
import MonthYearSwiper from "../bases/MonthYearSwiper";
import AccountSelection from "./AccountSelection";
import BarChartReport from "./BarChartReport";
import PieChartReport from "./PieChartReport";

const Report: React.FC = () => {
    const accounts = useRecoilValue(accountsState);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [monthYearIdx, setMonthYearIdx] = useState<number>(0);
    const [monthYearList, setMonthYearList] = useState<string[]>([]);
    const location = useLocation();
    const initialAccountId: number | null = location.state?.accountId;
    const navigate = useNavigate();

    const backToHome = useCallback(() => {
        navigate("/");
    }, [navigate]);

    useEffect(() => {
        if (!initialAccountId || monthYearList.length != 0) {
            return;
        }

        getTransactionMonthYearList({ accountId: initialAccountId })
            .then((response) => {
                setMonthYearList(response.monthYears);
            })
            .catch(backToHome);
    }, [backToHome, initialAccountId, monthYearList.length]);

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
        })
            .then((response) => {
                setTransactions(response.items.filter((t) => t.type !== "TRANSFER").reverse());
                setIsLoading(false);
            })
            .catch(backToHome);
    }, [backToHome, initialAccountId, monthYearIdx, monthYearList, navigate]);

    return isLoading ? (
        <Loading />
    ) : (
        <>
            <MonthYearSwiper
                monthYearList={monthYearList}
                onSlideChange={(swiper) => setMonthYearIdx(swiper.realIndex)}
            />
            <div className="mt-3 mb-5">
                <AccountSelection accounts={accounts} />
            </div>
            <div className="box mt-3 mb-5">
                <BarChartReport transactions={transactions} />
            </div>
            <div className="columns is-half-desktop is-half-tablet my-5 mx-0 px-0 box">
                <div className="column px-0">
                    <PieChartReport transactions={transactions} isExpense={false} />
                </div>
                <div className="column px-0">
                    <PieChartReport transactions={transactions} isExpense={true} />
                </div>
            </div>
        </>
    );
};

export default Report;
