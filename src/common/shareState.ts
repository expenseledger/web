import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { NotificationProps } from "../components/bases/Notification";
import type Account from "../service/model/Account";
import type Category from "../service/model/Category";
import type PageSetting from "../service/model/configs/PageSetting";
import { sumBalancesByCurrency } from "../service/helper/accountHelper";

export const accountsState = atom<Account[]>([]);

/** Account balances summed per currency; accounts in different currencies can't be added up. */
export const totalBalancesByCurrencyState = atom((get) =>
    sumBalancesByCurrency(get(accountsState))
);

export const categoriesState = atom<Category[]>([]);

export const toastState = atom<NotificationProps[]>([]);

export const isSignInState = atom<boolean>(false);

export const pageSettingState = atomWithStorage<PageSetting>("pageSetting", {
    isDarkTheme: false,
});

export const isHideBalanceOnMenuState = atomWithStorage<boolean>("isHideBalanceOnMenu", false);
