import React from "react";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import Logo from "../assets/pics/logo.svg";
import {
    categoriesState,
    totalWalletsBalanceState,
    walletsState,
} from "../common/shareState";
import { formatNumber, log } from "../common/utils";
import firebase from "../lib/firebase";
import Wallet from "../service/model/Wallet";
import { getUserData } from "../service/userService";
import Drawer from "./bases/Drawer";
import Loading from "./bases/Loading";
import Toast from "./bases/Toast";
import "./Layout.scss";

const Layout: React.FC = (props) => {
    const [wallets, setWallets] = useRecoilState(walletsState);
    const [, setCategories] = useRecoilState(categoriesState);
    const totalWalletsBalance = useRecoilValue(totalWalletsBalanceState);
    const [isLoading, setIsLoading] = React.useState(true);
    const [switchHeaderBackground, setSwitchHeaderBackground] =
        React.useState(false);

    const renderBurgerMenuContent = (wallets: Wallet[]) => {
        return (
            <div className="container is-mobile is-fluid mt-5">
                <aside className="menu">
                    <p className="menu-label">Wallets</p>
                    <ul className="menu-list">
                        {wallets.map((x) => (
                            <li key={x.name}>
                                <div className="columns is-mobile">
                                    <div className="column is-half">
                                        {x.name}
                                    </div>
                                    <div className="column is-one-third">
                                        {formatNumber(x.balance)}
                                    </div>
                                    <div className="column">THB</div>
                                </div>
                            </li>
                        ))}
                        <li>
                            <div className="columns is-mobile">
                                <div className="column is-half menu__totalBalance">
                                    =
                                </div>
                                <div className="column is-one-third has-text-weight-bold">
                                    {formatNumber(totalWalletsBalance)}
                                </div>
                                <div className="column">THB</div>
                            </div>
                        </li>
                    </ul>
                    <p className="menu-label">Setting</p>
                    <ul className="menu-list">
                        <li>
                            <ul>
                                <li>
                                    <Link to="/category/setting">Category</Link>
                                </li>
                                <li>
                                    <Link to="/wallet/setting">Wallet</Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <p
                        className="menu-label menu-label__signout"
                        onClick={() => firebase.auth().signOut()}
                    >
                        Sign out
                    </p>
                </aside>
            </div>
        );
    };
    const listenToScroll = () => {
        console.log("scroll");
        setSwitchHeaderBackground(document.body.scrollHeight > 63);
    };

    React.useEffect(() => {
        window.addEventListener("scroll", listenToScroll, false);
        getUserData()
            .then(({ categories, wallets }) => {
                setCategories(categories);
                setWallets(wallets);
                setIsLoading(false);
            })
            .catch((err) => log(err));

        return () => {
            window.removeEventListener("scroll", listenToScroll, false);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return isLoading ? (
        <Loading />
    ) : (
        <>
            <div className="header">
                <div className="columns is-mobile is-vcentered">
                    <div className="column is-narrow">
                        <Drawer>{renderBurgerMenuContent(wallets)}</Drawer>
                    </div>
                    <div className="column">
                        <Link to="/">
                            <span className="has-text-weight-bold is-size-4 has-text-dark header__title">
                                Expense ledger
                            </span>
                            <img
                                className="ml-2"
                                src={Logo}
                                width="25px"
                                alt="website logo"
                            />
                        </Link>
                    </div>
                </div>
            </div>
            <div className="container is-mobile is-fluid mt-4">
                {props.children}
            </div>
            <Toast position="top-right" />
        </>
    );
};

export default Layout;
