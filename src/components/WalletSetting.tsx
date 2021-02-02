import React from "react";
import { useRecoilState } from "recoil";
import { toastState, walletsState } from "../common/shareState";
import { WalletType } from "../service/constants";
import { mapNotificationProps } from "../service/mapper";
import {
    mapStringToWalletType,
    mapWalletTypeToString,
} from "../service/walletHelper";
import { createWallet, deleteWallet } from "../service/walletService";
import CreateAndDelete from "./bases/CreateAndDelete";
import { withAuthProtection } from "./hoc/WithAuthProtection";
import Layout from "./Layout";

const WalletSetting: React.FC = () => {
    const [wallets, setWallets] = useRecoilState(walletsState);
    const [, setNotificationList] = useRecoilState(toastState);
    const walletTypes: WalletType[] = ["BANK_ACCOUNT", "CASH", "CREDIT"];
    const createWalletHandler = async (
        walletName: string,
        walletType: string
    ) => {
        console.log(walletName, walletType);
        const isSuccess = await createWallet(
            walletName,
            mapStringToWalletType(walletType)
        );

        if (!isSuccess) {
            setNotificationList((prevNotiList) =>
                prevNotiList.concat(
                    mapNotificationProps("Create wallet failed", "danger")
                )
            );
            return;
        }

        // setWallets(
        //     wallets.concat({
        //         name: walletName,
        //         type: walletType,
        //         balance: 0,
        //     })
        // );
        setNotificationList((prevNotiList) =>
            prevNotiList.concat(
                mapNotificationProps("Create wallet success", "success")
            )
        );
    };
    const deleteWalletHandler = async (walletName: string) => {
        const isSuccess = await deleteWallet(walletName);

        if (!isSuccess) {
            setNotificationList((prevNotiList) =>
                prevNotiList.concat(
                    mapNotificationProps("Delete wallet failed", "danger")
                )
            );
            return;
        }

        setWallets(wallets.filter((x) => x.name !== walletName));
        setNotificationList((prevNotiList) =>
            prevNotiList.concat(
                mapNotificationProps("Delete wallet success", "success")
            )
        );
    };

    return (
        <Layout>
            <CreateAndDelete
                createFuncHandler={createWalletHandler}
                deleteFuncHandler={deleteWalletHandler}
                items={wallets.map((x, idx) => {
                    return { id: idx, name: x.name };
                })}
                dropdowns={walletTypes.map((x) => mapWalletTypeToString(x))}
            />
        </Layout>
    );
};

export default withAuthProtection()(WalletSetting);
