import { allCategoryTypes, CategoryType, categoryTypeLabels, TransactionType } from "../constants";
import Category from "../model/Category";

export const allCategoryTypeLabels = allCategoryTypes.map((t) => categoryTypeLabels[t]);

export function categoryTypeFromLabel(label: string): CategoryType {
    return allCategoryTypes.find((t) => categoryTypeLabels[t] === label);
}

export function categoriesFor(categories: Category[], type: TransactionType): Category[] {
    return categories.filter((c) => c.type === "ANY" || c.type === type);
}
