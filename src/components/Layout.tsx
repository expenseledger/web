import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import pj from "../../package.json";
import { accountsState, categoriesState, totalAccountsBalanceState } from "../common/shareState";
import { log } from "../common/utils";
import { auth } from "../lib/firebase";
import { getUserData } from "../service/userService";
import Loading from "./bases/Loading";
import Toast from "./bases/Toast";
import { useSignIn } from "./hoc/WithAuthProtection";
import Menu from "./menu/Menu";
import { Box, Container, Heading } from "@radix-ui/themes";
import { color } from "../common/constants";

const Header = styled.div`
    margin-top: 12px;
    top: 0px;
    z-index: 10;
`;
const Title = styled.div`
    text-align: center;
`;

const Layout: React.FC = () => {
    const [accounts, setAccounts] = useRecoilState(accountsState);
    const [, setCategories] = useRecoilState(categoriesState);
    const totalAccountsBalance = useRecoilValue(totalAccountsBalanceState);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSignIn, redirectToSignIn, isSignInLoading] = useSignIn();

    React.useEffect(() => {
        if (!isSignInLoading && !isSignIn) {
            redirectToSignIn();
            return;
        }

        if (isSignInLoading || !isSignIn) {
            return;
        }

        getUserData()
            .then(({ categories, accounts }) => {
                setCategories(categories);
                setAccounts(accounts);
                setIsLoading(false);
            })
            .catch((err) => log("getUserData failed", err));
    }, [isSignIn, isSignInLoading, redirectToSignIn, setAccounts, setCategories]);

    return isLoading ? (
        <Loading />
    ) : (
        <>
            <Header className="header">
                <Menu
                    accounts={accounts}
                    totalAccountBalance={totalAccountsBalance}
                    signOutFunc={() => auth.signOut()}
                    version={pj.version}
                />
                <Title className="py-2">
                    <Link to="/">
                        <Box p="4">
                            <Heading
                                size="8"
                                color={color.primary as any}
                                align="center"
                                style={{ fontWeight: 800 }}>
                                Expense Ledger
                            </Heading>
                        </Box>
                    </Link>
                </Title>
            </Header>
            <Container size="2" pt="3" px="6" className="mainContainer">
                <React.Suspense fallback={<Loading />}>
                    <Outlet />
                </React.Suspense>
            </Container>
            <Toast position="top-right" />
        </>
    );
};

export default Layout;
