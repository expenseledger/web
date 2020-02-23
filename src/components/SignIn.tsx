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

function SignIn(props: RouteComponentProps) {
    const [isLoading, setIsLoading] = React.useState(false);
    const [isInitSuccess, setIsInitSuccess] = React.useState(false);
    const [user, setUser] = React.useState<firebase.User | null>();

    React.useEffect(() => {
        const unregisterAuthObserver = firebase
            .auth()
            .onAuthStateChanged(user => setUser(user));
    return () => unregisterAuthObserver();
  }, []);
  
    React.useEffect(() => {
        if (isInitSuccess) {
            props.history.replace("/");
        } else {
            user?.delete().then(() => {
                firebase.auth().updateCurrentUser(user);
            });
        }
    }, [isInitSuccess, props.history, user]);

    const uiConfig: firebaseui.auth.Config = {
        signInFlow: "popup",
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            firebase.auth.GoogleAuthProvider.PROVIDER_ID
        ],
        callbacks: {
            signInSuccessWithAuthResult: authResult => {
                const isNewUser = authResult.additionalUserInfo.isNewUser;

                if (isNewUser) {
                    setIsLoading(true);
                    Promise.all([initCategory(), initWallet()])
                        .then(() => {
                            setIsInitSuccess(true);
                            setIsLoading(false);
                        })
                        .catch(err => {
                            setIsInitSuccess(false);
                            setIsLoading(false);
                            alert(err.message);
                        });
                } else {
                    setIsInitSuccess(true);
                }

                return false;
            }
        }
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
}

export default withRouter(SignIn);
