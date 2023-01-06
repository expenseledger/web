import * as R from "ramda";
import { useState } from "react";
import { Pie, PieChart, ResponsiveContainer, Sector } from "recharts";
import Transaction from "../../service/model/Transaction";
import { getAmount } from "./reportHelper";

interface PieChartReportProps {
    transactions: Transaction[];
    accountIds: number[];
    isExpense: boolean;
}

interface PieChartData {
    name: string;
    value: number;
}

const PieChartReport: React.FC<PieChartReportProps> = (props) => {
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const getPieChartData = (
        transactions: Transaction[],
        accountIds: number[],
        isExpense: boolean
    ): PieChartData[] => {
        const toReturn: PieChartData[] = [];
        const byName = R.groupBy((data: PieChartData) => data.name);
        const expenseFilter = (t: Transaction) => getAmount(t, accountIds) < 0;
        const incomeFilter = (t: Transaction) => getAmount(t, accountIds) >= 0;
        const dirtyData = byName(
            transactions
                .filter((t) => (isExpense ? expenseFilter(t) : incomeFilter(t)))
                .map((t) => {
                    return {
                        name: t.category?.name ?? "Unknown",
                        value: t.amount,
                    };
                })
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

        return toReturn;
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
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? "start" : "end";

        return (
            <g>
                <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
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
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill={fill}
                />
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                <text
                    x={ex + (cos >= 0 ? 1 : -1) * 12}
                    y={ey}
                    textAnchor={textAnchor}
                    fill="#333">{`${value}`}</text>
                <text
                    x={ex + (cos >= 0 ? 1 : -1) * 12}
                    y={ey}
                    dy={18}
                    textAnchor={textAnchor}
                    fill="#999">
                    {`(${(percent * 100).toFixed(2)}%)`}
                </text>
            </g>
        );
    };
    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };

    return (
        <div style={{ width: "100%", height: 500 }}>
            <ResponsiveContainer>
                <PieChart width={400} height={400}>
                    <Pie
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        data={getPieChartData(
                            props.transactions,
                            props.accountIds,
                            props.isExpense
                        )}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        onMouseEnter={onPieEnter}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PieChartReport;
