import { EmailAuthProvider, GoogleAuthProvider, onAuthStateChanged, User } from "firebase/auth";
import React from "react";
import { StyledFirebaseAuth } from "react-firebaseui";
import { useNavigate } from "react-router";
import Logo from "../../assets/pics/logo.svg";
import { auth } from "../../lib/firebase";
import { Box, Flex, Text } from "@radix-ui/themes";

const SignIn: React.FC = () => {
    const navigate = useNavigate();

    const executeAfterLogin = React.useCallback(
        (user: User) => {
            if (!user) {
                return;
            }

            navigate("/");
        },
        [navigate]
    );

    React.useEffect(() => {
        onAuthStateChanged(auth, (user) => user && executeAfterLogin(user));
    }, [executeAfterLogin, navigate]);

    const uiConfig: firebaseui.auth.Config = {
        signInFlow: "popup",
        signInOptions: [EmailAuthProvider.PROVIDER_ID, GoogleAuthProvider.PROVIDER_ID],
        callbacks: {
            signInSuccessWithAuthResult: () => {
                return false;
            },
        },
    };

    return (
        <Flex justify="center" align="center" direction="column" pt="9" px="6">
            <img src={Logo} alt="logo"/>
            <Box pt="6" pb="3">
                <Text align="center" size="8" weight="bold" as="div">Welcome to Expense Ledger</Text>
            </Box>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
        </Flex>
    );
};

export default SignIn;
