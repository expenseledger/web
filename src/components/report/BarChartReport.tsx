import dayjs from "dayjs";
import * as R from "ramda";
import { useEffect, useState } from "react";
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
import Transaction from "../../service/model/Transaction";
import BalanceWithCurrency from "../bases/BalanceWithCurrency";
import { EXPENSE_COLOR, getAmount, INCOME_COLOR } from "./reportHelper";

export interface BarChartReportProps {
    transactions: Transaction[];
    accountIds: number[];
}

interface BarChartData {
    name: string;
    income: number;
    expense: number;
}

const TotalAmountDiv = styled.div`
    text-align: center;
    font-weight: 700;
`;

const BarChartReport: React.FC<BarChartReportProps> = (props) => {
    const [data, setData] = useState<BarChartData[]>(null);
    const transfromTransactions = (
        transactions: Transaction[],
        accountIds: number[]
    ): BarChartData[] => {
        const toReturn: BarChartData[] = [];
        const byName = R.groupBy((data: BarChartData) => data.name);
        const dirtyData = byName(
            transactions.reverse().map((t) => {
                const amount = getAmount(t, accountIds);
                return {
                    name: dayjs(t.date).format("D MMM"),
                    income: amount >= 0 ? Math.abs(t.amount) : 0,
                    expense: amount < 0 ? Math.abs(t.amount) : 0,
                };
            })
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
    };

    useEffect(() => {
        setData(transfromTransactions(props.transactions, props.accountIds));
    }, [props.accountIds, props.transactions]);

    return !data ? null : (
        <>
            <TotalAmountDiv className="mb-5">
                <div>Total balance</div>
                <BalanceWithCurrency
                    balance={data
                        .map((d) => d.income - d.expense)
                        .reduce((acc, current) => acc + current)}
                />
            </TotalAmountDiv>
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
                    <Legend />
                    <Bar dataKey="income" fill={INCOME_COLOR} name="Income" />
                    <Bar dataKey="expense" fill={EXPENSE_COLOR} name="Expense" />
                </BarChart>
            </ResponsiveContainer>
        </>
    );
};

export default BarChartReport;
