import { onAuthStateChanged } from "firebase/auth";
import React from "react";
import { useNavigate } from "react-router";
import { auth } from "../../lib/firebase";
import Loading from "../bases/Loading";

interface AuthProtectionProps {
    redirectPath?: string;
    isTest?: boolean;
}

export const AuthProtection: React.FC<AuthProtectionProps> = (props) => {
    const [isSignin, setIsSignin] = React.useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (props.isTest) {
            return;
        }

        onAuthStateChanged(auth, (user) => {
            user ? setIsSignin(true) : navigate(props.redirectPath ?? "/signIn");
        });
    }, [navigate, props.isTest, props.redirectPath]);

    return isSignin || props.isTest ? <>{props.children}</> : <Loading />;
};
