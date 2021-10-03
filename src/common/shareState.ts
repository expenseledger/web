import { atom, selector } from "recoil";
import { NotificationProps } from "../components/bases/Notification";
import Category from "../service/model/Category";
import Wallet from "../service/model/Wallet";

export const walletsState = atom<Wallet[]>({
    key: "wallets",
    default: [],
});

export const totalWalletsBalanceState = selector<number>({
    key: "totalWalletsBalance",
    get: ({ get }) => {
        const wallets = get(walletsState);
        return wallets.length === 0
            ? 0
            : wallets.map((x) => x.balance).reduce((acc, current) => acc + current) ?? 0;
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
