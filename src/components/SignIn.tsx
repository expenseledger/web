import firebase from "firebase/app";
import "firebase/auth";
import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { useNavigate } from "react-router";
import Logo from "../assets/pics/logo.svg";
import "./SignIn.scss";

const SignIn: React.FC = () => {
    const navigate = useNavigate();

    const executeAfterLogin = React.useCallback(
        (user: firebase.User) => {
            if (!user) {
                return;
            }

            navigate("/");
        },
        [navigate]
    );

    React.useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => executeAfterLogin(user));
    }, [executeAfterLogin, navigate]);

    const uiConfig: firebaseui.auth.Config = {
        signInFlow: "popup",
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        ],
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
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        </div>
    );
};

export default SignIn;
