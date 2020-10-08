import firebase from "firebase/app";
import "firebase/auth";
import React from "react";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { totalWalletsBalanceState, walletsState } from "../common/shareState";
import Wallet from "../service/model/Wallet";
import Drawer from "./bases/Drawer";
import Toast from "./bases/Toast";
import "./Layout.scss";

interface LayoutProps {
    isShowBackwardIcon?: boolean;
    linkBackwardTo?: string;
}

const Layout: React.FC<LayoutProps> = (props) => {
    const [wallets] = useRecoilState(walletsState);
    const totalWalletsBalance = useRecoilValue(totalWalletsBalanceState);
    const renderBackIcon = () => {
        return !!props.isShowBackwardIcon ? (
            <div className="header__backIcon">
                <Link to="/">
                    <span className="icon">
                        <i className="fas fa-lg fa-arrow-left"></i>
                    </span>
                </Link>
            </div>
        ) : null;
    };

    const renderBurgerMenuContent = (wallets: Wallet[]) => {
        return (
            <div className="container is-mobile is-fluid">
                <aside className="menu">
                    <p className="menu-label">Wallets</p>
                    <ul className="menu-list">
                        {wallets.map((x) => (
                            <li key={x.name}>
                                <div className="columns is-mobile">
                                    <div className="column is-three-fifths">
                                        {x.name}
                                    </div>
                                    <div className="column">{x.balance}</div>
                                    <div className="column">THB</div>
                                </div>
                            </li>
                        ))}
                        <li>
                            <div className="columns is-mobile">
                                <div className="column is-three-fifths"></div>
                                <div className="column">
                                    {totalWalletsBalance}
                                </div>
                                <div className="column">THB</div>
                            </div>
                        </li>
                    </ul>
                    <p className="menu-label">Transactions</p>
                    <ul className="menu-list">
                        <li>
                            <a>Payments</a>
                        </li>
                        <li>
                            <a>Transfers</a>
                        </li>
                        <li>
                            <a>Balance</a>
                        </li>
                    </ul>
                </aside>
            </div>
        );
    };

    return (
        <>
            <div className="header">
                <div className="columns is-mobile is-vcentered">
                    {/* {renderBackIcon()} */}
                    <div className="column is-narrow">
                        <Drawer>{renderBurgerMenuContent(wallets)}</Drawer>
                    </div>
                    <div className="column is-half-mobile is-half-tablet">
                        <span className="has-text-weight-bold is-size-4 has-text-dark">
                            Expense ledger
                        </span>
                    </div>
                    <div className="column is-offset-4-desktop is-offset-3-tablet is-offset-1-mobile">
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

export default Layout;
