import { TransactionType } from "../constants";
import Category from "../model/Category";

/** The categories a transaction of this type can pick: its own type and ANY. */
export function categoriesFor(categories: Category[], type: TransactionType): Category[] {
    return categories.filter((c) => c.type === "ANY" || c.type === type);
}
