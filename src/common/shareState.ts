import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { NotificationProps } from "../components/bases/Notification";
import type Account from "../service/model/Account";
import type Category from "../service/model/Category";
import type PageSetting from "../service/model/configs/PageSetting";
import type { Currency } from "./../service/constants";

export const accountsState = atom<Account[]>([]);

export const totalAccountsBalanceState = atom<number>((get) => {
    const accounts = get(accountsState);
    return accounts.length === 0
        ? 0
        : (accounts.map((x) => x.balance).reduce((acc, current) => acc + current) ?? 0);
});

export const categoriesState = atom<Category[]>([]);

export const toastState = atom<NotificationProps[]>([]);

export const isSignInState = atom<boolean>(false);

export const currencyState = atomWithStorage<Currency>("currency", "฿");

export const pageSettingState = atomWithStorage<PageSetting>("pageSetting", {
    isDarkTheme: false,
});

export const isHideBalanceOnMenuState = atomWithStorage<boolean>("isHideBalanceOnMenu", false);
