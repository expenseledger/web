import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import pj from "../../package.json";
import Logo from "../assets/pics/logo.svg";
import { accountsState, categoriesState, totalAccountsBalanceState } from "../common/shareState";
import { log } from "../common/utils";
import { auth } from "../lib/firebase";
import Account from "../service/model/Account";
import { getUserData } from "../service/userService";
import BalanceWithCurrency from "./bases/BalanceWithCurrency";
import Drawer from "./bases/Drawer";
import Loading from "./bases/Loading";
import Toast from "./bases/Toast";
import { useSignIn } from "./hoc/WithAuthProtection";
import "./Layout.scss";

const Version = styled.div`
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: 0.5em;
    margin-right: 5px;
`;

const Layout: React.FC = () => {
    const [accounts, setAccounts] = useRecoilState(accountsState);
    const [, setCategories] = useRecoilState(categoriesState);
    const totalAccountsBalance = useRecoilValue(totalAccountsBalanceState);
    const [isLoading, setIsLoading] = React.useState(true);
    const { isSignIn, redirectToSignIn, isSignInLoading } = useSignIn();

    const renderBurgerMenuContent = (accounts: Account[]) => {
        return (
            <>
                <div className="container is-mobile is-fluid mt-5">
                    <aside className="menu">
                        <p className="menu-label">Accounts</p>
                        <ul className="menu-list">
                            {accounts.map((x) => (
                                <li key={x.name}>
                                    <div className="columns is-mobile">
                                        <div className="column is-half">{x.name}</div>
                                        <div className="column">
                                            <BalanceWithCurrency balance={x.balance} />
                                        </div>
                                    </div>
                                </li>
                            ))}
                            <li>
                                <div className="columns is-mobile">
                                    <div className="column is-half menu__totalBalance">=</div>
                                    <div className="column has-text-weight-bold">
                                        <BalanceWithCurrency balance={totalAccountsBalance} />
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <p className="menu-label">Setting</p>
                        <ul className="menu-list">
                            <li>
                                <ul>
                                    <li>
                                        <Link to="/account/setting">Account</Link>
                                    </li>
                                    <li>
                                        <Link to="/category/setting">Category</Link>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <p className="menu-label">Misc</p>
                        <ul className="menu-list">
                            <li>
                                <ul>
                                    <a onClick={() => auth.signOut()}>Sign out</a>
                                </ul>
                            </li>
                        </ul>
                    </aside>
                </div>
                <Version>v{pj.version}</Version>
            </>
        );
    };

    React.useEffect(() => {
        console.log(process.env);
        if (!isSignInLoading && !isSignIn) {
            redirectToSignIn();
            return;
        }

        getUserData()
            .then(({ categories, accounts }) => {
                setCategories(categories);
                setAccounts(accounts);
                setIsLoading(false);
            })
            .catch((err) => log(err));
    }, [isSignIn, isSignInLoading, redirectToSignIn, setAccounts, setCategories]);

    return isLoading ? (
        <Loading />
    ) : (
        <>
            <div className="header">
                <div className="columns is-mobile is-vcentered">
                    <div className="column is-narrow">
                        <Drawer>{renderBurgerMenuContent(accounts)}</Drawer>
                    </div>
                    <div className="column">
                        <Link to="/">
                            <span className="has-text-weight-bold is-size-4 has-text-dark header__title">
                                Expense ledger
                            </span>
                            <img className="ml-2" src={Logo} width="25px" alt="website logo" />
                        </Link>
                    </div>
                </div>
            </div>
            <div className="container is-mobile is-fluid mt-4">
                <React.Suspense fallback={<Loading />}>
                    <Outlet />
                </React.Suspense>
            </div>
            <Toast position="top-right" />
        </>
    );
};

export default Layout;
