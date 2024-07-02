import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from "recharts";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { currencyState } from "../../common/shareState";
import { formatNumber, groupBy } from "../../common/utils";
import Transaction from "../../service/model/Transaction";
import BalanceWithCurrency from "../bases/BalanceWithCurrency";
import { EXPENSE_COLOR, INCOME_COLOR, expenseFilter, incomeFilter } from "./reportHelper";
import { Text, Flex } from "@radix-ui/themes";

interface PieChartReportProps {
    transactions: Transaction[];
    isExpense: boolean;
}

interface PieChartData {
    name: string;
    value: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#c786ff", "#ff7285"];
const TotalAmountFlex = styled(Flex)<{ $isExpense: boolean }>`
    color: ${(props) => (props.$isExpense ? EXPENSE_COLOR : INCOME_COLOR)};
`;

const PieChartReport: React.FC<PieChartReportProps> = (props) => {
    const currency = useRecoilValue(currencyState);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [pieChartData, setPieChartData] = useState<PieChartData[]>([]);

    const getPieChartData = (transactions: Transaction[], isExpense: boolean): PieChartData[] => {
        const toReturn: PieChartData[] = [];
        const dirtyData = groupBy(
            transactions
                .filter((t) => (isExpense ? expenseFilter(t) : incomeFilter(t)))
                .map((t) => {
                    return {
                        name: t.category?.name ?? "Unknown",
                        value: t.amount,
                    };
                }),
            (t) => t.name
        );

        for (const key in dirtyData) {
            const aggregatedData = dirtyData[key].reduce((acc, current) => {
                return {
                    name: key,
                    value: acc.value + current.value,
                };
            });

            toReturn.push(aggregatedData);
        }

        return toReturn.length !== 0
            ? toReturn
            : [
                  {
                      name: "No data",
                      value: 1,
                  },
              ];
    };
    const renderActiveShape = (props: any) => {
        const RADIAN = Math.PI / 180;
        const {
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            startAngle,
            endAngle,
            fill,
            payload,
            percent,
            value,
        } = props;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 15) * cos;
        const my = cy + (outerRadius + 15) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 10;
        const ey = my;
        const textAnchor = cos >= 0 ? "start" : "end";

        return (
            <g>
                <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} fontSize="10px">
                    {payload.name}
                </text>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />

                {payload.name !== "No data" ? (
                    <>
                        <Sector
                            cx={cx}
                            cy={cy}
                            startAngle={startAngle}
                            endAngle={endAngle}
                            innerRadius={outerRadius + 6}
                            outerRadius={outerRadius + 10}
                            fill={fill}
                        />
                        <path
                            d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
                            stroke={fill}
                            fill="none"
                        />
                        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                        <text
                            x={ex + (cos >= 0 ? 1 : -1) * 12}
                            y={ey}
                            textAnchor={textAnchor}
                            fill="#333"
                            fontSize="10px">{`${currency} ${formatNumber(value, 1)}`}</text>
                        <text
                            x={ex + (cos >= 0 ? 1 : -1) * 12}
                            y={ey}
                            dy={18}
                            textAnchor={textAnchor}
                            fill="#999"
                            fontSize="8px">
                            {`(${(percent * 100).toFixed(1)}%)`}
                        </text>
                    </>
                ) : null}
            </g>
        );
    };
    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };

    useEffect(() => {
        setPieChartData(getPieChartData(props.transactions, props.isExpense));
    }, [props.isExpense, props.transactions]);

    return (
        <>
            <TotalAmountFlex
                direction="column"
                justify="center"
                align="center"
                $isExpense={props.isExpense}>
                <Text weight="bold">{props.isExpense ? "Expense" : "Income"}</Text>
                <Text weight="bold">
                    <BalanceWithCurrency
                        balance={
                            pieChartData.filter((p) => p.name !== "No data").length !== 0
                                ? pieChartData
                                      .map((p) => p.value)
                                      .reduce((acc, current) => acc + current)
                                : 0
                        }
                    />
                </Text>
            </TotalAmountFlex>
            <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                    <Pie
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        dataKey="value"
                        onMouseEnter={onPieEnter}>
                        {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </>
    );
};

export default PieChartReport;
