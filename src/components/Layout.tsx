import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import pj from "../../package.json";
import Logo from "../assets/pics/logo.svg";
import { accountsState, categoriesState, totalAccountsBalanceState } from "../common/shareState";
import { log } from "../common/utils";
import { auth } from "../lib/firebase";
import { getUserData } from "../service/userService";
import Loading from "./bases/Loading";
import Toast from "./bases/Toast";
import { useSignIn } from "./hoc/WithAuthProtection";
import "./Layout.scss";
import Menu from "./Menu";

const Layout: React.FC = () => {
    const [accounts, setAccounts] = useRecoilState(accountsState);
    const [, setCategories] = useRecoilState(categoriesState);
    const totalAccountsBalance = useRecoilValue(totalAccountsBalanceState);
    const [isLoading, setIsLoading] = React.useState(true);
    const { isSignIn, redirectToSignIn, isSignInLoading } = useSignIn();

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
                        <Menu
                            accounts={accounts}
                            totalAccountBalance={totalAccountsBalance}
                            signOutFunc={() => auth.signOut()}
                            version={pj.version}
                        />
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
