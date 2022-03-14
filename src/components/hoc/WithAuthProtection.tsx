import { onAuthStateChanged } from "firebase/auth";
import React from "react";
import { useNavigate } from "react-router";
import { useRecoilState } from "recoil";
import { IsSignInState } from "../../common/shareState";
import { auth } from "../../lib/firebase";
import Loading from "../bases/Loading";

interface WithAuthProtectionProps {
    redirectPath?: string;
    isTest?: boolean;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const withAuthProtection = (WrappedComponent: any) =>
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    function WithAuthProtection(props: WithAuthProtectionProps) {
        const [isSignin, setIsSignin] = React.useState(false);
        const navigate = useNavigate();

        React.useEffect(() => {
            console.log(isSignin);
            if (props.isTest) {
                return;
            }

            onAuthStateChanged(auth, (user) => {
                user ? setIsSignin(true) : navigate(props.redirectPath ?? "/signIn");
            });
        }, [isSignin, navigate, props.isTest, props.redirectPath]);

        return isSignin || props.isTest ? <>{WrappedComponent}</> : <Loading />;
    };

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

export const useSignIn = (
    redirectPath = "/signIn"
): { isSignIn: boolean; redirect: () => void } => {
    const [isSignIn, setIsSignin] = useRecoilState(IsSignInState);
    const navigate = useNavigate();
    const redirect = () => {
        if (isSignIn) {
            return;
        }

        navigate(redirectPath);
    };

    React.useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setIsSignin(!!user);
        });
    }, [setIsSignin]);

    return {
        isSignIn,
        redirect,
    };
};
