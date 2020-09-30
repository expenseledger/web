import firebase from "firebase/app";
import "firebase/auth";
import React from "react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { walletsState } from "../common/shareState";
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
            <div className="container is-fluid">
                <aside className="menu">
                    <p className="menu-label">Wallets</p>
                    <ul className="menu-list">
                        {wallets.map((x) => (
                            <li key={x.name}>
                                <a>
                                    {x.name} {x.balance} baht
                                </a>
                            </li>
                        ))}
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
            <Toast position="top-right" />
            <nav className="navbar is-transparent is-mobile">
                {renderBackIcon()}
                <div className="navbar-item">
                    <Drawer>{renderBurgerMenuContent(wallets)}</Drawer>
                </div>
                <div className="navbar-menu">
                    <div className="navbar-end">
                        <div className="navbar-item">
                            <button
                                className="header__signout button is-link is-inverted is-small"
                                onClick={() => firebase.auth().signOut()}
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <section className="container is-mobile">{props.children}</section>
            <footer className="footer">
                <div className="content has-text-centered">
                    <a href="https://www.freepik.com/vectors/banner">
                        Banner vector created by upklyak - www.freepik.com
                    </a>
                </div>
            </footer>
        </>
    );
};

export default Layout;
