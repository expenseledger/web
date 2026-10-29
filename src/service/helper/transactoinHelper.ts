import dayjs from "../../lib/dayjs";
import { transactionTypes } from "../constants";
import { UpdateTransactionRequest } from "../model/Requests";
import { Transaction } from "../model/Transaction";
import { mapAccountFromServer } from "./accountHelper";

export function mapTransactionFromServer(data: any): Transaction {
    return {
        id: data.id,
        type: transactionTypes[data.__typename],
        fromAccount: data.from ? mapAccountFromServer(data.from) : null,
        toAccount: data.to ? mapAccountFromServer(data.to) : null,
        amount: data.amount.amount,
        convertedAmount: data.convertedAmount?.amount ?? null,
        category: data.category
            ? { id: data.category.id, name: data.category.name, type: data.category.type }
            : null,
        description: data.description,
        date: new Date(data.occurredAt),
    };
}

export function compareTransactionsDesc(a: Transaction, b: Transaction): number {
    if (b.date > a.date) {
        return 1;
    }

    if (b.date < a.date) {
        return -1;
    }

    return +b.id - +a.id;
}

/** Every local month (`YYYY-MM`) from `oldest`'s to `newest`'s, newest first. */
export function monthYearsBetween(oldest: Date, newest: Date): string[] {
    const first = dayjs(oldest).startOf("month");
    const monthYears: string[] = [];

    for (
        let month = dayjs(newest).startOf("month");
        !month.isBefore(first);
        month = month.subtract(1, "M")
    ) {
        monthYears.push(month.format("YYYY-MM"));
    }

    return monthYears;
}

/** ISO-8601 with the local offset, e.g. `2026-09-01T00:00:00+07:00`, as API v3 expects. */
export function toOffsetDateTime(date: Date): string {
    return dayjs(date).format("YYYY-MM-DDTHH:mm:ssZ");
}

/** Whether `accountId` receives `tx`'s money in a cross-currency transfer. */
function receivesConverted(tx: Transaction, accountId: string): boolean {
    return tx.convertedAmount != null && tx.toAccount?.id === accountId;
}

/** The amount of `tx` as `accountId` sees it, in that account's currency. */
export function amountFor(tx: Transaction, accountId: string): number {
    return receivesConverted(tx, accountId) ? tx.convertedAmount : tx.amount;
}

export interface EditedTransaction {
    amount: number;
    categoryId: string;
    description: string;
    occurredAt: Date;
}

/** A patch with only what the edit changed, as seen from `accountId`. */
export function buildTransactionPatch(
    tx: Transaction,
    accountId: string,
    edited: EditedTransaction
): UpdateTransactionRequest {
    const patch: UpdateTransactionRequest = { id: tx.id, type: tx.type };

    if (edited.amount !== amountFor(tx, accountId)) {
        if (receivesConverted(tx, accountId)) {
            patch.convertedAmount = { amount: edited.amount, currency: tx.toAccount.currency };
        } else {
            const account = tx.fromAccount ?? tx.toAccount;
            patch.amount = { amount: edited.amount, currency: account.currency };
        }
    }

    if (edited.categoryId !== tx.category?.id) {
        patch.categoryId = edited.categoryId;
    }

    if ((edited.description || null) !== (tx.description || null)) {
        patch.description = edited.description || null;
    }

    if (!dayjs(edited.occurredAt).isSame(tx.date, "day")) {
        patch.occurredAt = edited.occurredAt;
    }

    return patch;
}
