import React from "react";
import firebase from "../../lib/firebase";

export function useAuth(): boolean {
    const [isSignin, setIsSignin] = React.useState(
        !!firebase.auth().currentUser
    );

    React.useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => setIsSignin(!!user));
    }, []);

    return isSignin;
}
