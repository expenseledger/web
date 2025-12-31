import { styled } from "@linaria/react";
import { currencyState } from "../../common/shareState";
import { formatNumber, groupBy } from "../../common/utils";
import Transaction from "../../service/model/Transaction";
import {
    EXPENSE_COLOR,
    INCOME_COLOR,
    expenseFilter,
    getMedian,
    incomeFilter,
} from "./reportHelper";
import { Table, Text } from "@radix-ui/themes";
import { useAtomValue } from "jotai";

interface ReportTableData {
    category: string;
    amount: number;
    medianAmount: number;
    maxAmount: number;
}

interface TableReportProps {
    transations: Transaction[];
    isExpense: boolean;
}

const NoDataDiv = styled.div<{ $isExpense: boolean }>`
    text-align: center;
    color: ${(props) => (props.$isExpense ? EXPENSE_COLOR : INCOME_COLOR)};
    font-weight: 700;
    width: 100%;
`;
const StyledTableRoot = styled(Table.Root)<{ $isExpense: boolean }>`
    thead > tr > th {
        color: ${(props) => (props.$isExpense ? EXPENSE_COLOR : INCOME_COLOR)};
    }
    tbody > tr > th {
        color: ${(props) => (props.$isExpense ? EXPENSE_COLOR : INCOME_COLOR)};
    }
    tbody > tr > td {
        color: ${(props) => (props.$isExpense ? EXPENSE_COLOR : INCOME_COLOR)};
    }
`;

const TableReport: React.FC<TableReportProps> = (props) => {
    const currency = useAtomValue(currencyState);
    const getReportTableData = (
        transactions: Transaction[],
        isExpense: boolean
    ): ReportTableData[] => {
        const rawData = groupBy(
            transactions
                .filter((t) => (isExpense ? expenseFilter(t) : incomeFilter(t)))
                .map((t) => {
                    return {
                        category: t.category?.name ?? "Unknown",
                        amount: t.amount,
                        maxAmount: t.amount,
                        medianAmount: t.amount,
                    };
                }),
            (t) => t.category
        );

        const toReturn: ReportTableData[] = [];

        for (const key in rawData) {
            const medianAmount = getMedian(rawData[key].map((d) => d.amount));
            const aggregatedData = rawData[key].reduce((acc, current) => {
                return {
                    category: key,
                    amount: acc.amount + current.amount,
                    maxAmount: Math.max(acc.maxAmount, current.amount),
                    medianAmount,
                };
            });

            toReturn.push(aggregatedData);
        }

        return toReturn.sort((a, b) => b.amount - a.amount);
    };
    const getRows = (transactions: Transaction[], isExpense: boolean) =>
        getReportTableData(transactions, isExpense).map((t, index) =>
            index === 0 ? (
                <Table.Row key={t.category}>
                    <Table.RowHeaderCell>
                        <Text weight="bold">{t.category}</Text>
                    </Table.RowHeaderCell>
                    <Table.RowHeaderCell>
                        <Text weight="bold">{formatNumber(t.amount)}</Text>
                    </Table.RowHeaderCell>
                    <Table.RowHeaderCell>
                        <Text weight="bold" size="1">
                            {formatNumber(t.medianAmount)} | {formatNumber(t.maxAmount)}
                        </Text>
                    </Table.RowHeaderCell>
                </Table.Row>
            ) : (
                <Table.Row key={t.category}>
                    <Table.Cell>{t.category}</Table.Cell>
                    <Table.Cell>{formatNumber(t.amount)}</Table.Cell>
                    <Table.Cell>
                        <Text size="1">
                            {formatNumber(t.medianAmount)} | {formatNumber(t.maxAmount)}
                        </Text>
                    </Table.Cell>
                </Table.Row>
            )
        );

    return getRows(props.transations, props.isExpense).length == 0 ? (
        <NoDataDiv $isExpense={props.isExpense}>No data</NoDataDiv>
    ) : (
        <StyledTableRoot $isExpense={props.isExpense} variant="surface">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Amount({currency})</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Median | Max</Table.ColumnHeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>{getRows(props.transations, props.isExpense)}</Table.Body>
        </StyledTableRoot>
    );
};

export default TableReport;
