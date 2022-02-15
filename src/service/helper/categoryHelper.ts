import { allCategoryTypes, CategoryType } from "./../constants";

export const allCategoryTypesString = allCategoryTypes.map(mapCategoryTypeToString);

export function mapCategoryTypeToString(categoryType: CategoryType): string {
    switch (categoryType) {
        case "ANY":
            return "Any";
        case "EXPENSE":
            return "Expense";
        case "INCOME":
            return "Income";
        case "TRANSFER":
            return "Transfer";
    }
}

export function mapStringToCategoryType(categoryType: string): CategoryType {
    switch (categoryType) {
        case "Any":
            return "ANY";
        case "Expense":
            return "EXPENSE";
        case "Income":
            return "INCOME";
        case "Transfer":
            return "TRANSFER";
        default:
            throw new Error(`${categoryType} is not defined`);
    }
}
