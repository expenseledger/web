import React from "react";
import { useRecoilState } from "recoil";
import { walletsState } from "../common/shareState";
import Layout from "./Layout";

const WalletSetting: React.FC = () => {
    const [wallets, setWallets] = useRecoilState(walletsState);
    return <Layout>Hello</Layout>;
};

export default WalletSetting;
