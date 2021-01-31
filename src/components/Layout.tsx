import firebase from "firebase/app";
import "firebase/auth";
import React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import Logo from "../assets/pics/logo.svg";
import {
    categoriesState,
    totalWalletsBalanceState,
    walletsState,
} from "../common/shareState";
import Wallet from "../service/model/Wallet";
import { getUserData } from "../service/UserService";
import { formatNumber } from "../service/Utils";
import Drawer from "./bases/Drawer";
import Loading from "./bases/Loading";
import Toast from "./bases/Toast";
import "./Layout.scss";

const Layout: React.FC<RouteComponentProps> = (props) => {
    const [wallets, setWallets] = useRecoilState(walletsState);
    const [, setCategories] = useRecoilState(categoriesState);
    const totalWalletsBalance = useRecoilValue(totalWalletsBalanceState);
    const [isLoading, setIsLoading] = React.useState(true);
    const categoryMenuHandler = () => {
        props.history.push("/category/setting");
    };
    const walletMenuHandler = () => {
        props.history.push("/wallet/setting");
    };

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
                                    <a onClick={categoryMenuHandler}>
                                        Category
                                    </a>
                                </li>
                                <li>
                                    <a onClick={walletMenuHandler}>Wallet</a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </aside>
            </div>
        );
    };

    React.useEffect(() => {
        getUserData()
            .then(({ categories, wallets }) => {
                setCategories(categories);
                setWallets(wallets);
                setIsLoading(false);
            })
            .catch((err) => console.log(err));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return isLoading ? (
        <Loading />
    ) : (
        <>
            <div className="header">
                <div className="columns is-mobile is-vcentered">
                    {/* {renderBackIcon()} */}
                    <div className="column is-narrow">
                        <Drawer>{renderBurgerMenuContent(wallets)}</Drawer>
                    </div>
                    <div className="column is-three-fifths-mobile is-three-fifths-tablet">
                        <Link to="/">
                            <span className="has-text-weight-bold is-size-4 has-text-dark header__title">
                                Expense ledger
                            </span>
                            <img className="ml-2" src={Logo} width="25px" />
                        </Link>
                    </div>
                    <div className="column is-offset-1-desktop is-offset-1-tablet">
                        <button
                            className="header__signout button is-link is-outlined is-small"
                            onClick={() => firebase.auth().signOut()}
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </div>
            <div className="container is-mobile is-fluid mt-4">
                {props.children}
            </div>
            <footer className="footer">
                <div className="content has-text-centered">
                    <a href="https://www.freepik.com/vectors/banner">
                        Banner vector created by upklyak - www.freepik.com
                    </a>
                </div>
            </footer>
            <Toast position="top-right" />
        </>
    );
};

export default withRouter(Layout);
