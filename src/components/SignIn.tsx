import * as React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/app";
import "firebase/auth";
import "./SignIn.scss";
import Logo from "../assets/pics/logo.svg";
import { withRouter, RouteComponentProps } from "react-router";

function SignIn(props: RouteComponentProps) {
  React.useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged(user => (!!user ? props.history.replace("/") : null));

    return () => unregisterAuthObserver();
  }, []);

  const uiConfig: firebaseui.auth.Config = {
    signInFlow: "popup",
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: authResult => {
        console.log("Kohpai Jaa", authResult);
        return false;
      }
    }
  };

  return (
    <div className="signIn">
      <img className="siginIn__logo" src={Logo} />
      <span className="signIn__title">Welcome to Expense Ledger</span>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </div>
  );
}

export default withRouter(SignIn);
