import { allCategoryTypes, CategoryType, TransactionType } from "../constants";
import Category from "../model/Category";

export const categoryTypeLabels: Record<CategoryType, string> = {
    ANY: "Any",
    EXPENSE: "Expense",
    INCOME: "Income",
    TRANSFER: "Transfer",
};

export const allCategoryTypeLabels = allCategoryTypes.map((t) => categoryTypeLabels[t]);

export function categoryTypeFromLabel(label: string): CategoryType {
    return allCategoryTypes.find((t) => categoryTypeLabels[t] === label);
}

/** The categories a transaction of this type can pick: its own type and ANY. */
export function categoriesFor(categories: Category[], type: TransactionType): Category[] {
    return categories.filter((c) => c.type === "ANY" || c.type === type);
}
