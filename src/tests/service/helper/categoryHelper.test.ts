import { categoriesFor } from "../../../service/helper/categoryHelper";
import Category from "../../../service/model/Category";

const categories: Category[] = [
    { id: "1", name: "Food", type: "EXPENSE" },
    { id: "2", name: "Salary", type: "INCOME" },
    { id: "3", name: "Savings", type: "TRANSFER" },
    { id: "4", name: "None", type: "ANY" },
];

describe("categoriesFor", () => {
    it.each([
        ["EXPENSE", ["Food", "None"]],
        ["INCOME", ["Salary", "None"]],
        ["TRANSFER", ["Savings", "None"]],
    ] as const)("keeps %s and ANY categories in order", (type, names) => {
        expect(categoriesFor(categories, type).map((c) => c.name)).toEqual(names);
    });
});
