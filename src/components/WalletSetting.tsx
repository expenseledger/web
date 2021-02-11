import React from "react";
import { useRecoilState } from "recoil";
import { toastState, walletsState } from "../common/shareState";
import { WalletType } from "../service/constants";
import { mapNotificationProps } from "../service/helper/notificationHelper";
import {
    mapStringToWalletType,
    mapWalletTypeToString,
} from "../service/helper/walletHelper";
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
        const response = await createWallet({
            name: walletName,
            type: mapStringToWalletType(walletType),
        });

        if (!response.wallet) {
            setNotificationList((prevNotiList) =>
                prevNotiList.concat(
                    mapNotificationProps("Create wallet failed", "danger")
                )
            );
            return;
        }

        setWallets(
            wallets.concat({
                id: response.wallet.id,
                name: response.wallet.name,
                type: response.wallet.type,
                balance: response.wallet.balance,
            })
        );
        setNotificationList((prevNotiList) =>
            prevNotiList.concat(
                mapNotificationProps("Create wallet success", "success")
            )
        );
    };

    const deleteWalletHandler = async (id: string | number) => {
        const isSuccess = await deleteWallet({
            id: +id,
        });

        if (!isSuccess) {
            setNotificationList((prevNotiList) =>
                prevNotiList.concat(
                    mapNotificationProps("Delete wallet failed", "danger")
                )
            );
            return;
        }

        setWallets(wallets.filter((x) => x.id !== id));
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
                items={wallets.map((x) => {
                    return { id: x.id, name: x.name };
                })}
                dropdowns={walletTypes.map((x) => mapWalletTypeToString(x))}
            />
        </Layout>
    );
};

export default withAuthProtection()(WalletSetting);
