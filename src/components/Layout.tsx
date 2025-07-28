import React from "react";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
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
import { useAtom, useAtomValue } from "jotai";

const Header = styled.div`
    padding-top: 12px;
    top: 0px;
    z-index: 10;
`;
const Title = styled.div`
    text-align: center;
    cursor: pointer;
`;

export interface BackToHomeParam {
    accountId: number;
}

export type ContextType = {
    setBackToHomeParam: React.Dispatch<React.SetStateAction<BackToHomeParam>>;
};

export function useBackToHome() {
    return useOutletContext<ContextType>();
}

const Layout: React.FC = () => {
    const [accounts, setAccounts] = useAtom(accountsState);
    const [, setCategories] = useAtom(categoriesState);
    const totalAccountsBalance = useAtomValue(totalAccountsBalanceState);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSignIn, redirectToSignIn, isSignInLoading] = useSignIn();
    const navigate = useNavigate();
    const [backToHomeParam, setBackToHomeParam] = React.useState<BackToHomeParam>(null);

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
                    <Box p="4" onClick={() => navigate("/", { state: backToHomeParam })}>
                        <Heading
                            size="8"
                            color={color.primary as any}
                            align="center"
                            style={{ fontWeight: 800 }}>
                            Expense Ledger
                        </Heading>
                    </Box>
                </Title>
            </Header>
            <Container size="2" pt="3" px="6" className="mainContainer">
                <React.Suspense fallback={<Loading />}>
                    <Outlet context={{ setBackToHomeParam } satisfies ContextType} />
                </React.Suspense>
            </Container>
            <Toast position="top-right" />
        </>
    );
};

export default Layout;
