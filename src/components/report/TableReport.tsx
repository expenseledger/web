import * as R from "ramda";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { currencyState } from "../../common/shareState";
import { formatNumber } from "../../common/utils";
import Transaction from "../../service/model/Transaction";
import { EXPENSE_COLOR, INCOME_COLOR, expenseFilter, incomeFilter } from "./reportHelper";
import { Table, Text } from "@radix-ui/themes";

interface ReportTableData {
    category: string;
    amount: number;
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
    const currency = useRecoilValue(currencyState);
    const getReportTableData = (
        transactions: Transaction[],
        isExpense: boolean
    ): ReportTableData[] => {
        const groupByCategoryName = R.groupBy((data: ReportTableData) => data.category);
        const dirtyData = groupByCategoryName(
            transactions
                .filter((t) => (isExpense ? expenseFilter(t) : incomeFilter(t)))
                .map((t) => {
                    return {
                        category: t.category?.name ?? "Unknown",
                        amount: t.amount,
                    };
                })
        );

        const toReturn: ReportTableData[] = [];

        for (const key in dirtyData) {
            const aggregatedData = dirtyData[key].reduce((acc, current) => {
                return {
                    category: key,
                    amount: acc.amount + current.amount,
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
                </Table.Row>
            ) : (
                <Table.Row key={t.category}>
                    <Table.Cell>{t.category}</Table.Cell>
                    <Table.Cell>{formatNumber(t.amount)}</Table.Cell>
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
                </Table.Row>
            </Table.Header>
            <Table.Body>{getRows(props.transations, props.isExpense)}</Table.Body>
        </StyledTableRoot>
    );
};

export default TableReport;
