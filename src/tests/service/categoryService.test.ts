import {
    createCategory,
    deleteCategory,
    getAllCategories,
    patchCategory,
} from "../../service/categoryService";
import { getUserData } from "../../service/userService";
import { mockClient, resetMockV3 } from "../mock/mockClient";

jest.mock("../../lib/apollo", () => ({
    __esModule: true,
    default: jest.requireActual("../mock/mockClient").mockClient,
}));

jest.mock("../../common/utils", () => ({
    log: jest.fn(),
}));

async function categoryNamed(name: string) {
    return (await getAllCategories()).find((c) => c.name === name);
}

describe("categoryService", () => {
    beforeEach(async () => {
        jest.restoreAllMocks();
        await resetMockV3();
        await getUserData();
    });

    describe("getAllCategories", () => {
        it("returns the seeded categories", async () => {
            expect(await getAllCategories()).toHaveLength(7);
        });

        it("returns each category's type", async () => {
            expect(await categoryNamed("Salary")).toEqual({
                id: expect.any(String),
                name: "Salary",
                type: "INCOME",
            });
        });

        it("returns no categories on an unexpected error", async () => {
            jest.spyOn(mockClient, "query").mockRejectedValueOnce(new Error("network"));

            expect(await getAllCategories()).toEqual([]);
        });
    });

    describe("createCategory", () => {
        it("creates the category", async () => {
            const result = await createCategory({ name: "Rent", type: "EXPENSE" });

            expect(result.addedCategory).toEqual({
                id: expect.any(String),
                name: "Rent",
                type: "EXPENSE",
            });
        });

        it("returns the error code of a taken name", async () => {
            const result = await createCategory({ name: "Food", type: "ANY" });

            expect(result).toEqual({ addedCategory: null, errorCode: "NAME_TAKEN" });
        });
    });

    describe("patchCategory", () => {
        it("renames the category", async () => {
            const food = await categoryNamed("Food");

            const result = await patchCategory({ id: food.id, name: "Meals" });

            expect(result.category).toEqual({ id: food.id, name: "Meals", type: "EXPENSE" });
        });

        it("retypes the category", async () => {
            const food = await categoryNamed("Food");

            const result = await patchCategory({ id: food.id, type: "ANY" });

            expect(result.category).toEqual({ id: food.id, name: "Food", type: "ANY" });
        });

        it("returns the error code of renaming None", async () => {
            const none = await categoryNamed("None");

            const result = await patchCategory({ id: none.id, name: "Other" });

            expect(result).toEqual({ category: null, errorCode: "CATEGORY_PROTECTED" });
        });
    });

    describe("deleteCategory", () => {
        it("deletes the category", async () => {
            const food = await categoryNamed("Food");

            const result = await deleteCategory({ id: food.id });

            expect(result.isSuccess).toBe(true);
            expect(await categoryNamed("Food")).toBeUndefined();
        });

        it("returns the error code of deleting None", async () => {
            const none = await categoryNamed("None");

            const result = await deleteCategory({ id: none.id });

            expect(result).toEqual({ isSuccess: false, errorCode: "CATEGORY_PROTECTED" });
        });
    });
});
