import { atom } from "recoil";
import { NotificationProps } from "../components/bases/Notification";
import Category from "../service/model/Category";
import Wallet from "../service/model/Wallet";

export const walletsState = atom<Wallet[]>({
    key: "wallets",
    default: [],
});

export const categoriesState = atom<Category[]>({
    key: "categories",
    default: [],
});

export const toastState = atom<NotificationProps[]>({
    key: "toastState",
    default: [],
});
