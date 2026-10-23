import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import { createStore } from "jotai";
import { categoriesState } from "../../common/shareState";
import { TransactionCard } from "../../components/transactionList/TransactionCard";
import { renderWithProviders } from "../bases/testUtils";

const date = new Date("2026-10-21T00:00:00+07:00");
const bills = { id: "c1", name: "Bills", type: "EXPENSE" as const };
const categories = [
    bills,
    { id: "c2", name: "None", type: "ANY" as const },
    { id: "c3", name: "Salary", type: "INCOME" as const },
];
const item = (
    id: string,
    amount: number,
    description: string,
    type: "EXPENSE" | "INCOME" = "EXPENSE"
) => ({
    id,
    amount,
    type,
    category: bills,
    description,
    date,
    onDelete: jest.fn().mockResolvedValue(undefined),
    onUpdate: jest.fn().mockResolvedValue(undefined),
});

describe("TransactionCard", () => {
    it.each([
        ["an expense", "EXPENSE", ["Bills", "None"]],
        // Its own category stays pickable even when it doesn't fit.
        ["an income", "INCOME", ["None", "Salary", "Bills"]],
    ] as const)("lists the categories that fit %s", async (_, type, names) => {
        const store = createStore();
        store.set(categoriesState, categories);
        const { container } = renderWithProviders(
            <TransactionCard date={date} currency="THB" items={[item("1", -500, "first", type)]} />,
            { store }
        );

        fireEvent.click(container.querySelectorAll("svg")[1]);
        const category = await screen.findByRole("combobox");

        expect(category).toHaveTextContent("Bills");
        fireEvent.click(category);
        expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(names);
    });
});
