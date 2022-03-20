import { atom, selector } from "recoil";
import { NotificationProps } from "../components/bases/Notification";
import Account from "../service/model/Account";
import Category from "../service/model/Category";

export const accountsState = atom<Account[]>({
    key: "accounts",
    default: [],
});

export const totalAccountsBalanceState = selector<number>({
    key: "totalAccountsBalance",
    get: ({ get }) => {
        const accounts = get(accountsState);
        return accounts.length === 0
            ? 0
            : accounts.map((x) => x.balance).reduce((acc, current) => acc + current) ?? 0;
    },
});

export const categoriesState = atom<Category[]>({
    key: "categories",
    default: [],
});

export const toastState = atom<NotificationProps[]>({
    key: "toastState",
    default: [],
});

export const IsSignInState = atom<boolean>({
    key: "isSingIn",
    default: false,
});
