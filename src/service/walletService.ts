import axios from "axios";
import { httpStatus, WalletType } from "./constants";
import Wallet from "./model/Wallet";
import { callAxios, isReturnSuccessStatus } from "./uils";

const walletUrl = (path: string) =>
    process.env.REACT_APP_SERVER_URL + "/wallet" + path;

export async function getAllWallet(): Promise<Wallet[]> {
    let toReturn: Wallet[] = new Array(0);
    const response = await callAxios(axios.post, walletUrl("/list"));

    if (response.status !== httpStatus.ok || !response.success) {
        return toReturn;
    }

    if (response.data) {
        toReturn = response.data.items;
    }

    return toReturn;
}

export async function getWallet(walletName: string): Promise<Wallet> {
    const response = await callAxios(axios.post, walletUrl("/list"), {
        name: walletName,
    });

    if (!isReturnSuccessStatus) {
        console.log(
            `getWallet failed, status: ${response.status}, ${
                response.error?.message ?? ""
            }`
        );
        return null;
    }

    return response.data;
}

export async function initWallet(): Promise<void> {
    const response = await callAxios(axios.post, walletUrl("/init"));

    if (!isReturnSuccessStatus(response)) {
        console.log(`Cannot init wallet, ${response.error?.message}`);
        throw new Error("Cannot init wallet");
    }
}

export async function createWallet(
    walletName: string,
    walletType: WalletType
): Promise<boolean> {
    const response = await callAxios(axios.post, walletUrl("/create"), {
        name: walletName,
        type: walletType.toString(),
        balance: 0,
    });

    if (!isReturnSuccessStatus(response)) {
        console.log(`Cannot create wallet, ${response.error?.message}`);
        return false;
    }

    return true;
}

export async function deleteWallet(walletName: string): Promise<boolean> {
    const response = await callAxios(axios.post, walletUrl("/delete"), {
        name: walletName,
    });

    if (!isReturnSuccessStatus(response)) {
        console.log(`Cannot delete wallet, ${response.error?.message}`);
        return false;
    }

    return true;
}
