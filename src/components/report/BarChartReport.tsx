import { useCallback, useEffect, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import styled from "styled-components";
import dayjs from "../../lib/dayjs";
import Transaction from "../../service/model/Transaction";
import BalanceWithCurrency from "../bases/BalanceWithCurrency";
import { EXPENSE_COLOR, INCOME_COLOR, getAmount } from "./reportHelper";
import { Flex, Text } from "@radix-ui/themes";
import { groupBy } from "../../common/utils";

export interface BarChartReportProps {
    transactions: Transaction[];
}

interface BarChartData {
    name: string;
    income: number;
    expense: number;
}

const NoDataDiv = styled.div`
    text-align: center;
    height: 250px;
    width: 100%;
`;
const NoDatatext = styled.span`
    position: relative;
    top: 100px;
`;

const BarChartReport: React.FC<BarChartReportProps> = (props) => {
    const [data, setData] = useState<BarChartData[]>(null);
    const getXAxis = (daysInMonth: number): string[] => {
        const toReturn = [];
        let counter = 1;

        while (counter <= daysInMonth) {
            const end = counter + 6;
            toReturn.push(`${counter} - ${end > daysInMonth ? daysInMonth : end}`);
            counter += 7;
        }

        return toReturn;
    };
    const transfromTransactions = useCallback((transactions: Transaction[]): BarChartData[] => {
        const toReturn: BarChartData[] = [];

        if ((transactions?.length ?? 0) === 0) {
            return toReturn;
        }

        const daysInMonth = dayjs(transactions[0].date).daysInMonth();
        const xAxis = getXAxis(daysInMonth);
        const dirtyData = groupBy(
            transactions.map((t) => {
                const amount = getAmount(t);
                const idx = Math.floor((dayjs(t.date).date() - 1) / 7);

                return {
                    name: xAxis[idx],
                    income: amount >= 0 ? Math.abs(t.amount) : 0,
                    expense: amount < 0 ? Math.abs(t.amount) : 0,
                };
            }),
            (t) => t.name
        );

        for (const key in dirtyData) {
            const aggregatedData = dirtyData[key].reduce((acc, current) => {
                return {
                    name: key,
                    income: acc.income + current.income,
                    expense: acc.expense + current.expense,
                };
            });

            toReturn.push(aggregatedData);
        }

        return toReturn;
    }, []);

    useEffect(() => {
        setData(transfromTransactions(props.transactions));
    }, [props.transactions, transfromTransactions]);

    return (data?.length ?? 0) === 0 ? (
        <NoDataDiv>
            <NoDatatext className="title">No data</NoDatatext>
        </NoDataDiv>
    ) : (
        <>
            <Flex direction="column" align="center" justify="center" mb="5">
                <Text weight="bold">Net Income</Text>
                <Text weight="bold">
                    <BalanceWithCurrency
                        balance={data
                            .map((d) => d.income - d.expense)
                            .reduce((acc, current) => acc + current)}
                    />
                </Text>
            </Flex>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend align="center" />
                    <Bar dataKey="income" fill={INCOME_COLOR} name="Income" />
                    <Bar dataKey="expense" fill={EXPENSE_COLOR} name="Expense" />
                </BarChart>
            </ResponsiveContainer>
        </>
    );
};

export default BarChartReport;
