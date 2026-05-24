import client from "../../lib/apollo";
import {
    createCategory,
    deleteCategory,
    getAllCategories,
    updateCategory,
} from "../../service/categoryService";

jest.mock("../../lib/apollo", () => ({
    __esModule: true,
    default: {
        query: jest.fn(),
        mutate: jest.fn(),
    },
}));

jest.mock("../../common/utils", () => ({
    log: jest.fn(),
}));

const mockClient = client as jest.Mocked<typeof client>;

describe("categoryService", () => {
    const serverCategory = { id: 1, name: "Food", type: "EXPENSE" };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getAllCategories", () => {
        it("returns categories on success", async () => {
            mockClient.query.mockResolvedValue({
                data: { categories: { nodes: [serverCategory] } },
            } as never);

            const result = await getAllCategories();

            expect(result).toEqual([serverCategory]);
        });

        it("returns empty array when response has error", async () => {
            mockClient.query.mockResolvedValue({
                data: null,
                error: { message: "failed" },
            } as never);

            const result = await getAllCategories();

            expect(result).toEqual([]);
        });

        it("returns empty array on unexpected error", async () => {
            mockClient.query.mockRejectedValue(new Error("network"));

            const result = await getAllCategories();

            expect(result).toEqual([]);
        });
    });

    describe("createCategory", () => {
        it("returns created category on success", async () => {
            mockClient.mutate.mockResolvedValue({
                data: { createCategoryV2: { category: serverCategory } },
            } as never);

            const result = await createCategory({ name: "Food", type: "EXPENSE" });

            expect(result.addedCategory).toEqual(serverCategory);
        });

        it("returns null when mutation has error", async () => {
            mockClient.mutate.mockResolvedValue({
                data: null,
                error: { message: "failed" },
            } as never);

            const result = await createCategory({ name: "Food", type: "EXPENSE" });

            expect(result.addedCategory).toBeNull();
        });

        it("returns null on unexpected error", async () => {
            mockClient.mutate.mockRejectedValue(new Error("network"));

            const result = await createCategory({ name: "Food", type: "EXPENSE" });

            expect(result.addedCategory).toBeNull();
        });
    });

    describe("deleteCategory", () => {
        it("returns success on successful deletion", async () => {
            mockClient.mutate.mockResolvedValue({ data: {} } as never);

            const result = await deleteCategory({ id: 1 });

            expect(result.isSuccess).toBe(true);
        });

        it("returns failure when mutation has error", async () => {
            mockClient.mutate.mockResolvedValue({
                data: null,
                error: { message: "failed" },
            } as never);

            const result = await deleteCategory({ id: 1 });

            expect(result.isSuccess).toBe(false);
        });

        it("returns failure on unexpected error", async () => {
            mockClient.mutate.mockRejectedValue(new Error("network"));

            const result = await deleteCategory({ id: 1 });

            expect(result.isSuccess).toBe(false);
        });
    });

    describe("updateCategory", () => {
        it("returns updated category on success", async () => {
            mockClient.mutate.mockResolvedValue({
                data: { updateCategory: { category: serverCategory } },
            } as never);

            const result = await updateCategory({
                id: 1,
                name: "Food",
                type: "EXPENSE",
            });

            expect(result.updatedCategory).toEqual(serverCategory);
        });

        it("returns null when mutation has error", async () => {
            mockClient.mutate.mockResolvedValue({
                data: null,
                error: { message: "failed" },
            } as never);

            const result = await updateCategory({
                id: 1,
                name: "Food",
                type: "EXPENSE",
            });

            expect(result.updatedCategory).toBeNull();
        });

        it("returns null on unexpected error", async () => {
            mockClient.mutate.mockRejectedValue(new Error("network"));

            const result = await updateCategory({
                id: 1,
                name: "Food",
                type: "EXPENSE",
            });

            expect(result.updatedCategory).toBeNull();
        });
    });
});
