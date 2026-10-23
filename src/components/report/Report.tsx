import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { accountsState } from "../../common/shareState";
import dayjs from "../../lib/dayjs";
import Transaction from "../../service/model/Transaction";
import { getTransactionMonthYearList, listTransactions } from "../../service/transactionService";
import Loading from "../bases/Loading";
import MonthYearSwiper from "../bases/MonthYearSwiper";
import AccountSelection, { SelectableAccount } from "./AccountSelection";
import BarChartReport from "./BarChartReport";
import PieChartReport from "./PieChartReport";
import TableReport from "./TableReport";
import { Box, Card, Grid } from "@radix-ui/themes";
import { useAtomValue } from "jotai";
import AnimatedPage from "../AnimatedPage";

const Report: React.FC = () => {
    const accounts = useAtomValue(accountsState);
    const location = useLocation();
    const initalSelectedAccounts: SelectableAccount[] = location?.state?.accountId
        ? accounts.map((a) => {
              return {
                  ...a,
                  isSelected: a.id === location.state.accountId,
              };
          })
        : [];
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [monthYearIdx, setMonthYearIdx] = useState<number>(0);
    const [monthYearList, setMonthYearList] = useState<string[]>([]);
    const [selectableAccounts, setSelectableAccounts] =
        useState<SelectableAccount[]>(initalSelectedAccounts);
    const navigate = useNavigate();
    const currency = selectableAccounts.find((a) => a.isSelected)?.currency ?? "THB";

    const backToHome = useCallback(() => {
        navigate("/");
    }, [navigate]);

    const selectableAccountsChangeHandler = (newAccount: SelectableAccount[]) => {
        setSelectableAccounts(newAccount);
    };

    useEffect(() => {
        const selectedAccounts = selectableAccounts.filter((a) => a.isSelected);

        if (selectedAccounts.length === 0) {
            setMonthYearList([]);
            setTransactions([]);
            setIsLoading(false);
            return;
        }

        let ignore = false;

        Promise.all(selectedAccounts.map((a) => getTransactionMonthYearList({ accountId: a.id })))
            .then((responses) => {
                if (ignore) {
                    return;
                }

                const monthYears = responses.map((response) => response.monthYears).flat();
                setMonthYearList([...new Set(monthYears)].sort((a, b) => b.localeCompare(a)));

                if (monthYears.length === 0) {
                    setTransactions([]);
                    setIsLoading(false);
                }
            })
            .catch(backToHome);

        return () => {
            ignore = true;
        };
    }, [backToHome, selectableAccounts]);

    useEffect(() => {
        if (monthYearList.length == 0) {
            return;
        }

        const selectedAccounts = selectableAccounts.filter((a) => a.isSelected);
        const month = dayjs(monthYearList[monthYearIdx]);
        let ignore = false;

        Promise.all(
            selectedAccounts.map((a) =>
                listTransactions({
                    accountId: a.id,
                    fromDate: month.toDate(),
                    toDate: month.endOf("month").toDate(),
                })
            )
        )
            .then((responses) => {
                if (ignore) {
                    return;
                }

                const transactions = responses
                    .map((response) => response.items)
                    .flat()
                    .filter((t) => t.type !== "TRANSFER")
                    .sort((a, b) => a.date.getTime() - b.date.getTime());

                setTransactions(transactions);
                setIsLoading(false);
            })
            .catch(backToHome);

        return () => {
            ignore = true;
        };
    }, [backToHome, monthYearIdx, monthYearList, selectableAccounts]);

    return isLoading ? (
        <Loading />
    ) : (
        <AnimatedPage>
            <MonthYearSwiper
                monthYearList={monthYearList}
                onSlideChange={(swiper) => setMonthYearIdx(swiper.realIndex)}
            />
            <Card mt="3" mb="5">
                <AccountSelection
                    accounts={selectableAccounts}
                    onChangeHanlder={selectableAccountsChangeHandler}
                />
            </Card>
            <Card mt="3" mb="5">
                <BarChartReport transactions={transactions} currency={currency} />
            </Card>
            <Card mt="3" mb="5">
                <Grid
                    columns={{
                        initial: "1",
                        sm: "2",
                    }}
                    mt="3"
                    mb="5">
                    <Box>
                        <PieChartReport
                            transactions={transactions}
                            isExpense={false}
                            currency={currency}
                        />
                    </Box>
                    <Box>
                        <PieChartReport
                            transactions={transactions}
                            isExpense={true}
                            currency={currency}
                        />
                    </Box>
                </Grid>
            </Card>
            <Box mt="3" mb="5">
                <TableReport transations={transactions} isExpense={false} currency={currency} />
            </Box>
            <Box mt="3" mb="5">
                <TableReport transations={transactions} isExpense={true} currency={currency} />
            </Box>
        </AnimatedPage>
    );
};

export default Report;
