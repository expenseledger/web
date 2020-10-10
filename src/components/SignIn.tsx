import firebase from "firebase/app";
import "firebase/auth";
import * as React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { RouteComponentProps, withRouter } from "react-router";
import Logo from "../assets/pics/logo.svg";
import { initCategory } from "../service/CategoryService";
import { initWallet } from "../service/WalletService";
import Loading from "./bases/Loading";
import "./SignIn.scss";

const SignIn: React.FC<RouteComponentProps> = (props) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [isNewUser, setIsNewUser] = React.useState<boolean | null>(null);
    const executeAfterLogin = React.useCallback(
        (user: firebase.User) => {
            if (!user || isNewUser === null) {
                return;
            }

            if (!isNewUser) {
                props.history.replace("/");
            } else {
                setIsLoading(true);
                Promise.all([initCategory(), initWallet()])
                    .then(() => {
                        setIsLoading(false);
                        props.history.replace("/");
                    })
                    .catch((err) => {
                        user?.delete().then(() => {
                            setIsLoading(false);
                            alert(err.message);
                        });
                    });
            }
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
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <img className="siginIn__logo" src={Logo} />
                    <span className="signIn__title">
                        Welcome to Expense Ledger
                    </span>
                    <StyledFirebaseAuth
                        uiConfig={uiConfig}
                        firebaseAuth={firebase.auth()}
                    />
                </>
            )}
        </div>
    );
};

export default withRouter(SignIn);
