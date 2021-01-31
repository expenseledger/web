import firebase from "firebase/app";
import "firebase/auth";
import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { RouteComponentProps, withRouter } from "react-router";
import Logo from "../assets/pics/logo.svg";
import "./SignIn.scss";

const SignIn: React.FC<RouteComponentProps> = (props) => {
    const [isNewUser, setIsNewUser] = React.useState<boolean | null>(null);

    const executeAfterLogin = React.useCallback(
        (user: firebase.User) => {
            if (!user || isNewUser === null) {
                return;
            }

            props.history.replace("/");
        },
        [isNewUser, props.history]
    );

    React.useEffect(() => {
        const unregisterAuthObserver = firebase
            .auth()
            .onAuthStateChanged((user) => executeAfterLogin(user));
        return () => unregisterAuthObserver();
    }, [executeAfterLogin, props.history]);

    const uiConfig: firebaseui.auth.Config = {
        signInFlow: "popup",
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
            signInSuccessWithAuthResult: (authResult) => {
                setIsNewUser(authResult.additionalUserInfo.isNewUser);
                return false;
            },
        },
    };

    return (
        <div className="signIn">
            <img className="siginIn__logo" src={Logo} />
            <span className="signIn__title">Welcome to Expense Ledger</span>
            <StyledFirebaseAuth
                uiConfig={uiConfig}
                firebaseAuth={firebase.auth()}
            />
        </div>
    );
};

export default withRouter(SignIn);
