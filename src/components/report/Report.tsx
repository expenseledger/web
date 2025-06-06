import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
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

    const backToHome = useCallback(() => {
        navigate("/");
    }, [navigate]);

    const selectableAccountsChangeHandler = (newAccount: SelectableAccount[]) => {
        if (newAccount.filter((a) => a.isSelected).length === 0) {
            setMonthYearList([]);
            setTransactions([]);
        }

        setSelectableAccounts(newAccount);
    };

    useEffect(() => {
        const selectedAccounts = selectableAccounts.filter((a) => a.isSelected);

        if (selectedAccounts.length === 0) {
            return;
        }

        Promise.all(selectedAccounts.map((a) => getTransactionMonthYearList({ accountId: a.id })))
            .then((responses) => {
                const monthYears = responses.map((response) => response.monthYears).flat();
                setMonthYearList([...new Set(monthYears)].sort((a, b) => b.localeCompare(a)));
            })
            .catch(backToHome);
    }, [backToHome, selectableAccounts]);

    useEffect(() => {
        if (monthYearList.length == 0) {
            return;
        }

        const selectedAccounts = selectableAccounts.filter((a) => a.isSelected);
        const from = dayjs(monthYearList[monthYearIdx]);
        const until = from.add(1, "M");

        Promise.all(
            selectedAccounts.map((a) =>
                listTransactions({
                    accountId: a.id,
                    from: from.toDate(),
                    until: until.toDate(),
                })
            )
        )
            .then((responses) => {
                const transactions = responses
                    .map((response) => response.items)
                    .flat()
                    .filter((t) => t.type !== "TRANSFER")
                    .sort((a, b) => a.date.getTime() - b.date.getTime());

                setTransactions(transactions);
                setIsLoading(false);
            })
            .catch(backToHome);
    }, [backToHome, monthYearIdx, monthYearList, navigate, selectableAccounts]);

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
                <BarChartReport transactions={transactions} />
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
                        <PieChartReport transactions={transactions} isExpense={false} />
                    </Box>
                    <Box>
                        <PieChartReport transactions={transactions} isExpense={true} />
                    </Box>
                </Grid>
            </Card>
            <Box mt="3" mb="5">
                <TableReport transations={transactions} isExpense={false} />
            </Box>
            <Box mt="3" mb="5">
                <TableReport transations={transactions} isExpense={true} />
            </Box>
        </AnimatedPage>
    );
};

export default Report;
