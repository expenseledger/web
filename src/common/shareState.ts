import { atom, selector } from "recoil";
import { NotificationProps } from "../components/bases/Notification";
import Account from "../service/model/Account";
import Category from "../service/model/Category";
import PageSetting from "../service/model/configs/PageSetting";
import { Currency } from "./../service/constants";

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

export const isSignInState = atom<boolean>({
    key: "isSingIn",
    default: false,
});

export const currencyState = atom<Currency>({
    key: "currency",
    default:
        window.localStorage.getItem("currency") === null ||
        window.localStorage.getItem("currency") === undefined
            ? "฿"
            : (window.localStorage.getItem("currency") as Currency),
});

export const pageSettingState = atom<PageSetting>({
    key: "pageSetting",
    default: {
        isMenuOnRightSide: window.localStorage.getItem("isMenuOnRightSide") === "true",
    },
});
