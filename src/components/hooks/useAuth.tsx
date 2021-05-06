import firebase from "firebase/app";
import "firebase/auth";
import React from "react";

export function useAuth(): boolean {
    const [isSignin, setIsSignin] = React.useState(
        !!firebase.auth().currentUser
    );

    React.useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => setIsSignin(!!user));
    }, []);

    return isSignin;
}
