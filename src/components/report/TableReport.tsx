import * as R from "ramda";
import { formatNumber } from "../../common/utils";
import Transaction from "../../service/model/Transaction";
import { expenseFilter, incomeFilter } from "./reportHelper";

interface ReportTableData {
    category: string;
    amount: number;
}

interface TableReportProps {
    transations: Transaction[];
    isExpense: boolean;
}

const TableReport: React.FC<TableReportProps> = (props) => {
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

        return toReturn;
    };
    const getRows = (transactions: Transaction[], isExpense: boolean) =>
        getReportTableData(transactions, isExpense).map((t) => (
            <tr key={t.category}>
                <td>{t.category}</td>
                <td>{formatNumber(t.amount)}</td>
            </tr>
        ));

    return (
        <table className="table">
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>{getRows(props.transations, props.isExpense)}</tbody>
        </table>
    );
};

export default TableReport;
