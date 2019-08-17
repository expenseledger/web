import * as React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import * as firebase from "firebase/app";
import "firebase/auth";
import "./SignIn.scss";
import Logo from "../assets/pics/logo.svg";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
    storageBucket: "",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};

firebase.initializeApp(firebaseConfig);

function SignIn() {
    let [currentUser, SetCurrentUser] = React.useState<firebase.User | null>(
        null
    );
    const uiConfig = {
        signInFlow: "popup",
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            firebase.auth.GoogleAuthProvider.PROVIDER_ID
        ],
        callbacks: {
            // Avoid redirects after sign-in.
            signInSuccessWithAuthResult: () => false
        }
    };

    React.useEffect(() => {
        const unregisterAuthObserver = firebase
            .auth()
            .onAuthStateChanged(user => SetCurrentUser(user));

        return () => unregisterAuthObserver();
    }, []);

    return !currentUser ? (
        <div className="signIn">
            <img className="siginIn__logo" src={Logo} />
            <span className="signIn__title">Welcome to Expense Ledger</span>
            <StyledFirebaseAuth
                uiConfig={uiConfig}
                firebaseAuth={firebase.auth()}
            />
        </div>
    ) : (
        <div>
            <h1>My App</h1>
            <p>Welcome {currentUser.displayName}! You are now signed-in!</p>
            <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
        </div>
    );
}

export default SignIn;
