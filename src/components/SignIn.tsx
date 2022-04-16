import { EmailAuthProvider, GoogleAuthProvider, onAuthStateChanged, User } from "firebase/auth";
import React from "react";
import { StyledFirebaseAuth } from "react-firebaseui";
import { useNavigate } from "react-router";
import Logo from "../assets/pics/logo.svg";
import { auth } from "../lib/firebase";
import "./SignIn.scss";

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
        onAuthStateChanged(auth, (user) => executeAfterLogin(user));
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
        <div className="signIn">
            <img className="siginIn__logo" src={Logo} />
            <span className="signIn__title">Welcome to Expense Ledger</span>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
        </div>
    );
};

export default SignIn;
