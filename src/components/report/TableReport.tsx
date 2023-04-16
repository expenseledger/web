import * as R from "ramda";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { currencyState } from "../../common/shareState";
import { formatNumber } from "../../common/utils";
import Transaction from "../../service/model/Transaction";
import { EXPENSE_COLOR, INCOME_COLOR, expenseFilter, incomeFilter } from "./reportHelper";

interface ReportTableData {
    category: string;
    amount: number;
}

interface TableReportProps {
    transations: Transaction[];
    isExpense: boolean;
}

const NoDataDiv = styled.div<{ isExpense: boolean }>`
    text-align: center;
    color: ${(props) => (props.isExpense ? EXPENSE_COLOR : INCOME_COLOR)};
    font-weight: 700;
`;
const StyledTable = styled.table<{ isExpense: boolean }>`
    color: ${(props) => (props.isExpense ? EXPENSE_COLOR : INCOME_COLOR)};

    thead > tr > th {
        color: ${(props) => (props.isExpense ? EXPENSE_COLOR : INCOME_COLOR)};
    }
    tbody > tr > th {
        color: ${(props) => (props.isExpense ? EXPENSE_COLOR : INCOME_COLOR)};
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
                <tr key={t.category}>
                    <th>{t.category}</th>
                    <th>{formatNumber(t.amount)}</th>
                </tr>
            ) : (
                <tr key={t.category}>
                    <td>{t.category}</td>
                    <td>{formatNumber(t.amount)}</td>
                </tr>
            )
        );

    return getRows(props.transations, props.isExpense).length == 0 ? (
        <NoDataDiv isExpense={props.isExpense}>No data</NoDataDiv>
    ) : (
        <>
            <StyledTable isExpense={props.isExpense} className="table" width="100%">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Amount({currency})</th>
                    </tr>
                </thead>
                <tbody>{getRows(props.transations, props.isExpense)}</tbody>
            </StyledTable>
        </>
    );
};

export default TableReport;
